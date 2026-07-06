import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocation as useLocationCtx } from "@/contexts/LocationContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import FilterSidebar, { type Filters, defaultFilters } from "@/components/FilterSidebar";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";
import { useSearchListings, type SearchFilters, type SortOption } from "@/hooks/useSearchListings";
import { IconFilter, IconX, IconSortDescending, IconSearch, IconLoader2, IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Helmet } from "react-helmet-async";
import { cityToCountry } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sanitizeCalloutPricingText } from "@/lib/seoText";
import { jsonLdScript, breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/structuredData";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { country: locationCountry } = useLocationCtx();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("newest");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saving, setSaving] = useState(false);

  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const urlCity = searchParams.get("city") || "";
  const urlCityCountry = urlCity ? cityToCountry[urlCity] || "" : "";
  const urlCountry = urlCityCountry || searchParams.get("country") || "";

  // Dynamic SEO title/desc/canonical from URL params
  const seoMake = searchParams.get("make") || "";
  const seoCondition = searchParams.get("condition") || "";
  const seoCity = urlCity;
  const seoCountry = urlCountry;
  const seoVehicleType = searchParams.get("vehicleType") || "";
  const location = seoCity || seoCountry;
  const urlBodyTypes = searchParams.getAll("bodyType").length > 0
    ? searchParams.getAll("bodyType")
    : (searchParams.get("bodyType") ? [searchParams.get("bodyType")!] : []);
  const primaryBodyType = urlBodyTypes[0] || "";
  const vehicleLabel = seoVehicleType === "bike"
    ? "Bikes"
    : seoVehicleType === "commercial"
    ? "Commercial Vehicles"
    : seoVehicleType === "boat"
    ? "Boats"
    : primaryBodyType
    ? `${primaryBodyType}s`
    : seoCondition === "New"
    ? "New Cars"
    : "Cars";
  const rawSeoTitle = seoMake && location
    ? `${seoMake} ${vehicleLabel} for Sale in ${location} | Motokah`
    : seoMake
    ? `${seoMake} ${vehicleLabel} for Sale in East Africa | Motokah`
    : location
    ? `${vehicleLabel} for Sale in ${location} | Motokah`
    : `Search ${vehicleLabel} for Sale in East Africa | Motokah`;
  const rawSeoDesc = seoMake && location
    ? `Buy ${seoMake} ${vehicleLabel.toLowerCase()} in ${location}. Browse dealer and private listings on Motokah.`
    : seoMake
    ? `Find ${seoMake} ${vehicleLabel.toLowerCase()} for sale across East Africa. Compare prices, check mileage and contact sellers on Motokah.`
    : location
    ? `Browse ${vehicleLabel.toLowerCase()} for sale in ${location}. Find dealer and private listings with photos, specs and seller contact details.`
    : `Search ${vehicleLabel.toLowerCase()} for sale across Kenya, Tanzania, Uganda, Rwanda and East Africa on Motokah.`;
  const seoTitle = sanitizeCalloutPricingText(rawSeoTitle);
  const seoDesc = sanitizeCalloutPricingText(rawSeoDesc);
  const canonicalParams = new URLSearchParams();
  if (seoMake) canonicalParams.set("make", seoMake);
  if (seoCity) canonicalParams.set("city", seoCity);
  if (seoCountry) canonicalParams.set("country", seoCountry);
  if (seoCondition) canonicalParams.set("condition", seoCondition);
  if (seoVehicleType) canonicalParams.set("vehicleType", seoVehicleType);
  urlBodyTypes.forEach((bodyType) => canonicalParams.append("bodyType", bodyType));
  const seoCanonical = `https://www.motokah.com/search${canonicalParams.toString() ? "?" + canonicalParams.toString() : ""}`;
  const isBoatCategoryUrl = urlBodyTypes.includes("Boat");
  const hasExplicitLocationFilter = searchParams.has("country") || searchParams.has("city");

  const filtersFromUrl = (): Filters => ({
    ...defaultFilters,
    make: searchParams.get("make") || "",
    condition: searchParams.get("condition") || "",
    city: urlCity,
    country: urlCountry
      || (isBoatCategoryUrl ? "" : (locationCountry !== "All" ? locationCountry : "")),
    bodyType: urlBodyTypes,
    transmission: searchParams.get("transmission") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    yearFrom: searchParams.get("yearFrom") || "",
    yearTo: searchParams.get("yearTo") || "",
    maxMileage: searchParams.get("maxMileage") || "",
    fuelType: searchParams.getAll("fuelType"),
    vehicleType: (searchParams.get("vehicleType") as "car" | "bike" | "commercial" | "boat" | "spare") || "",
  });

  const [filters, setFilters] = useState<Filters>(() => filtersFromUrl());

  // Search can be reached repeatedly with different query params from nav, footer,
  // wishlist, and chips. Keep UI state owned by the URL so filters never get stuck.
  useEffect(() => {
    setKeyword(searchParams.get("q") || "");
    setFilters(filtersFromUrl());
    setPage(1);
  }, [searchParams.toString(), locationCountry]);

  useEffect(() => {
    if (!urlCity || !urlCityCountry || searchParams.get("country") === urlCityCountry) return;
    const params = new URLSearchParams(searchParams);
    params.set("country", urlCityCountry);
    setSearchParams(params, { replace: true });
  }, [urlCity, urlCityCountry, searchParams, setSearchParams]);

  // Sync URL params when filters change
  const updateFilters = (newFilters: Filters) => {
    const normalizedFilters = { ...newFilters };
    if (normalizedFilters.city) {
      normalizedFilters.country = cityToCountry[normalizedFilters.city] || normalizedFilters.country;
    }
    if (normalizedFilters.country && normalizedFilters.city && cityToCountry[normalizedFilters.city] !== normalizedFilters.country) {
      normalizedFilters.city = "";
    }
    setFilters(normalizedFilters);
    setPage(1);
    
    // Update URL to reflect current filters
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (normalizedFilters.make) params.set("make", normalizedFilters.make);
    if (normalizedFilters.condition) params.set("condition", normalizedFilters.condition);
    if (normalizedFilters.city) params.set("city", normalizedFilters.city);
    if (normalizedFilters.country) params.set("country", normalizedFilters.country);
    if (normalizedFilters.transmission) params.set("transmission", normalizedFilters.transmission);
    if (normalizedFilters.vehicleType) params.set("vehicleType", normalizedFilters.vehicleType);
    if (normalizedFilters.minPrice) params.set("minPrice", normalizedFilters.minPrice);
    if (normalizedFilters.maxPrice) params.set("maxPrice", normalizedFilters.maxPrice);
    if (normalizedFilters.yearFrom) params.set("yearFrom", normalizedFilters.yearFrom);
    if (normalizedFilters.yearTo) params.set("yearTo", normalizedFilters.yearTo);
    if (normalizedFilters.maxMileage) params.set("maxMileage", normalizedFilters.maxMileage);
    normalizedFilters.bodyType.forEach(bt => params.append("bodyType", bt));
    normalizedFilters.fuelType.forEach(ft => params.append("fuelType", ft));
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    const resetCountry = locationCountry !== "All" ? locationCountry : "";
    setFilters({ ...defaultFilters, country: resetCountry });
    setKeyword("");
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  // Convert Filters to SearchFilters for the hook
  const searchFilters: SearchFilters = useMemo(() => ({
    q: keyword.trim() || undefined,
    make: filters.make || undefined,
    condition: filters.condition || undefined,
    transmission: filters.transmission || undefined,
    city: filters.city || undefined,
    country: filters.country || undefined,
    bodyType: filters.bodyType.length > 0 ? filters.bodyType : undefined,
    fuelType: filters.fuelType.length > 0 ? filters.fuelType : undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    yearFrom: filters.yearFrom || undefined,
    yearTo: filters.yearTo || undefined,
    maxMileage: filters.maxMileage || undefined,
    vehicleType: filters.vehicleType || undefined,
  }), [filters, keyword]);

  const { listings: filtered, loading } = useSearchListings(searchFilters, sort);

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    if (filters.make) chips.push({ key: "make", label: filters.make });
    if (filters.condition) chips.push({ key: "condition", label: filters.condition });
    if (filters.transmission) chips.push({ key: "transmission", label: filters.transmission });
    if (filters.city) chips.push({ key: "city", label: `${filters.city}${filters.country ? `, ${filters.country}` : ""}` });
    else if (filters.country && hasExplicitLocationFilter) chips.push({ key: "country", label: filters.country });
    if (filters.vehicleType) chips.push({ key: "vehicleType", label: filters.vehicleType.charAt(0).toUpperCase() + filters.vehicleType.slice(1) });
    filters.bodyType.forEach(bt => chips.push({ key: `bodyType-${bt}`, label: bt }));
    filters.fuelType.forEach(ft => chips.push({ key: `fuelType-${ft}`, label: ft }));
    if (filters.minPrice) chips.push({ key: "minPrice", label: `Min: ${Number(filters.minPrice).toLocaleString()}` });
    if (filters.maxPrice) chips.push({ key: "maxPrice", label: `Max: ${Number(filters.maxPrice).toLocaleString()}` });
    if (filters.yearFrom) chips.push({ key: "yearFrom", label: `From ${filters.yearFrom}` });
    if (filters.yearTo) chips.push({ key: "yearTo", label: `To ${filters.yearTo}` });
    if (filters.maxMileage) chips.push({ key: "maxMileage", label: `≤${Number(filters.maxMileage).toLocaleString()} km` });
    return chips;
  }, [filters, hasExplicitLocationFilter]);

  const removeChip = (key: string) => {
    let newFilters;
    if (key.startsWith("bodyType-")) {
      const val = key.replace("bodyType-", "");
      newFilters = { ...filters, bodyType: filters.bodyType.filter(v => v !== val) };
    } else if (key.startsWith("fuelType-")) {
      const val = key.replace("fuelType-", "");
      newFilters = { ...filters, fuelType: filters.fuelType.filter(v => v !== val) };
    } else {
      newFilters = { ...filters, [key]: key === "bodyType" || key === "fuelType" ? [] : "" };
    }
    updateFilters(newFilters);
  };

  const hasActiveFilters = activeChips.length > 0;
  const locationLabel = filters.city || filters.country || (locationCountry !== "All" ? locationCountry : "East Africa");
  const pageHeading = filters.condition === "New"
    ? `New Cars for Sale in ${locationLabel}`
    : filters.vehicleType === "bike"
    ? `Bikes for Sale in ${locationLabel}`
    : filters.vehicleType === "commercial"
    ? `Commercial Vehicles for Sale in ${locationLabel}`
    : filters.vehicleType === "boat"
    ? `Boats for Sale in ${locationLabel}`
    : filters.bodyType[0]
    ? `${filters.bodyType[0]}s for Sale in ${locationLabel}`
    : `Used Cars for Sale in ${locationLabel}`;

  const handleSaveSearch = async () => {
    if (!user) { toast.error("Sign in to save searches"); return; }
    if (!saveName.trim()) { toast.error("Give your search a name"); return; }
    setSaving(true);
    const error = null; // saved_searches table not yet created
    // TODO: await supabase.from("saved_searches").insert({ user_id: user.id, name: saveName.trim(), filters: searchFilters });
    if (error) {
      toast.error("Could not save search");
    } else {
      toast.success("Search saved!");
      setSaveDialogOpen(false);
      setSaveName("");
    }
    setSaving(false);
  };

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 12;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <link rel="canonical" href={seoCanonical} />
        {jsonLdScript(breadcrumbJsonLd([
          { name: "Home", url: "https://www.motokah.com/" },
          { name: "Cars for Sale", url: seoCanonical },
        ]))}
        {jsonLdScript(collectionPageJsonLd({
          name: seoTitle.replace(" | Motokah", ""),
          description: seoDesc,
          url: seoCanonical,
          itemCount: filtered.length,
        }))}
      </Helmet>
      <Header />

      <main className="container mx-auto px-4 pt-5 pb-28 lg:py-6">
        {/* Top bar */}
        <div className="mb-4 space-y-3 sm:flex sm:items-start sm:justify-between sm:gap-4 sm:space-y-0">
          <div className="min-w-0">
            <h1 className="break-words text-lg font-bold leading-tight sm:text-xl">{pageHeading}</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Searching..." : `${filtered.length} ${filtered.length === 1 ? "vehicle" : "vehicles"} found`}
            </p>
          </div>
          <div className="-mx-1 flex w-[calc(100%+0.5rem)] items-center gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:w-auto sm:shrink-0 sm:overflow-visible sm:pb-0">
            {isMobile && (
              <button onClick={() => setDrawerOpen(true)}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium">
                <IconFilter size={16} stroke={2.5} /> Filters
              </button>
            )}
            {hasActiveFilters && (
              <button
                onClick={() => { if (!user) { toast.error("Sign in to save searches"); return; } setSaveDialogOpen(true); }}
                title="Save this search"
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/50 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
              >
                <IconBookmark size={15} stroke={2.5} />
                <span className="sm:hidden">Save</span>
                <span className="hidden sm:inline">Save Search</span>
              </button>
            )}
            <div className="flex shrink-0 items-center gap-2">
              <IconSortDescending size={16} stroke={2.5} className="shrink-0 text-muted-foreground" />
              <select value={sort} onChange={e => { setSort(e.target.value as SortOption); setPage(1); }}
                className="h-9 w-[126px] rounded-md border border-input bg-background px-2 text-sm sm:w-auto">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="views">Most Viewed</option>
                <option value="location">Location A→Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Search Dialog */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><IconBookmarkFilled size={18} className="text-primary" /> Save Search</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">Give this search a name so you can find it later in your profile.</p>
              <Input
                placeholder="e.g. Toyota SUVs in Nairobi"
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSaveSearch()}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveSearch} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="-mx-1 mb-4 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {activeChips.map(chip => (
              <span key={chip.key}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {chip.label}
                <button onClick={() => removeChip(chip.key)}><IconX size={12} stroke={3} /></button>
              </span>
            ))}
            <button onClick={clearFilters} className="shrink-0 text-xs text-muted-foreground underline hover:text-foreground">
              Clear all
            </button>
          </div>
        )}

        <div className="flex min-w-0 gap-6">
          {/* Desktop sidebar */}
          {!isMobile && (
            <aside className="w-64 shrink-0">
              <div className="sticky top-4 rounded-xl border border-border bg-card p-4">
                <FilterSidebar filters={filters} onChange={updateFilters} onClear={clearFilters} />
              </div>
            </aside>
          )}

          {/* Results */}
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <IconLoader2 size={32} className="animate-spin text-primary" />
              </div>
            ) : paged.length > 0 ? (
              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paged.map((listing, index) => (
                  <VehicleCard key={listing.id} listing={listing} priority={page === 1 && index < 3} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <IconSearch size={48} stroke={1.5} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
                <button onClick={clearFilters} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 rounded-md border border-border text-sm disabled:opacity-40">
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-md text-sm font-medium ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted/50"}`}>
                    {p}
                  </button>
                ))}
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-md border border-border text-sm disabled:opacity-40">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        <section className="mt-12 border-t border-border pt-8">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-foreground">
              {seoMake
                ? `${seoMake} ${vehicleLabel.toLowerCase()}${location ? ` in ${location}` : " in East Africa"}`
                : `${vehicleLabel} for sale${location ? ` in ${location}` : " in East Africa"}`}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Motokah helps buyers compare vehicle listings by price, mileage, year, transmission,
              fuel type and seller location. {location ? `For ${location}, ` : "Across East Africa, "}
              browse dealer and private stock, shortlist vehicles, then call or WhatsApp the seller directly
              before arranging an inspection.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {["Toyota", "Nissan", "Subaru", "Mazda", "Honda", "Mitsubishi"].filter(make => make !== seoMake).map((make) => {
                const params = new URLSearchParams();
                params.set("make", make);
                if (seoCity) params.set("city", seoCity);
                if (seoCountry) params.set("country", seoCountry);
                return (
                  <a
                    key={make}
                    href={`/search?${params.toString()}`}
                    className="rounded-full border border-border px-3 py-1.5 hover:border-primary hover:text-primary"
                  >
                    {make}{location ? ` in ${location}` : ""}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer open={drawerOpen} onOpenChange={setDrawerOpen}
        filters={filters} onChange={updateFilters} onClear={clearFilters} />

      <Footer />
    </div>
  );
}
