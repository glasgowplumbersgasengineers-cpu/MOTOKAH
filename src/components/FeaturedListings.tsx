import { IconFlame, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import VehicleCard from "./VehicleCard";
import { useListings } from "@/hooks/useListings";
import { useLocation } from "@/contexts/LocationContext";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FeaturedListings() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { country } = useLocation();
  const { listings, loading } = useListings({ limit: 10, country });

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
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const displayListings = listings;

  return (
    <section className="container mx-auto py-7 md:py-10">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2 className="min-w-0 text-xl md:text-2xl font-bold flex items-center gap-2 whitespace-nowrap">
          <IconFlame size={22} stroke={2.5} className="shrink-0 text-destructive" />
          <span className="truncate">Hot Deals & Featured</span>
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => scroll("left")} disabled={!canScrollLeft} aria-label="Scroll left"
            className="hidden md:flex w-8 h-8 rounded-full border border-border items-center justify-center disabled:opacity-30 hover:bg-accent/10 transition-colors">
            <IconChevronLeft size={18} stroke={2.5} />
          </button>
          <button onClick={() => scroll("right")} disabled={!canScrollRight} aria-label="Scroll right"
            className="hidden md:flex w-8 h-8 rounded-full border border-border items-center justify-center disabled:opacity-30 hover:bg-accent/10 transition-colors">
            <IconChevronRight size={18} stroke={2.5} />
          </button>
          <Link to="/search" className="text-sm text-primary hover:underline md:ml-2 whitespace-nowrap">View All →</Link>
        </div>
      </div>
      {loading ? (
        <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="min-w-[280px] h-[320px] rounded-xl bg-muted animate-pulse flex-shrink-0" />
          ))}
        </div>
      ) : (
        <div ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-none w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {displayListings.map((l, i) => (
            <div key={l.id} className="min-w-[280px] max-w-[320px] snap-start flex-shrink-0">
              <VehicleCard listing={l} priority={i < 3} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
