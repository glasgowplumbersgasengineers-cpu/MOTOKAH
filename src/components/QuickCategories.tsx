import { IconCar, IconTruck, IconBus, IconMotorbike, IconCrown, IconBolt, IconLayoutGrid, IconSailboat } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const staticCategories = [
  { name: "Cars", icon: IconCar, query: "?vehicleType=car" },
  { name: "SUVs & Crossovers", icon: IconTruck, query: "?bodyType=SUV" },
  { name: "Sedans", icon: IconCar, query: "?bodyType=Sedan" },
  { name: "Hatchbacks", icon: IconCar, query: "?bodyType=Hatchback" },
  { name: "Vans & Wagons", icon: IconBus, query: "?bodyType=Van" },
  { name: "Bikes & Motorcycles", icon: IconMotorbike, query: "?vehicleType=bike" },
  { name: "Commercial Vehicles", icon: IconTruck, query: "?vehicleType=commercial" },
  { name: "Boats & Marine", icon: IconSailboat, query: "?vehicleType=boat" },
  { name: "Luxury & Sports", icon: IconCrown, query: "?bodyType=Coupe" },
  { name: "Electric Vehicles", icon: IconBolt, query: "?fuelType=Electric" },
  { name: "View All", icon: IconLayoutGrid, query: "" },
];

export default function QuickCategories() {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {staticCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => navigate(`/search${cat.query}`)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary hover:scale-[1.02] transition-all duration-200 group"
          >
            <cat.icon size={48} stroke={3} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-foreground">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
