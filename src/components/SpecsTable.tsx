import { IconGauge, IconCalendar, IconManualGearbox, IconGasStation, IconPaint, IconCar, IconMapPin, IconEngine, IconCircleCheck, IconClock, IconBolt, IconArmchair } from "@/components/icons";
import { type Listing } from "@/data/mockData";

interface SpecsTableProps {
  listing: Listing;
}

const specs = (l: SpecsTableProps["listing"]) => [
  { icon: IconCar, label: "Make", value: l.make },
  { icon: IconCar, label: "Model", value: l.model },
  { icon: IconCalendar, label: "Year", value: l.year.toString() },
  { icon: IconGauge, label: "Mileage", value: l.mileage > 0 ? `${l.mileage.toLocaleString()} km` : l.condition === "New" ? "0 km (New)" : "N/A" },
  { icon: IconManualGearbox, label: "Transmission", value: l.transmission || "Manual" },
  { icon: IconGasStation, label: "Fuel Type", value: l.fuelType || "Petrol" },
  { icon: IconPaint, label: "Body Type", value: l.bodyType || "Sedan" },
  { icon: IconMapPin, label: "Location", value: l.location },
  ...(l.cc ? [{ icon: IconEngine, label: "Engine", value: `${l.cc}cc` }] : []),
  { icon: l.dutyPaid !== false ? IconCircleCheck : IconClock, label: "Duty Status", value: l.dutyPaid === false ? "Duty Not Paid" : "Duty Paid" },
  ...(l.color ? [{ icon: IconPaint, label: "Color", value: l.color }] : []),
  ...(l.driveType ? [{ icon: IconBolt, label: "Drive Type", value: l.driveType }] : []),
  ...(l.seats ? [{ icon: IconArmchair, label: "Seats", value: l.seats.toString() }] : []),
];

export default function SpecsTable({ listing }: SpecsTableProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Vehicle Specifications</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {specs(listing).map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <s.icon size={14} stroke={2.5} className="text-primary" />
              <span>{s.label}</span>
            </div>
            <div className="font-semibold text-sm">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
