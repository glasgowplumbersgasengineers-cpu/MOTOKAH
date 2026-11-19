import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { getBrandsForCountry as bundledBrandsForCountry } from "@/data/newCarsByCountry";
import { OFFICIAL_CATALOG, type CatalogBrand } from "@/data/officialCatalog";
import type { NewCarBrand } from "@/data/newCarBrands";

// The native app ships with a copy of the new-car and brand catalog, but new cars
// must appear without an App Store / Play Store update. So the app downloads the
// latest catalog that every website deploy publishes (scripts/build-catalog-json.mts)
// and uses it over the bundled copy. The website itself always uses its own
// bundled data, which is already the latest deploy.

const SITE = "https://www.motokah.com";
const CACHE_KEY = "motokah_catalog_v1";

type Snapshot = {
  newCars: Record<string, Record<string, NewCarBrand>>;
  catalog: Record<string, CatalogBrand>;
};

const isNative = Capacitor.isNativePlatform();

// Photo paths like /catalog/images/x.webp only exist inside the app if the car
// was there when the app was built, so remote data points them at the website.
const absolute = (p: string | null) => (p && p.startsWith("/") ? SITE + p : p);

function withAbsoluteImages(s: Snapshot): Snapshot {
  const newCars = Object.fromEntries(
    Object.entries(s.newCars).map(([country, brands]) => [
      country,
      Object.fromEntries(
        Object.entries(brands).map(([slug, b]) => [
          slug,
          { ...b, models: b.models.map((m) => ({ ...m, img: absolute(m.img) ?? "", gallery: (m.gallery || []).map((g) => absolute(g) ?? g) })) },
        ]),
      ),
    ]),
  );
  const catalog = Object.fromEntries(
    Object.entries(s.catalog).map(([slug, b]) => [
      slug,
      { ...b, logo: absolute(b.logo), models: b.models.map((m) => ({ ...m, img: absolute(m.img) })) },
    ]),
  );
  return { newCars, catalog };
}

function readCache(): Snapshot | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Snapshot) : null;
  } catch {
    return null;
  }
}

let remote: Snapshot | null = isNative ? readCache() : null;
let settled = !isNative;
let request: Promise<void> | null = null;
const listeners = new Set<() => void>();

function load() {
  if (!request) {
    request = fetch(`${SITE}/data/catalog.json`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`catalog ${r.status}`))))
      .then((json: Snapshot) => {
        if (!json?.newCars || !json?.catalog) throw new Error("catalog malformed");
        remote = withAbsoluteImages(json);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(remote));
        } catch {
          /* storage full or blocked: the in-memory copy still works */
        }
      })
      .catch(() => {
        /* offline or site down: keep the cached or bundled catalog */
      })
      .finally(() => {
        settled = true;
        listeners.forEach((l) => l());
      });
  }
}

// `ready` is false only in the app while the first download is still in flight.
// Pages should not treat a missing car as "not found" until it is true, since
// the car may be newer than the copy bundled in the app.
export function useCatalog() {
  const [, rerender] = useState(0);
  useEffect(() => {
    if (!isNative) return;
    const l = () => rerender((n) => n + 1);
    listeners.add(l);
    load();
    return () => {
      listeners.delete(l);
    };
  }, []);

  return {
    ready: settled,
    getBrandsForCountry: (countrySlug: string): Record<string, NewCarBrand> =>
      remote?.newCars[countrySlug] ?? bundledBrandsForCountry(countrySlug),
    catalog: remote?.catalog ?? OFFICIAL_CATALOG,
  };
}
