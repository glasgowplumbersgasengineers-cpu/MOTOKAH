import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { useSearchListings } from "@/hooks/useSearchListings";
import { OFFICIAL_CATALOG } from "@/data/officialCatalog";
import { formatVehiclePrice } from "@/lib/prices";
import { IconCar, IconChevronRight, IconLoader2 } from "@/components/icons";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function CatalogModelPage() {
  const { brand: brandSlug = "", model: modelSlug = "" } = useParams<{ brand: string; model: string }>();
  const brand = OFFICIAL_CATALOG[brandSlug.toLowerCase()];
  const model = brand?.models.find((m) => m.slug === modelSlug.toLowerCase());
  usePageTitle(brand && model ? `${brand.name} ${model.name}` : "Model");

  const { listings, loading } = useSearchListings(
    { make: brand?.name ?? "", model: model?.name ?? "" },
    "newest",
  );

  if (!brand || !model) return <Navigate to="/" replace />;

  const quickSpecs = [model.bodyType, model.transmission, model.fuelType].filter(Boolean);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 lg:pb-0">
      <Helmet>
        <title>{brand.name} {model.name} Price and Specs | Motokah</title>
        <meta
          name="description"
          content={`${brand.name} ${model.name}: typical price, specs, and real listings for sale in East Africa.`}
        />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link>
          <IconChevronRight size={12} />
          <Link to={`/brands/${brandSlug}`} className="hover:text-primary">{brand.name}</Link>
          <IconChevronRight size={12} />
          <span className="text-foreground font-medium">{model.name}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden mb-5">
              <div className="aspect-[16/10] bg-muted/40">
                {model.img ? (
                  <img src={model.img} alt={`${brand.name} ${model.name}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IconCar size={48} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {quickSpecs.map((s) => (
                  <span key={s} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="text-xl font-extrabold text-foreground mb-1">{brand.name} {model.name}</h1>
            <p className="text-sm text-muted-foreground mb-5">
              Built from {model.sampleSize} real listings on Motokah{model.sampleSize < 5 ? ", a small sample so treat this loosely" : ""}.
            </p>

            <h2 className="text-base font-bold text-foreground mb-2">What buyers usually check</h2>
            <ul className="text-sm text-muted-foreground space-y-1.5 mb-6 list-disc pl-5">
              <li>Ask for the Japan auction report if it's an import, and check the grade</li>
              <li>Confirm the mileage against the service book, not just the odometer</li>
              <li>For a {model.fuelType === "Diesel" ? "diesel" : "petrol"} {model.bodyType?.toLowerCase() || "car"}, check for smoke on cold start and listen for the {model.transmission === "Manual" ? "clutch" : "gearbox"} under load</li>
              <li>Prices vary a lot by year and trim, use the range below as a guide, not a quote</li>
            </ul>

            <h2 className="text-base font-bold text-foreground mb-2">Listings for sale now</h2>
            {loading ? (
              <div className="flex justify-center py-10"><IconLoader2 size={24} className="animate-spin text-primary" /></div>
            ) : listings.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6">
                No {brand.name} {model.name} listed right now. Check back soon, or search all {brand.name} cars.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listings.slice(0, 6).map((l) => <VehicleCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Typical price</p>
              <p className="text-2xl font-extrabold text-primary">{formatVehiclePrice(model.medianUsd, "USD")}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Range seen: {formatVehiclePrice(model.minUsd, "USD")} to {formatVehiclePrice(model.maxUsd, "USD")}
              </p>
              <p className="text-[11px] text-muted-foreground mt-3">
                Not a factory price, these are used Japan-import cars never sold new in East Africa.
                This is the real spread of what the same model is actually selling for on Motokah.
              </p>
            </div>
            <Link
              to="/sell"
              className="block text-center bg-primary text-primary-foreground font-semibold rounded-xl py-3"
            >
              Sell your {brand.name} {model.name}
            </Link>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
