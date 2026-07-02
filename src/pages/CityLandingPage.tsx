import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { useSearchListings } from "@/hooks/useSearchListings";
import { Button } from "@/components/ui/button";
import { IconLoader2 } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/structuredData";

const cityDescriptions: Record<string, string> = {
  "dar-es-salaam": "Browse new and used cars for sale in Dar es Salaam. Find Toyota, Nissan, Honda, Suzuki and more from sellers across Tanzania's biggest car market.",
  "dodoma": "Find your perfect car in Dodoma, Tanzania's capital. New and used vehicles from sellers across the central region.",
  "arusha": "Cars for sale in Arusha — from city sedans to safari-ready 4x4 Land Cruisers and Defenders. Compare prices and buy today.",
  "mwanza": "Discover affordable cars in Mwanza on Lake Victoria. Second-hand and brand-new Toyota, Nissan and Suzuki vehicles available now.",
  "zanzibar": "Buy and sell cars in Zanzibar. Find the best deals on used cars, motorcycles and light commercial vehicles on the island.",
  "mbeya": "Browse cars for sale in Mbeya, the southern gateway to Tanzania. All makes and models at competitive prices.",
  "nairobi": "Find your next car in Nairobi, Kenya. Browse dealer and private listings across Kirinyaga Road, Mombasa Road and other major car areas.",
  "mombasa": "Cars for sale in Mombasa. Import-ready Japanese vehicles, locally used cars and light trucks at Mombasa port-city prices.",
  "kisumu": "Buy cars in Kisumu on Lake Victoria. Affordable used Toyota, Nissan and Subaru vehicles, trucks, and motorcycles for the western Kenya market.",
  "nakuru": "Cars for sale in Nakuru. Compare prices on Toyota, Subaru, and Honda from dealers and private sellers in the Rift Valley.",
  "kampala": "Find cars for sale in Kampala, Uganda. New and used vehicles from sellers in Kampala Industrial Area, Kireka and across the city.",
  "entebbe": "Browse cars in Entebbe, Uganda. Conveniently located near Entebbe Airport, find vehicle listings from local sellers.",
  "jinja": "Cars for sale in Jinja, Uganda's industrial city on the Nile. Find Toyota, Nissan, and Mitsubishi vehicles from local sellers.",
  "kigali": "Buy cars in Kigali, Rwanda. Clean used vehicles and new imports in one of East Africa's fastest-growing cities. Find Toyota, Honda and more.",
  "addis-ababa": "Cars for sale in Addis Ababa, Ethiopia. Find your next vehicle in the capital — Toyota Land Cruisers, Isuzu trucks, and city cars.",
  "lagos": "Find cars in Lagos, Nigeria. Browse a wide selection of vehicles from dealers and private sellers across Africa's largest city.",
  "abuja": "Buy cars in Abuja, Nigeria's Federal Capital Territory. Find car listings from dealers and private sellers across the city.",
};

const cityGuideContent: Record<string, { heading: string; body: string }> = {
  "dar-es-salaam": {
    heading: "Buying a Car in Dar es Salaam",
    body: "Dar es Salaam is Tanzania's commercial capital and the largest car market in the country. The main car-trading hubs are along Morogoro Road, Nyerere Road, and in the Kariakoo and Mikocheni areas, where you'll find hundreds of dealers offering both locally used vehicles and direct Japanese imports. Toyota dominates the market — the Land Cruiser, Hilux, Vitz and IST are among the most popular models due to their reliability on Tanzania's varied road conditions. Nissan X-Trail, Honda CRV and Suzuki Escudo are also in high demand. When buying in Dar es Salaam, always verify the vehicle's TIN (Tax Identification Number), check the chassis number against SUMATRA records, and confirm import duty has been paid in full. Getting a pre-purchase inspection from a mechanic in Sinza or Ubungo is strongly advised before committing to any sale.",
  },
  "arusha": {
    heading: "Buying a Car in Arusha",
    body: "Arusha is the gateway to Tanzania's northern safari circuit, and the local car market reflects this — four-wheel-drive vehicles, Landcruiser Prado, Hilux double-cabs, and Land Rover Defenders are particularly sought after for game drives and highland roads to Kilimanjaro and the Ngorongoro Crater. The main car market runs along the Nairobi Highway and around the Clock Tower roundabout, with dealers stocking both city hatchbacks for urban use and heavy-duty off-roaders for tour operators. Arusha buyers often source vehicles imported via Dar es Salaam or directly from Nairobi, so verifying import documentation is important. Prices here trend slightly higher than in Dar es Salaam for comparable 4x4 models due to strong demand from tourism businesses.",
  },
  "nairobi": {
    heading: "Buying a Car in Nairobi",
    body: "Nairobi is the biggest car market in East Africa. Kirinyaga Road in the CBD is Kenya's most famous car-dealer strip, lined with hundreds of showrooms selling Japanese imports, locally used cars, and ex-expat vehicles. Other major hubs include Ngong Road, Mombasa Road, and Industrial Area. Toyota is the most popular brand, with the Corolla, Probox, Land Cruiser and Prado selling in huge volumes. Subaru Forester, Impreza and Legacy are beloved in the Kenyan market for their all-weather performance in the highlands. When buying in Nairobi, insist on a NTSA inspection certificate, check the logbook (V5) carefully, and use a licensed clearing agent for any imported vehicle. Insurance is mandatory from day one. Nairobi's traffic means fuel efficiency is a top priority — hybrid options like the Toyota Axio Hybrid and Honda Fit Hybrid are gaining popularity fast.",
  },
  "mombasa": {
    heading: "Buying a Car in Mombasa",
    body: "Mombasa is Kenya's major port city and a primary entry point for imported vehicles in East Africa. Many buyers travel to Mombasa specifically to purchase vehicles fresh off the boat before they are transported upcountry, which can mean better prices and more import options. The main car market areas are along Moi Avenue, Digo Road, and the Changamwe industrial zone near the port. Japanese imports — especially Toyota, Nissan, and Honda — dominate the market. The coastal climate means buyers should check vehicle undercarriages carefully for rust and salt corrosion, particularly on older imports. Mombasa dealers are generally experienced with import documentation, KRA duty payments, and NTSA registration, making the paperwork process more straightforward than in inland cities.",
  },
  "kampala": {
    heading: "Buying a Car in Kampala",
    body: "Kampala is Uganda's fastest-growing car market, with demand driven by a rapidly expanding middle class and strong road infrastructure investment. The main car-trading areas are in Kampala Industrial Area along Jinja Road, Kireka, and the Nakawa market. Japanese imports are the backbone of the market — Toyota Harrier, Land Cruiser Prado, Hiace minibuses, and Nissan X-Trail are top sellers. Uganda drives on the left and imports primarily right-hand-drive vehicles. When buying in Kampala, check that the vehicle's URA (Uganda Revenue Authority) import declaration is complete, the chassis plate matches documents, and the vehicle passes roadworthiness inspection. Car hire businesses, NGOs, and construction companies are active buyers in Kampala, which keeps the quality of available stock high.",
  },
  "kigali": {
    heading: "Buying a Car in Kigali",
    body: "Kigali has one of the cleanest, most regulated car markets in East Africa. Rwanda has strict vehicle age restrictions — vehicles older than 10 years (and in some categories 5 years) are restricted from import, meaning the average age of cars on Kigali roads is younger than in neighbouring countries. Toyota, Honda and Volkswagen are popular brands. The Kigali car market is concentrated around Gisozi and Kimironko, with a growing number of formal showrooms alongside private sellers. Rwanda uses a plastic bag ban and stringent environmental standards, attracting cleaner, well-maintained vehicles. Import duty and VAT are applied on CIF value, so buyers should account for full landed costs when budgeting. Kigali's hilly terrain makes engine condition a priority — always test a car on a steep incline before buying.",
  },
  "addis-ababa": {
    heading: "Buying a Car in Addis Ababa",
    body: "Addis Ababa is Ethiopia's commercial heart and the centre of its car market. The main vehicle market is along Mexico Square (Meskel Square area) and the Kazanchis district. Ethiopia has historically had high import duties, making brand-new cars expensive and giving the secondhand market significant depth. Toyota Land Cruiser is the dominant vehicle for both urban and rural use, valued for its durability on Ethiopia's highland roads. Isuzu trucks and Mitsubishi Pajero also have strong followings. The government has in recent years relaxed some import restrictions, bringing in more Chinese-brand vehicles at competitive prices. When buying in Addis, verify the vehicle's customs clearance documents carefully and use a licensed broker to navigate ERCA (Ethiopian Revenue and Customs Authority) paperwork.",
  },
};

export default function CityLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const cityName = slug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "";
  const description = cityDescriptions[slug || ""] || `Find cars for sale in ${cityName}. Browse new and used vehicles from local sellers.`;
  const guideContent = cityGuideContent[slug || ""] || null;
  const canonicalUrl = `https://www.motokah.com/city/${slug}`;

  const { listings, loading } = useSearchListings(
    { city: cityName },
    "newest"
  );

  const [relatedCities] = useState(() => {
    const all = [
      "Dar es Salaam", "Dodoma", "Arusha", "Mwanza", "Zanzibar",
      "Nairobi", "Mombasa", "Kisumu", "Nakuru",
      "Kampala", "Entebbe", "Jinja",
      "Kigali", "Addis Ababa", "Lagos", "Abuja"
    ];
    return all.filter(c => c.toLowerCase() !== cityName.toLowerCase()).slice(0, 8);
  });

  return (
    <>
      <Helmet>
        <title>{`Cars for Sale in ${cityName} | Motokah`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`Cars for Sale in ${cityName} — Motokah`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.motokah.com/pwa-512x512.png" />
        <JsonLd data={breadcrumbJsonLd([
          { name: "Home", url: "https://www.motokah.com/" },
          { name: "Cars for Sale", url: "https://www.motokah.com/search" },
          { name: cityName, url: canonicalUrl },
        ])} />
        <JsonLd data={collectionPageJsonLd({
          name: `Cars for Sale in ${cityName}`,
          description,
          url: canonicalUrl,
          itemCount: listings.length,
        })} />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <div className="bg-primary/5 border-b border-border">
          <div className="container mx-auto py-12 px-4">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{cityName}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Cars for Sale in {cityName}
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              {description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to={`/search?city=${encodeURIComponent(cityName)}`}>View All in {cityName}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/sell">Sell Your Car</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="container mx-auto py-10 px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <IconLoader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : listings.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {listings.length} {listings.length === 1 ? "car" : "cars"} in {cityName}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {listings.map((listing) => (
                  <VehicleCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No cars found in {cityName} yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Be the first to <Link to="/sell" className="text-primary hover:underline">list your car</Link>.
              </p>
            </div>
          )}
        </div>

        {/* City guide content — rich text for SEO */}
        {guideContent && (
          <div className="container mx-auto py-10 px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">{guideContent.heading}</h2>
            <p className="text-muted-foreground leading-relaxed">{guideContent.body}</p>
            <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
              Popular Used Cars in {cityName}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Motokah helps buyers compare Toyota, Nissan, Subaru, Mazda, Honda, Mitsubishi and Mercedes-Benz
              listings in {cityName}. Use filters for price, year, mileage, fuel type, transmission and body style,
              then call or WhatsApp the seller directly before arranging an inspection.
            </p>
          </div>
        )}

        {/* Related Cities */}
        <div className="bg-secondary/30 border-t border-border">
          <div className="container mx-auto py-10 px-4">
            <h2 className="text-xl font-bold mb-4">Browse Other Cities</h2>
            <div className="flex flex-wrap gap-2">
              {relatedCities.map((city) => (
                <Link
                  key={city}
                  to={`/city/${city.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-4 py-2 bg-card border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
