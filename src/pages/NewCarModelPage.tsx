import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TOYOTA_NEW_CARS } from "@/data/newCarsToyota";
import { IconChevronRight, IconExternalLink } from "@/components/icons";
import { usePageTitle } from "@/hooks/usePageTitle";

function fmt(tzs: number | null) {
  return tzs ? `TZS ${tzs.toLocaleString()}` : "Contact dealer for price";
}

export default function NewCarModelPage() {
  const { model: slug = "" } = useParams<{ model: string }>();
  const model = TOYOTA_NEW_CARS.find((m) => m.slug === slug.toLowerCase());
  usePageTitle(model ? `Toyota ${model.name}` : "New Car");

  if (!model) return <Navigate to="/new-cars" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Toyota {model.name} Price in Tanzania | Motokah</title>
        <meta
          name="description"
          content={`Toyota ${model.name} official starting price in Tanzania: ${fmt(model.priceTzs)}. Specs and dealer details.`}
        />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <IconChevronRight size={12} />
          <Link to="/new-cars" className="hover:text-primary">New Cars</Link>
          <IconChevronRight size={12} />
          <span className="text-foreground font-medium">Toyota {model.name}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden mb-5">
              <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center p-6">
                <img src={model.img} alt={`Toyota ${model.name}`} className="max-w-full max-h-full object-contain" />
              </div>
            </div>

            <h1 className="text-xl font-extrabold text-foreground mb-1">Toyota {model.name}</h1>
            <p className="text-sm text-muted-foreground mb-5">{model.bodyType}, new, Tanzania</p>

            <h2 className="text-base font-bold text-foreground mb-2">Specifications</h2>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border mb-6">
              {[
                ["Body type", model.bodyType],
                ["Engine", model.engine],
                ["Fuel consumption", model.fuelPer100km],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              These specs and this price come directly from{" "}
              <a href={model.officialUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-medium inline-flex items-center gap-1">
                Toyota Tanzania's own page for the {model.name} <IconExternalLink size={12} />
              </a>. Motokah does not sell new vehicles, this page links you to the real dealer.
            </p>
          </div>

          <aside className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Starting from</p>
              <p className="text-2xl font-extrabold text-primary">{fmt(model.priceTzs)}</p>
              <p className="text-[11px] text-muted-foreground mt-2">
                Excludes registration, insurance and accessories. Confirm with Toyota Tanzania before buying,
                prices can change without notice.
              </p>
            </div>
            <a
              href={model.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-primary text-primary-foreground font-semibold rounded-xl py-3"
            >
              View on Toyota Tanzania
            </a>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
