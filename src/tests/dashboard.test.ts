import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const adminId = "11111111-1111-4111-8111-111111111111";
const otherId = "22222222-2222-4222-8222-222222222222";
const sessionA = "33333333-3333-4333-8333-333333333333";
const sessionB = "44444444-4444-4444-8444-444444444444";

test("Supabase dashboard migration: exact counters, private follow-up fields and consent-based analytics", async (t) => {
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
    create table public.listings (id uuid primary key default gen_random_uuid(), title text, type text, location text, price numeric, beds integer, baths integer, area integer, description text, images text[], created_at timestamptz default now());
    alter table public.listings enable row level security;
    insert into auth.users values ('${adminId}', 'admin@example.com'), ('${otherId}', 'other@example.com');
  `);
  const cms = await readFile(
    new URL(
      "../../supabase/migrations/202610080001_admin_cms.sql",
      import.meta.url,
    ),
    "utf8",
  );
  const dashboard = await readFile(
    new URL(
      "../../supabase/migrations/202610080002_admin_dashboard_analytics.sql",
      import.meta.url,
    ),
    "utf8",
  );
  await db.exec(cms);
  await db.exec(dashboard);
  // Rerunning the second migration must not fail, duplicate constraints or lose data.
  await db.exec(dashboard);

  const role = async (name: "anon" | "authenticated" | "owner", user = "") => {
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub', $1, false)", [
      user,
    ]);
    if (name !== "owner") await db.exec(`set role ${name}`);
  };
  await db.query(
    "insert into public.cms_administrators (user_id) values ($1::uuid)",
    [adminId],
  );

  const submit = (email: string, name = "Client Test") =>
    db.query<{ id: string }>(
      "select public.submit_contact_request($1,$2,'+33612345678','realEstate',array['rental-income'],'{}'::jsonb,'Message',true,'') as id",
      [name, email],
    );

  try {
    await t.test(
      "the second migration is additive: it keeps the CMS, listings and requests intact",
      async () => {
        await role("owner");
        const columns = await db.query<{ column_name: string }>(
          "select column_name from information_schema.columns where table_schema = 'public' and table_name = 'contact_requests' order by column_name",
        );
        const names = columns.rows.map((row) => row.column_name);
        for (const expected of [
          "notes",
          "reminder_at",
          "updated_at",
          "status",
          "created_at",
        ])
          assert.equal(names.includes(expected), true, expected);
        // The CMS tables of the first migration are untouched.
        assert.equal(
          (
            await db.query(
              "select 1 from information_schema.tables where table_schema = 'public' and table_name in ('site_content', 'site_content_drafts', 'site_content_revisions')",
            )
          ).rows.length,
          3,
        );
        // Analytics stores aggregates only: no IP, no user agent, no fingerprint column.
        const analyticsColumns = await db.query<{ column_name: string }>(
          "select column_name from information_schema.columns where table_schema = 'public' and table_name = 'analytics_pageviews' order by ordinal_position",
        );
        assert.deepEqual(
          analyticsColumns.rows.map((row) => row.column_name),
          ["id", "session_id", "path", "browser", "created_at"],
        );
      },
    );

    await t.test(
      "follow-up writes are validated, private and timestamped by the database",
      async () => {
        await role("anon");
        const request = await submit("client@example.com");
        const id = request.rows[0].id;
        await assert.rejects(
          db.query("select * from public.contact_requests"),
          /permission denied/,
        );
        await assert.rejects(
          db.query(
            "select public.update_contact_follow_up($1::uuid, 'contacted', null, null, false)",
            [id],
          ),
          /permission denied/,
        );

        await role("authenticated", otherId);
        await assert.rejects(
          db.query(
            "select public.update_contact_follow_up($1::uuid, 'contacted', null, null, false)",
            [id],
          ),
          /Administrator/,
        );

        await role("authenticated", adminId);
        await assert.rejects(
          db.query(
            "select public.update_contact_follow_up($1::uuid, 'unknown', null, null, false)",
            [id],
          ),
          /Invalid status/,
        );
        await assert.rejects(
          db.query(
            "select public.update_contact_follow_up($1::uuid, null, $2, null, false)",
            [id, "x".repeat(4001)],
          ),
          /Invalid notes/,
        );
        await assert.rejects(
          db.query(
            "select public.update_contact_follow_up($1::uuid, null, null, timestamptz '1990-01-01', false)",
            [id],
          ),
          /Invalid reminder date/,
        );
        const updated = await db.query<{
          result: {
            status: string;
            notes: string;
            reminder_at: string;
            updated_at: string;
          };
        }>(
          "select public.update_contact_follow_up($1::uuid, 'contacted', $2, now() - interval '2 days', false) as result",
          [id, "Client relancé par téléphone"],
        );
        assert.equal(updated.rows[0].result.status, "contacted");
        assert.equal(
          updated.rows[0].result.notes,
          "Client relancé par téléphone",
        );
        assert.ok(updated.rows[0].result.reminder_at);
        const firstStamp = updated.rows[0].result.updated_at;
        const second = await db.query<{ result: { updated_at: string } }>(
          "select public.update_contact_follow_up($1::uuid, null, 'Note mise à jour', null, false) as result",
          [id],
        );
        assert.notEqual(second.rows[0].result.updated_at, firstStamp);

        // Notes and reminders never leak to the public visitors or another account.
        await role("anon");
        await assert.rejects(
          db.query("select notes from public.contact_requests"),
          /permission denied/,
        );
        await role("authenticated", otherId);
        assert.equal(
          (await db.query("select * from public.contact_requests")).rows.length,
          0,
        );
      },
    );

    await t.test(
      "the dashboard returns exact counts beyond one page, overdue reminders and freshness",
      async () => {
        // 120 extra rows: a browser that loads 50 rows per page must not under-count.
        // Inserted as the project owner, because the browser role has no direct INSERT
        // grant on contact_requests (public writes go through submit_contact_request).
        await role("owner");
        await db.query(`
          insert into public.contact_requests (name, email, phone, service, options, created_at, status)
          select 'Demande ' || value, 'bulk' || value || '@example.com', '+33612345678', 'realEstate', array['rental-income'],
                 now() - (value || ' days')::interval, case when value % 3 = 0 then 'archived' else 'new' end
          from generate_series(1, 120) as value
        `);
        await role("authenticated", adminId);
        const dashboardResult = (
          await db.query<{ result: Record<string, never> }>(
            "select public.contact_requests_dashboard(5) as result",
          )
        ).rows[0].result as unknown as {
          total: number;
          by_status: Record<string, number>;
          overdue: number;
          due_soon: number;
          untouched_new: number;
          last_request_at: string;
          oldest_new_at: string;
          recent: { id: string; has_notes: boolean; reminder_at: string }[];
        };
        assert.equal(dashboardResult.total, 121);
        assert.equal(
          dashboardResult.by_status.new +
            dashboardResult.by_status.contacted +
            dashboardResult.by_status.archived,
          121,
        );
        assert.equal(dashboardResult.by_status.archived, 40);
        assert.equal(dashboardResult.overdue, 1);
        assert.equal(dashboardResult.recent.length, 5);
        assert.ok(dashboardResult.last_request_at);
        assert.ok(dashboardResult.oldest_new_at);
        assert.ok(dashboardResult.untouched_new > 0);
        assert.equal(
          dashboardResult.recent.some((row) => row.has_notes),
          true,
        );
        const bounded = (
          await db.query<{ result: { recent: unknown[] } }>(
            "select public.contact_requests_dashboard(500) as result",
          )
        ).rows[0].result;
        assert.equal(bounded.recent.length, 20);

        await role("authenticated", otherId);
        await assert.rejects(
          db.query("select public.contact_requests_dashboard(5)"),
          /Administrator/,
        );
        await role("anon");
        await assert.rejects(
          db.query("select public.contact_requests_dashboard(5)"),
          /permission denied/,
        );
      },
    );

    await t.test(
      "archiving a request removes it from overdue follow-ups without deleting the record",
      async () => {
        await role("authenticated", adminId);
        const before = (
          await db.query<{ result: { overdue: number } }>(
            "select public.contact_requests_dashboard(1) as result",
          )
        ).rows[0].result.overdue;
        const target = (
          await db.query<{ id: string }>(
            "select id from public.contact_requests where reminder_at is not null and reminder_at <= now() limit 1",
          )
        ).rows[0].id;
        await db.query(
          "select public.update_contact_follow_up($1::uuid, 'archived', null, null, false)",
          [target],
        );
        const after = (
          await db.query<{ result: { overdue: number; total: number } }>(
            "select public.contact_requests_dashboard(1) as result",
          )
        ).rows[0].result;
        assert.equal(after.overdue, before - 1);
        assert.equal(after.total, 121);
        await db.query(
          "select public.update_contact_follow_up($1::uuid, 'contacted', null, null, true)",
          [target],
        );
        const cleared = (
          await db.query<{ result: { reminder_at: string | null } }>(
            "select public.update_contact_follow_up($1::uuid, null, null, null, false) as result",
            [target],
          )
        ).rows[0].result;
        assert.equal(cleared.reminder_at, null);
      },
    );

    await t.test(
      "pageviews are recorded anonymously, validated, capped per session and purged after 90 days",
      async () => {
        await role("owner");
        await db.query(
          "insert into public.analytics_pageviews (session_id, path, browser, created_at) values ($1::uuid, '/ancienne-page', 'Chrome', now() - interval '120 days')",
          [sessionB],
        );
        await role("anon");
        for (const [session, path, browser] of [
          [sessionA, "/", "Chrome"],
          [sessionA, "/listings", "Chrome"],
          [sessionA, "/", "Chrome"],
          [sessionB, "/", "Safari"],
          [sessionB, "/about", "Navigateur inconnu"],
        ] as const)
          await db.query("select public.record_pageview($1::uuid, $2, $3)", [
            session,
            path,
            browser,
          ]);
        // The oldest row is dropped on the next write: retention is enforced in SQL.
        await role("owner");
        const stored = await db.query<{ browser: string; path: string }>(
          "select browser, path from public.analytics_pageviews order by id",
        );
        assert.equal(
          stored.rows.some((row) => row.path === "/ancienne-page"),
          false,
        );
        assert.equal(
          stored.rows.filter((row) => row.browser === "Autre").length,
          1,
        );

        await role("anon");
        for (const invalid of [
          "/listings?preview=draft",
          "/listings#section",
          "/admin",
          "/admin/requests",
          "//evil.example",
          "no-leading-slash",
          "/" + "x".repeat(400),
        ])
          await assert.rejects(
            db.query("select public.record_pageview($1::uuid, $2, 'Chrome')", [
              sessionA,
              invalid,
            ]),
            /Invalid path/,
            invalid,
          );
        await assert.rejects(
          db.query("select public.record_pageview(null, '/', 'Chrome')"),
          /Invalid event/,
        );
        // 120 events/hour/session are accepted, the rest are silently dropped.
        for (let index = 0; index < 130; index++)
          await db.query(
            "select public.record_pageview($1::uuid, '/saturation', 'Chrome')",
            [sessionA],
          );
        await role("owner");
        assert.equal(
          (
            await db.query<{ count: string }>(
              "select count(*)::text as count from public.analytics_pageviews where session_id = $1::uuid and path = '/saturation'",
              [sessionA],
            )
          ).rows[0].count,
          "117",
        );
        // Nobody can list individual pageviews through the API.
        await role("anon");
        await assert.rejects(
          db.query("select * from public.analytics_pageviews"),
          /permission denied/,
        );
        // Even an administrator never receives per-visitor rows: only the aggregate RPC.
        await role("authenticated", adminId);
        await assert.rejects(
          db.query("select * from public.analytics_pageviews"),
          /permission denied/,
        );
      },
    );

    await t.test(
      "the analytics summary is aggregated, admin-only and reports distinct sessions and pages",
      async () => {
        await role("authenticated", otherId);
        await assert.rejects(
          db.query("select public.analytics_summary(30)"),
          /Administrator/,
        );
        await role("anon");
        await assert.rejects(
          db.query("select public.analytics_summary(30)"),
          /permission denied/,
        );

        await role("authenticated", adminId);
        const summary = (
          await db.query<{ result: Record<string, never> }>(
            "select public.analytics_summary(30) as result",
          )
        ).rows[0].result as unknown as {
          days: number;
          retention_days: number;
          totals: { pageviews: number; sessions: number; pages: number };
          browsers: { browser: string; pageviews: number; sessions: number }[];
          top_pages: { path: string; pageviews: number; sessions: number }[];
          daily: { day: string; pageviews: number }[];
          last_recorded_at: string;
        };
        assert.equal(summary.days, 30);
        assert.equal(summary.retention_days, 90);
        assert.equal(summary.totals.pageviews, 122);
        assert.equal(summary.totals.sessions, 2);
        assert.ok(summary.totals.pages >= 3);
        assert.deepEqual(
          summary.browsers.map((row) => row.browser),
          ["Chrome", "Autre", "Safari"],
        );
        assert.equal(summary.daily.length, 1);
        assert.ok(summary.last_recorded_at);
        assert.equal(
          summary.top_pages[0].pageviews,
          Math.max(...summary.top_pages.map((row) => row.pageviews)),
        );
        // An invalid period is clamped instead of scanning the whole table.
        const clamped = (
          await db.query<{ result: { days: number } }>(
            "select public.analytics_summary(10000) as result",
          )
        ).rows[0].result;
        assert.equal(clamped.days, 90);
      },
    );
  } finally {
    await db.close();
  }
});
