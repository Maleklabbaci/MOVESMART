import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { defaultContent } from "../content/defaults";
const adminId = "11111111-1111-4111-8111-111111111111";
const otherId = "22222222-2222-4222-8222-222222222222";

test("Supabase migration: real SQL enforces RLS, draft isolation, version conflicts and validated forms", async (t) => {
  const db = new PGlite();
  await db.waitReady;
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth; create table auth.users (id uuid primary key, email text);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public, auth to anon, authenticated;
    create schema storage;
    create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
    alter table storage.objects enable row level security;
    grant usage on schema storage to anon, authenticated; grant select, insert, update, delete on storage.objects to anon, authenticated;
    create policy legacy_photos_permissive on storage.objects for all to authenticated using (true) with check (true);
    create table public.listings (id uuid primary key default gen_random_uuid(), title text, type text, location text, price numeric, beds integer, baths integer, area integer, description text, images text[], created_at timestamptz default now());
    alter table public.listings enable row level security;
    create policy legacy_listings_permissive on public.listings for all to authenticated using (true) with check (true);
    insert into auth.users values ('${adminId}', 'admin@example.com'), ('${otherId}', 'other@example.com');
  `);
  const migration = await readFile(
    new URL(
      "../../supabase/migrations/202610080001_admin_cms.sql",
      import.meta.url,
    ),
    "utf8",
  );
  await db.exec(migration);
  // Simulate permissive policies/grants left behind by another admin implementation.
  await db.exec(`
    create policy legacy_drafts on public.site_content_drafts for all to authenticated using (true) with check (true);
    create policy legacy_revisions on public.site_content_revisions for all to authenticated using (true) with check (true);
    create policy legacy_contacts on public.contact_requests for all to authenticated using (true) with check (true);
    create policy legacy_subscribers on public.newsletter_subscriptions for all to authenticated using (true) with check (true);
    create policy legacy_members on public.cms_administrators for all to authenticated using (true) with check (true);
    grant all on public.site_content_drafts, public.contact_requests, public.newsletter_subscriptions to public;
  `);
  await db.exec(
    "create sequence public.listings_legacy_id_seq owned by public.listings.id",
  );
  await db.exec(migration); // Must be safe to run twice, without weakening previous guards.
  assert.equal(
    (
      await db.query<{ allowed: boolean }>(
        "select has_sequence_privilege('authenticated', 'public.listings_legacy_id_seq', 'usage') as allowed",
      )
    ).rows[0].allowed,
    true,
  );
  assert.equal(
    (
      await db.query<{ kind: string }>(
        "select data_type as kind from information_schema.columns where table_schema='public' and table_name='listings' and column_name='price'",
      )
    ).rows[0].kind,
    "numeric",
  );

  await db.query(
    "insert into public.cms_administrators (user_id) values ($1::uuid)",
    [adminId],
  );
  const role = async (name: "anon" | "authenticated" | "owner", user = "") => {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [
      user,
    ]);
    if (name !== "owner") await db.exec(`set role ${name}`);
  };
  try {
    await t.test(
      "any signed-in user is not automatically an administrator; old write policies cannot bypass guards",
      async () => {
        await role("authenticated", otherId);
        assert.equal(
          (
            await db.query<{ allowed: boolean }>(
              "select public.is_cms_admin() as allowed",
            )
          ).rows[0].allowed,
          false,
        );
        await assert.rejects(
          db.query("select public.save_site_draft($1::jsonb, 0)", [
            JSON.stringify(defaultContent),
          ]),
          /Administrator/,
        );
        await assert.rejects(
          db.exec(
            "insert into public.listings (title) values ('unauthorised')",
          ),
          /row-level security/,
        );
        await assert.rejects(
          db.exec(
            "insert into storage.objects (bucket_id,name) values ('photos','evil.svg')",
          ),
          /row-level security/,
        );
        await assert.rejects(
          db.query(
            "insert into public.cms_administrators (user_id) values ($1::uuid)",
            [otherId],
          ),
          /permission denied/,
        );
        assert.equal(
          (await db.query("select * from public.contact_requests")).rows.length,
          0,
        );
        assert.equal(
          (await db.query("select * from public.cms_administrators")).rows
            .length,
          0,
        );
      },
    );
    await t.test(
      "saving a draft does not change published content; anonymous visitors cannot read it",
      async () => {
        await role("authenticated", adminId);
        const content = structuredClone(defaultContent);
        content.settings.brand = "CMS Brand";
        const saved = await db.query<{ result: { revision: number } }>(
          "select public.save_site_draft($1::jsonb, 0) as result",
          [JSON.stringify(content)],
        );
        assert.equal(saved.rows[0].result.revision, 1);
        await role("anon");
        const published = await db.query<{ content: object }>(
          "select content from public.site_content",
        );
        assert.deepEqual(published.rows[0].content, {});
        await assert.rejects(
          db.exec("select * from public.site_content_drafts"),
          /permission denied/,
        );
        await role("authenticated", otherId);
        assert.equal(
          (await db.query("select * from public.site_content_drafts")).rows
            .length,
          0,
        );
      },
    );
    await t.test(
      "optimistic concurrency prevents stale draft saves and stale publications",
      async () => {
        await role("authenticated", adminId);
        await assert.rejects(
          db.query("select public.save_site_draft($1::jsonb, 0)", [
            JSON.stringify(defaultContent),
          ]),
          /revision conflict/,
        );
        const published = await db.query<{
          result: { revision: number; content: typeof defaultContent };
        }>("select public.publish_site_content(1, 0) as result");
        assert.equal(published.rows[0].result.revision, 1);
        assert.equal(
          published.rows[0].result.content.settings.brand,
          "CMS Brand",
        );
        await assert.rejects(
          db.exec("select public.publish_site_content(1, 0)"),
          /revision conflict/,
        );
        await assert.rejects(
          db.exec("update public.site_content set content = '{}'"),
          /permission denied/,
        );
        await role("anon");
        const content = await db.query<{ content: typeof defaultContent }>(
          "select content from public.site_content",
        );
        assert.equal(content.rows[0].content.settings.brand, "CMS Brand");
      },
    );
    await t.test(
      "public contact RPC validates consent, details and service options; private submissions are not readable",
      async () => {
        await role("anon");
        const submit = (
          email: string,
          details = "{}",
          consent = true,
          options = "array['rental-income']",
          name = "Client Test",
        ) =>
          db.query<{ id: string }>(
            `select public.submit_contact_request($4,$1,'+33612345678','realEstate',${options},$2::jsonb,'Message',$3,'') as id`,
            [email, details, consent, name],
          );
        assert.match(
          (await submit("client@example.com")).rows[0].id,
          /^[a-f0-9-]{36}$/,
        );
        await assert.rejects(
          submit("another@example.com", "{}", false),
          /Invalid submission/,
        );
        await assert.rejects(submit("a@b.c"), /Invalid submission/);
        await assert.rejects(
          submit(
            "another@example.com",
            "{}",
            true,
            "array['rental-income']",
            "\tA\n",
          ),
          /Invalid submission/,
        );
        await assert.rejects(
          submit(
            "another@example.com",
            "{}",
            true,
            "array['rental-income']",
            "😀".repeat(76),
          ),
          /Invalid submission/,
        );
        await assert.rejects(
          submit(
            "another@example.com",
            JSON.stringify({ budget: "😀".repeat(3000) }),
          ),
          /Invalid details/,
        );
        await assert.rejects(
          submit("another@example.com", '{"bad":{"nested":true}}'),
          /Invalid details/,
        );
        await assert.rejects(
          submit(
            "another@example.com",
            JSON.stringify({ ["x".repeat(81)]: "bad key" }),
          ),
          /Invalid details/,
        );
        await assert.rejects(
          submit(
            "another@example.com",
            JSON.stringify({ budget: "x".repeat(5001) }),
          ),
          /Invalid details/,
        );
        await assert.rejects(
          submit("another@example.com", "{}", true, "array['full-setup']"),
          /Invalid service options/,
        );
        await assert.rejects(
          db.exec("select * from public.contact_requests"),
          /permission denied/,
        );
        await assert.rejects(
          db.exec(
            "insert into public.contact_requests (name,email,phone,service,options) values ('x','a@b.c','+123456789','realEstate','{}')",
          ),
          /permission denied/,
        );
        await role("authenticated", adminId);
        assert.equal(
          (await db.query("select * from public.contact_requests")).rows.length,
          1,
        );
        await role("authenticated", otherId);
        assert.equal(
          (await db.query("select * from public.contact_requests")).rows.length,
          0,
        );
      },
    );
    await t.test(
      "newsletter addresses are deduplicated and email limits cannot be bypassed by repeating requests",
      async () => {
        await role("anon");
        await assert.rejects(
          db.exec("select public.subscribe_newsletter('a@b.c',true,'')"),
          /Invalid subscription/,
        );
        for (let i = 0; i < 3; i++)
          assert.equal(
            (
              await db.query<{ ok: boolean }>(
                "select public.subscribe_newsletter('USER@example.com', true, '') as ok",
              )
            ).rows[0].ok,
            true,
          );
        await assert.rejects(
          db.exec(
            "select public.subscribe_newsletter('user@example.com',true,'')",
          ),
          /Too many requests/,
        );
        await assert.rejects(
          db.exec(
            "select public.subscribe_newsletter('bot@example.com',true,'bot-filled-field')",
          ),
          /Invalid subscription/,
        );
        await assert.rejects(
          db.exec("select * from public.newsletter_subscriptions"),
          /permission denied/,
        );
        await role("authenticated", adminId);
        const subscribers = await db.query<{ email: string }>(
          "select email from public.newsletter_subscriptions",
        );
        assert.deepEqual(subscribers.rows, [{ email: "user@example.com" }]);
        await role("authenticated", otherId);
        assert.equal(
          (await db.query("select * from public.newsletter_subscriptions")).rows
            .length,
          0,
        );
        assert.equal(
          (await db.query("select * from public.site_content_revisions")).rows
            .length,
          0,
        );
      },
    );
    await t.test(
      "public image URLs do not imply public access to storage file metadata",
      async () => {
        await role("authenticated", adminId);
        await db.exec(
          "insert into storage.objects (bucket_id,name) values ('photos','cms/test.webp')",
        );
        assert.equal(
          (
            await db.query(
              "select * from storage.objects where bucket_id='photos'",
            )
          ).rows.length,
          1,
        );
        await role("authenticated", otherId);
        assert.equal(
          (
            await db.query(
              "select * from storage.objects where bucket_id='photos'",
            )
          ).rows.length,
          0,
        );
        await role("anon");
        assert.equal(
          (
            await db.query(
              "select * from storage.objects where bucket_id='photos'",
            )
          ).rows.length,
          0,
        );
      },
    );
    await t.test(
      "one IP cannot bypass the hourly quota by using a new email each time",
      async () => {
        await role("anon");
        await db.query("select set_config('request.headers', $1, false)", [
          JSON.stringify({ "x-forwarded-for": "198.51.100.10" }),
        ]);
        for (let index = 0; index < 30; index++)
          await db.query("select public.subscribe_newsletter($1,true,'')", [
            `quota${index}@example.com`,
          ]);
        await assert.rejects(
          db.exec(
            "select public.subscribe_newsletter('quota31@example.com',true,'')",
          ),
          /Too many requests/,
        );
        await assert.rejects(
          db.exec(
            "select public.check_form_limit('newsletter','not-allowed@example.com')",
          ),
          /permission denied/,
        );
        await db.query("select set_config('request.headers', '{}', false)");
      },
    );
    await t.test(
      "unlisted articles remain private even when other site changes are published",
      async () => {
        await role("authenticated", adminId);
        const content = structuredClone(defaultContent);
        content.articles.push({
          ...content.articles[0],
          id: "private-article",
          visible: false,
          title: { fr: "PRIVATE ARTICLE", en: "", ar: "" },
        });
        await db.query("select public.save_site_draft($1::jsonb, 1)", [
          JSON.stringify(content),
        ]);
        await db.exec("select public.publish_site_content(2, 1)");
        const history = await db.query<{ content: typeof content }>(
          "select content from public.site_content_revisions where revision=2",
        );
        assert.equal(
          history.rows[0].content.articles.some(
            (article) => article.id === "private-article",
          ),
          true,
        );
        await role("anon");
        const published = await db.query<{ content: typeof content }>(
          "select content from public.site_content",
        );
        assert.equal(
          published.rows[0].content.articles.some(
            (article) => article.id === "private-article",
          ),
          false,
        );
        assert.equal(
          JSON.stringify(published.rows[0].content).includes("PRIVATE ARTICLE"),
          false,
        );
      },
    );
    await t.test(
      "a previously private photos bucket is never made public silently",
      async () => {
        await role("owner");
        const revision = (
          await db.query<{ revision: number }>(
            "select revision from public.site_content where id='main'",
          )
        ).rows[0].revision;
        await db.exec(
          "update storage.buckets set public=false where id='photos'",
        );
        await assert.rejects(
          db.exec(migration),
          /Existing photos bucket is private/,
        );
        await db.exec("rollback");
        assert.equal(
          (
            await db.query<{ public: boolean }>(
              "select public from storage.buckets where id='photos'",
            )
          ).rows[0].public,
          false,
        );
        assert.equal(
          (
            await db.query<{ revision: number }>(
              "select revision from public.site_content where id='main'",
            )
          ).rows[0].revision,
          revision,
        );
      },
    );
  } finally {
    await db.close();
  }
});
