import { Link } from "react-router-dom";
import {
  cityModelLinks,
  priorityCategoryLinks,
  priorityCityLinks,
  priorityCountryLinks,
  priorityDealerLinks,
  priorityModelLinks,
} from "@/data/seoLandingLinks";

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
        <LinkGroup title="Top Countries" links={priorityCountryLinks} />
        <LinkGroup title="Top Cities" links={priorityCityLinks} />
        <LinkGroup title="Popular Searches" links={priorityCategoryLinks} />
        <LinkGroup title="Model Searches" links={priorityModelLinks} />
        <LinkGroup title="City + Model Searches" links={cityModelLinks} />
        <LinkGroup title="Dealer Pages" links={priorityDealerLinks} />
      </div>
    </section>
  );
}
