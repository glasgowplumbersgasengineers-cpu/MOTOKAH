import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { useSearchListings } from "@/hooks/useSearchListings";
import { Button } from "@/components/ui/button";
import { IconLoader2 } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { jsonLdScript, breadcrumbJsonLd } from "@/lib/structuredData";

const MAKE_DISPLAY: Record<string, string> = {
  toyota: "Toyota", nissan: "Nissan", subaru: "Subaru", mitsubishi: "Mitsubishi",
  honda: "Honda", mazda: "Mazda", isuzu: "Isuzu", mercedes: "Mercedes-Benz",
  bmw: "BMW", kia: "Kia", hyundai: "Hyundai", volkswagen: "Volkswagen",
  suzuki: "Suzuki", land_rover: "Land Rover",
};

const CITY_DISPLAY: Record<string, string> = {
  "nairobi": "Nairobi", "mombasa": "Mombasa", "kisumu": "Kisumu", "nakuru": "Nakuru",
  "dar-es-salaam": "Dar es Salaam", "arusha": "Arusha", "mwanza": "Mwanza",
  "kampala": "Kampala", "entebbe": "Entebbe", "jinja": "Jinja",
  "kigali": "Kigali", "addis-ababa": "Addis Ababa", "lagos": "Lagos", "abuja": "Abuja",
  "accra": "Accra", "lusaka": "Lusaka", "harare": "Harare",
};

const CITY_COUNTRY: Record<string, string> = {
  "nairobi": "Kenya", "mombasa": "Kenya", "kisumu": "Kenya", "nakuru": "Kenya",
  "dar-es-salaam": "Tanzania", "arusha": "Tanzania", "mwanza": "Tanzania",
  "kampala": "Uganda", "entebbe": "Uganda", "jinja": "Uganda",
  "kigali": "Rwanda", "addis-ababa": "Ethiopia", "lagos": "Nigeria", "abuja": "Nigeria",
  "accra": "Ghana", "lusaka": "Zambia", "harare": "Zimbabwe",
};

const RELATED_MAKES = ["toyota", "nissan", "subaru", "mitsubishi", "honda", "mazda", "isuzu", "suzuki"];
const RELATED_CITIES = ["nairobi", "mombasa", "kampala", "dar-es-salaam", "addis-ababa", "kigali", "arusha", "nakuru"];

const MAKE_GUIDES: Record<string, { popularModels: string[]; priceRange: string; notes: string }> = {
  toyota: {
    popularModels: ["Land Cruiser", "Hilux", "Prado", "Harrier", "Corolla", "Probox", "Hiace", "Vitz"],
    priceRange: "KES 400K – 15M",
    notes: "Toyota dominates East Africa. Parts are cheap, mechanics are everywhere, resale value is highest of any brand. Land Cruiser and Prado command premium prices for good reason: they handle anything from Nairobi tarmac to unpaved upcountry roads.",
  },
  nissan: {
    popularModels: ["X-Trail", "Navara", "Note", "Tiida", "Patrol", "Hardbody"],
    priceRange: "KES 350K – 8M",
    notes: "Nissan is East Africa's second most popular brand. The X-Trail is a favourite for families, the Navara for commercial use, and the Note for city driving. Parts are widely available and servicing costs are reasonable.",
  },
  subaru: {
    popularModels: ["Forester", "Impreza", "Legacy", "Outback", "XV"],
    priceRange: "KES 600K – 5M",
    notes: "Subaru has a devoted following in Kenya and Uganda, prized for all-wheel drive performance in highland and wet-season conditions. The Forester and Impreza are especially popular. Fuel costs are slightly higher than Toyota equivalents.",
  },
  mitsubishi: {
    popularModels: ["Pajero", "L200", "Outlander", "Colt", "Galant"],
    priceRange: "KES 500K – 9M",
    notes: "Mitsubishi Pajero is a prestige off-road choice across East Africa, used by NGOs, tour operators, and families. The L200 pickup is popular for commercial and agricultural use. Parts take longer to source than Toyota but are available.",
  },
  honda: {
    popularModels: ["Fit", "Vezel", "CRV", "Civic", "Accord"],
    priceRange: "KES 400K – 6M",
    notes: "Honda vehicles offer reliable city performance and fuel efficiency. The Fit and Vezel are popular urban choices. Honda hybrid models are gaining traction as fuel prices rise across East Africa.",
  },
  mazda: {
    popularModels: ["Demio", "CX-5", "Atenza", "CX-3", "BT-50"],
    priceRange: "KES 400K – 7M",
    notes: "Mazda offers stylish, well-built vehicles at competitive prices. The Demio is popular as an affordable city car, while the CX-5 competes with the Toyota Rav4 in the SUV segment. Mazda's SkyActiv engines are fuel-efficient.",
  },
  isuzu: {
    popularModels: ["D-Max", "NPR", "Trooper", "MU-7"],
    priceRange: "KES 1M – 12M",
    notes: "Isuzu is the dominant commercial vehicle brand across East Africa. The D-Max pickup and NPR truck are workhorses for businesses, farms, and construction. Isuzu dealers are well-established in all major cities.",
  },
  mercedes: {
    popularModels: ["C-Class", "E-Class", "GLE", "Sprinter", "G-Class"],
    priceRange: "KES 1.5M – 30M",
    notes: "Mercedes-Benz is the premium choice for executives and diplomats across East Africa. The C-Class and E-Class dominate the luxury sedan segment. Sprinter minibuses are widely used for staff transport and tourism.",
  },
  bmw: {
    popularModels: ["3 Series", "5 Series", "X5", "X3", "7 Series"],
    priceRange: "KES 1.5M – 25M",
    notes: "BMW has a strong following among professionals and business owners in Nairobi, Kampala and Addis Ababa. The 3 Series and 5 Series are the most common. Servicing costs are higher than Japanese brands but specialist garages are available.",
  },
  kia: {
    popularModels: ["Sportage", "Picanto", "Sorento", "Rio"],
    priceRange: "KES 700K – 6M",
    notes: "Kia has grown rapidly in East Africa, offering Korean reliability at prices below European brands. The Sportage SUV is particularly popular. Kia has official dealers in Nairobi, Kampala, and Dar es Salaam.",
  },
  hyundai: {
    popularModels: ["Tucson", "Santa Fe", "i10", "i20", "Accent"],
    priceRange: "KES 600K – 7M",
    notes: "Hyundai is a solid mainstream choice across East Africa. The Tucson and Santa Fe compete well in the SUV segment. The small i10 and i20 are popular for city use with low running costs.",
  },
  suzuki: {
    popularModels: ["Vitara", "Swift", "Grand Vitara", "Jimny", "Ertiga"],
    priceRange: "KES 300K – 4M",
    notes: "Suzuki offers affordable, fuel-efficient vehicles well-suited to urban East Africa. The Grand Vitara handles mixed urban and rural roads, while the Swift and Ertiga are popular family choices.",
  },
};

const CITY_CONTEXT: Record<string, string> = {
  "nairobi": "Nairobi is East Africa's largest car market. Kirinyaga Road and Ngong Road are lined with dealers. Traffic-heavy city means fuel efficiency matters.",
  "mombasa": "Mombasa is Kenya's main import port. Fresh Japanese imports arrive here. Check undercarriage for coastal salt corrosion on older vehicles.",
  "dar-es-salaam": "Dar es Salaam is Tanzania's commercial hub. Main dealer areas are Morogoro Road and Kariakoo. Verify TRA import duty clearance before buying.",
  "kampala": "Kampala's car market centres on Industrial Area and Kireka. Uganda imports right-hand-drive vehicles from Japan and UK. Check URA import paperwork.",
  "addis-ababa": "Addis Ababa has strict import rules and high duty rates. Mexico Square area has the main car market. Land Cruiser dominates for good reason on highland roads.",
  "kigali": "Kigali enforces strict vehicle age restrictions. Average car quality is higher than neighbouring countries. Hilly terrain: test engine on steep ground.",
  "arusha": "Arusha serves Tanzania's northern safari circuit. 4x4 vehicles command high demand from tour operators. Prices run higher than Dar for comparable 4x4 models.",
  "nakuru": "Nakuru is Kenya's Rift Valley hub. Active used car market with mix of Nairobi-sourced imports and local sellers. Good range of mid-budget options.",
  "kisumu": "Kisumu is western Kenya's main city on Lake Victoria. Smaller market than Nairobi but growing. Well-maintained vehicles arrive from Nairobi dealers.",
  "entebbe": "Entebbe is a smaller market near Kampala International Airport. Many expat sellers offering well-maintained vehicles. Good for European-sourced cars.",
  "jinja": "Jinja is Uganda's industrial city. Practical commercial vehicles and affordable used cars. Less selection than Kampala but no city traffic.",
  "lagos": "Lagos is Africa's largest city and biggest car market. Huge variety from budget to luxury. Verify VIN and inspect carefully — large volume means varied quality.",
  "abuja": "Abuja has a relatively affluent buyer base. Cleaner, newer vehicles than Lagos on average. Foreign diplomats and NGOs sell well-maintained cars here.",
  "accra": "Accra's car market is centred on Dzorwulu and Lapaz. Both left-hand and right-hand drive vehicles are available. Verify customs papers thoroughly.",
  "lusaka": "Lusaka is Zambia's capital and main car hub. Mostly Japanese imports via Durban port. Toyota and Nissan are dominant. Check import duty clearance.",
  "harare": "Harare has a sizeable used car market despite economic pressures. Vehicles sourced from Japan, UK and South Africa. USD pricing is standard.",
};

export default function CityMakeLandingPage() {
  const { make, city } = useParams<{ make: string; city: string }>();
  const makeSlug = make?.toLowerCase() || "";
  const citySlug = city?.toLowerCase() || "";

  const makeName = MAKE_DISPLAY[makeSlug] || makeSlug.charAt(0).toUpperCase() + makeSlug.slice(1);
  const cityName = CITY_DISPLAY[citySlug] || citySlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const countryName = CITY_COUNTRY[citySlug] || "East Africa";

  const makeGuide = MAKE_GUIDES[makeSlug];
  const cityContext = CITY_CONTEXT[citySlug] || "";

  const title = `${makeName} Cars for Sale in ${cityName} | Motokah`;
  const description = `Buy a used ${makeName} in ${cityName}, ${countryName}. Browse verified listings: ${makeGuide?.popularModels.slice(0, 3).join(", ")} and more. ${makeGuide?.priceRange || ""}.`;
  const canonicalUrl = `https://www.motokah.com/cars/${makeSlug}/in/${citySlug}`;

  const { listings, loading } = useSearchListings({ city: cityName, make: makeName }, "newest");

  const breadcrumbs = [
    { name: "Home", url: "https://www.motokah.com/" },
    { name: `Cars in ${cityName}`, url: `https://www.motokah.com/city/${citySlug}` },
    { name: `${makeName} in ${cityName}`, url: canonicalUrl },
  ];

  const relatedMakes = RELATED_MAKES.filter(m => m !== makeSlug);
  const relatedCities = RELATED_CITIES.filter(c => c !== citySlug);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        {jsonLdScript(breadcrumbJsonLd(breadcrumbs))}
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to={`/city/${citySlug}`} className="hover:text-foreground">Cars in {cityName}</Link>
            <span>/</span>
            <span className="text-foreground">{makeName}</span>
          </nav>

          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              {makeName} Cars for Sale in {cityName}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {description}
            </p>
          </div>

          {/* Listings */}
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
                No {makeName} listings in {cityName} right now.
              </p>
              <Button asChild variant="outline">
                <Link to={`/city/${citySlug}`}>Browse all cars in {cityName}</Link>
              </Button>
            </div>
          )}

          {/* Buying Guide */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 prose prose-sm dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">
                Buying a {makeName} in {cityName}
              </h2>
              {cityContext && <p className="text-muted-foreground mb-3">{cityContext}</p>}
              {makeGuide && (
                <p className="text-muted-foreground">{makeGuide.notes}</p>
              )}
              <p className="text-muted-foreground mt-3">
                Motokah connects buyers directly with verified {makeName} dealers and private sellers in {cityName}. All listings include photos, full specs, and direct contact details. No middlemen.
              </p>
            </div>

            {makeGuide && (
              <div className="bg-card border rounded-xl p-5">
                <h3 className="font-semibold mb-3">{makeName} Quick Facts</h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Typical price range</dt>
                    <dd className="font-medium">{makeGuide.priceRange}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Popular models</dt>
                    <dd className="font-medium">{makeGuide.popularModels.slice(0, 5).join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Market</dt>
                    <dd className="font-medium">{cityName}, {countryName}</dd>
                  </div>
                </dl>
                <Button asChild className="w-full mt-4">
                  <Link to={`/search?make=${encodeURIComponent(makeName)}&city=${encodeURIComponent(cityName)}`}>
                    View all {makeName} listings
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Related: same make, other cities */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3">{makeName} in Other Cities</h2>
            <div className="flex flex-wrap gap-2">
              {relatedCities.map(c => (
                <Link
                  key={c}
                  to={`/cars/${makeSlug}/in/${c}`}
                  className="px-3 py-1.5 rounded-full border text-sm hover:bg-accent transition-colors"
                >
                  {makeName} in {CITY_DISPLAY[c] || c}
                </Link>
              ))}
            </div>
          </div>

          {/* Related: same city, other makes */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-3">Other Makes in {cityName}</h2>
            <div className="flex flex-wrap gap-2">
              {relatedMakes.map(m => (
                <Link
                  key={m}
                  to={`/cars/${m}/in/${citySlug}`}
                  className="px-3 py-1.5 rounded-full border text-sm hover:bg-accent transition-colors"
                >
                  {MAKE_DISPLAY[m] || m} in {cityName}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-card border rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Selling a {makeName} in {cityName}?</h2>
            <p className="text-muted-foreground text-sm mb-4">
              List free on Motokah. Reach thousands of buyers across {countryName} and East Africa.
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
