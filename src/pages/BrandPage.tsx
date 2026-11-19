import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCatalog } from "@/lib/catalog";
import { formatVehiclePrice } from "@/lib/prices";
import { IconCar, IconChevronRight, IconLoader2 } from "@/components/icons";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function BrandPage() {
  const { brand: slug = "" } = useParams<{ brand: string }>();
  const { catalog, ready } = useCatalog();
  const brand = catalog[slug.toLowerCase()];
  usePageTitle(brand ? `${brand.name} Models` : "Brand");

  if (!brand && !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <IconLoader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }
  if (!brand) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 lg:pb-0">
      <Helmet>
        <title>{brand.name} Cars in East Africa | Motokah</title>
        <meta
          name="description"
          content={`${brand.name} models and real market prices in East Africa, built from live listings on Motokah.`}
        />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <IconChevronRight size={12} />
          <span className="text-foreground font-medium">{brand.name}</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shrink-0">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="w-11 h-11 object-contain dark:invert" />
            ) : (
              <IconCar size={36} className="text-muted-foreground" />
            )}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">{brand.name}</h1>
            <p className="text-sm text-muted-foreground">
              {brand.models.length} model{brand.models.length === 1 ? "" : "s"} with real market prices
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brand.models.map((m) => (
            <Link
              key={m.slug}
              to={`/brands/${slug}/${m.slug}`}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="aspect-[16/10] bg-muted/40">
                {m.img ? (
                  <img src={m.img} alt={`${brand.name} ${m.name}`} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IconCar size={32} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-3.5">
                <h3 className="font-bold text-foreground text-sm">{brand.name} {m.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {[m.bodyType, m.transmission, m.fuelType].filter(Boolean).join(" · ")}
                </p>
                <p className="text-sm font-extrabold text-primary mt-2">
                  {formatVehiclePrice(m.medianUsd, "USD")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  typical range {formatVehiclePrice(m.minUsd, "USD")} to {formatVehiclePrice(m.maxUsd, "USD")}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-6 max-w-2xl">
          Prices are built from real {brand.name} listings already on Motokah, not factory prices,
          most of these are used Japan-import cars, so there is no new-car price to quote. Specs shown
          are typical for the model and can vary by trim and year.
        </p>
      </div>
      <Footer />
    </div>
  );
}
