import { z } from "zod";

export const languages = ["fr", "en", "ar"] as const;
export type Language = (typeof languages)[number];
export const homeSections = [
  "hero",
  "stats",
  "services",
  "why",
  "testimonials",
  "faq",
  "cta",
] as const;
export type HomeSectionId = (typeof homeSections)[number];
export const localizedTextSchema = z.object({
  fr: z.string().max(100_000),
  en: z.string().max(100_000),
  ar: z.string().max(100_000),
});
export type LocalizedText = z.infer<typeof localizedTextSchema>;

export function isSafeUrl(value: string, allowRelative = true): boolean {
  if (!value) return true;
  if (value !== value.trim() || /[\u0000-\u001f\\]/.test(value)) return false;
  if (allowRelative && /^\/(?!\/)/.test(value)) return true;
  try {
    const url = new URL(value);
    return (
      ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
const imageUrl = z
  .string()
  .max(2_048)
  .refine(
    (value) => isSafeUrl(value),
    "Utilisez une URL http(s) ou un chemin /images/…",
  );
const socialUrl = z
  .string()
  .max(2_048)
  .refine((value) => isSafeUrl(value, false), "Utilisez une URL http(s).");
export const imageSchema = z.object({
  url: imageUrl,
  alt: localizedTextSchema,
});
const itemId = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/);
export const faqSchema = z.object({
  id: itemId,
  question: localizedTextSchema,
  answer: localizedTextSchema,
});
export const testimonialSchema = z.object({
  id: itemId,
  name: localizedTextSchema,
  role: localizedTextSchema,
  location: localizedTextSchema,
  text: localizedTextSchema,
  image: imageUrl,
  rating: z.number().int().min(1).max(5),
});
export const articleSchema = z.object({
  id: itemId,
  title: localizedTextSchema,
  excerpt: localizedTextSchema,
  content: localizedTextSchema,
  category: localizedTextSchema,
  author: z.string().max(150),
  image: imageUrl,
  alt: localizedTextSchema,
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine(
      (value) =>
        Number.isFinite(Date.parse(value)) &&
        new Date(value).toISOString().slice(0, 10) === value,
      "Date invalide.",
    ),
  visible: z.boolean(),
});
const dictionary = z
  .record(z.string().max(100), z.string().max(20_000))
  .refine((value) => Object.keys(value).length <= 1_000);
export const siteContentSchema = z
  .object({
    schemaVersion: z.literal(1),
    settings: z.object({
      brand: z.string().trim().min(1).max(80),
      name: z.string().trim().min(1).max(150),
      whatsapp: z
        .string()
        .regex(
          /^\+[1-9]\d{6,14}$/,
          "Numéro international requis, ex. +971569130632.",
        ),
      email: z.email().max(254),
      location: z.string().max(200),
      social: z.object({
        instagram: socialUrl,
        linkedin: socialUrl,
        facebook: socialUrl,
      }),
      logoMonochrome: z.boolean(),
    }),
    images: z.object({
      logo: imageSchema,
      homeHero: imageSchema,
      aboutHero: imageSchema,
    }),
    translations: z.object({ fr: dictionary, en: dictionary, ar: dictionary }),
    faq: z.array(faqSchema).max(100),
    testimonials: z.array(testimonialSchema).max(100),
    articles: z.array(articleSchema).max(200),
    homeOrder: z
      .array(z.enum(homeSections))
      .length(homeSections.length)
      .refine(
        (order) => new Set(order).size === homeSections.length,
        "Chaque section doit apparaître une fois.",
      ),
    visibleSections: z.object({
      hero: z.boolean(),
      stats: z.boolean(),
      services: z.boolean(),
      why: z.boolean(),
      testimonials: z.boolean(),
      faq: z.boolean(),
      cta: z.boolean(),
    }),
  })
  .superRefine((value, context) => {
    for (const collection of ["faq", "testimonials", "articles"] as const) {
      const ids = new Set<string>();
      value[collection].forEach((item, index) => {
        if (ids.has(item.id))
          context.addIssue({
            code: "custom",
            path: [collection, index, "id"],
            message: "Identifiant déjà utilisé.",
          });
        ids.add(item.id);
      });
    }
    if (new TextEncoder().encode(JSON.stringify(value)).length > 1_000_000)
      context.addIssue({
        code: "custom",
        message: "Le contenu dépasse 1 Mo. Utilisez des URL pour les images.",
      });
  });
export type SiteContent = z.infer<typeof siteContentSchema>;
export type CmsArticle = z.infer<typeof articleSchema>;
export type CmsImage = z.infer<typeof imageSchema>;
export type CmsFaq = z.infer<typeof faqSchema>;
export type CmsTestimonial = z.infer<typeof testimonialSchema>;
