import { z } from "zod";
import { contactSchema, newsletterSchema } from "./forms";

const timestamp = z.iso.datetime({ offset: true });
export const contactStatusSchema = z.enum(["new", "contacted", "archived"]);
export const contactRecordSchema = contactSchema
  .omit({ consent: true, website: true })
  .extend({
    id: z.uuid(),
    status: contactStatusSchema,
    created_at: timestamp,
    consent_at: timestamp.optional(),
  });
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
