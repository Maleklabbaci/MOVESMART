import type { Language } from "../content/types";

/** Country names are standard locale data; calling codes remain immutable form values. */
export function countryDisplayName(
  country: { flag: string; country: string },
  language: Language,
): string {
  const region = Array.from(country.flag, (char) =>
    String.fromCharCode((char.codePointAt(0) ?? 0) - 0x1f1e6 + 65),
  ).join("");
  if (!/^[A-Z]{2}$/.test(region)) return country.country;
  return (
    new Intl.DisplayNames([language], { type: "region" }).of(region) ||
    country.country
  );
}
