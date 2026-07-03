import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { sanitizeCalloutPricingText } from "@/lib/seoText";
import { normalizeImageUrl } from "@/lib/imageUrls";
import { usePageTitle } from "@/hooks/usePageTitle";
import { DEALER_CITY, LAUNCH_SHOWROOM_USERS, getShowroomListings } from "@/data/mockData";
import {
  IconBrandWhatsapp,
  IconPhone,
  IconBrandInstagram,
  IconUsers,
  IconMapPin,
  IconPhoto,
} from "@tabler/icons-react";
interface Post {
  shortcode: string;
  date: string;
  caption: string;
  likes: number;
  images: string[];
  url: string;
}

interface DealerData {
  username: string;
  full_name: string;
  bio: string;
  phone: string;
  followers: number;
  website: string;
  scraped_at: string;
  posts: Post[];
}

// Auto-load all showroom JSONs from src/data/showrooms/
const _mods = import.meta.glob("../data/showrooms/*.json", { eager: true }) as Record<string, { default: DealerData }>;
const SHOWROOMS: Record<string, DealerData> = Object.fromEntries(
  Object.entries(_mods).map(([path, mod]) => {
    const username = path.split("/").pop()!.replace(".json", "");
    const dealer = mod.default as DealerData;
    return [username, {
      ...dealer,
      posts: (dealer.posts || []).map((post) => ({
        ...post,
        images: (post.images || []).map(normalizeImageUrl),
      })),
    }];
  }).filter(([username]) => LAUNCH_SHOWROOM_USERS.has(username))
);

function formatFollowers(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function getCountryCode(username: string): string {
  const city = DEALER_CITY[username] ?? "Dar es Salaam, TZ";
  if (city.endsWith(", KE")) return "254";
  if (city.endsWith(", RW")) return "250";
  if (city.endsWith(", UG")) return "256";
  if (city.endsWith(", ET")) return "251";
  return "255"; // TZ default
}

export default function InstagramShowroom() {
  const { username } = useParams<{ username: string }>();
  const dealer = username ? SHOWROOMS[username] : null;
  usePageTitle(dealer ? `${dealer.full_name || dealer.username} — Motokah Showroom` : "Showroom Not Found");

  if (!dealer) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Showroom Not Found</h1>
          <p className="text-muted-foreground text-sm">This dealer showroom doesn't exist yet.</p>
          <Link to="/dealer-leads">
            <Button variant="outline">Browse All Dealers</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const phone = dealer.phone.replace(/[^0-9]/g, "");
  const countryCode = getCountryCode(username!);
  const waPhone = phone.startsWith("0") ? `${countryCode}${phone.slice(1)}` : phone;

  const dealerName = dealer.full_name || dealer.username;
  const city = DEALER_CITY[username!] ?? "Dar es Salaam, Tanzania";
  const cityLabel = city.replace(/, \w{2}$/, "");
  const listings = getShowroomListings(username!);
  const carCount = listings.length;
  const pageTitle = sanitizeCalloutPricingText(`${dealerName} — Used Cars for Sale in ${cityLabel} | Motokah`);
  const pageDesc = sanitizeCalloutPricingText(`Browse launch-ready used cars from ${dealerName} in ${cityLabel}. View photos, prices, specs and direct dealer contact details on Motokah.`);
  const pageUrl = `https://www.motokah.com/showroom/${username}`;
  const ogImage = listings.find((listing) => listing.image)?.image || "https://www.motokah.com/pwa-512x512.png";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <Header />

      {/* Hero / dealer profile */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <IconBrandInstagram size={36} className="text-primary" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  {dealer.full_name || dealer.username}
                </h1>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  @{dealer.username}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <IconUsers size={14} />
                  {formatFollowers(dealer.followers)} followers
                </span>
                {(() => {
                  const loc = dealer.bio.match(/(?:📍|location|address|ofisi|located)[^\n]*?((?:dar es salaam|nairobi|kampala|arusha|mwanza|dodoma|mombasa|kigali)[^\n,]{0,30})/i)?.[1]
                    || dealer.bio.match(/(dar es salaam|nairobi|kampala|arusha|mwanza|dodoma|mombasa|kigali)/i)?.[1]
                    || "Tanzania";
                  return (
                    <span className="flex items-center gap-1">
                      <IconMapPin size={14} />
                      {loc.trim()}
                    </span>
                  );
                })()}
              </div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 max-w-lg">
                {dealer.bio.replace(/🇹🇿|🇯🇵|▶️|☎️|👇/gu, "").replace(/\n+/g, " ").trim()}
              </p>
            </div>

            {/* Contact */}
            <div className="flex gap-2 shrink-0">
              <a
                href={`https://wa.me/${waPhone}?text=Hi, I found you on Motokah. I'm interested in your cars.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#25D366] hover:bg-[#1ebe5a] text-white gap-2">
                  <IconBrandWhatsapp size={16} /> WhatsApp
                </Button>
              </a>
              <a href={`tel:+${waPhone}`}>
                <Button variant="outline" className="gap-2">
                  <IconPhone size={16} /> Call
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Listings grid */}
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">
            Available Cars
            <span className="ml-2 text-sm font-normal text-muted-foreground">({carCount} listings)</span>
          </h2>
          <a
            href={`https://www.instagram.com/${dealer.username}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <IconBrandInstagram size={14} /> View on Instagram
          </a>
        </div>
        {listings.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <IconPhoto size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No launch-ready listings found for this dealer yet.</p>
            <a href={`https://www.instagram.com/${dealer.username}/`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">
              View on Instagram →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <VehicleCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
