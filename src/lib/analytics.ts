import { supabase } from "./supabase";

/**
 * Consent-based audience measurement.
 *
 * Design constraints (audited by src/tests/analytics.test.ts and the SQL notes in
 * supabase/migrations/202610080002_admin_dashboard_analytics.sql):
 * - nothing is recorded before an explicit opt-in;
 * - no IP address, no user-agent string, no cookie, no device fingerprint and no
 *   cross-site identifier is ever collected or stored;
 * - the only identifier is a random session id generated in the browser.
 */
export const CONSENT_KEY = "movesmart_analytics_consent";
export const SESSION_KEY = "movesmart_analytics_session";
export const RETENTION_DAYS = 90;
/** A session ends after 30 minutes without activity, then a new random id is used. */
export const SESSION_IDLE_MS = 30 * 60 * 1000;
/** Mirrors the server-side cap: extra events are dropped instead of stored. */
export const MAX_EVENTS_PER_HOUR = 120;
export const SITE_BROWSERS = [
  "Chrome",
  "Safari",
  "Firefox",
  "Edge",
  "Opera",
  "Samsung Internet",
  "Autre",
] as const;
export type SiteBrowser = (typeof SITE_BROWSERS)[number];
export type ConsentDecision = "granted" | "denied";
export const ANALYTICS_POLICY_VERSION = 1;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface StoredSession {
  version: number;
  id: string;
  lastSeen: number;
}

export function analyticsEnabled(): boolean {
  return import.meta.env?.VITE_ANALYTICS_ENABLED !== "false";
}

/** Storage can be unavailable (private mode, disabled cookies): never throw. */
export function browserStorage(): StorageLike | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

export function readConsent(store: StorageLike | null): ConsentDecision | null {
  try {
    const value = store?.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(
  store: StorageLike | null,
  decision: ConsentDecision | null,
): void {
  try {
    if (!store) return;
    if (decision === null) store.removeItem(CONSENT_KEY);
    else store.setItem(CONSENT_KEY, decision);
  } catch {
    /* Storage disabled: the visitor simply stays unmeasured. */
  }
}

/**
 * Do Not Track / Global Privacy Control are treated as a refusal even if the visitor
 * previously opted in: a privacy signal always wins over a stored choice.
 */
export function privacySignal(): boolean {
  try {
    if (typeof navigator === "undefined") return false;
    const navigatorLike = navigator as Navigator & {
      globalPrivacyControl?: boolean;
      doNotTrack?: string | null;
    };
    if (navigatorLike.globalPrivacyControl === true) return true;
    const dnt = navigatorLike.doNotTrack ?? null;
    return dnt === "1" || dnt === "yes";
  } catch {
    return false;
  }
}

/** Coarse browser family, stored as a label instead of the raw user-agent string. */
export function detectBrowser(userAgent: string | undefined): SiteBrowser {
  const value = userAgent ?? "";
  if (!value) return "Autre";
  if (/SamsungBrowser/i.test(value)) return "Samsung Internet";
  if (/Edg[A-Z]?\//i.test(value) || /EdgiOS/i.test(value)) return "Edge";
  if (/OPR\/|Opera/i.test(value)) return "Opera";
  if (/Firefox\/|FxiOS/i.test(value)) return "Firefox";
  if (/Chrome\/|CriOS/i.test(value)) return "Chrome";
  if (/Safari\//i.test(value)) return "Safari";
  return "Autre";
}

export function readSessionId(
  store: StorageLike | null,
  now: number,
  random: () => string,
): string {
  let parsed: Partial<StoredSession> | null = null;
  try {
    parsed = JSON.parse(store?.getItem(SESSION_KEY) ?? "null");
  } catch {
    parsed = null;
  }
  const usable =
    parsed &&
    parsed.version === ANALYTICS_POLICY_VERSION &&
    typeof parsed.id === "string" &&
    /^[a-f0-9-]{36}$/i.test(parsed.id) &&
    typeof parsed.lastSeen === "number" &&
    now >= parsed.lastSeen &&
    now - parsed.lastSeen < SESSION_IDLE_MS;
  if (usable && parsed) {
    writeSession(store, { ...parsed, lastSeen: now } as StoredSession);
    return parsed.id as string;
  }
  const id = random();
  writeSession(store, { version: ANALYTICS_POLICY_VERSION, id, lastSeen: now });
  return id;
}

function writeSession(store: StorageLike | null, session: StoredSession): void {
  try {
    store?.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* Ignored: measurement must never break a page. */
  }
}

/**
 * Pageviews are stored as a path only: query strings (draft previews, search terms),
 * fragments and the admin area are never sent. The server repeats every one of these
 * checks, so a modified client cannot store more than this either.
 */
export function trackablePath(raw: string): string | null {
  if (typeof raw !== "string" || !raw.startsWith("/")) return null;
  const [pathname] = raw.split(/[?#]/);
  if (
    !pathname ||
    pathname.length > 300 ||
    /[\u0000-\u001f\u007f]/.test(pathname)
  )
    return null;
  if (pathname.startsWith("//")) return null;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  if (pathname !== "/" && pathname.endsWith("/"))
    return pathname.replace(/\/+$/, "");
  return pathname;
}

export interface TrackerOptions {
  store: StorageLike | null;
  record: (
    sessionId: string,
    path: string,
    browser: SiteBrowser,
  ) => PromiseLike<unknown>;
  now?: () => number;
  random?: () => string;
  enabled?: boolean;
  signal?: () => boolean;
  userAgent?: () => string | undefined;
}

/**
 * Returns a recorder that stays silent unless measurement is enabled, the visitor
 * explicitly opted in and no privacy signal is set. Repeated identical paths from the
 * same render pass are de-duplicated; visiting the same page again later still counts.
 */
export function createTracker(options: TrackerOptions) {
  const now = options.now ?? (() => Date.now());
  const random = options.random ?? (() => crypto.randomUUID());
  const signal = options.signal ?? privacySignal;
  const userAgent =
    options.userAgent ??
    (() =>
      typeof navigator === "undefined" ? undefined : navigator.userAgent);
  const enabled = options.enabled ?? analyticsEnabled();
  let lastPath: string | null = null;
  return {
    allowed(): boolean {
      return enabled && !signal() && readConsent(options.store) === "granted";
    },
    async record(raw: string): Promise<boolean> {
      if (!this.allowed()) return false;
      const path = trackablePath(raw);
      if (!path || path === lastPath) return false;
      lastPath = path;
      try {
        await options.record(
          readSessionId(options.store, now(), random),
          path,
          detectBrowser(userAgent()),
        );
        return true;
      } catch {
        // A blocked or offline measurement request must never surface to the visitor.
        return false;
      }
    },
  };
}

/** Forgets the local choice and the local session id (used by "withdraw consent"). */
export function forgetMeasurement(store: StorageLike | null): void {
  writeConsent(store, null);
  try {
    store?.removeItem(SESSION_KEY);
  } catch {
    /* Ignored. */
  }
}

const listeners = new Set<() => void>();

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function decideConsent(
  store: StorageLike | null,
  decision: ConsentDecision,
): void {
  writeConsent(store, decision);
  if (decision === "denied") {
    try {
      store?.removeItem(SESSION_KEY);
    } catch {
      /* Ignored. */
    }
  }
  for (const listener of listeners) listener();
}

/** Removes the stored choice so the visitor is asked again on the next visit. */
export function clearConsent(store: StorageLike | null): void {
  forgetMeasurement(store);
  for (const listener of listeners) listener();
}

/** Shared instance used by the public site. */
export const tracker = createTracker({
  store: browserStorage(),
  record: (sessionId, path, browser) =>
    supabase.rpc("record_pageview", {
      p_session_id: sessionId,
      p_path: path,
      p_browser: browser,
    }),
});
