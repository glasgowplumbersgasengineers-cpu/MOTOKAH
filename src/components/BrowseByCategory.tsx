import { IconCar, IconTruck, IconBus, IconMotorbike, IconCrown, IconBolt, IconCurrencyDollar } from "@/components/icons";
import { useNavigate } from "react-router-dom";

const cats = [
  { name: "SUVs & Crossovers", icon: IconTruck, count: 18940, param: "bodyType=SUV" },
  { name: "Sedans", icon: IconCar, count: 12340, param: "bodyType=Sedan" },
  { name: "Hatchbacks", icon: IconCar, count: 8760, param: "bodyType=Hatchback" },
  { name: "Vans & Wagons", icon: IconBus, count: 3420, param: "bodyType=Van" },
  { name: "Commercial Trucks", icon: IconTruck, count: 6890, param: "vehicleType=commercial" },
  { name: "Motorcycles & Bikes", icon: IconMotorbike, count: 15670, param: "vehicleType=bike" },
  { name: "Luxury & Premium", icon: IconCrown, count: 4560, param: "condition=New&minPrice=50000000" },
  { name: "Budget Cars", icon: IconCurrencyDollar, count: 9200, param: "maxPrice=15000000" },
  { name: "Electric Vehicles", icon: IconBolt, count: 2340, param: "q=electric" },
  { name: "Buses & Coaches", icon: IconBus, count: 1230, param: "bodyType=Bus" },
];

export default function BrowseByCategory() {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-2">Browse by Category</h2>
      <p className="text-muted-foreground text-sm mb-6">Find the perfect vehicle type for your needs</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {cats.map(c => (
          <button key={c.name} onClick={() => navigate(`/search?${c.param}`)} className="flex flex-col items-center gap-2 p-5 rounded-xl border border-border bg-card hover:border-primary hover:bg-secondary/50 transition-all group cursor-pointer">
            <c.icon size={48} stroke={3} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-foreground">{c.name}</span>
            <span className="text-xs text-muted-foreground">{c.count.toLocaleString()} listings</span>
          </button>
        ))}
      </div>
    </section>
  );
}
