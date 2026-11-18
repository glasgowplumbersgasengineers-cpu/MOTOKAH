import { TOYOTA_NEW_CARS } from "./newCarsToyota";
import { SUZUKI_NEW_CARS } from "./newCarsSuzuki";
import { NEW_CAR_BRANDS, type NewCarBrand } from "./newCarBrands";
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

export function getBrandsForCountry(countrySlug: string): Record<string, NewCarBrand> {
  if (countrySlug === "tanzania") return NEW_CAR_BRANDS;

  return {
    toyota: { name: "Toyota", models: stripToCountry(TOYOTA_NEW_CARS, countrySlug, "toyota") },
    suzuki: { name: "Suzuki", models: stripToCountry(SUZUKI_NEW_CARS, countrySlug, "suzuki") },
  };
}
