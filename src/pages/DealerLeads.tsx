import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  IconBrandWhatsapp,
  IconPhone,
  IconMail,
  IconMapPin,
  IconStar,
  IconBuildingStore,
  IconExternalLink,
  IconSearch,
  IconBrandInstagram,
  IconUsers,
} from "@tabler/icons-react";
import { DEALERS, type Dealer } from "@/data/dealers";
import { mockDealers } from "@/data/mockData";
import { breadcrumbJsonLd, collectionPageJsonLd, jsonLdScript } from "@/lib/structuredData";

// Instagram showrooms — accounts with scraped data + showroom pages
const IG_SHOWROOMS = mockDealers.filter((d) =>
  d.user_id.startsWith("dealer-") && d.user_id !== "dealer-ibaraki"
).map((d) => ({
  username: d.user_id.replace(/^dealer-/, ""),
  name: d.display_name,
  phone: d.phone,
  description: d.description,
  listing_count: d.listing_count,
}));

type Country = "All" | "Tanzania" | "Kenya" | "Uganda" | "Rwanda";

const COUNTRY_TABS: { label: string; value: Country }[] = [
  { label: "All", value: "All" },
  { label: "🇹🇿 Tanzania", value: "Tanzania" },
  { label: "🇰🇪 Kenya", value: "Kenya" },
  { label: "🇺🇬 Uganda", value: "Uganda" },
  { label: "🇷🇼 Rwanda", value: "Rwanda" },
];

/** Strip all non-digit characters (keeps + for URLs). */
function phoneForUrl(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

function DealerCard({ dealer }: { dealer: Dealer }) {
  const hasPhone = !!dealer.phone;
  const phoneUrl = dealer.phone ? phoneForUrl(dealer.phone) : "";

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <IconBuildingStore size={20} className="text-primary flex-shrink-0" />
          <h3 className="font-bold text-foreground text-sm leading-tight truncate">
            {dealer.name}
          </h3>
        </div>
        {dealer.verified && (
          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full flex-shrink-0">
            Verified
          </span>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center gap-1 text-muted-foreground text-xs">
        <IconMapPin size={14} className="flex-shrink-0" />
        <span>
          {dealer.countryFlag} {dealer.city}, {dealer.country}
        </span>
      </div>

      {/* Brands */}
      {dealer.brands && dealer.brands.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {dealer.brands.map((brand) => (
            <span
              key={brand}
              className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border"
            >
              {brand}
            </span>
          ))}
        </div>
      )}

      {/* Rating */}
      {dealer.rating != null && (
        <div className="flex items-center gap-1 text-xs text-amber-500">
          <IconStar size={14} fill="currentColor" />
          <span className="font-semibold">{dealer.rating.toFixed(1)}</span>
        </div>
      )}

      {/* Action buttons */}
      {hasPhone ? (
        <div className="flex gap-2 mt-auto flex-wrap">
          {dealer.whatsapp && (
            <a
              href={`https://wa.me/${phoneUrl.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[80px]"
            >
              <Button
                size="sm"
                className="w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white text-xs gap-1"
              >
                <IconBrandWhatsapp size={14} />
                WhatsApp
              </Button>
            </a>
          )}
          <a href={`tel:${dealer.phone}`} className="flex-1 min-w-[60px]">
            <Button
              size="sm"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1"
            >
              <IconPhone size={14} />
              Call
            </Button>
          </a>
          {dealer.email && (
            <a href={`mailto:${dealer.email}`} className="flex-1 min-w-[60px]">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs gap-1"
              >
                <IconMail size={14} />
                Email
              </Button>
            </a>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mt-auto italic">
          Contact via website
        </p>
      )}

      {/* Website link */}
      {dealer.website && (
        <a
          href={dealer.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <IconExternalLink size={12} />
          Visit Website
        </a>
      )}
    </div>
  );
}

export default function DealerLeads() {
  usePageTitle("East Africa Car Dealers — Motokah");

  const [activeCountry, setActiveCountry] = useState<Country>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return DEALERS.filter((d) => {
      const matchesCountry =
        activeCountry === "All" || d.country === activeCountry;

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        (d.brands || []).some((b) => b.toLowerCase().includes(q));

      return matchesCountry && matchesSearch;
    });
  }, [activeCountry, search]);

  const countryCount = useMemo(
    () => new Set(DEALERS.map((d) => d.country)).size,
    []
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>East Africa Car Dealers and Showrooms | Motokah</title>
        <meta
          name="description"
          content="Find car dealers and vehicle showrooms across Tanzania, Kenya, Uganda and Rwanda. Call or WhatsApp dealers directly from Motokah."
        />
        <link rel="canonical" href="https://www.motokah.com/dealer-leads" />
        <meta property="og:title" content="East Africa Car Dealers and Showrooms | Motokah" />
        <meta property="og:description" content="Find car dealers and vehicle showrooms across East Africa. Call or WhatsApp dealers directly." />
        <meta property="og:url" content="https://www.motokah.com/dealer-leads" />
        {jsonLdScript(breadcrumbJsonLd([
          { name: "Home", url: "https://www.motokah.com/" },
          { name: "Dealer Contacts", url: "https://www.motokah.com/dealer-leads" },
        ]))}
        {jsonLdScript(collectionPageJsonLd({
          name: "East Africa Car Dealers and Showrooms",
          description: "Dealer contact directory for car buyers across Tanzania, Kenya, Uganda and Rwanda.",
          url: "https://www.motokah.com/dealer-leads",
          itemCount: DEALERS.length + IG_SHOWROOMS.length,
        }))}
      </Helmet>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border py-10 px-4">
          <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
                <IconBuildingStore size={32} className="text-primary" />
                East Africa Car Showrooms
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Tap to WhatsApp or call any dealer instantly
              </p>
            </div>
            <Link to="/become-dealer">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0">
                + Add Your Dealership
              </Button>
            </Link>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 py-6 flex flex-col gap-6">
          {/* Search + Stats */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <IconSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                type="search"
                placeholder="Search dealer, city or brand…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground flex-shrink-0">
              <span className="font-semibold text-foreground">{filtered.length}</span> dealers
              {activeCountry === "All" && (
                <>
                  {" "}across{" "}
                  <span className="font-semibold text-foreground">{countryCount}</span> countries
                </>
              )}
            </p>
          </div>

          {/* Country filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {COUNTRY_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCountry(tab.value)}
                className={`flex-shrink-0 text-xs sm:text-sm px-3 py-1.5 rounded-full border transition-colors font-medium ${
                  activeCountry === tab.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Instagram Showrooms */}
          <div>
            <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <IconBrandInstagram size={18} className="text-pink-500" />
              Instagram Showrooms
              <span className="text-xs font-normal text-muted-foreground">— live dealer listings</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {IG_SHOWROOMS.map((s) => {
                const waPhone = s.phone.replace(/[^0-9]/g, "");
                const waNum = waPhone.startsWith("0") ? `255${waPhone.slice(1)}` : waPhone;
                return (
                  <div key={s.username} className="bg-card border border-border rounded-xl p-3 flex flex-col gap-2 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center shrink-0">
                        <IconBrandInstagram size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate leading-tight">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground">@{s.username}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <IconUsers size={10} /> {s.listing_count} listings
                    </p>
                    <div className="flex gap-1 mt-auto">
                      <Link to={`/showroom/${s.username}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full text-[10px] h-7 px-2">View</Button>
                      </Link>
                      {waNum.length >= 10 && (
                        <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="bg-[#25D366] hover:bg-[#1ebe5a] text-white h-7 px-2">
                            <IconBrandWhatsapp size={12} />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((dealer) => (
                <DealerCard key={dealer.id} dealer={dealer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <IconBuildingStore size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No dealers found for this filter.</p>
              <button
                onClick={() => { setSearch(""); setActiveCountry("All"); }}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center pb-4 border-t border-border pt-4">
            Dealer info sourced from public directories. Contact details may change — verify before visiting.
          </p>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold text-foreground">How to use Motokah dealer contacts</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Start with dealers that have clear inventory, public phone numbers and recent stock.
              Ask for the vehicle price, chassis details, registration documents and inspection time
              before visiting. Dealers can claim their page so Motokah buyers reach the correct WhatsApp
              number instead of old scraped contacts.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/dealers" className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                Browse dealer pages
              </Link>
              <Link to="/become-dealer" className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                Claim a dealer page
              </Link>
              <Link to="/search?country=Tanzania" className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary">
                Browse Tanzania stock
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
