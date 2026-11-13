import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { type Listing, mockListings } from "@/data/mockData";
import { isRealUuid } from "@/lib/uuid";
import { IconX, IconScale } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";

const defaultImage = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop";

export default function Compare() {
  const [searchParams] = useSearchParams();
  const [ids, setIds] = useState<string[]>([]);
  const [cars, setCars] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  usePageTitle("Compare Vehicles");

  useEffect(() => {
    // Prefer URL params, fall back to localStorage
    const urlIds = searchParams.get("ids");
    const resolvedIds: string[] = urlIds
      ? urlIds.split(",").filter(Boolean)
      : JSON.parse(localStorage.getItem("compareIds") || "[]");

    setIds(resolvedIds);
    if (resolvedIds.length === 0) { setLoading(false); return; }

    const fetchCars = async () => {
      const staticIds = resolvedIds.map(id => id.startsWith("mock-") ? id.replace(/^mock-/, "stock-") : id);

      // Previously: anything not prefixed "stock-" was assumed to be a real
      // Supabase UUID and sent straight to a `.in("id", realIds)` query — but
      // scraped (ig-/jiji-/ib- prefixed) listings never match "stock-" either,
      // so they fell into "realIds" and broke the entire query with a real
      // 400 (22P02 invalid uuid), silently showing "No vehicles selected"
      // even when two were genuinely picked. Found live 2026-11-13, same bug
      // family as SellerCard/reports/wishlist. Fix: check mockListings
      // membership directly instead of guessing from a prefix.
      const fromMock: Listing[] = staticIds
        .map(id => mockListings.find(m => m.id === id))
        .filter((m): m is Listing => Boolean(m));
      const mockIds = new Set(fromMock.map(m => m.id));
      const realIds = staticIds.filter(id => !mockIds.has(id) && isRealUuid(id));

      let fromDB: Listing[] = [];
      if (realIds.length > 0) {
        const { data } = await supabase
          .from("listings")
          .select("*, listing_images(image_url, display_order)")
          .in("id", realIds)
          .eq("status", "approved");

        fromDB = (data || []).map((r) => {
          const images: { image_url: string; display_order: number }[] = r.listing_images || [];
          images.sort((a, b) => a.display_order - b.display_order);
          const image = images[0]?.image_url || defaultImage;
          return {
            id: r.id, title: r.title, price: Number(r.price), currency: r.currency,
            condition: r.condition, year: r.year, mileage: r.mileage || 0,
            transmission: r.transmission || "Manual", location: r.city || "Africa",
            sellerType: "private" as const, sellerListingCount: 1,
            bodyType: r.body_type || undefined, fuelType: r.fuel_type || undefined,
            make: r.make, model: r.model,
          };
        });
      }

      // Preserve original order
      const all = [...fromMock, ...fromDB];
      const ordered = staticIds.map(id => all.find(c => c.id === id)).filter(Boolean) as Listing[];
      setCars(ordered);
      setLoading(false);
    };
    fetchCars();
  }, [searchParams]);

  const remove = (id: string) => {
    const next = ids.filter((i) => i !== id);
    setIds(next);
    setCars(cars.filter(c => c.id !== id));
    localStorage.setItem("compareIds", JSON.stringify(next));
  };

  const specs: { key: keyof Listing; label: string }[] = [
    { key: "year", label: "Year" },
    { key: "mileage", label: "Mileage" },
    { key: "transmission", label: "Transmission" },
    { key: "fuelType", label: "Fuel Type" },
    { key: "bodyType", label: "Body Type" },
    { key: "condition", label: "Condition" },
    { key: "cc", label: "Engine (cc)" },
    { key: "location", label: "Location" },
  ];

  const formatValue = (key: keyof Listing, car: Listing) => {
    if (key === "mileage") return car.mileage > 0 ? `${(car.mileage / 1000).toFixed(0)}k km` : "0 km";
    if (key === "cc") return car.cc ? `${car.cc}cc` : "—";
    return (car[key] as string) || "—";
  };

  // Determine "winner" for numeric fields — best value per row
  const getWinnerId = (key: keyof Listing): string | null => {
    if (cars.length < 2) return null;
    if (key === "price") {
      const min = Math.min(...cars.map(c => c.price));
      const winners = cars.filter(c => c.price === min);
      return winners.length === 1 ? winners[0].id : null;
    }
    if (key === "year") {
      const max = Math.max(...cars.map(c => c.year));
      const winners = cars.filter(c => c.year === max);
      return winners.length === 1 ? winners[0].id : null;
    }
    if (key === "mileage") {
      const vals = cars.map(c => c.mileage).filter(v => v > 0);
      if (!vals.length) return null;
      const min = Math.min(...vals);
      const winners = cars.filter(c => c.mileage === min);
      return winners.length === 1 ? winners[0].id : null;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <IconScale size={24} className="text-primary" /> Compare Vehicles
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />)}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">No vehicles selected for comparison.</p>
            <Link to="/search"><Button>Browse Listings</Button></Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 text-sm font-semibold text-foreground border-b border-border w-32">Feature</th>
                  {cars.map((car) => (
                    <th key={car.id} className="p-3 border-b border-border min-w-[200px]">
                      <div className="relative">
                        <button
                          onClick={() => remove(car.id)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        >
                          <IconX size={12} />
                        </button>
                        <img src={car.image} alt={car.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                        <Link to={`/listing/${car.id}`} className="text-sm font-semibold text-foreground hover:text-primary line-clamp-2">
                          {car.title}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-primary/5">
                  <td className="p-3 text-sm font-semibold text-foreground">Price</td>
                  {cars.map((car) => {
                    const isWinner = getWinnerId("price") === car.id;
                    return (
                      <td key={car.id} className={`p-3 text-sm font-bold ${isWinner ? "text-success" : "text-primary"}`}>
                        {car.currency} {car.price.toLocaleString()}
                        {isWinner && <span className="ml-1.5 text-[10px] bg-success/15 text-success px-1.5 py-0.5 rounded-full font-semibold">Best</span>}
                      </td>
                    );
                  })}
                </tr>
                {specs.map((spec, idx) => {
                  const winnerId = getWinnerId(spec.key);
                  return (
                    <tr key={spec.key} className={`border-b border-border ${idx % 2 === 0 ? "" : "bg-muted/30"}`}>
                      <td className="p-3 text-sm font-semibold text-foreground">{spec.label}</td>
                      {cars.map((car) => {
                        const isWinner = winnerId === car.id;
                        return (
                          <td key={car.id} className={`p-3 text-sm ${isWinner ? "text-success font-semibold" : "text-muted-foreground"}`}>
                            {formatValue(spec.key, car)}
                            {isWinner && <span className="ml-1.5 text-[10px] bg-success/15 text-success px-1.5 py-0.5 rounded-full font-semibold">✓</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
