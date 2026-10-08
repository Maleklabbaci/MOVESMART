import type { BrowserContext, Page } from "@playwright/test";
import { defaultContent } from "../src/content/defaults";
import type { SiteContent } from "../src/content/types";

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
        : dataset;
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
