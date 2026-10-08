import { z } from "zod";
import { contactSchema, newsletterSchema } from "./forms";

const timestamp = z.iso.datetime({ offset: true });
const count = z.union([
  z.number().int().nonnegative(),
  z.string().regex(/^\d+$/).transform(Number),
]);
export const contactStatusSchema = z.enum(["new", "contacted", "archived"]);
export const contactServiceSchema = z.enum(["realEstate", "businessSetup"]);
export const contactRecordSchema = contactSchema
  .omit({ consent: true, website: true })
  .extend({
    id: z.uuid(),
    status: contactStatusSchema,
    created_at: timestamp,
    consent_at: timestamp.optional(),
    // Added by supabase/migrations/202610080002_admin_dashboard_analytics.sql.
    // Optional so the admin stays usable against a project where only the first
    // migration has been applied.
    reminder_at: timestamp.nullish(),
    notes: z.string().max(4_000).nullish(),
    updated_at: timestamp.nullish(),
  })
  .transform((value) => ({
    ...value,
    reminder_at: value.reminder_at ?? null,
    notes: value.notes ?? "",
  }));
export const subscriberRecordSchema = newsletterSchema
  .pick({ email: true })
  .extend({
    id: z.uuid(),
    active: z.boolean(),
    created_at: timestamp,
    consent_at: timestamp,
  });
export type ContactRecord = z.infer<typeof contactRecordSchema>;
export type SubscriberRecord = z.infer<typeof subscriberRecordSchema>;
export const parseContactRecords = (value: unknown) =>
  z.array(contactRecordSchema).parse(value);
export const parseSubscriberRecords = (value: unknown) =>
  z.array(subscriberRecordSchema).parse(value);

export type ContactStatus = z.infer<typeof contactStatusSchema>;
export type ContactService = z.infer<typeof contactServiceSchema>;

export interface ContactFilters {
  status: ContactStatus | "all";
  service: ContactService | "all";
  reminder: "all" | "overdue" | "upcoming" | "none";
  search: string;
}

export const emptyContactFilters: ContactFilters = {
  status: "all",
  service: "all",
  reminder: "all",
  search: "",
};
export const contactFiltersActive = (filters: ContactFilters): boolean =>
  filters.status !== "all" ||
  filters.service !== "all" ||
  filters.reminder !== "all" ||
  filters.search.trim() !== "";

/**
 * PostgREST treats commas, parentheses, quotes, `*` and `%` as syntax inside `or=(…)`
 * and `ilike` values; they are removed instead of being sent raw.
 */
export function sanitizeSearchTerm(value: string): string {
  return value
    .replace(/[,()"'*%\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

export function isReminderOverdue(
  record: {
    reminder_at?: string | null;
    status: ContactStatus;
  },
  now = Date.now(),
): boolean {
  if (!record.reminder_at || record.status === "archived") return false;
  const value = Date.parse(record.reminder_at);
  return Number.isFinite(value) && value <= now;
}

export function formatReminder(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
}

/** `datetime-local` values are interpreted as the administrator's local time. */
export function reminderToIso(value: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export const requestCsvRows = (records: ContactRecord[]): unknown[][] => [
  [
    "Nom",
    "Email",
    "Téléphone",
    "Service",
    "Options",
    "Détails",
    "Message",
    "Statut",
    "Relance prévue",
    "Relance échue",
    "Notes internes",
    "Consentement déclaré",
    "Date",
  ],
  ...records.map((item) => [
    item.name,
    item.email,
    item.phone,
    item.service,
    item.options.join("; "),
    JSON.stringify(item.details),
    item.message,
    item.status,
    item.reminder_at ?? "",
    isReminderOverdue(item) ? "Oui" : "Non",
    item.notes,
    item.consent_at ?? "",
    item.created_at,
  ]),
];

export const dashboardPayloadSchema = z.object({
  generated_at: timestamp,
  total: count,
  subscribers_total: count,
  subscribers_active: count,
  by_status: z.object({
    new: count,
    contacted: count,
    archived: count,
  }),
  overdue: count,
  due_soon: count,
  untouched_new: count,
  last_request_at: timestamp.nullish(),
  oldest_new_at: timestamp.nullish(),
  recent: z.array(
    z.object({
      id: z.uuid(),
      name: z.string().max(150),
      service: contactServiceSchema,
      status: contactStatusSchema,
      created_at: timestamp,
      reminder_at: timestamp.nullish(),
      has_notes: z.boolean(),
    }),
  ),
});
export type DashboardPayload = z.infer<typeof dashboardPayloadSchema>;
export const parseDashboardPayload = (value: unknown): DashboardPayload =>
  dashboardPayloadSchema.parse(value);

export const analyticsSummarySchema = z.object({
  generated_at: timestamp,
  days: z.number().int().min(1).max(90),
  retention_days: z.number().int().positive(),
  totals: z.object({ pageviews: count, sessions: count, pages: count }),
  browsers: z.array(
    z.object({
      browser: z.string().max(40),
      pageviews: count,
      sessions: count,
    }),
  ),
  top_pages: z.array(
    z.object({ path: z.string().max(300), pageviews: count, sessions: count }),
  ),
  daily: z.array(
    z.object({ day: z.string().max(20), pageviews: count, sessions: count }),
  ),
  first_recorded_at: timestamp.nullish(),
  last_recorded_at: timestamp.nullish(),
});
export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;
export const parseAnalyticsSummary = (value: unknown): AnalyticsSummary =>
  analyticsSummarySchema.parse(value);
