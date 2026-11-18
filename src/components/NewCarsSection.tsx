import { Link } from "react-router-dom";
import { TOYOTA_NEW_CARS } from "@/data/newCarsToyota";
import { IconArrowRight } from "@/components/icons";

function fmt(tzs: number | null) {
  return tzs ? `TZS ${tzs.toLocaleString()}` : "Contact dealer";
}

// Real new vehicles with real official prices, separate from the used listings
// Motokah actually sells. Links out to the real dealer, not to a Motokah listing.
export default function NewCarsSection() {
  const featured = TOYOTA_NEW_CARS.slice(0, 4);
  return (
    <section className="py-12 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-extrabold text-foreground">New Cars</h2>
          <Link to="/tanzania/new-cars" className="text-sm font-semibold text-primary flex items-center gap-1 shrink-0">
            View all <IconArrowRight size={14} />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Brand new models across East Africa, starting with real official prices in Tanzania.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {featured.map((m) => (
            <Link
              key={m.slug}
              to={`/tanzania/new-cars/toyota/${m.slug}`}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center p-2">
                <img src={m.img} alt={`Toyota ${m.name}`} className="max-w-full max-h-full object-contain" loading="lazy" />
              </div>
              <div className="p-2.5">
                <h3 className="font-bold text-foreground text-xs">Toyota {m.name}</h3>
                <p className="text-xs font-extrabold text-primary mt-1">{fmt(m.priceTzs)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
