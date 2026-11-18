import { Link } from "react-router-dom";
import { OFFICIAL_CATALOG, CATALOG_BRAND_SLUGS } from "@/data/officialCatalog";
import { IconCar } from "@/components/icons";

// The official brand section: one logo per manufacturer, into a page listing
// their models with real market prices. Separate from "Browse by Model" above,
// which links straight to user listings.
export default function BrandCatalogSection() {
  return (
    <section className="py-12 border-b border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-extrabold text-foreground mb-2">Browse by Brand</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Models, specs and real market prices for the manufacturers East African buyers search most.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {CATALOG_BRAND_SLUGS.map((slug) => {
            const brand = OFFICIAL_CATALOG[slug];
            return (
              <Link
                key={slug}
                to={`/brands/${slug}`}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-card border border-border rounded-xl hover:border-primary hover:shadow-sm transition-all text-center"
              >
                <span className="w-10 h-10 flex items-center justify-center">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-9 h-9 object-contain dark:invert" />
                  ) : (
                    <IconCar size={28} className="text-muted-foreground" />
                  )}
                </span>
                <span className="text-xs font-semibold text-foreground leading-tight">{brand.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
