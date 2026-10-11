import { IconClock } from "@tabler/icons-react";
import VehicleCard from "./VehicleCard";
import { useListings } from "@/hooks/useListings";
import { useLocation } from "@/contexts/LocationContext";

export default function LatestListingsGrid() {
  const { country } = useLocation();
  const { listings, loading } = useListings({ limit: 6, country });
  const displayListings = listings;

  return (
    <section className="container mx-auto py-7 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <IconClock size={24} stroke={2.5} className="text-primary" /> Latest Listings
        </h2>
        <a href="/search" className="text-sm text-primary hover:underline">View All →</a>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-[320px] rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayListings.map((l, i) => (
            <div key={l.id} className={i >= 3 ? "hidden sm:block" : undefined}>
              <VehicleCard listing={l} priority={i < 3} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
