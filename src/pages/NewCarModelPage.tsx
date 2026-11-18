import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NEW_CAR_BRANDS } from "@/data/newCarBrands";
import { IconChevronRight, IconExternalLink, IconCar } from "@/components/icons";
import { usePageTitle } from "@/hooks/usePageTitle";

function fmt(tzs: number | null) {
  return tzs ? `TZS ${tzs.toLocaleString()}` : "Contact dealer for price";
}

export default function NewCarModelPage() {
  const { brand: brandSlug = "", model: modelSlug = "" } = useParams<{ brand: string; model: string }>();
  const brand = NEW_CAR_BRANDS[brandSlug.toLowerCase()];
  const model = brand?.models.find((m) => m.slug === modelSlug.toLowerCase());
  usePageTitle(brand && model ? `${brand.name} ${model.name}` : "New Car");

  if (!brand || !model) return <Navigate to="/new-cars" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 lg:pb-0">
      <Helmet>
        <title>{brand.name} {model.name} Price in Tanzania | Motokah</title>
        <meta
          name="description"
          content={model.description ?? `${brand.name} ${model.name} official starting price in Tanzania: ${fmt(model.priceTzs)}. Specs and dealer details.`}
        />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <IconChevronRight size={12} />
          <Link to="/new-cars" className="hover:text-primary">New Cars</Link>
          <IconChevronRight size={12} />
          <span className="text-foreground font-medium">{brand.name} {model.name}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden mb-5">
              <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center p-6">
                {model.img ? (
                  <img src={model.img} alt={`${brand.name} ${model.name}`} className="max-w-full max-h-full object-contain" />
                ) : (
                  <IconCar size={48} className="text-muted-foreground" />
                )}
              </div>
            </div>

            {model.gallery.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
                {model.gallery.map((src) => (
                  <img key={src} src={src} alt={`${brand.name} ${model.name}`} className="h-20 w-28 object-cover rounded-lg border border-border shrink-0" loading="lazy" />
                ))}
              </div>
            )}

            <h1 className="text-xl font-extrabold text-foreground mb-1">{brand.name} {model.name}</h1>
            <p className="text-sm text-muted-foreground mb-5">{model.bodyType}, new, Tanzania</p>

            {model.description && (
              <p className="text-sm text-foreground leading-relaxed mb-6">{model.description}</p>
            )}

            <h2 className="text-base font-bold text-foreground mb-2">Specifications</h2>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border mb-6">
              {[
                ["Body type", model.bodyType],
                ["Engine", model.engine],
                ["Fuel consumption", model.fuelPer100km],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
              {!model.engine && !model.fuelPer100km && !model.bodyType && (
                <p className="px-4 py-2.5 text-sm text-muted-foreground">
                  {brand.name} doesn't publish detailed specs for this model on its Tanzania site. Contact the dealer for specifications.
                </p>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              {model.priceTzs ? "These specs and this price come" : "This listing comes"} directly from{" "}
              <a href={model.officialUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-medium inline-flex items-center gap-1">
                {brand.name} Tanzania's own page{model.officialUrl.includes("://") && !model.officialUrl.endsWith(".com/") ? ` for the ${model.name}` : ""} <IconExternalLink size={12} />
              </a>. Motokah does not sell new vehicles, this page links you to the real dealer.
            </p>
          </div>

          <aside className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {model.priceTzs ? "Starting from" : "Price"}
              </p>
              <p className="text-2xl font-extrabold text-primary">{fmt(model.priceTzs)}</p>
              <p className="text-[11px] text-muted-foreground mt-2">
                {model.priceTzs
                  ? "Excludes registration, insurance and accessories. Confirm with the dealer before buying, prices can change without notice."
                  : `${brand.name} does not publish a price for this model online. Contact an authorized dealer for a current quote.`}
              </p>
            </div>
            <a
              href={model.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-primary text-primary-foreground font-semibold rounded-xl py-3"
            >
              View on {brand.name} Tanzania
            </a>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
