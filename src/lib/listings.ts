import { z } from "zod";
import { isSafeUrl } from "../content/types";
export const listingPayloadSchema = z.object({
  title: z.string().trim().min(2).max(200),
  type: z.enum([
    "Apartment",
    "Villa",
    "Penthouse",
    "House",
    "Townhouse",
    "Studio",
    "Office",
    "Land",
  ]),
  location: z.string().trim().min(2).max(200),
  price: z.coerce.number().positive().max(1_000_000_000),
  beds: z.coerce.number().int().min(0).max(100),
  baths: z.coerce.number().int().min(0).max(100),
  area: z.coerce.number().positive().max(10_000_000),
  description: z.string().max(20_000),
  images: z
    .array(
      z
        .string()
        .max(2_048)
        .refine((url) => Boolean(url) && isSafeUrl(url)),
    )
    .max(30),
});
export const listingSchema = listingPayloadSchema.extend({
  id: z.union([z.string(), z.number()]).transform(String),
  created_at: z.string().optional(),
});
export type Listing = z.infer<typeof listingSchema>;
export const listingTypes = listingPayloadSchema.shape.type.options;
export function parseListings(data: unknown): Listing[] {
  return z.array(listingSchema).parse(data);
}

export interface ListingPage {
  data: unknown;
  error: unknown;
  count: number | null;
}
/** Follow actual returned ranges, including projects with a server row cap below pageSize. */
export async function loadListingPages(
  readPage: (offset: number, pageSize: number) => PromiseLike<ListingPage>,
  pageSize = 200,
): Promise<Listing[]> {
  const result: Listing[] = [];
  const ids = new Set<string>();
  let offset = 0;
  let expectedCount: number | null = null;
  while (true) {
    const { data, error, count } = await readPage(offset, pageSize);
    if (error) throw error;
    if (count === null || !Number.isSafeInteger(count) || count < 0)
      throw new Error("Le total du catalogue n’a pas été confirmé.");
    if (expectedCount !== null && count !== expectedCount)
      throw new Error(
        "Le catalogue a changé pendant le chargement. Réessayez.",
      );
    expectedCount = count;
    const rows = parseListings(data ?? []);
    if (!rows.length && offset < count)
      throw new Error("Le catalogue reçu est incomplet. Réessayez.");
    for (const row of rows) {
      if (ids.has(row.id))
        throw new Error(
          "Le catalogue a changé pendant le chargement. Réessayez.",
        );
      ids.add(row.id);
      result.push(row);
    }
    offset += rows.length;
    if (offset > count)
      throw new Error("Le catalogue reçu est incohérent. Réessayez.");
    if (offset === count) return result;
  }
}

export function listingTypeKey(type: Listing["type"]) {
  return "listing_type_" + type.toLowerCase();
}
