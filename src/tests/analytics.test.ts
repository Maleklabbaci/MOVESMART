import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONSENT_KEY,
  SESSION_IDLE_MS,
  SESSION_KEY,
  browserStorage,
  clearConsent,
  createTracker,
  decideConsent,
  detectBrowser,
  privacySignal,
  readConsent,
  readSessionId,
  subscribeConsent,
  trackablePath,
  writeConsent,
  type StorageLike,
} from "../lib/analytics";
import {
  applyPostgrestOrder,
  matchesPostgrestRow,
} from "../lib/postgrestFilter";
import {
  analyticsSummarySchema,
  contactRecordSchema,
  dashboardPayloadSchema,
  emptyContactFilters,
  contactFiltersActive,
  formatReminder,
  isReminderOverdue,
  reminderToIso,
  requestCsvRows,
  sanitizeSearchTerm,
} from "../lib/adminMessages";

function fakeStorage(initial: Record<string, string> = {}): StorageLike {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => void values.set(key, value),
    removeItem: (key) => void values.delete(key),
  };
}

const sessionId = "33333333-3333-4333-8333-333333333333";

test("browser families are coarse labels and never the raw user-agent string", () => {
  const cases: [string, string][] = [
    [
      "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Chrome",
    ],
    [
      "Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0 Mobile/15E148 Safari/604.1",
      "Chrome",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
      "Safari",
    ],
    [
      "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
      "Firefox",
    ],
    [
      "Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/120.0 Mobile/15E148 Safari/605.1.15",
      "Firefox",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 Edg/120.0.0.0",
      "Edge",
    ],
    [
      "Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/120.0 Mobile/15E148 Safari/605.1.15",
      "Edge",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 OPR/106.0.0.0",
      "Opera",
    ],
    [
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0 Mobile Safari/537.36",
      "Samsung Internet",
    ],
    ["Mozilla/5.0 (compatible; SomeBot/1.0)", "Autre"],
    ["", "Autre"],
  ];
  for (const [userAgent, expected] of cases)
    assert.equal(detectBrowser(userAgent), expected, userAgent);
  assert.equal(detectBrowser(undefined), "Autre");
});

test("pageviews store a path only, never a query string, a fragment or the admin area", () => {
  assert.equal(trackablePath("/listings"), "/listings");
  assert.equal(trackablePath("/"), "/");
  assert.equal(
    trackablePath("/blog/article-1?preview=draft"),
    "/blog/article-1",
  );
  assert.equal(trackablePath("/listings/?q=villa#top"), "/listings");
  assert.equal(trackablePath("//evil.example/path"), null);
  assert.equal(trackablePath("/admin"), null);
  assert.equal(trackablePath("/admin/requests"), null);
  assert.equal(trackablePath("no-slash"), null);
  assert.equal(trackablePath("/" + "x".repeat(400)), null);
  assert.equal(trackablePath("/broken\u0007path"), null);
  assert.equal(trackablePath(undefined as unknown as string), null);
});

test("consent is explicit, revocable and stored locally only", () => {
  const store = fakeStorage();
  assert.equal(readConsent(store), null);
  writeConsent(store, "granted");
  assert.equal(readConsent(store), "granted");
  writeConsent(store, "denied");
  assert.equal(readConsent(store), "denied");
  store.setItem(CONSENT_KEY, "maybe");
  assert.equal(readConsent(store), null);

  const notified: number[] = [];
  const unsubscribe = subscribeConsent(() => notified.push(1));
  decideConsent(store, "granted");
  assert.equal(readConsent(store), "granted");
  assert.equal(notified.length, 1);
  assert.equal(store.getItem(SESSION_KEY) !== null, false);
  decideConsent(store, "denied");
  assert.equal(notified.length, 2);
  assert.equal(store.getItem(SESSION_KEY), null);
  clearConsent(store);
  assert.equal(readConsent(store), null);
  assert.equal(store.getItem(SESSION_KEY), null);
  assert.equal(notified.length, 3);
  unsubscribe();
  decideConsent(store, "granted");
  assert.equal(notified.length, 3);

  // Storage failures must never break a page.
  const broken: StorageLike = {
    getItem: () => {
      throw new Error("disabled");
    },
    setItem: () => {
      throw new Error("disabled");
    },
    removeItem: () => {
      throw new Error("disabled");
    },
  };
  assert.equal(readConsent(broken), null);
  writeConsent(broken, "granted");
  assert.equal(readConsent(null), null);
});

test("the random session id is stable during a visit and rotates after 30 idle minutes", () => {
  const now = 1_700_000_000_000;
  const rotated = "44444444-4444-4444-8444-444444444444";
  const store = fakeStorage();
  let generated = 0;
  const random = () => {
    generated += 1;
    return generated === 1 ? sessionId : rotated;
  };
  assert.equal(readSessionId(store, now, random), sessionId);
  assert.equal(readSessionId(store, now + 60_000, random), sessionId);
  assert.equal(generated, 1);

  const stored = (lastSeen: number) =>
    fakeStorage({
      [SESSION_KEY]: JSON.stringify({ version: 1, id: sessionId, lastSeen }),
    });
  // Still the same session just under 30 minutes after the last activity...
  assert.equal(
    readSessionId(stored(now), now + SESSION_IDLE_MS - 1, random),
    sessionId,
  );
  // ...and a new random id once the idle window is exceeded.
  assert.equal(
    readSessionId(stored(now), now + SESSION_IDLE_MS + 1, random),
    rotated,
  );

  const corrupted = fakeStorage({
    [SESSION_KEY]: JSON.stringify({
      version: 1,
      id: "not-a-uuid",
      lastSeen: now,
    }),
  });
  assert.equal(
    readSessionId(corrupted, now, () => sessionId),
    sessionId,
  );
  const older = fakeStorage({
    [SESSION_KEY]: JSON.stringify({
      version: 0,
      id: sessionId,
      lastSeen: now,
    }),
  });
  assert.equal(
    readSessionId(older, now, () => "55555555-5555-4555-8555-555555555555"),
    "55555555-5555-4555-8555-555555555555",
  );
  // A clock that moved backwards, or a session recorded in the future, is replaced.
  assert.equal(
    readSessionId(stored(now + 10_000_000), now, () => rotated),
    rotated,
  );
  const garbage = fakeStorage({ [SESSION_KEY]: "{not json" });
  assert.equal(
    readSessionId(garbage, now, () => sessionId),
    sessionId,
  );
});

test("nothing is measured without an explicit opt-in, and a privacy signal always wins", async () => {
  const calls: { session: string; path: string; browser: string }[] = [];
  const build = (store: StorageLike, options: Record<string, unknown> = {}) =>
    createTracker({
      store,
      record: (session, path, browser) => {
        calls.push({ session, path, browser });
        return Promise.resolve();
      },
      now: () => 1_700_000_000_000,
      random: () => sessionId,
      userAgent: () => "Mozilla/5.0 Chrome/120.0 Safari/537.36",
      ...options,
    });

  const anonymous = fakeStorage();
  assert.equal(await build(anonymous).record("/"), false);
  assert.equal(calls.length, 0);

  const refused = fakeStorage({ [CONSENT_KEY]: "denied" });
  assert.equal(await build(refused).record("/"), false);
  assert.equal(calls.length, 0);

  const granted = fakeStorage({ [CONSENT_KEY]: "granted" });
  const tracker = build(granted);
  assert.equal(await tracker.record("/listings?utm=x"), true);
  assert.deepEqual(calls, [
    { session: sessionId, path: "/listings", browser: "Chrome" },
  ]);
  // The same path from a re-render is not counted twice...
  assert.equal(await tracker.record("/listings"), false);
  assert.equal(calls.length, 1);
  // ...but visiting it again after another page is a new pageview.
  assert.equal(await tracker.record("/about"), true);
  assert.equal(await tracker.record("/listings"), true);
  assert.equal(calls.length, 3);

  const signalled = build(fakeStorage({ [CONSENT_KEY]: "granted" }), {
    signal: () => true,
  });
  assert.equal(await signalled.record("/"), false);
  const disabled = build(fakeStorage({ [CONSENT_KEY]: "granted" }), {
    enabled: false,
  });
  assert.equal(await disabled.record("/"), false);

  const failing = createTracker({
    store: fakeStorage({ [CONSENT_KEY]: "granted" }),
    record: () => Promise.reject(new Error("offline")),
    random: () => sessionId,
  });
  assert.equal(await failing.record("/"), false);
  assert.equal(await failing.record("/admin"), false);
});

test("privacy signals are honoured from the browser environment", () => {
  // Node has no navigator: the check must be defensive rather than throwing.
  assert.equal(privacySignal(), false);
  assert.equal(browserStorage(), null);
});

test("the PostgREST filter helper matches what the admin queries send", () => {
  const row = {
    id: "a",
    name: "Client Test",
    email: "client@example.com",
    status: "new",
    service: "realEstate",
    reminder_at: "2026-10-01T08:00:00+00:00",
    created_at: "2026-10-08T10:00:00+00:00",
    notes: "",
  };
  const match = (query: string) =>
    matchesPostgrestRow(row, new URLSearchParams(query));
  assert.equal(match("select=*&limit=50&offset=0"), true);
  assert.equal(match("status=eq.new"), true);
  assert.equal(match("status=eq.archived"), false);
  assert.equal(match("status=neq.archived"), true);
  assert.equal(match("service=eq.businessSetup"), false);
  assert.equal(match("name=ilike.*client*"), true);
  assert.equal(match("name=ilike.*CLIENT*"), true);
  assert.equal(match("name=ilike.*nothing*"), false);
  assert.equal(match("or=(name.ilike.*test*,email.ilike.*nobody*)"), true);
  assert.equal(match("or=(name.ilike.*nobody*,email.ilike.*nobody*)"), false);
  assert.equal(
    match(
      "reminder_at=not.is.null&reminder_at=lte.2026-10-08T00:00:00Z&status=neq.archived",
    ),
    true,
  );
  assert.equal(
    match("reminder_at=not.is.null&reminder_at=lte.2026-09-01T00:00:00Z"),
    false,
  );
  assert.equal(match("reminder_at=is.null"), false);
  assert.equal(match("status=in.(new,contacted)"), true);
  assert.equal(match("status=in.(archived)"), false);
});

test("the PostgREST order helper reproduces PostgREST ordering, NULLs last", () => {
  const rows = [
    { id: "old", created_at: "2026-10-01T00:00:00Z", reminder_at: null },
    {
      id: "new-b",
      created_at: "2026-10-08T00:00:00Z",
      reminder_at: "2026-10-02T00:00:00Z",
    },
    {
      id: "new-a",
      created_at: "2026-10-08T00:00:00Z",
      reminder_at: "2026-10-09T00:00:00Z",
    },
  ];
  assert.deepEqual(
    applyPostgrestOrder(
      rows,
      new URLSearchParams("order=created_at.desc&order=id.desc"),
    ).map((row) => row.id),
    ["new-b", "new-a", "old"],
  );
  assert.deepEqual(
    applyPostgrestOrder(rows, new URLSearchParams("order=reminder_at.asc")).map(
      (row) => row.id,
    ),
    ["new-b", "new-a", "old"],
  );
  assert.deepEqual(applyPostgrestOrder(rows, new URLSearchParams()), rows);
});

test("request records and filters accept both migration states", () => {
  const base = {
    id: "33333333-3333-4333-8333-333333333333",
    name: "Client Test",
    email: "client@example.com",
    phone: "+33612345678",
    service: "realEstate",
    options: ["rental-income"],
    details: { budget: "2000000" },
    message: "",
    status: "new",
    created_at: "2026-10-08T10:00:00+00:00",
  };
  // Rows from a project where only the first migration is applied.
  const first = contactRecordSchema.parse(base);
  assert.equal(first.notes, "");
  assert.equal(first.reminder_at, null);
  // Rows that include follow-up columns.
  const second = contactRecordSchema.parse({
    ...base,
    notes: "Client relancé",
    reminder_at: "2026-10-01T08:00:00+00:00",
    updated_at: "2026-10-02T08:00:00+00:00",
  });
  assert.equal(second.notes, "Client relancé");
  assert.throws(() =>
    contactRecordSchema.parse({ ...base, notes: "x".repeat(4001) }),
  );
  assert.throws(() =>
    contactRecordSchema.parse({ ...base, reminder_at: "not a date" }),
  );

  assert.equal(sanitizeSearchTerm('client, (test) "x" *%'), "client test x");
  assert.equal(sanitizeSearchTerm("a".repeat(200)).length, 60);
  assert.equal(contactFiltersActive(emptyContactFilters), false);
  assert.equal(
    contactFiltersActive({ ...emptyContactFilters, reminder: "overdue" }),
    true,
  );
  assert.equal(
    contactFiltersActive({ ...emptyContactFilters, search: "   " }),
    false,
  );
});

test("overdue reminders ignore archived requests, empty dates and future dates", () => {
  const now = Date.parse("2026-10-08T12:00:00Z");
  assert.equal(
    isReminderOverdue(
      { status: "new", reminder_at: "2026-10-08T09:00:00Z" },
      now,
    ),
    true,
  );
  assert.equal(
    isReminderOverdue(
      { status: "new", reminder_at: "2026-10-09T09:00:00Z" },
      now,
    ),
    false,
  );
  assert.equal(
    isReminderOverdue(
      { status: "archived", reminder_at: "2026-10-01T09:00:00Z" },
      now,
    ),
    false,
  );
  assert.equal(
    isReminderOverdue({ status: "new", reminder_at: null }, now),
    false,
  );
  assert.equal(
    isReminderOverdue({ status: "new", reminder_at: "invalid" }, now),
    false,
  );
  assert.equal(formatReminder("2026-10-08T10:30:00+00:00"), "2026-10-08T10:30");
  assert.equal(formatReminder(null), "");
  assert.equal(formatReminder("invalid"), "");
  assert.equal(reminderToIso(""), null);
  assert.equal(reminderToIso("invalid"), null);
  assert.equal(
    reminderToIso("2026-10-08T10:30"),
    new Date("2026-10-08T10:30").toISOString(),
  );
});

test("the CSV export carries follow-up columns and flags overdue reminders", () => {
  const rows = requestCsvRows([
    {
      ...contactRecordSchema.parse({
        id: "33333333-3333-4333-8333-333333333333",
        name: "Client Test",
        email: "client@example.com",
        phone: "+33612345678",
        service: "realEstate",
        options: ["rental-income"],
        details: { budget: "2000000" },
        message: "Bonjour",
        status: "contacted",
        created_at: "2026-10-08T10:00:00+00:00",
        notes: "Note privée",
        reminder_at: "2026-01-01T08:00:00+00:00",
      }),
    },
  ]);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].length, 13);
  assert.equal(rows[0][8], "Relance prévue");
  assert.equal(rows[0][10], "Notes internes");
  assert.equal(rows[1][8], "2026-01-01T08:00:00+00:00");
  assert.equal(rows[1][9], "Oui");
  assert.equal(rows[1][10], "Note privée");
});

test("dashboard and analytics payloads are validated before they reach the UI", () => {
  const dashboard = {
    generated_at: "2026-10-08T10:00:00+00:00",
    total: 121,
    subscribers_total: 4,
    subscribers_active: 3,
    by_status: { new: 80, contacted: 1, archived: 40 },
    overdue: 1,
    due_soon: 2,
    untouched_new: 5,
    last_request_at: "2026-10-08T09:00:00+00:00",
    oldest_new_at: null,
    recent: [
      {
        id: "33333333-3333-4333-8333-333333333333",
        name: "Client Test",
        service: "realEstate",
        status: "new",
        created_at: "2026-10-08T09:00:00+00:00",
        reminder_at: null,
        has_notes: false,
      },
    ],
  };
  const parsed = dashboardPayloadSchema.parse(dashboard);
  assert.equal(parsed.total, 121);
  assert.equal(parsed.recent[0].name, "Client Test");
  assert.throws(() =>
    dashboardPayloadSchema.parse({ ...dashboard, total: -1 }),
  );
  assert.throws(() =>
    dashboardPayloadSchema.parse({ ...dashboard, by_status: undefined }),
  );
  assert.throws(() =>
    dashboardPayloadSchema.parse({
      ...dashboard,
      recent: [{ ...dashboard.recent[0], status: "unknown" }],
    }),
  );

  const summary = {
    generated_at: "2026-10-08T10:00:00+00:00",
    days: 30,
    retention_days: 90,
    totals: { pageviews: 122, sessions: 2, pages: 3 },
    browsers: [{ browser: "Chrome", pageviews: 120, sessions: 1 }],
    top_pages: [{ path: "/", pageviews: 60, sessions: 2 }],
    daily: [{ day: "2026-10-08", pageviews: 122, sessions: 2 }],
    first_recorded_at: "2026-10-08T09:00:00+00:00",
    last_recorded_at: "2026-10-08T10:00:00+00:00",
  };
  assert.equal(analyticsSummarySchema.parse(summary).totals.pageviews, 122);
  assert.throws(() =>
    analyticsSummarySchema.parse({ ...summary, browsers: "none" }),
  );
  assert.throws(() => analyticsSummarySchema.parse({ ...summary, days: 0 }));
});
