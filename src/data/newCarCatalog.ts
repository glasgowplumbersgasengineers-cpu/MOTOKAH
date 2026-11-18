// Single source of truth for every new car Motokah shows, across every East
// African country and brand. This is the dynamic system: adding a car means
// adding one object to this array, nothing else. No new page, no new route,
// no new component. NewCars.tsx and NewCarModelPage.tsx are already built
// to read this and render automatically for any country/brand/model combo.
//
// Fields stay honest: `price` and `currency` are null when no real price
// could be confirmed for that country, `officialUrl` is "" when no official
// distributor website could be confirmed, `sourceNote` records exactly where
// a price came from so a stale or disputed number can be found and fixed.
export interface CatalogEntry {
  country: string; // matches countries.ts slug
  brand: string;
  brandSlug: string;
  slug: string;
  name: string;
  bodyType: string | null;
  engine: string | null;
  fuelPer100km: string | null;
  price: number | null;
  currency: string | null;
  img: string;
  officialUrl: string;
  description: string | null;
  gallery: string[];
  sourceNote: string | null;
}

export const NEW_CAR_CATALOG: CatalogEntry[] = [
  // Kenya — BYD, via CFAO Mobility Kenya (Loxea is CFAO's EV distribution
  // arm). Prices are CFAO's own September 2025 published retail list
  // (reported by TechArena Kenya), not an aggregator guess, but they move,
  // so they're shown as "starting from" and should be reconfirmed with CFAO
  // before anyone relies on them for a purchase.
  {
    country: "kenya", brand: "BYD", brandSlug: "byd", slug: "atto-3",
    name: "Atto 3", bodyType: "SUV", engine: "Electric", fuelPer100km: null,
    price: 6950000, currency: "KES", img: "", officialUrl: "https://cfaomobility.co.ke",
    description: null, gallery: [],
    sourceNote: "CFAO Mobility Kenya published retail list, Sept 2025 (Standard Range trim), via TechArena Kenya. Reconfirm with CFAO before relying on this.",
  },
  {
    country: "kenya", brand: "BYD", brandSlug: "byd", slug: "seal",
    name: "Seal", bodyType: "Sedan", engine: "Electric", fuelPer100km: null,
    price: 9480000, currency: "KES", img: "", officialUrl: "https://cfaomobility.co.ke",
    description: null, gallery: [],
    sourceNote: "CFAO Mobility Kenya published retail list, Sept 2025 (RWD Standard Range trim), via TechArena Kenya. Reconfirm with CFAO before relying on this.",
  },
];
