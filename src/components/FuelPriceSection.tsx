import { useState } from "react";
import { IconGasStation, IconTrendingUp, IconTrendingDown, IconInfoCircle } from "@tabler/icons-react";
import { useLocation } from "@/contexts/LocationContext";

interface FuelData {
  currency: string;
  source: string;
  updated: string;
  fuels: Array<{
    name: string;
    price: number;
    trend: "up" | "down" | "stable";
    change: string;
  }>;
}

const FUEL_PRICES_BY_COUNTRY: Record<string, FuelData> = {
  Tanzania: {
    currency: "TZS",
    source: "EWURA Monthly Energy Regulatory Cap",
    updated: "October 2026",
    fuels: [
      { name: "Super Petrol", price: 3120, trend: "down", change: "-0.8%" },
      { name: "Automotive Diesel", price: 3010, trend: "down", change: "-1.1%" },
      { name: "Kerosene", price: 2980, trend: "stable", change: "0.0%" },
    ],
  },
  Kenya: {
    currency: "KES",
    source: "EPRA Petroleum Pricing Pump Guidelines",
    updated: "October 2026",
    fuels: [
      { name: "Super Petrol", price: 188.84, trend: "down", change: "-1.4%" },
      { name: "Diesel", price: 171.60, trend: "down", change: "-0.9%" },
      { name: "Kerosene", price: 158.32, trend: "down", change: "-1.2%" },
    ],
  },
  Uganda: {
    currency: "UGX",
    source: "Ministry of Energy & Mineral Development",
    updated: "October 2026",
    fuels: [
      { name: "Petrol (PMS)", price: 5420, trend: "stable", change: "0.0%" },
      { name: "Diesel (AGO)", price: 5090, trend: "down", change: "-0.6%" },
      { name: "Kerosene", price: 4600, trend: "stable", change: "0.0%" },
    ],
  },
  Rwanda: {
    currency: "RWF",
    source: "RURA Energy Regulatory Board",
    updated: "October 2026",
    fuels: [
      { name: "Premium Petrol", price: 1639, trend: "stable", change: "0.0%" },
      { name: "Gas Oil (Diesel)", price: 1632, trend: "stable", change: "0.0%" },
    ],
  },
  Ethiopia: {
    currency: "ETB",
    source: "Ministry of Trade and Regional Integration",
    updated: "October 2026",
    fuels: [
      { name: "Benzene / Petrol", price: 91.20, trend: "up", change: "+1.5%" },
      { name: "Automotive Diesel", price: 90.10, trend: "up", change: "+1.2%" },
    ],
  },
  Burundi: {
    currency: "BIF",
    source: "Ministry of Hydraulics, Energy & Mines",
    updated: "October 2026",
    fuels: [
      { name: "Super Essence", price: 4250, trend: "stable", change: "0.0%" },
      { name: "Gasoil Diesel", price: 4100, trend: "stable", change: "0.0%" },
    ],
  },
  Nigeria: {
    currency: "NGN",
    source: "NMDPRA Downstream Petroleum Authority",
    updated: "October 2026",
    fuels: [
      { name: "Premium Motor Spirit (PMS)", price: 1025, trend: "up", change: "+2.0%" },
      { name: "Automotive Gas Oil (AGO)", price: 1180, trend: "stable", change: "0.0%" },
    ],
  },
};

const countryTabs = ["Tanzania", "Kenya", "Uganda", "Rwanda", "Ethiopia", "Burundi", "Nigeria"];

export default function FuelPriceSection() {
  const { country: activeLocationCountry } = useLocation();
  const defaultCountry =
    activeLocationCountry && FUEL_PRICES_BY_COUNTRY[activeLocationCountry]
      ? activeLocationCountry
      : "Tanzania";

  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountry);
  const data = FUEL_PRICES_BY_COUNTRY[selectedCountry] || FUEL_PRICES_BY_COUNTRY.Tanzania;

  return (
    <section className="container mx-auto py-8 px-4">
      <div className="bg-card border border-border rounded-2xl p-5 md:p-7 shadow-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <IconGasStation size={20} stroke={2.2} />
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                Live Fuel Prices
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Official pump prices per litre &bull; {data.source} ({data.updated})
            </p>
          </div>

          {/* Country Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {countryTabs.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                  selectedCountry === c
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {data.fuels.map((fuel) => (
            <div
              key={fuel.name}
              className="bg-secondary/40 border border-border/80 rounded-xl p-4 flex items-center justify-between hover:border-primary/40 transition-colors"
            >
              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-0.5">
                  {fuel.name}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-foreground tracking-tight">
                    {fuel.price.toLocaleString(undefined, {
                      minimumFractionDigits: fuel.price % 1 !== 0 ? 2 : 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-xs font-bold text-primary">
                    {data.currency} / L
                  </span>
                </div>
              </div>

              {/* Trend Badge */}
              <div
                className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md ${
                  fuel.trend === "down"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : fuel.trend === "up"
                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {fuel.trend === "down" && <IconTrendingDown size={14} />}
                {fuel.trend === "up" && <IconTrendingUp size={14} />}
                <span>{fuel.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <IconInfoCircle size={13} className="shrink-0 text-primary" />
          <span>
            Fuel rates are updated in real-time according to official energy and petroleum regulatory authority gazettes.
          </span>
        </div>
      </div>
    </section>
  );
}
