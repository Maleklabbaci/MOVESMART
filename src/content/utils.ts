import { defaultContent } from "./defaults";
import {
  siteContentSchema,
  type CmsArticle,
  type Language,
  type LocalizedText,
  type SiteContent,
} from "./types";

export function normalizeLanguage(code?: string | null): Language {
  const language = code?.toLowerCase().split(/[-_]/)[0];
  return language === "en" || language === "ar" ? language : "fr";
}
export function localize(value: LocalizedText, language: Language): string {
  return value[language] || value.fr || value.en || value.ar || "";
}
function merge(base: unknown, value: unknown): unknown {
  if (value === undefined) return structuredClone(base);
  if (
    typeof base !== "object" ||
    !base ||
    Array.isArray(base) ||
    typeof value !== "object" ||
    !value ||
    Array.isArray(value)
  )
    return value;
  const result: Record<string, unknown> = {};
  const original = base as Record<string, unknown>;
  const incoming = value as Record<string, unknown>;
  for (const key of new Set([
    ...Object.keys(original),
    ...Object.keys(incoming),
  ])) {
    if (["__proto__", "prototype", "constructor"].includes(key)) continue;
    result[key] = merge(original[key], incoming[key]);
  }
  return result;
}
/** Fills missing fields for older revisions; intentionally empty collections stay empty. */
export function hydrateContent(value: unknown): SiteContent {
  if (value !== null && (typeof value !== "object" || Array.isArray(value)))
    throw new Error("Contenu CMS invalide.");
  return siteContentSchema.parse(merge(defaultContent, value ?? {}));
}
export function articleForLanguage(article: CmsArticle, language: Language) {
  return {
    ...article,
    title: localize(article.title, language),
    excerpt: localize(article.excerpt, language),
    content: localize(article.content, language),
    category: localize(article.category, language),
    alt: localize(article.alt, language),
    date: new Intl.DateTimeFormat(language, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(article.publishedAt + "T00:00:00Z")),
  };
}
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length)
    return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
