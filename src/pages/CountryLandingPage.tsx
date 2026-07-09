import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { useSearchListings } from "@/hooks/useSearchListings";
import { Button } from "@/components/ui/button";
import { IconLoader2, IconMapPin } from "@tabler/icons-react";
import { jsonLdScript, breadcrumbJsonLd, collectionPageJsonLd, faqJsonLd } from "@/lib/structuredData";

const countries: Record<string, { name: string; cities: string[]; description: string; guide: string }> = {
  tanzania: {
    name: "Tanzania",
    cities: ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Zanzibar", "Mbeya"],
    description: "Browse used cars for sale in Tanzania. Find Toyota, Nissan, Honda, Suzuki, BMW and more from sellers in Dar es Salaam, Arusha, Mwanza and other cities.",
    guide: "Tanzania's used car market is strongest in Dar es Salaam, with many Japanese imports also moving through Arusha, Mwanza and Dodoma. Buyers should confirm registration, import duty status, chassis number, service condition and seller contact details before paying.",
  },
  kenya: {
    name: "Kenya",
    cities: ["Nairobi", "Mombasa", "Nakuru", "Kisumu", "Eldoret", "Thika"],
    description: "Browse cars for sale in Kenya. Compare used Toyota, Subaru, Nissan, Mazda, Mercedes-Benz and more across Nairobi, Mombasa, Nakuru, Kisumu and Eldoret.",
    guide: "Kenya has one of East Africa's most active car markets, led by Nairobi and Mombasa. Before buying, check the logbook, NTSA status, import documentation where relevant, mileage consistency and whether the seller can meet in person for inspection.",
  },
  uganda: {
    name: "Uganda",
    cities: ["Kampala", "Entebbe", "Jinja", "Mukono", "Mbarara"],
    description: "Browse cars for sale in Uganda. Find used Toyota, Nissan, Mitsubishi, Honda and commercial vehicles in Kampala, Entebbe, Jinja and nearby cities.",
    guide: "Uganda's market is centred on Kampala, Jinja Road and surrounding dealer areas. Buyers should confirm URA import records, registration documents, chassis numbers and mechanical condition before final payment.",
  },
  rwanda: {
    name: "Rwanda",
    cities: ["Kigali", "Butare", "Ruhengeri", "Byumba"],
    description: "Browse cars for sale in Rwanda. Find used vehicles in Kigali and other Rwandan cities, from compact city cars to SUVs and commercial vehicles.",
    guide: "Rwanda's vehicle market is more regulated than many neighbouring markets. Buyers should check vehicle age, import status, roadworthiness, service history and insurance before completing a sale.",
  },
  ethiopia: {
    name: "Ethiopia",
    cities: ["Addis Ababa", "Adama", "Bahir Dar", "Hawassa", "Dire Dawa"],
    description: "Browse cars for sale in Ethiopia. Find Toyota, Nissan, Mercedes-Benz, Isuzu and other vehicles in Addis Ababa and major Ethiopian cities.",
    guide: "Ethiopia's car market is concentrated around Addis Ababa, with import costs and paperwork playing a major role in pricing. Always verify customs clearance, registration documents and seller identity before buying.",
  },
  nigeria: {
    name: "Nigeria",
    cities: ["Lagos", "Abuja", "Ibadan", "Kano", "Port Harcourt"],
    description: "Browse cars for sale in Nigeria. Find used cars, SUVs and commercial vehicles in Lagos, Abuja, Ibadan, Kano and Port Harcourt.",
    guide: "Nigeria has a large and diverse car market, especially around Lagos and Abuja. Buyers should verify customs duty, registration, ownership documents and vehicle inspection before making payment.",
  },
  burundi: {
    name: "Burundi",
    cities: ["Bujumbura"],
    description: "Browse cars for sale in Burundi. Find used vehicles in Bujumbura and nearby areas through Motokah.",
    guide: "For Burundi listings, confirm the seller's identity, import paperwork, registration and vehicle condition before paying or arranging transport.",
  },
};

const countryFaqs: Record<string, { q: string; a: string }[]> = {
  tanzania: [
    {
      q: "Where can I find used cars for sale in Tanzania?",
      a: "Motokah lists used cars from dealers and sellers in Dar es Salaam, Arusha, Mwanza, Dodoma, Zanzibar and other Tanzanian cities.",
    },
    {
      q: "What should I check before buying a used car in Tanzania?",
      a: "Check the registration details, chassis number, import duty status, seller contact information, service condition and inspection history before paying.",
    },
    {
      q: "Which car brands are popular in Tanzania?",
      a: "Toyota, Nissan, Mazda, Honda, Subaru, Mitsubishi and Suzuki are popular in Tanzania because parts and mechanics are widely available.",
    },
  ],
  kenya: [
    {
      q: "Where can I find used cars for sale in Kenya?",
      a: "Motokah lists used cars in Nairobi, Mombasa, Nakuru, Kisumu, Eldoret and other Kenyan cities, including dealer and private stock.",
    },
    {
      q: "What documents should I check when buying a car in Kenya?",
      a: "Check the logbook, NTSA status, seller ID, import documents where relevant, mileage consistency and vehicle inspection condition.",
    },
    {
      q: "Which used cars are popular in Kenya?",
      a: "Toyota Probox, Toyota Harrier, Toyota Prado, Mazda Demio, Subaru Forester, Honda Vezel and Nissan X-Trail are common buyer searches in Kenya.",
    },
  ],
};

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

export default function CountryLandingPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const country = countries[slug];
  const countryName = country?.name || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const { listings, loading } = useSearchListings({ country: countryName }, "newest");
  const description = country?.description || `Browse cars for sale in ${countryName}. Find used vehicles from sellers on Motokah.`;
  const canonicalUrl = `https://www.motokah.com/country/${slug}`;
  const faqs = countryFaqs[slug] || [];

  return (
    <>
      <Helmet>
        <title>{`Cars for Sale in ${countryName} | Motokah`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`Cars for Sale in ${countryName} | Motokah`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.motokah.com/pwa-512x512.png" />
        {jsonLdScript(breadcrumbJsonLd([
          { name: "Home", url: "https://www.motokah.com/" },
          { name: "Cars for Sale", url: "https://www.motokah.com/search" },
          { name: countryName, url: canonicalUrl },
        ]))}
        {jsonLdScript(collectionPageJsonLd({
          name: `Cars for Sale in ${countryName}`,
          description,
          url: canonicalUrl,
          itemCount: listings.length,
        }))}
        {faqs.length > 0 && jsonLdScript(faqJsonLd(faqs))}
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <section className="border-b border-border bg-primary/5">
          <div className="container mx-auto px-4 py-12">
            <nav className="mb-4 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{countryName}</span>
            </nav>
            <h1 className="text-3xl font-extrabold text-foreground md:text-4xl">
              Cars for Sale in {countryName}
            </h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">{description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to={`/search?country=${encodeURIComponent(countryName)}`}>Search {countryName}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/sell">Sell Your Car</Link>
              </Button>
            </div>
          </div>
        </section>

        {country && (
          <section className="container mx-auto px-4 py-8">
            <div className="mb-4 flex items-center gap-2">
              <IconMapPin size={20} className="text-primary" />
              <h2 className="text-xl font-bold">Browse by City</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {country.cities.map((city) => (
                <Link
                  key={city}
                  to={`/city/${slugify(city)}`}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-primary hover:text-primary"
                >
                  {city}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 pb-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <IconLoader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : listings.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Showing {listings.length} {listings.length === 1 ? "listing" : "listings"} in {countryName}
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {listings.map((listing) => (
                  <VehicleCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-lg font-semibold">No listings found in {countryName} yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">Try another city or browse all available vehicles.</p>
            </div>
          )}
        </section>

        {country && (
          <section className="border-t border-border bg-secondary/30">
            <div className="container mx-auto max-w-3xl px-4 py-10">
              <h2 className="mb-3 text-2xl font-bold">Buying a Car in {countryName}</h2>
              <p className="leading-relaxed text-muted-foreground">{country.guide}</p>
              <h2 className="mb-3 mt-8 text-xl font-bold">Popular Searches in {countryName}</h2>
              <p className="leading-relaxed text-muted-foreground">
                Motokah is built for high-intent local searches including used cars in {countryName},
                Toyota for sale in {countryName}, Japanese import cars, affordable SUVs, pickups,
                vans and dealer stock. Browse by city, compare prices and contact verified sellers directly.
              </p>
              {faqs.length > 0 && (
                <>
                  <h2 className="mb-3 mt-8 text-xl font-bold">Buying Questions in {countryName}</h2>
                  <div className="space-y-4">
                    {faqs.map((item) => (
                      <div key={item.q}>
                        <h3 className="font-semibold text-foreground">{item.q}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
