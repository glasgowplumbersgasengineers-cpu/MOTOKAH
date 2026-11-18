import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TOYOTA_NEW_CARS } from "@/data/newCarsToyota";
import { usePageTitle } from "@/hooks/usePageTitle";

function fmt(tzs: number | null) {
  return tzs ? `TZS ${tzs.toLocaleString()}` : "Contact dealer for price";
}

export default function NewCars() {
  usePageTitle("New Cars");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>New Cars in Tanzania | Motokah</title>
        <meta
          name="description"
          content="Brand new Toyota models and their official starting prices in Tanzania, straight from Toyota Tanzania's own showroom."
        />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-6 flex-1">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">New Cars</h1>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
          Brand new Toyota models and their official starting prices, taken straight from Toyota
          Tanzania's own showroom. These are new vehicle prices, not Motokah listings, prices exclude
          registration, insurance and accessories and can change without notice. Confirm with Toyota
          Tanzania or an authorized dealer before buying.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {TOYOTA_NEW_CARS.map((m) => (
            <Link
              key={m.slug}
              to={`/new-cars/toyota/${m.slug}`}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center p-2">
                <img src={m.img} alt={`Toyota ${m.name}`} className="max-w-full max-h-full object-contain" loading="lazy" />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-foreground text-sm">Toyota {m.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{m.bodyType}</p>
                <p className="text-sm font-extrabold text-primary mt-1.5">{fmt(m.priceTzs)}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Looking for a used car instead?{" "}
          <Link to="/search" className="text-primary font-medium">Browse used listings on Motokah</Link>.
        </p>
      </div>
      <Footer />
    </div>
  );
}
