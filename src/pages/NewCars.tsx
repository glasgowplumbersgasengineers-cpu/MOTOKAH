import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCountry, COUNTRIES } from "@/data/countries";
import { useCatalog } from "@/lib/catalog";
import { IconCar } from "@/components/icons";
import { usePageTitle } from "@/hooks/usePageTitle";

function fmt(price: number | null, currency?: string) {
  return price ? `${currency ?? "TZS"} ${price.toLocaleString()}` : "Contact dealer for price";
}

export default function NewCars() {
  const { country: countrySlug = "" } = useParams<{ country: string }>();
  const country = getCountry(countrySlug);
  const { getBrandsForCountry } = useCatalog();
  usePageTitle(country ? `New Cars in ${country.name}` : "New Cars");

  if (!country) return <Navigate to="/tanzania/new-cars" replace />;

  const brands = getBrandsForCountry(country.slug);
  const brandSlugs = Object.keys(brands);
  const isTanzania = country.slug === "tanzania";

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 lg:pb-0">
      <Helmet>
        <title>New Cars in {country.name} | Motokah</title>
        <meta
          name="description"
          content={`Brand new car models in ${country.name}, with real specs and photos, straight from each manufacturer's own showroom where one exists.`}
        />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-6 flex-1">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">New Cars in {country.name}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {COUNTRIES.map((c) => (
            <Link
              key={c.slug}
              to={`/${c.slug}/new-cars`}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                c.slug === country.slug
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
          {isTanzania
            ? `Brand new models and their official prices in Tanzania, taken straight from each manufacturer's own Tanzania showroom. These are new vehicle prices, not Motokah listings. Only Toyota publishes a real price for every model here, every other brand's own site doesn't publish one at all, those are shown as "Contact dealer for price" honestly rather than guessed. Prices exclude registration, insurance and accessories and can change without notice. Confirm with the manufacturer or an authorized dealer before buying.`
            : `Real model names, specs and photos for ${country.name}, not Motokah listings. Prices aren't shown yet for ${country.name}, they'll be added once confirmed directly from each manufacturer's own ${country.name} distributor. Where no official distributor website could be confirmed for a brand in ${country.name}, that's shown honestly rather than linking to a guessed site.`}
        </p>

        {brandSlugs.map((brandSlug) => {
          const brand = brands[brandSlug];
          return (
            <div key={brandSlug} className="mb-8">
              <h2 className="text-lg font-bold text-foreground mb-3">{brand.name}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {brand.models.map((m) => (
                  <Link
                    key={m.slug}
                    to={`/${country.slug}/new-cars/${brandSlug}/${m.slug}`}
                    className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-sm transition-all"
                  >
                    <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center p-2">
                      {m.img ? (
                        <img src={m.img} alt={`${brand.name} ${m.name}`} className="max-w-full max-h-full object-contain" loading="lazy" />
                      ) : (
                        <IconCar size={28} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-foreground text-sm">{brand.name} {m.name}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{m.bodyType}</p>
                      <p className="text-sm font-extrabold text-primary mt-1.5">{fmt(m.priceTzs, m.currency)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        <p className="text-xs text-muted-foreground mt-2">
          Looking for a used car instead?{" "}
          <Link to="/search" className="text-primary font-medium">Browse used listings on Motokah</Link>.
        </p>
      </div>
      <Footer />
    </div>
  );
}
