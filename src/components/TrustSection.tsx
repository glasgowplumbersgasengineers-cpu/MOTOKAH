import { IconBrandWhatsapp, IconShieldCheck, IconInfoCircle, IconSearch } from "@tabler/icons-react";

const trustItems = [
  { icon: IconBrandWhatsapp, title: "Direct Seller Contact", desc: "Call or WhatsApp sellers from the listing page", stat: "No middleman" },
  { icon: IconShieldCheck, title: "Dealer-Focused Listings", desc: "Browse reachable showrooms with cleaner vehicle data and direct seller contacts", stat: "Quality first" },
  { icon: IconInfoCircle, title: "Clear Listing Details", desc: "Photos, location, specs and seller details are kept together for faster checks", stat: "Easy to compare" },
  { icon: IconSearch, title: "Inspect Before Buying", desc: "Use trusted mechanics and original documents before paying any seller", stat: "Buyer safety" },
];

export default function TrustSection() {
  return (
    <section className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center mb-8">Why Trust Motokah?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trustItems.map(item => (
          <div key={item.title} className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
            <item.icon size={40} stroke={2.5} className="text-primary mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
            <span className="text-sm font-semibold text-primary">{item.stat}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
