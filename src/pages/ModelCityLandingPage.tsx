import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { useSearchListings } from "@/hooks/useSearchListings";
import { Button } from "@/components/ui/button";
import { IconLoader2 } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { jsonLdScript, breadcrumbJsonLd } from "@/lib/structuredData";
import { robotsContentForCount } from "@/lib/pageListingCounts";

const MAKE_DISPLAY: Record<string, string> = {
  toyota: "Toyota", nissan: "Nissan", subaru: "Subaru", mitsubishi: "Mitsubishi",
  honda: "Honda", mazda: "Mazda", isuzu: "Isuzu", mercedes: "Mercedes-Benz",
  bmw: "BMW", kia: "Kia", hyundai: "Hyundai", suzuki: "Suzuki",
};

const MODEL_DISPLAY: Record<string, string> = {
  "land-cruiser": "Land Cruiser", "hilux": "Hilux", "prado": "Land Cruiser Prado",
  "harrier": "Harrier", "corolla": "Corolla", "probox": "Probox",
  "fielder": "Fielder", "hiace": "Hiace", "vitz": "Vitz", "axio": "Axio",
  "noah": "Noah", "succeed": "Succeed", "rav4": "RAV4", "fortuner": "Fortuner",
  "x-trail": "X-Trail", "navara": "Navara", "note": "Note", "tiida": "Tiida",
  "patrol": "Patrol", "hardbody": "Hardbody",
  "forester": "Forester", "impreza": "Impreza", "outback": "Outback", "xv": "XV",
  "pajero": "Pajero", "l200": "L200", "outlander": "Outlander",
  "fit": "Fit", "vezel": "Vezel", "crv": "CR-V", "civic": "Civic",
  "demio": "Demio", "cx-5": "CX-5", "atenza": "Atenza",
  "d-max": "D-Max", "trooper": "Trooper",
};

const CITY_DISPLAY: Record<string, string> = {
  "nairobi": "Nairobi", "mombasa": "Mombasa", "kisumu": "Kisumu", "nakuru": "Nakuru",
  "dar-es-salaam": "Dar es Salaam", "arusha": "Arusha", "mwanza": "Mwanza",
  "kampala": "Kampala", "entebbe": "Entebbe", "jinja": "Jinja",
  "kigali": "Kigali", "addis-ababa": "Addis Ababa", "lagos": "Lagos",
};

const CITY_COUNTRY: Record<string, string> = {
  "nairobi": "Kenya", "mombasa": "Kenya", "kisumu": "Kenya", "nakuru": "Kenya",
  "dar-es-salaam": "Tanzania", "arusha": "Tanzania", "mwanza": "Tanzania",
  "kampala": "Uganda", "entebbe": "Uganda", "jinja": "Uganda",
  "kigali": "Rwanda", "addis-ababa": "Ethiopia", "lagos": "Nigeria",
};

const TOP_COMBOS: { make: string; model: string; cities: string[] }[] = [
  { make: "toyota", model: "land-cruiser", cities: ["nairobi", "kampala", "dar-es-salaam", "addis-ababa", "kigali"] },
  { make: "toyota", model: "prado", cities: ["nairobi", "kampala", "dar-es-salaam", "kigali"] },
  { make: "toyota", model: "hilux", cities: ["nairobi", "dar-es-salaam", "kampala", "arusha"] },
  { make: "toyota", model: "harrier", cities: ["kampala", "nairobi", "dar-es-salaam"] },
  { make: "toyota", model: "probox", cities: ["nairobi", "mombasa", "nakuru", "kisumu"] },
  { make: "toyota", model: "fielder", cities: ["nairobi", "mombasa", "kampala"] },
  { make: "toyota", model: "vitz", cities: ["nairobi", "dar-es-salaam", "kampala"] },
  { make: "toyota", model: "axio", cities: ["nairobi", "kampala", "dar-es-salaam"] },
  { make: "nissan", model: "x-trail", cities: ["nairobi", "kampala", "dar-es-salaam"] },
  { make: "nissan", model: "navara", cities: ["nairobi", "dar-es-salaam", "kampala"] },
  { make: "nissan", model: "note", cities: ["nairobi", "kampala"] },
  { make: "subaru", model: "forester", cities: ["nairobi", "kampala", "dar-es-salaam"] },
  { make: "subaru", model: "impreza", cities: ["nairobi", "kampala"] },
  { make: "mitsubishi", model: "pajero", cities: ["kampala", "nairobi", "addis-ababa", "dar-es-salaam"] },
  { make: "honda", model: "fit", cities: ["nairobi", "kampala", "dar-es-salaam"] },
  { make: "honda", model: "crv", cities: ["nairobi", "kampala"] },
  { make: "mazda", model: "demio", cities: ["nairobi", "dar-es-salaam"] },
  { make: "isuzu", model: "d-max", cities: ["nairobi", "dar-es-salaam", "kampala"] },
];

export default function ModelCityLandingPage() {
  const { make, model, city } = useParams<{ make: string; model: string; city: string }>();
  const makeSlug = make?.toLowerCase() || "";
  const modelSlug = model?.toLowerCase() || "";
  const citySlug = city?.toLowerCase() || "";

  const makeName = MAKE_DISPLAY[makeSlug] || makeSlug.charAt(0).toUpperCase() + makeSlug.slice(1);
  const modelName = MODEL_DISPLAY[modelSlug] || modelSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const cityName = CITY_DISPLAY[citySlug] || citySlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const countryName = CITY_COUNTRY[citySlug] || "East Africa";

  const fullName = `${makeName} ${modelName}`;
  const title = `${fullName} for Sale in ${cityName} | Motokah`;
  const description = `Buy a used ${fullName} in ${cityName}, ${countryName}. Verified listings from local dealers and private sellers. Contact directly, no middleman.`;
  const canonicalUrl = `https://www.motokah.com/cars/${makeSlug}/${modelSlug}/in/${citySlug}`;

  const { listings, loading } = useSearchListings({ city: cityName, make: makeName, model: modelName }, "newest");
  const robotsContent = robotsContentForCount(listings.length);

  const breadcrumbs = [
    { name: "Home", url: "https://www.motokah.com/" },
    { name: `${makeName} ${modelName}`, url: `https://www.motokah.com/cars/${makeSlug}/${modelSlug}` },
    { name: `${fullName} in ${cityName}`, url: canonicalUrl },
  ];

  // Related cities for same make+model
  const combo = TOP_COMBOS.find(c => c.make === makeSlug && c.model === modelSlug);
  const relatedCities = combo ? combo.cities.filter(c => c !== citySlug) : [];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content={robotsContent} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        {jsonLdScript(breadcrumbJsonLd(breadcrumbs))}
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

          <nav className="flex gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to={`/cars/${makeSlug}/${modelSlug}`} className="hover:text-foreground">{fullName}</Link>
            <span>/</span>
            <span className="text-foreground">{cityName}</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              {fullName} for Sale in {cityName}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{description}</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
              {listings.map(listing => (
                <VehicleCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 mb-12">
              <p className="text-muted-foreground text-lg mb-4">
                No {fullName} listings in {cityName} right now.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to={`/cars/${makeSlug}/${modelSlug}`}>All {fullName} listings</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={`/city/${citySlug}`}>All cars in {cityName}</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Related cities */}
          {relatedCities.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold mb-3">{fullName} in Other Cities</h2>
              <div className="flex flex-wrap gap-2">
                {relatedCities.map(c => (
                  <Link
                    key={c}
                    to={`/cars/${makeSlug}/${modelSlug}/in/${c}`}
                    className="px-3 py-1.5 rounded-full border text-sm hover:bg-accent transition-colors"
                  >
                    {fullName} in {CITY_DISPLAY[c] || c}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Cross-links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-card border rounded-xl p-5">
              <h3 className="font-semibold mb-2">More {makeName} in {cityName}</h3>
              <Link to={`/cars/${makeSlug}/in/${citySlug}`} className="text-primary text-sm hover:underline">
                Browse all {makeName} listings in {cityName}
              </Link>
            </div>
            <div className="bg-card border rounded-xl p-5">
              <h3 className="font-semibold mb-2">All {fullName} listings</h3>
              <Link to={`/cars/${makeSlug}/${modelSlug}`} className="text-primary text-sm hover:underline">
                Browse {fullName} across East Africa
              </Link>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Selling a {fullName} in {cityName}?</h2>
            <p className="text-muted-foreground text-sm mb-4">
              List free on Motokah. Reach buyers across {countryName} and East Africa.
            </p>
            <Button asChild>
              <Link to="/sell">Post your car free</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
