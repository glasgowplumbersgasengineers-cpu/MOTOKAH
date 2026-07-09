import { useEffect, useRef, useState } from "react";
import { IconMotorbike, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { supabase } from "@/integrations/supabase/client";
import VehicleCard from "./VehicleCard";
import { type Listing } from "@/data/mockData";
import { bikeTypes } from "@/data/mockData";
import { useLocation } from "@/contexts/LocationContext";
import { Link } from "react-router-dom";
import { hasUsablePhone, isLaunchQualityListing } from "@/lib/listingQuality";

const countryCurrencyMap: Record<string, string[]> = {
  Tanzania: ["TZS"],
  Kenya: ["KES"],
  Uganda: ["UGX"],
  Rwanda: ["RWF"],
  Burundi: ["BIF"],
  Ethiopia: ["ETB"],
  Nigeria: ["NGN"],
};

export default function BikesSection() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { country } = useLocation();

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll);
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [listings]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.7 : el.clientWidth * 0.7, behavior: "smooth" });
  };

  useEffect(() => {
    const fetch = async () => {
      let query = supabase
        .from("listings")
        .select("*, listing_images(image_url, display_order)")
        .eq("status", "approved")
        .in("body_type", bikeTypes)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (country && country !== "All") {
        const currencies = countryCurrencyMap[country] || [];
        if (currencies.length > 0) {
          query = query.in("currency", currencies);
        }
      }
      
      const { data: rows } = await query;

      if (!rows || rows.length === 0) { setLoading(false); return; }

      const sellerIds = [...new Set(rows.map((r) => r.seller_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, seller_type, phone")
        .in("user_id", sellerIds);
      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      const mapped: Listing[] = rows.map((r) => {
        const imgs = (r.listing_images as { image_url: string; display_order: number }[]) || [];
        const sorted = [...imgs].sort((a, b) => a.display_order - b.display_order);
        const profile = profileMap.get(r.seller_id);
        return {
          id: r.id,
          title: r.title,
          price: Number(r.price),
          currency: r.currency,
          condition: r.condition,
          year: r.year,
          mileage: r.mileage || 0,
          transmission: r.transmission || "Manual",
          location: r.city || "Africa",
          image: sorted[0]?.image_url || "",
          views: r.views || 0,
          sellerName: profile?.display_name || "Private Seller",
          sellerRating: 4.5,
          sellerType: (profile?.seller_type as "dealer" | "private") || "private",
          sellerListingCount: 1,
          sellerPhone: profile?.phone || undefined,
          bodyType: r.body_type || undefined,
          fuelType: r.fuel_type || undefined,
          make: r.make,
          model: r.model,
          
        };
      });

      setListings(mapped.filter((listing) => hasUsablePhone(listing.sellerPhone) && isLaunchQualityListing(listing)));
      setLoading(false);
    };
    fetch();
  }, [country]);

  if (!loading && listings.length === 0) return null;

  return (
    <section className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <IconMotorbike size={24} stroke={2.5} className="text-primary" /> New Bikes by Make
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")} disabled={!canScrollLeft}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-accent/10 transition-colors">
            <IconChevronLeft size={18} stroke={2.5} />
          </button>
          <button onClick={() => scroll("right")} disabled={!canScrollRight}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-accent/10 transition-colors">
            <IconChevronRight size={18} stroke={2.5} />
          </button>
          <Link to="/search?vehicleType=bike" className="text-sm text-primary hover:underline ml-2">View All →</Link>
        </div>
      </div>
      {loading ? (
        <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="min-w-[280px] h-[320px] rounded-xl bg-muted animate-pulse flex-shrink-0" />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {listings.map((l) => (
            <div key={l.id} className="min-w-[280px] max-w-[320px] snap-start flex-shrink-0">
              <VehicleCard listing={l} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
