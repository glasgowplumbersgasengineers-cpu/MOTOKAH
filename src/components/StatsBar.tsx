import { IconCar, IconUsers, IconMapPin, IconShieldCheck } from "@/components/icons";

const stats = [
  { icon: IconCar, value: "Fresh", label: "Dealer Listings" },
  { icon: IconUsers, value: "Direct", label: "Seller Contact" },
  { icon: IconMapPin, value: "Local", label: "City Browsing" },
  { icon: IconShieldCheck, value: "Clean", label: "Launch Inventory" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-border bg-surface-2 py-8">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="flex items-center gap-3 justify-center">
            <s.icon size={32} stroke={2.5} className="text-primary" />
            <div>
              <span className="text-xl font-extrabold text-foreground">{s.value}</span>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
