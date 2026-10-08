import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultContent } from "../content/defaults";
import {
  hydrateContent,
  normalizeLanguage,
  localize,
  moveItem,
  articleForLanguage,
} from "../content/utils";
import { isSafeUrl, siteContentSchema } from "../content/types";
import { textFields } from "../content/fields";
import { normalizePhone, contactSchema, newsletterSchema } from "../lib/forms";
import { listingPayloadSchema, loadListingPages } from "../lib/listings";
import { validateImage } from "../lib/images";
import { countryDisplayName } from "../lib/countries";
import { csvCell } from "../lib/csv";
import {
  parseContactRecords,
  parseSubscriberRecords,
} from "../lib/adminMessages";

test("default CMS content is valid and all editable keys exist in every language", () => {
  assert.equal(siteContentSchema.safeParse(defaultContent).success, true);
  assert.equal(
    new Set(textFields.map((field) => field.key)).size,
    textFields.length,
  );
  for (const field of textFields)
    for (const language of ["fr", "en", "ar"] as const)
      assert.equal(
        typeof defaultContent.translations[language][field.key],
        "string",
        field.key,
      );
});
test("regional browser languages resolve consistently including RTL languages", () => {
  for (const [input, expected] of [
    ["fr-FR", "fr"],
    ["fr_CA", "fr"],
    ["en-GB", "en"],
    ["AR-ae", "ar"],
    ["de-DE", "fr"],
    ["", "fr"],
  ] as const)
    assert.equal(normalizeLanguage(input), expected);
});
test("partial revisions are merged without mutating defaults or resurrecting empty collections", () => {
  const content = hydrateContent({
    settings: { brand: "A new brand" },
    translations: { fr: { home_hero_title: "Nouveau titre" } },
    faq: [],
    articles: [],
  });
  assert.equal(content.settings.brand, "A new brand");
  assert.equal(content.settings.email, defaultContent.settings.email);
  assert.equal(content.translations.fr.home_hero_title, "Nouveau titre");
  assert.equal(
    content.translations.en.home_hero_title,
    defaultContent.translations.en.home_hero_title,
  );
  assert.equal(content.faq.length, 0);
  assert.equal(content.articles.length, 0);
  assert.equal(defaultContent.settings.brand, "MoveSmart");
  assert.ok(defaultContent.faq.length);
});
test("content hydration rejects executable URLs and prototype pollution", () => {
  assert.throws(() =>
    hydrateContent({ images: { logo: { url: "javascript:alert(1)" } } }),
  );
  assert.throws(() =>
    hydrateContent({ settings: { social: { instagram: "//evil.example" } } }),
  );
  hydrateContent(JSON.parse('{"__proto__":{"polluted":true}}'));
  assert.equal(({} as { polluted?: boolean }).polluted, undefined);
  assert.throws(() => hydrateContent("not an object"));
});
test("safe assets may use https or local paths but never SVG data or javascript schemes", () => {
  for (const value of [
    "https://cdn.example.com/photo.webp",
    "/images/cover.png",
    "",
  ])
    assert.equal(isSafeUrl(value), true);
  for (const value of [
    "data:image/svg+xml,<svg/>",
    "javascript:alert(1)",
    "//example.com/a",
    "\\evil.example/a",
    "https://user:secret@example.com/a",
    " https://example.com/a",
  ])
    assert.equal(isSafeUrl(value), false);
});
test("CMS validation rejects duplicates, invalid dates and duplicate sections", () => {
  const content = structuredClone(defaultContent);
  content.faq.push(content.faq[0]);
  assert.equal(siteContentSchema.safeParse(content).success, false);
  const another = structuredClone(defaultContent);
  another.articles[0].publishedAt = "2026-02-31";
  assert.equal(siteContentSchema.safeParse(another).success, false);
  const sections = structuredClone(defaultContent);
  sections.homeOrder[1] = "hero";
  assert.equal(siteContentSchema.safeParse(sections).success, false);
});
test("localized articles preserve paragraph breaks and format dates in UTC", () => {
  const article = articleForLanguage(defaultContent.articles[0], "fr");
  assert.ok(article.content.split(/\n\s*\n/).length > 1);
  assert.match(article.date, /2025/);
  assert.equal(localize({ fr: "Repli", en: "", ar: "" }, "en"), "Repli");
});
test("reordering keeps the original immutable and ignores out-of-bounds moves", () => {
  const values = ["a", "b", "c"];
  assert.deepEqual(moveItem(values, 0, 2), ["b", "c", "a"]);
  assert.deepEqual(values, ["a", "b", "c"]);
  assert.equal(moveItem(values, -1, 0), values);
});
test("international phone numbers are normalized, not silently accepted as letters", () => {
  assert.equal(normalizePhone("+33", "06 12 34 56 78"), "+33612345678");
  assert.equal(normalizePhone("+33", "٠٦١٢٣٤٥٦٧٨"), "+33612345678");
  assert.equal(normalizePhone("+971", "+213 555 123 456"), "+213555123456");
  assert.equal(normalizePhone("+971", "0033 6 12345678"), "+33612345678");
  const input = {
    name: "Client Test",
    email: "CLIENT@example.com",
    phone: "+33612345678",
    service: "realEstate",
    options: ["rental-income"],
    details: { budget: "2000000" },
    message: "",
    consent: true,
    website: "",
  };
  assert.equal(contactSchema.parse(input).email, "client@example.com");
  assert.equal(
    contactSchema.safeParse({ ...input, consent: false }).success,
    false,
  );
  assert.equal(
    contactSchema.safeParse({ ...input, phone: "abc" }).success,
    false,
  );
  assert.equal(
    newsletterSchema.safeParse({ email: "bad", consent: true, website: "" })
      .success,
    false,
  );
});
test("listing saves do not truncate decimals or allow negative bedrooms", () => {
  const input = {
    title: "Test apartment",
    location: "Dubai Marina",
    type: "Apartment",
    price: "2500000.50",
    beds: "2",
    baths: "2",
    area: "1500.5",
    images: [],
    description: "",
  };
  assert.equal(listingPayloadSchema.parse(input).price, 2500000.5);
  assert.equal(
    listingPayloadSchema.safeParse({ ...input, beds: "-1" }).success,
    false,
  );
  assert.equal(
    listingPayloadSchema.safeParse({ ...input, beds: "1.5" }).success,
    false,
  );
});
test("image uploads enforce supported formats and limits before making a network request", () => {
  assert.equal(validateImage({ type: "image/webp", size: 2048 }), null);
  assert.ok(validateImage({ type: "image/svg+xml", size: 200 }));
  assert.ok(validateImage({ type: "image/jpeg", size: 6 * 1024 * 1024 }));
  assert.ok(validateImage({ type: "image/jpeg", size: 0 }));
});
test("CSV escaping prevents formulas from visitor-controlled contact details", () => {
  assert.equal(
    csvCell('=HYPERLINK("http://evil")'),
    '"\'=HYPERLINK(""http://evil"")"',
  );
  assert.equal(csvCell("simple@example.com"), '"simple@example.com"');
  assert.equal(csvCell(" +command"), '"\' +command"');
});

test("catalogue pagination includes records after 1000 even with a lower server row cap", async () => {
  const rows = Array.from({ length: 1005 }, (_, index) => ({
    id: String(index),
    title: `Bien ${index}`,
    location: "Dubai",
    type: "Villa",
    price: 1000,
    beds: 2,
    baths: 1,
    area: 100,
    images: [],
    description: "",
  }));
  const offsets: number[] = [];
  const loaded = await loadListingPages(async (offset, pageSize) => {
    offsets.push(offset);
    return {
      data: rows.slice(offset, offset + Math.min(pageSize, 100)),
      error: null,
      count: rows.length,
    };
  });
  assert.equal(loaded.length, 1005);
  assert.equal(loaded.at(-1)?.title, "Bien 1004");
  assert.deepEqual(
    offsets,
    Array.from({ length: 11 }, (_, index) => index * 100),
  );
});
test("incomplete or changing catalogue pages never pass as a complete empty catalogue", async () => {
  await assert.rejects(
    loadListingPages(async () => ({ data: [], error: null, count: 10 })),
    /incomplet/,
  );
  await assert.rejects(
    loadListingPages(async () => ({ data: [], error: null, count: null })),
    /total/,
  );
  const failure = new Error("offline");
  await assert.rejects(
    loadListingPages(async () => ({ data: null, error: failure, count: null })),
    (error) => error === failure,
  );
  assert.deepEqual(
    await loadListingPages(async () => ({ data: [], error: null, count: 0 })),
    [],
  );
});
test("private admin records reject malformed details, dates, phone links and booleans", () => {
  const row = {
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
  assert.equal(parseContactRecords([row]).length, 1);
  assert.throws(() =>
    parseContactRecords([{ ...row, details: { budget: { nested: true } } }]),
  );
  assert.throws(() =>
    parseContactRecords([{ ...row, phone: "javascript:alert(1)" }]),
  );
  assert.throws(() =>
    parseContactRecords([{ ...row, created_at: "invalid date" }]),
  );
  const subscription = {
    id: row.id,
    email: row.email,
    active: false,
    created_at: row.created_at,
    consent_at: row.created_at,
  };
  assert.equal(parseSubscriberRecords([subscription])[0].active, false);
  assert.throws(() =>
    parseSubscriberRecords([{ ...subscription, active: "false" }]),
  );
});

test("country names follow the content language rather than an English-only dropdown", () => {
  assert.equal(
    countryDisplayName({ flag: "🇩🇿", country: "Algeria" }, "fr"),
    "Algérie",
  );
  assert.equal(
    countryDisplayName({ flag: "🇫🇷", country: "France" }, "ar"),
    "فرنسا",
  );
  assert.equal(
    countryDisplayName({ flag: "?", country: "Fallback" }, "en"),
    "Fallback",
  );
});
