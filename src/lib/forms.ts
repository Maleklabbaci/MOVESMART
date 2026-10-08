import { z } from "zod";
export function normalizePhone(countryCode: string, input: string): string {
  const digits = input.replace(/[٠-٩۰-۹]/g, (char) =>
    String(char.charCodeAt(0) - (char >= "۰" ? 0x06f0 : 0x0660)),
  );
  const compact = digits.replace(/[\s().-]/g, "");
  if (compact.startsWith("+")) return compact;
  if (compact.startsWith("00")) return "+" + compact.slice(2);
  return countryCode + compact.replace(/^0+/, "");
}
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/),
  service: z.enum(["realEstate", "businessSetup"]),
  options: z.array(z.string().max(80)).min(1).max(6),
  details: z.record(z.string().max(80), z.string().max(5_000)),
  message: z.string().max(5_000),
  consent: z.literal(true),
  website: z.string().max(200),
});
export type ContactInput = z.infer<typeof contactSchema>;
export const newsletterSchema = z.object({
  email: z
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
  consent: z.literal(true),
  website: z.string().max(200),
});
