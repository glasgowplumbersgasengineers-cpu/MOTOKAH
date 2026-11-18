import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCountry } from "@/data/countries";
import { getBrandsForCountry } from "@/data/newCarsByCountry";
import { IconChevronRight, IconExternalLink, IconCar } from "@/components/icons";
import { usePageTitle } from "@/hooks/usePageTitle";

function fmt(tzs: number | null) {
  return tzs ? `TZS ${tzs.toLocaleString()}` : "Contact dealer for price";
}

export default function NewCarModelPage() {
  const { country: countrySlug = "", brand: brandSlug = "", model: modelSlug = "" } = useParams<{ country: string; brand: string; model: string }>();
  const country = getCountry(countrySlug);
  const brands = country ? getBrandsForCountry(country.slug) : {};
  const brand = brands[brandSlug?.toLowerCase()];
  const model = brand?.models.find((m) => m.slug === modelSlug.toLowerCase());
  usePageTitle(brand && model ? `${brand.name} ${model.name}` : "New Car");

  if (!country) return <Navigate to="/tanzania/new-cars" replace />;
  if (!brand || !model) return <Navigate to={`/${country.slug}/new-cars`} replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 lg:pb-0">
      <Helmet>
        <title>{brand.name} {model.name} Price in Tanzania | Motokah</title>
        <meta
          name="description"
          content={model.description ?? `${brand.name} ${model.name} in ${country.name}. Specs, photos and dealer details.`}
        />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <IconChevronRight size={12} />
          <Link to={`/${country.slug}/new-cars`} className="hover:text-primary">New Cars in {country.name}</Link>
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
            <p className="text-sm text-muted-foreground mb-5">{model.bodyType}, new, {country.name}</p>

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
                  Detailed specs for this model aren't confirmed for {country.name} yet. Contact the dealer for specifications.
                </p>
              )}
            </div>

            {model.officialUrl ? (
              <p className="text-xs text-muted-foreground">
                {model.priceTzs ? "These specs and this price come" : "Specs and photos come"} directly from{" "}
                <a href={model.officialUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-medium inline-flex items-center gap-1">
                  {brand.name} {country.name}'s own site <IconExternalLink size={12} />
                </a>. Motokah does not sell new vehicles, this page links you to the real dealer.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                No official {brand.name} distributor website could be confirmed for {country.name} yet. Motokah does
                not sell new vehicles, contact an authorized {brand.name} dealer in {country.name} directly for pricing.
              </p>
            )}
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
                  : `${brand.name} does not publish a price for this model online in ${country.name} yet. Contact an authorized dealer for a current quote.`}
              </p>
            </div>
            {model.officialUrl && (
              <a
                href={model.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-primary text-primary-foreground font-semibold rounded-xl py-3"
              >
                View on {brand.name} {country.name}
              </a>
            )}
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
