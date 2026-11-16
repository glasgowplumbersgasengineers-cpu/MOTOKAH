import { Link } from "react-router-dom";
import { IconMapPin } from "@/components/icons";

const locations = [
  { city: "Dar es Salaam", country: "Tanzania" },
  { city: "Arusha", country: "Tanzania" },
  { city: "Mwanza", country: "Tanzania" },
  { city: "Nairobi", country: "Kenya" },
  { city: "Mombasa", country: "Kenya" },
  { city: "Kampala", country: "Uganda" },
  { city: "Kigali", country: "Rwanda" },
  { city: "Addis Ababa", country: "Ethiopia" },
  { city: "Lagos", country: "Nigeria" },
  { city: "Abuja", country: "Nigeria" },
];

function citySlug(city: string) {
  return city.toLowerCase().replace(/\s+/g, "-");
}

export default function LocationSection() {
  return (
    <section className="py-12 bg-secondary/20 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <IconMapPin size={22} className="text-primary" />
          <h2 className="text-2xl font-bold">Browse by Location</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {locations.map((loc) => (
            <Link
              key={loc.city}
              to={`/city/${citySlug(loc.city)}`}
              className="group p-4 bg-card border border-border rounded-xl hover:border-primary hover:shadow-md transition-all"
            >
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {loc.city}
              </div>
              <div className="text-xs text-muted-foreground">{loc.country}</div>
              <div className="text-xs font-medium text-primary mt-1">Browse cars</div>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Tanzania", "Kenya", "Uganda", "Rwanda", "Ethiopia", "Nigeria", "Burundi"].map((c) => (
            <Link
              key={c}
              to={`/country/${c.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-4 py-2 bg-card border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
            >
              {c}
            </Link>
          ))}
          <Link
            to="/search"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            View All Africa
          </Link>
        </div>
      </div>
    </section>
  );
}
