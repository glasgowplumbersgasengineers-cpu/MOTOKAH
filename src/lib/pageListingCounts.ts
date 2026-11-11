/**
 * Shared "how many real listings does this programmatic page actually have" logic.
 *
 * Why this file exists: 2026-11 SEO audit found 91% of programmatic landing pages
 * (city, city x make, model x city, make/model, country x make) rendering with ZERO
 * real listings — "No cars found" doorway pages, after an earlier fix gated listing
 * quality on real image health. A domain with hundreds of near-empty indexed pages is
 * a strong negative ranking signal, so every page type below now needs an honest count
 * before it's allowed into the sitemap or indexed by search engines.
 *
 * This module is intentionally pure (no React, no Vite-only `import.meta.glob`, no
 * Node `fs`/`require`) so it can be imported from BOTH:
 *   - React landing pages (client-side, via Vite/ESM) to decide noindex + empty-state UI
 *   - scripts/generate-sitemap.cjs (build-time, plain Node/CJS, loaded via dynamic
 *     import() since this file compiles to ESM) to decide sitemap inclusion
 *
 * The actual listing data differs by context:
 *   - Client-side landing pages already get a fully quality-gated, already-filtered
 *     array back from `useSearchListings` (src/hooks/useSearchListings.ts) — that hook
 *     applies `isLaunchQualityListing` (src/lib/listingQuality.ts) itself. Components
 *     should just use `listings.length` from that hook directly against the thresholds
 *     exported here; no re-filtering needed.
 *   - The build script has no React runtime, so it loads the same underlying data
 *     sources (src/data/mockData.ts's `mockListings`, filtered by the same
 *     `isLaunchQualityListing`, plus live Supabase `listings`) via Vite's
 *     `ssrLoadModule` (see scripts/generate-sitemap.cjs) and then calls
 *     `matchesListingFilter` below per URL combination — this is the one piece of
 *     matching logic that genuinely has no React-hook equivalent to call into, so it's
 *     written once here and the comment above the hook's city/country maps
 *     (src/hooks/useSearchListings.ts) points back here. Keep the two maps in sync.
 */

/** Minimal shape needed to test whether a listing belongs to a given city/make/model/country. */
export interface CountableListing {
  make?: string | null;
  model?: string | null;
  /** Free-text location, e.g. "Dar es Salaam, TZ" or "Dar es Salaam" — matched by substring. */
  location?: string | null;
  /** ISO-ish country code some listings carry directly (e.g. "TZ"), independent of `location`. */
  country?: string | null;
}

export interface ListingCountFilter {
  city?: string;
  make?: string;
  model?: string;
  /** Full country name, e.g. "Tanzania" — matches src/hooks/useSearchListings.ts's `countryCitiesMap` keys. */
  country?: string;
}

// Mirrors src/hooks/useSearchListings.ts's `countryCitiesMap`. Keep both in sync if either changes —
// this copy exists only because the hook's copy lives inside a React-hook file that the Node build
// script cannot import (it pulls in react-router/supabase-js client wiring it doesn't need).
export const COUNTRY_CITIES: Record<string, string[]> = {
  Tanzania: ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Morogoro", "Tanga", "Kigoma", "Moshi", "Zanzibar", "Iringa", "Sumbawanga", "Songea", "Bukoba", "Lindi", "Musoma", "Shinyanga", "Tabora", "Kahama"],
  Kenya: ["Nairobi", "Mombasa", "Nakuru", "Kisumu", "Eldoret", "Ruiru", "Kikuyu", "Thika", "Kiambu", "Machakos", "Kajiado", "Meru", "Nanyuki", "Nyeri", "Kericho", "Kakamega", "Bungoma", "Busia", "Kitale"],
  Uganda: ["Kampala", "Entebbe", "Jinja", "Mukono", "Mbarara", "Gulu", "Arua", "Lira", "Fort Portal"],
  Rwanda: ["Kigali", "Butare", "Ruhengeri", "Byumba"],
  Burundi: ["Bujumbura"],
  Ethiopia: ["Addis Ababa", "Adama", "Bahir Dar", "Hawassa", "Dire Dawa"],
  Nigeria: ["Lagos", "Abuja", "Ibadan", "Kano", "Port Harcourt", "Benin City", "Kaduna", "Ilorin", "Maiduguri", "Enugu"],
};

export const COUNTRY_ISO: Record<string, string> = {
  Tanzania: "TZ", Kenya: "KE", Uganda: "UG", Rwanda: "RW", Ethiopia: "ET", Burundi: "BI", Nigeria: "NG",
};

/** True if a listing matches a city/make/model/country filter combination. */
export function matchesListingFilter(listing: CountableListing, filter: ListingCountFilter): boolean {
  if (filter.make && (listing.make || "").toLowerCase() !== filter.make.toLowerCase()) return false;
  // Exact match, not substring: mirrors the dominant real-data path in
  // src/hooks/useSearchListings.ts (the mockListings/showroom branch uses
  // `m.model?.toLowerCase() === filters.model!.toLowerCase()`). Caption-derived
  // model strings like "Harrier 240GL PKG" will NOT match a clean "Harrier" filter —
  // that's a known pre-existing mismatch in how model pages are populated, not
  // something this audit is fixing, but the count here must reflect the real
  // (low) number of listings a visitor actually sees, not a looser approximation.
  if (filter.model && (listing.model || "").toLowerCase() !== filter.model.toLowerCase()) return false;
  if (filter.city) {
    const loc = (listing.location || "").toLowerCase();
    if (!loc.includes(filter.city.toLowerCase())) return false;
  }
  if (filter.country) {
    const cities = COUNTRY_CITIES[filter.country] || [];
    const iso = COUNTRY_ISO[filter.country];
    const loc = listing.location || "";
    const matchesCity = cities.some((c) => loc.includes(c));
    const matchesIso = Boolean(iso && listing.country === iso);
    if (!matchesCity && !matchesIso) return false;
  }
  return true;
}

/** Count how many listings in `listings` satisfy the given filter. */
export function countQualityListings(listings: CountableListing[], filter: ListingCountFilter): number {
  let count = 0;
  for (const listing of listings) {
    if (matchesListingFilter(listing, filter)) count += 1;
  }
  return count;
}

/**
 * Minimum real quality-gated listings a programmatic page needs before it's included in
 * the sitemap at all. Below this, the page is thin content and should not be submitted
 * for indexing (see MIN_LISTINGS_FOR_INDEX) even though the route itself keeps working.
 */
export const MIN_LISTINGS_FOR_SITEMAP = 3;

/**
 * Minimum real listings before a page is allowed to stay indexable (robots: index).
 * Pages at or below this get `noindex, follow` so a direct/backlink visit still works,
 * but Google doesn't treat the page as part of the crawlable/indexable site — same
 * number as MIN_LISTINGS_FOR_SITEMAP today; kept separate because the two concerns
 * (sitemap inclusion vs. index eligibility) are allowed to diverge in future tuning.
 */
export const MIN_LISTINGS_FOR_INDEX = 3;

/** robots meta content for a page given how many real listings it currently has. */
export function robotsContentForCount(count: number): string {
  return count >= MIN_LISTINGS_FOR_INDEX ? "index, follow" : "noindex, follow";
}
