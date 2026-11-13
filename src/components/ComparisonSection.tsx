import { useState } from "react";
import { IconScale, IconCheck } from "@tabler/icons-react";
import { useListings } from "@/hooks/useListings";
import { useLocation } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ComparisonSection() {
  const { country } = useLocation();
  const { listings, loading } = useListings({ limit: 4, country });
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  if (!loading && listings.length === 0) return null;

  return (
    <section className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <IconScale size={24} stroke={2.5} className="text-primary" /> Compare Vehicles Side by Side
      </h2>
      <p className="text-muted-foreground text-sm mb-6">Select 2–4 vehicles to compare specs and prices</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="h-52 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {listings.map(l => {
            const isSelected = selected.includes(l.id);
            return (
              <button key={l.id} onClick={() => toggle(l.id)}
                className={`text-left bg-card border rounded-xl overflow-hidden transition-all ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/30"}`}>
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                  <img src={l.image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-70" loading="lazy" />
                  <img src={l.image} alt={l.title} className="relative w-full h-full object-contain" loading="lazy" />
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-1">{l.title}</h3>
                      <p className="text-primary font-bold text-sm mt-1">{l.currency} {l.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">{l.year} · {l.mileage.toLocaleString()} km · {l.transmission}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? "bg-primary border-primary" : "border-border"}`}>
                      {isSelected && <IconCheck size={12} stroke={3} className="text-primary-foreground" />}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="text-center">
        {selected.length >= 2 ? (
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
            <Link to={`/compare?ids=${selected.join(",")}`}>
              Compare ({selected.length}) Selected Vehicles
            </Link>
          </Button>
        ) : (
          <Button disabled className="disabled:opacity-40">
            {selected.length === 0 ? "Select vehicles above to compare" : `Select ${2 - selected.length} more to compare`}
          </Button>
        )}
      </div>
    </section>
  );
}
