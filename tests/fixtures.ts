import type { BrowserContext, Page } from "@playwright/test";
import { defaultContent } from "../src/content/defaults";
import type { SiteContent } from "../src/content/types";
import {
  applyPostgrestOrder,
  matchesPostgrestRow,
} from "../src/lib/postgrestFilter";

export async function mockBackend(context: BrowserContext) {
  const state = {
    admin: true,
    metadataAdmin: false,
    published: structuredClone(defaultContent),
    publishedRevision: 1,
    draft: null as SiteContent | null,
    draftRevision: 0,
    privateReads: 0,
    failRole: false,
    failPublished: false,
    failContact: false,
    failNewsletter: false,
    failListings: false,
    failDelete: false,
    rowCap: 1000,
    listingReads: 0,
    revisions: [] as {
      id: number;
      content: SiteContent;
      revision: number;
      created_at: string;
    }[],
    requests: [] as Record<string, unknown>[],
    subscribers: [] as Record<string, unknown>[],
    uploads: [] as string[],
    /** Pageviews the site asked to record, with the consent gate already applied. */
    pageviews: [] as {
      session_id: string;
      path: string;
      browser: string;
      created_at: string;
    }[],
    pageviewAttempts: 0,
    listings: [
      {
        id: "33333333-3333-4333-8333-333333333333",
        title: "Villa Dubai Marina",
        type: "Villa",
        location: "Dubai Marina",
        price: 5000000,
        beds: 4,
        baths: 5,
        area: 4500,
        description: "Une propriété de test.",
        images: ["https://images.example.com/villa.png"],
        created_at: "2026-10-08T10:00:00Z",
      },
    ],
  };
  const image =
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="a"><stop stop-color="#252b34"/><stop offset="1" stop-color="#4c555f"/></linearGradient></defs><rect width="1200" height="800" fill="url(#a)"/></svg>';
  // No test ever reaches a real remote backend or makes a production write.
  const siteOrigin = new URL(
    process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
  ).origin;
  await context.route("**/*", (route) => {
    if (new URL(route.request().url()).origin === siteOrigin)
      return route.continue();
    if (route.request().resourceType() === "image")
      return route.fulfill({ contentType: "image/svg+xml", body: image });
    return route.abort("blockedbyclient");
  });
  await context.route(/\/(auth|rest|storage)\/v1\//, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    const body =
      method === "GET" ||
      method === "DELETE" ||
      !request.headers()["content-type"]?.includes("application/json")
        ? {}
        : request.postDataJSON() || {};
    const headers = {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "*",
      "access-control-allow-methods": "*",
      "access-control-expose-headers": "content-range",
    };
    const json = (
      value: unknown,
      status = 200,
      extra: Record<string, string> = {},
    ) =>
      route.fulfill({
        status,
        contentType: "application/json",
        headers: { ...headers, ...extra },
        body: JSON.stringify(value),
      });
    const denied = () => json({ code: "42501", message: "Denied" }, 403);
    const offline = () =>
      json({ code: "P0001", message: "Service unavailable" }, 503);
    if (method === "OPTIONS") return route.fulfill({ status: 204, headers });
    const user = {
      id: "11111111-1111-4111-8111-111111111111",
      email: "admin@example.com",
      aud: "authenticated",
      role: "authenticated",
      app_metadata: { provider: "email", providers: ["email"] },
      user_metadata: state.metadataAdmin
        ? { role: "admin", cms_admin: true }
        : {},
      created_at: "2026-01-01T00:00:00Z",
    };
    if (url.pathname.includes("/auth/v1/token")) {
      const expires = Math.floor(Date.now() / 1000) + 3600;
      const token =
        Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
          "base64url",
        ) +
        "." +
        Buffer.from(
          JSON.stringify({
            sub: user.id,
            aud: "authenticated",
            role: "authenticated",
            exp: expires,
          }),
        ).toString("base64url") +
        ".test-signature";
      return json({
        access_token: token,
        token_type: "bearer",
        expires_in: 3600,
        expires_at: expires,
        refresh_token: "test-refresh-token",
        user,
      });
    }
    if (url.pathname.includes("/auth/v1/user")) return json(user);
    if (url.pathname.includes("/auth/v1/logout"))
      return route.fulfill({ status: 204, headers });
    const rpc = url.pathname.split("/rpc/")[1];
    if (rpc === "is_cms_admin")
      return state.failRole ? offline() : json(state.admin);
    if (rpc === "save_site_draft") {
      if (!state.admin) return denied();
      if (body.p_expected_revision !== state.draftRevision)
        return json({ code: "40001", message: "Draft revision conflict" }, 409);
      state.draft = structuredClone(body.p_content);
      state.draftRevision++;
      return json({
        revision: state.draftRevision,
        updated_at: new Date().toISOString(),
      });
    }
    if (rpc === "publish_site_content") {
      if (!state.admin) return denied();
      if (
        body.p_expected_draft_revision !== state.draftRevision ||
        body.p_expected_published_revision !== state.publishedRevision
      )
        return json({ code: "40001", message: "Publication conflict" }, 409);
      state.published = structuredClone(state.draft!);
      state.published.articles = state.published.articles.filter(
        (article) => article.visible,
      );
      state.publishedRevision++;
      state.revisions.unshift({
        id: state.publishedRevision,
        content: structuredClone(state.draft!),
        revision: state.publishedRevision,
        created_at: new Date().toISOString(),
      });
      return json({
        revision: state.publishedRevision,
        content: state.published,
        published_at: new Date().toISOString(),
      });
    }
    if (rpc === "submit_contact_request") {
      if (state.failContact) return offline();
      const id = crypto.randomUUID();
      state.requests.push({
        id,
        name: body.p_name,
        email: body.p_email,
        phone: body.p_phone,
        service: body.p_service,
        options: body.p_options,
        details: body.p_details,
        message: body.p_message,
        status: "new",
        notes: "",
        reminder_at: null,
        updated_at: new Date().toISOString(),
        consent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
      return json(id);
    }
    if (rpc === "subscribe_newsletter") {
      if (state.failNewsletter) return offline();
      if (!state.subscribers.some((row) => row.email === body.p_email))
        state.subscribers.push({
          id: crypto.randomUUID(),
          email: body.p_email,
          active: true,
          consent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
      return json(true);
    }
    if (rpc === "update_contact_follow_up") {
      if (!state.admin) return denied();
      const row = state.requests.find((item) => item.id === body.p_id);
      if (!row)
        return json({ code: "P0002", message: "Request not found" }, 404);
      const notes = String(body.p_notes ?? "");
      if (notes.length > 4000)
        return json({ code: "22023", message: "Invalid notes" }, 400);
      if (body.p_status) row.status = body.p_status;
      if (body.p_notes !== null && body.p_notes !== undefined)
        row.notes = notes;
      if (body.p_clear_reminder) row.reminder_at = null;
      else if (body.p_reminder_at) row.reminder_at = body.p_reminder_at;
      row.updated_at = new Date().toISOString();
      return json({
        id: row.id,
        status: row.status,
        notes: row.notes,
        reminder_at: row.reminder_at,
        updated_at: row.updated_at,
      });
    }
    if (rpc === "contact_requests_dashboard") {
      if (!state.admin) return denied();
      const day = 24 * 60 * 60 * 1000;
      const now = Date.now();
      const rows = state.requests;
      const status = (value: string) =>
        rows.filter((item) => item.status === value).length;
      const reminderAt = (item: Record<string, unknown>) =>
        item.reminder_at ? Date.parse(String(item.reminder_at)) : Number.NaN;
      const open = rows.filter((item) => item.status !== "archived");
      const recent = [...rows]
        .sort(
          (left, right) =>
            Date.parse(String(right.created_at)) -
            Date.parse(String(left.created_at)),
        )
        .slice(0, Math.min(Math.max(Number(body.p_recent ?? 5), 1), 20))
        .map((item) => ({
          id: item.id,
          name: item.name,
          service: item.service,
          status: item.status,
          created_at: item.created_at,
          reminder_at: item.reminder_at ?? null,
          has_notes: Boolean(item.notes),
        }));
      const createdAt = (item: Record<string, unknown>) =>
        Date.parse(String(item.created_at));
      return json({
        generated_at: new Date().toISOString(),
        total: rows.length,
        subscribers_total: state.subscribers.length,
        subscribers_active: state.subscribers.filter((item) => item.active)
          .length,
        by_status: {
          new: status("new"),
          contacted: status("contacted"),
          archived: status("archived"),
        },
        overdue: open.filter((item) => reminderAt(item) <= now).length,
        due_soon: open.filter(
          (item) => reminderAt(item) > now && reminderAt(item) <= now + 7 * day,
        ).length,
        untouched_new: rows.filter(
          (item) => item.status === "new" && createdAt(item) <= now - 7 * day,
        ).length,
        last_request_at: rows.length
          ? new Date(
              Math.max(...rows.map((item) => createdAt(item))),
            ).toISOString()
          : null,
        oldest_new_at: rows.some((item) => item.status === "new")
          ? new Date(
              Math.min(
                ...rows
                  .filter((item) => item.status === "new")
                  .map((item) => createdAt(item)),
              ),
            ).toISOString()
          : null,
        recent,
      });
    }
    if (rpc === "record_pageview") {
      state.pageviewAttempts++;
      const sessionId = String(body.p_session_id ?? "");
      const path = String(body.p_path ?? "");
      const browser = String(body.p_browser ?? "Autre");
      if (!/^[a-f0-9-]{36}$/i.test(sessionId) || !path.startsWith("/"))
        return json({ code: "22023", message: "Invalid event" }, 400);
      state.pageviews.push({
        session_id: sessionId,
        path,
        browser,
        created_at: new Date().toISOString(),
      });
      return route.fulfill({ status: 204, headers });
    }
    if (rpc === "analytics_summary") {
      if (!state.admin) return denied();
      const days = Math.min(Math.max(Number(body.p_days ?? 30), 1), 90);
      const since = Date.now() - days * 24 * 60 * 60 * 1000;
      const rows = state.pageviews.filter(
        (item) => Date.parse(item.created_at) >= since,
      );
      const byBrowser = new Map<
        string,
        { pageviews: number; sessions: Set<string> }
      >();
      const byPath = new Map<
        string,
        { pageviews: number; sessions: Set<string> }
      >();
      const byDay = new Map<
        string,
        { pageviews: number; sessions: Set<string> }
      >();
      for (const row of rows) {
        const browser = byBrowser.get(row.browser) ?? {
          pageviews: 0,
          sessions: new Set<string>(),
        };
        browser.pageviews++;
        browser.sessions.add(row.session_id);
        byBrowser.set(row.browser, browser);
        const page = byPath.get(row.path) ?? {
          pageviews: 0,
          sessions: new Set<string>(),
        };
        page.pageviews++;
        page.sessions.add(row.session_id);
        byPath.set(row.path, page);
        const key = row.created_at.slice(0, 10);
        const bucket = byDay.get(key) ?? {
          pageviews: 0,
          sessions: new Set<string>(),
        };
        bucket.pageviews++;
        bucket.sessions.add(row.session_id);
        byDay.set(key, bucket);
      }
      const ranked = (
        values: Map<string, { pageviews: number; sessions: Set<string> }>,
      ) =>
        [...values.entries()]
          .sort(
            (left, right) =>
              right[1].pageviews - left[1].pageviews ||
              left[0].localeCompare(right[0]),
          )
          .map(([key, value]) => ({
            key,
            pageviews: value.pageviews,
            sessions: value.sessions.size,
          }));
      return json({
        generated_at: new Date().toISOString(),
        days,
        retention_days: 90,
        totals: {
          pageviews: rows.length,
          sessions: new Set(rows.map((item) => item.session_id)).size,
          pages: new Set(rows.map((item) => item.path)).size,
        },
        browsers: ranked(byBrowser).map((item) => ({
          browser: item.key,
          pageviews: item.pageviews,
          sessions: item.sessions,
        })),
        top_pages: ranked(byPath)
          .slice(0, 10)
          .map((item) => ({
            path: item.key,
            pageviews: item.pageviews,
            sessions: item.sessions,
          })),
        daily: [...byDay.entries()]
          .sort((left, right) => left[0].localeCompare(right[0]))
          .map(([key, value]) => ({
            day: key,
            pageviews: value.pageviews,
            sessions: value.sessions.size,
          })),
        first_recorded_at: state.pageviews.length
          ? state.pageviews[0].created_at
          : null,
        last_recorded_at: state.pageviews.length
          ? state.pageviews[state.pageviews.length - 1].created_at
          : null,
      });
    }
    if (url.pathname.includes("/storage/v1/object/public/"))
      return route.fulfill({
        contentType: "image/svg+xml",
        headers,
        body: image,
      });
    if (url.pathname.includes("/storage/v1/object/list/")) {
      if (!state.admin) return denied();
      return json(
        state.uploads
          .slice(body.offset ?? 0, (body.offset ?? 0) + (body.limit ?? 50))
          .map((name) => ({
            id: name,
            name: name.split("/").pop(),
            metadata: { size: 1024 },
            created_at: new Date().toISOString(),
          })),
      );
    }
    if (url.pathname.includes("/storage/v1/object/") && method === "POST") {
      if (!state.admin) return denied();
      const name = url.pathname.split("/photos/")[1];
      state.uploads.push(name);
      return json({ Key: "photos/" + name });
    }
    const table = url.pathname.split("/rest/v1/")[1];
    let rows: Record<string, unknown>[] = [];
    const requestedId = url.searchParams.get("id")?.replace(/^eq\./, "");
    if (table === "site_content") {
      if (state.failPublished) return offline();
      rows = [
        {
          id: "main",
          content: state.published,
          revision: state.publishedRevision,
          published_at: "2026-10-08T10:00:00Z",
        },
      ];
    } else if (table === "site_content_drafts") {
      state.privateReads++;
      rows =
        state.admin && state.draft
          ? [
              {
                id: "main",
                content: state.draft,
                revision: state.draftRevision,
                updated_at: "2026-10-08T10:00:00Z",
              },
            ]
          : [];
    } else if (table === "site_content_revisions") {
      state.privateReads++;
      rows = state.admin ? state.revisions : [];
    } else if (table === "listings") {
      if (state.failListings) return offline();
      if (method === "GET") state.listingReads++;
      else {
        if (!state.admin) return denied();
        if (method === "DELETE") {
          if (state.failDelete) return denied();
          rows = state.listings.filter((item) => item.id === requestedId);
          state.listings = state.listings.filter(
            (item) => item.id !== requestedId,
          );
        } else if (method === "PATCH") {
          state.listings = state.listings.map((item) =>
            item.id === requestedId ? { ...item, ...body } : item,
          );
          rows = state.listings.filter((item) => item.id === requestedId);
        } else if (method === "POST") {
          const row = {
            ...body,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
          };
          state.listings.unshift(row);
          rows = [row];
        }
      }
      if (method === "GET") rows = state.listings;
    } else if (
      table === "contact_requests" ||
      table === "newsletter_subscriptions"
    ) {
      state.privateReads++;
      if (!state.admin) return denied();
      const dataset =
        table === "contact_requests" ? state.requests : state.subscribers;
      if (method === "PATCH")
        for (const item of dataset)
          if (item.id === requestedId) Object.assign(item, body);
      rows = requestedId
        ? dataset.filter((item) => item.id === requestedId)
        : dataset.filter((item) => matchesPostgrestRow(item, url.searchParams));
      rows = applyPostgrestOrder(rows, url.searchParams);
      if (method === "DELETE") {
        if (table === "contact_requests")
          state.requests = dataset.filter((item) => item.id !== requestedId);
        else
          state.subscribers = dataset.filter((item) => item.id !== requestedId);
      }
    } else
      return json({ code: "PGRST205", message: "Unknown test table" }, 404);
    if (requestedId) rows = rows.filter((item) => item.id === requestedId);
    const total = rows.length;
    const offset = Number(url.searchParams.get("offset") || 0);
    const limit = Math.min(
      Number(url.searchParams.get("limit") || state.rowCap),
      state.rowCap,
    );
    if (method === "GET") rows = rows.slice(offset, offset + limit);
    const selection = url.searchParams.get("select");
    if (selection && selection !== "*")
      rows = rows.map((row) =>
        Object.fromEntries(selection.split(",").map((key) => [key, row[key]])),
      );
    if (
      request.headers().accept?.includes("application/vnd.pgrst.object+json")
    ) {
      if (rows.length !== 1)
        return json({ code: "PGRST116", message: "Expected one row" }, 406);
      return json(rows[0]);
    }
    return json(rows, 200, {
      "content-range": `${offset}-${Math.max(offset, offset + rows.length - 1)}/${total}`,
    });
  });
  return state;
}
export async function login(page: Page) {
  await page.goto("/admin");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page
    .getByLabel("Mot de passe", { exact: true })
    .fill("test-password-only");
  await page.getByRole("button", { name: "Se connecter", exact: true }).click();
}
