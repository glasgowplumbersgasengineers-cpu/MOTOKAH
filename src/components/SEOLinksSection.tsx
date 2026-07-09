import { Link } from "react-router-dom";

const cityLinks = [
  { label: "Used cars in Dar es Salaam", to: "/city/dar-es-salaam" },
  { label: "Used cars in Arusha", to: "/city/arusha" },
  { label: "Used cars in Mwanza", to: "/city/mwanza" },
  { label: "Used cars in Dodoma", to: "/city/dodoma" },
  { label: "Used cars in Nairobi", to: "/city/nairobi" },
  { label: "Used cars in Mombasa", to: "/city/mombasa" },
  { label: "Used cars in Kampala", to: "/city/kampala" },
  { label: "Used cars in Kigali", to: "/city/kigali" },
];

const modelLinks = [
  { label: "Toyota Harrier Tanzania", to: "/search?make=Toyota&model=Harrier&country=Tanzania" },
  { label: "Toyota Land Cruiser Tanzania", to: "/search?make=Toyota&model=Land%20Cruiser&country=Tanzania" },
  { label: "Toyota Hilux Tanzania", to: "/search?make=Toyota&model=Hilux&country=Tanzania" },
  { label: "Toyota Prado Tanzania", to: "/search?make=Toyota&model=Prado&country=Tanzania" },
  { label: "Mazda Demio Tanzania", to: "/search?make=Mazda&model=Demio&country=Tanzania" },
  { label: "Subaru Forester Kenya", to: "/search?make=Subaru&model=Forester&country=Kenya" },
  { label: "Toyota Probox Kenya", to: "/search?make=Toyota&model=Probox&country=Kenya" },
  { label: "Honda Vezel Kenya", to: "/search?make=Honda&model=Vezel&country=Kenya" },
];

const categoryLinks = [
  { label: "Cars for sale in Tanzania", to: "/country/tanzania" },
  { label: "New cars in Tanzania", to: "/search?country=Tanzania&condition=New" },
  { label: "SUVs in Tanzania", to: "/search?country=Tanzania&bodyType=SUV" },
  { label: "Pickup trucks in Tanzania", to: "/search?country=Tanzania&bodyType=Pickup" },
  { label: "Commercial vehicles in Tanzania", to: "/search?country=Tanzania&vehicleType=commercial" },
  { label: "Bikes in Tanzania", to: "/search?country=Tanzania&vehicleType=bike" },
  { label: "Boats in Tanzania", to: "/search?country=Tanzania&vehicleType=boat" },
  { label: "Cars for sale in Kenya", to: "/country/kenya" },
];

function LinkGroup({ title, links }: { title: string; links: Array<{ label: string; to: string }> }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SEOLinksSection() {
  return (
    <section className="border-b border-border bg-secondary/20 py-10">
      <div className="container mx-auto space-y-8 px-4">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-extrabold text-foreground">Find Used Cars Across Tanzania and East Africa</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Browse launch-quality dealer stock by city, country, body style and popular Japanese import models.
            Motokah focuses first on Tanzania, then Kenya, Uganda, Rwanda and nearby East African markets.
          </p>
        </div>
        <LinkGroup title="Top Cities" links={cityLinks} />
        <LinkGroup title="Popular Searches" links={categoryLinks} />
        <LinkGroup title="Model Searches" links={modelLinks} />
      </div>
    </section>
  );
}
