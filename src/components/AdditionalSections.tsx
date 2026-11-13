import { IconClockPlus, IconTrophy, IconDiamond } from "@tabler/icons-react";
import VehicleCard from "./VehicleCard";
import { useListings } from "@/hooks/useListings";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "@/contexts/LocationContext";
import { currencyForCountry, usePriceFormatter } from "@/lib/prices";

export function NewlyAdded() {
  const { country } = useLocation();
  const { listings, loading } = useListings({ limit: 8, country });

  if (loading) {
    return (
      <section className="container mx-auto py-10">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <IconClockPlus size={24} stroke={2.5} className="text-success" /> Newly Added
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (listings.length === 0) return null;

  return (
    <section className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <IconClockPlus size={24} stroke={2.5} className="text-success" /> Newly Added
        </h2>
        <a href="/search" className="text-sm text-primary hover:underline">View All →</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {listings.map(l => <VehicleCard key={l.id} listing={l} />)}
      </div>
    </section>
  );
}

interface BrandCount {
  make: string;
  count: number;
}

export function BestSellingBrands() {
  const { country } = useLocation();
  const [brands, setBrands] = useState<BrandCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase
      .from("listings")
      .select("make")
      .eq("status", "approved");

    const currency = currencyForCountry(country);
    if (currency) query = query.eq("currency", currency);

    query
      .then(({ data }) => {
        if (!data) { setLoading(false); return; }
        const counts: Record<string, number> = {};
        data.forEach(r => { counts[r.make] = (counts[r.make] || 0) + 1; });
        const sorted = Object.entries(counts)
          .map(([make, count]) => ({ make, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);
        setBrands(sorted);
        setLoading(false);
      });
  }, [country]);

  if (loading) return null;
  if (brands.length === 0) return null;

  return (
    <section className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <IconTrophy size={24} stroke={2.5} className="text-accent" /> Best Selling Brands
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {brands.map(b => (
          <a key={b.make} href={`/search?make=${encodeURIComponent(b.make)}`} className="flex flex-col items-center gap-2 p-5 rounded-xl border border-border bg-card hover:border-primary hover:scale-[1.02] transition-all group">
            <span className="text-2xl font-extrabold text-primary group-hover:scale-110 transition-transform">{b.make[0]}</span>
            <span className="font-semibold text-foreground">{b.make}</span>
            <span className="text-xs text-muted-foreground">{b.count.toLocaleString()} listings</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function SpecialDeals() {
  const { country } = useLocation();
  const { listings, loading } = useListings({ limit: 4, country });
  const priceFormatter = usePriceFormatter();

  if (loading || listings.length === 0) return null;

  // Show the most affordable as "deals"
  const deals = [...listings].sort((a, b) => a.price - b.price).slice(0, 2);

  return (
    <section className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <IconDiamond size={24} stroke={2.5} className="text-primary" /> Best Value Picks
        </h2>
        <a href="/search" className="text-sm text-primary hover:underline">View All →</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deals.map(l => (
          <a key={l.id} href={`/listing/${l.id}`} className="flex flex-col sm:flex-row bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
            <div className="relative sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden bg-muted">
              <img src={l.image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-70" loading="lazy" />
              <img src={l.image} alt={l.title} className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div className="p-4 flex flex-col justify-center flex-1">
              <h3 className="font-bold text-lg mb-2">{l.title}</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xl font-bold text-primary">{priceFormatter.format(l.price, l.currency)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{l.year} · {l.mileage.toLocaleString()} km · {l.transmission} · {l.location}</p>
              <span className="text-sm text-primary font-semibold mt-3 hover:underline">View Details →</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
