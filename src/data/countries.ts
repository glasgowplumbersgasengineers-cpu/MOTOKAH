// East African countries Motokah covers. Tanzania is the only one with real
// scraped prices right now (toyota.co.tz etc). The others get real model
// specs/photos and whatever official distributor site could actually be
// confirmed, with no price shown, honestly, until a real price-scrape pass
// is done per country.
export interface Country {
  slug: string;
  name: string;
  currency: string;
}

export const COUNTRIES: Country[] = [
  { slug: "tanzania", name: "Tanzania", currency: "TZS" },
  { slug: "kenya", name: "Kenya", currency: "KES" },
  { slug: "uganda", name: "Uganda", currency: "UGX" },
  { slug: "rwanda", name: "Rwanda", currency: "RWF" },
  { slug: "burundi", name: "Burundi", currency: "BIF" },
  { slug: "south-sudan", name: "South Sudan", currency: "SSP" },
];

export const COUNTRY_SLUGS = COUNTRIES.map((c) => c.slug);

export function getCountry(slug: string): Country | undefined {
  return COUNTRIES.find((c) => c.slug === slug.toLowerCase());
}
