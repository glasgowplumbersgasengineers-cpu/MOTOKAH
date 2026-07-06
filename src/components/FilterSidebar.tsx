import { IconX } from "@tabler/icons-react";
import { bodyTypes, conditions, transmissions, fuelTypes, carMakes, africanCities, cityToCountry } from "@/data/mockData";

export interface Filters {
  make: string;
  model: string;
  condition: string;
  bodyType: string[];
  transmission: string;
  fuelType: string[];
  yearFrom: string;
  yearTo: string;
  minPrice: string;
  maxPrice: string;
  maxMileage: string;
  city: string;
  country: string;
  vehicleType: "" | "car" | "bike" | "commercial" | "boat" | "spare";
}

export const defaultFilters: Filters = {
  make: "", model: "", condition: "", bodyType: [], transmission: "",
  fuelType: [], yearFrom: "", yearTo: "", minPrice: "", maxPrice: "",
  maxMileage: "", city: "", country: "", vehicleType: "",
};

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
}

const years = Array.from({ length: 27 }, (_, i) => String(2000 + i));
const countries = ["Tanzania", "Kenya", "Uganda", "Rwanda", "Burundi", "Ethiopia", "Nigeria"];
const currencyByCountry: Record<string, string> = {
  Tanzania: "TZS",
  Kenya: "KES",
  Uganda: "UGX",
  Rwanda: "RWF",
  Burundi: "BIF",
  Ethiopia: "ETB",
  Nigeria: "NGN",
};

export default function FilterSidebar({ filters, onChange, onClear }: FilterSidebarProps) {
  const availableCities = filters.country
    ? africanCities.filter((city) => cityToCountry[city] === filters.country)
    : africanCities;

  const update = (key: keyof Filters, value: string | string[] | boolean) => {
    const next = { ...filters, [key]: value };
    if (key === "city" && typeof value === "string") {
      next.country = value ? cityToCountry[value] || "" : next.country;
    }
    if (key === "country" && typeof value === "string") {
      if (next.city && cityToCountry[next.city] !== value) next.city = "";
    }
    onChange(next);
  };

  const toggleArray = (key: "bodyType" | "fuelType", value: string) => {
    const arr = filters[key];
    update(key, arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filters</h3>
        <button onClick={onClear} className="text-xs text-primary hover:underline">Clear All</button>
      </div>

      {/* Vehicle Type */}
      <div>
        <label className="text-sm font-medium mb-1 block">Vehicle Type</label>
        <select value={filters.vehicleType} onChange={e => update("vehicleType", e.target.value)}
          className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
          <option value="">All Types</option>
          <option value="car">Cars</option>
          <option value="bike">Motorcycles</option>
          <option value="commercial">Commercial</option>
          <option value="boat">Boats</option>
        </select>
      </div>

      {/* Make */}
      <div>
        <label className="text-sm font-medium mb-1 block">Make</label>
        <select value={filters.make} onChange={e => update("make", e.target.value)}
          className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
          <option value="">All Makes</option>
          {carMakes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="text-sm font-medium mb-1 block">Condition</label>
        <select value={filters.condition} onChange={e => update("condition", e.target.value)}
          className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
          <option value="">All</option>
          {conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium mb-1 block">Price Range ({currencyByCountry[filters.country] || "local currency"})</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => update("minPrice", e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm" />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => update("maxPrice", e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm" />
        </div>
      </div>

      {/* Body Type */}
      <div>
        <label className="text-sm font-medium mb-2 block">Body Type</label>
        <div className="space-y-1.5">
          {bodyTypes.map(bt => (
            <label key={bt} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={filters.bodyType.includes(bt)}
                onChange={() => toggleArray("bodyType", bt)}
                className="rounded border-input" />
              {bt}
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="text-sm font-medium mb-1 block">Transmission</label>
        <select value={filters.transmission} onChange={e => update("transmission", e.target.value)}
          className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
          <option value="">All</option>
          {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="text-sm font-medium mb-2 block">Fuel Type</label>
        <div className="space-y-1.5">
          {fuelTypes.map(ft => (
            <label key={ft} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={filters.fuelType.includes(ft)}
                onChange={() => toggleArray("fuelType", ft)}
                className="rounded border-input" />
              {ft}
            </label>
          ))}
        </div>
      </div>

      {/* Year Range */}
      <div>
        <label className="text-sm font-medium mb-1 block">Year</label>
        <div className="flex gap-2">
          <select value={filters.yearFrom} onChange={e => update("yearFrom", e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
            <option value="">From</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={filters.yearTo} onChange={e => update("yearTo", e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
            <option value="">To</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Max Mileage */}
      <div>
        <label className="text-sm font-medium mb-1 block">Max Mileage (km)</label>
        <input type="number" placeholder="e.g. 50000" value={filters.maxMileage} onChange={e => update("maxMileage", e.target.value)}
          className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm" />
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-medium mb-1 block">Country</label>
        <select value={filters.country} onChange={e => update("country", e.target.value)}
          className="mb-2 w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
          <option value="">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="text-sm font-medium mb-1 block">City</label>
        <select value={filters.city} onChange={e => update("city", e.target.value)}
          className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
          <option value="">All Cities</option>
          {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

    </div>
  );
}
