import { IconSearch, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { carMakes, bodyTypes, conditions, transmissions, africanCities, bikeMakes, bikeTypes, ccRanges, commercialTypes, cityToCountry } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "@/contexts/LocationContext";
import { getSearchSuggestions } from "@/lib/searchSuggestions";

const selectCls = "h-10 rounded-md border border-input bg-surface-3 px-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors w-full";
const years = Array.from({ length: 27 }, (_, i) => String(2000 + i));

type Tab = "cars" | "commercial" | "bikes";

export default function HeroSearch() {
  const navigate = useNavigate();
  const { country, city } = useLocation();
  const [tab, setTab] = useState<Tab>("cars");
  const [advanced, setAdvanced] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [carF, setCarF] = useState({ make: "", bodyType: "", condition: "", transmission: "", city: "", minPrice: "", maxPrice: "", maxMileage: "" });
  const [bikeF, setBikeF] = useState({ make: "", type: "", cc: "", condition: "", yearFrom: "", yearTo: "", city: "", maxPrice: "" });
  const [comF, setComF] = useState({ vehicleType: "", make: "", condition: "", yearFrom: "", yearTo: "", city: "", maxPrice: "" });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = getSearchSuggestions(keyword);

  const handleSearch = (overrideKeyword?: string) => {
    const p = new URLSearchParams();
    const term = (overrideKeyword !== undefined ? overrideKeyword : keyword).trim();
    if (term) p.set("q", term);
    const applyDefaultLocation = () => {
      if (city) {
        p.set("city", city);
        const cc = cityToCountry[city];
        if (cc) p.set("country", cc);
      } else if (country !== "All") {
        p.set("country", country);
      }
    };
    if (tab === "cars") {
      if (carF.make) p.set("make", carF.make);
      if (carF.bodyType) p.set("bodyType", carF.bodyType);
      if (carF.condition) p.set("condition", carF.condition);
      if (carF.transmission) p.set("transmission", carF.transmission);
      if (carF.city) { p.set("city", carF.city); const cc = cityToCountry[carF.city]; if (cc) p.set("country", cc); }
      if (carF.minPrice) p.set("minPrice", carF.minPrice);
      if (carF.maxPrice) p.set("maxPrice", carF.maxPrice);
      if (carF.maxMileage) p.set("maxMileage", carF.maxMileage);
      if (!carF.city) applyDefaultLocation();
    } else if (tab === "bikes") {
      p.set("vehicleType", "bike");
      if (bikeF.make) p.set("make", bikeF.make);
      if (bikeF.type) p.set("bodyType", bikeF.type);
      if (bikeF.cc) p.set("cc", bikeF.cc);
      if (bikeF.condition) p.set("condition", bikeF.condition);
      if (bikeF.city) { p.set("city", bikeF.city); const cc = cityToCountry[bikeF.city]; if (cc) p.set("country", cc); }
      if (!bikeF.city) applyDefaultLocation();
    } else {
      p.set("vehicleType", "commercial");
      if (comF.vehicleType) p.set("bodyType", comF.vehicleType);
      if (comF.make) p.set("make", comF.make);
      if (comF.condition) p.set("condition", comF.condition);
      if (comF.city) { p.set("city", comF.city); const cc = cityToCountry[comF.city]; if (cc) p.set("country", cc); }
      if (!comF.city) applyDefaultLocation();
    }
    navigate(`/search?${p.toString()}`);
  };

  const tabLabel = tab === "cars" ? "used cars" : tab === "bikes" ? "bikes" : "commercial vehicles";
  const heroLocation = city || (country !== "All" ? country : "East Africa");

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-1 via-surface-2 to-surface-1" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=800&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight">
            Find Used Cars in <span className="text-primary">{heroLocation}</span>
          </h1>
        </div>

        <div className="max-w-3xl mx-auto bg-card/95 backdrop-blur border border-border rounded-xl shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {(["cars", "commercial", "bikes"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                  tab === t
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "commercial" ? "Commercial" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Main search bar */}
          <div className="p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={`Search ${tabLabel}...`}
                  value={keyword}
                  onChange={e => {
                    setKeyword(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      setShowSuggestions(false);
                      handleSearch();
                    }
                  }}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-border/50 max-h-64 overflow-y-auto">
                    {suggestions.map((s) => (
                      <button
                        key={s.text}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setKeyword(s.text);
                          setShowSuggestions(false);
                          handleSearch(s.text);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-secondary/70 transition-colors"
                      >
                        <span className="font-medium text-foreground flex items-center gap-2">
                          <IconSearch size={14} className="text-muted-foreground" />
                          {s.text}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                          {s.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleSearch} className="h-11 px-6 bg-primary text-primary-foreground font-bold">
                Search
              </Button>
            </div>

            {/* Advanced search toggle */}
            <button
              onClick={() => setAdvanced(a => !a)}
              className="flex items-center gap-1 mt-2 text-xs text-primary hover:underline"
            >
              {advanced ? <IconChevronUp size={13} /> : <IconChevronDown size={13} />}
              Advanced search
            </button>

            {/* Advanced filters */}
            {advanced && (
              <div className="mt-3 pt-3 border-t border-border">
                {tab === "cars" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <select value={carF.make} onChange={e => setCarF(f => ({...f, make: e.target.value}))} className={selectCls}>
                      <option value="">Make / Brand</option>
                      {carMakes.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={carF.bodyType} onChange={e => setCarF(f => ({...f, bodyType: e.target.value}))} className={selectCls}>
                      <option value="">Body Type</option>
                      {bodyTypes.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={carF.condition} onChange={e => setCarF(f => ({...f, condition: e.target.value}))} className={selectCls}>
                      <option value="">Condition</option>
                      {conditions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={carF.transmission} onChange={e => setCarF(f => ({...f, transmission: e.target.value}))} className={selectCls}>
                      <option value="">Transmission</option>
                      {transmissions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={carF.city} onChange={e => setCarF(f => ({...f, city: e.target.value}))} className={selectCls}>
                      <option value="">Location</option>
                      {africanCities.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <input type="number" placeholder="Min Price (TZS)" value={carF.minPrice} onChange={e => setCarF(f => ({...f, minPrice: e.target.value}))} className={selectCls} />
                    <input type="number" placeholder="Max Price (TZS)" value={carF.maxPrice} onChange={e => setCarF(f => ({...f, maxPrice: e.target.value}))} className={selectCls} />
                    <input type="number" placeholder="Max Mileage (km)" value={carF.maxMileage} onChange={e => setCarF(f => ({...f, maxMileage: e.target.value}))} className={selectCls} />
                  </div>
                )}
                {tab === "bikes" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <select value={bikeF.make} onChange={e => setBikeF(f => ({...f, make: e.target.value}))} className={selectCls}>
                      <option value="">Make</option>
                      {bikeMakes.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={bikeF.type} onChange={e => setBikeF(f => ({...f, type: e.target.value}))} className={selectCls}>
                      <option value="">Type</option>
                      {bikeTypes.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={bikeF.cc} onChange={e => setBikeF(f => ({...f, cc: e.target.value}))} className={selectCls}>
                      <option value="">Engine CC</option>
                      {ccRanges.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={bikeF.condition} onChange={e => setBikeF(f => ({...f, condition: e.target.value}))} className={selectCls}>
                      <option value="">Condition</option>
                      {conditions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={bikeF.city} onChange={e => setBikeF(f => ({...f, city: e.target.value}))} className={selectCls}>
                      <option value="">Location</option>
                      {africanCities.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <input type="number" placeholder="Max Price" value={bikeF.maxPrice} onChange={e => setBikeF(f => ({...f, maxPrice: e.target.value}))} className={selectCls} />
                  </div>
                )}
                {tab === "commercial" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <select value={comF.vehicleType} onChange={e => setComF(f => ({...f, vehicleType: e.target.value}))} className={selectCls}>
                      <option value="">Vehicle Type</option>
                      {commercialTypes.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={comF.make} onChange={e => setComF(f => ({...f, make: e.target.value}))} className={selectCls}>
                      <option value="">Make</option>
                      {carMakes.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={comF.condition} onChange={e => setComF(f => ({...f, condition: e.target.value}))} className={selectCls}>
                      <option value="">Condition</option>
                      {conditions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={comF.city} onChange={e => setComF(f => ({...f, city: e.target.value}))} className={selectCls}>
                      <option value="">Location</option>
                      {africanCities.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <input type="number" placeholder="Max Price" value={comF.maxPrice} onChange={e => setComF(f => ({...f, maxPrice: e.target.value}))} className={selectCls} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
