import fs from "fs";
import { COUNTRIES } from "../src/data/countries.ts";
import { getBrandsForCountry } from "../src/data/newCarsByCountry.ts";
import { OFFICIAL_CATALOG } from "../src/data/officialCatalog.ts";

// Published with every website deploy so the native app can show new cars/brands
// without an App Store or Play Store update (see src/lib/catalog.ts).
const newCars = Object.fromEntries(COUNTRIES.map((c) => [c.slug, getBrandsForCountry(c.slug)]));
fs.mkdirSync("public/data", { recursive: true });
fs.writeFileSync("public/data/catalog.json", JSON.stringify({ generatedAt: new Date().toISOString(), newCars, catalog: OFFICIAL_CATALOG }));
console.log("catalog.json:", Object.keys(newCars).length, "countries,", Object.keys(OFFICIAL_CATALOG).length, "brands");
