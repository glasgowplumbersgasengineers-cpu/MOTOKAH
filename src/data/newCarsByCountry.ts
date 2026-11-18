import { TOYOTA_NEW_CARS } from "./newCarsToyota";
import { SUZUKI_NEW_CARS } from "./newCarsSuzuki";
import { NEW_CAR_BRANDS, type NewCarBrand } from "./newCarBrands";
import { NEW_CAR_CATALOG } from "./newCarCatalog";
import type { NewCarModel } from "./newCarsToyota";

// Real official distributor root site per brand per country, confirmed by
// checking directly. Empty string means no official distributor website
// could be confirmed for that brand in that country, shown honestly in the
// UI rather than guessed at. These are root/showroom pages, not per-model
// pages like Tanzania has, because no per-model page was found for them.
const OFFICIAL_SITE: Record<string, Record<string, string>> = {
  kenya: {
    toyota: "https://cfaomobility.co.ke",
    suzuki: "https://cfaomobility.co.ke",
  },
  uganda: {
    toyota: "",
    suzuki: "",
  },
  rwanda: {
    toyota: "https://www.toyotarwanda.com",
    suzuki: "",
  },
  burundi: {
    toyota: "",
    suzuki: "",
  },
  "south-sudan": {
    toyota: "",
    suzuki: "",
  },
};

// Model-level data (name, specs, real photos) carries over since a Toyota
// Hilux or Suzuki Jimny is the same vehicle wherever it's sold. Price and
// Tanzania-specific description text do not, since neither has been
// confirmed for these countries yet.
function stripToCountry(models: NewCarModel[], countrySlug: string, brandSlug: string): NewCarModel[] {
  const officialUrl = OFFICIAL_SITE[countrySlug]?.[brandSlug] ?? "";
  return models.map((m) => ({
    ...m,
    priceTzs: null,
    description: null,
    officialUrl,
  }));
}

// Extra brands/models added directly via the dynamic catalog (newCarCatalog.ts),
// grouped by country then brand. This is what lets a brand be added with no
// new code: push a row into NEW_CAR_CATALOG and it shows up here automatically.
function catalogBrandsForCountry(countrySlug: string): Record<string, NewCarBrand> {
  const out: Record<string, NewCarBrand> = {};
  for (const entry of NEW_CAR_CATALOG) {
    if (entry.country !== countrySlug) continue;
    if (!out[entry.brandSlug]) out[entry.brandSlug] = { name: entry.brand, models: [] };
    out[entry.brandSlug].models.push({
      slug: entry.slug,
      name: entry.name,
      bodyType: entry.bodyType,
      engine: entry.engine,
      fuelPer100km: entry.fuelPer100km,
      priceTzs: entry.price,
      currency: entry.currency ?? undefined,
      img: entry.img,
      officialUrl: entry.officialUrl,
      description: entry.description,
      gallery: entry.gallery,
      sourceNote: entry.sourceNote ?? undefined,
    });
  }
  return out;
}

export function getBrandsForCountry(countrySlug: string): Record<string, NewCarBrand> {
  const base: Record<string, NewCarBrand> =
    countrySlug === "tanzania"
      ? { ...NEW_CAR_BRANDS }
      : {
          toyota: { name: "Toyota", models: stripToCountry(TOYOTA_NEW_CARS, countrySlug, "toyota") },
          suzuki: { name: "Suzuki", models: stripToCountry(SUZUKI_NEW_CARS, countrySlug, "suzuki") },
        };

  const extra = catalogBrandsForCountry(countrySlug);
  for (const brandSlug of Object.keys(extra)) {
    if (base[brandSlug]) {
      base[brandSlug] = { name: base[brandSlug].name, models: [...base[brandSlug].models, ...extra[brandSlug].models] };
    } else {
      base[brandSlug] = extra[brandSlug];
    }
  }
  return base;
}
