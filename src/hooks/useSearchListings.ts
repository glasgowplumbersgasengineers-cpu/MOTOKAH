import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type Listing, mockListings, commercialTypes as COMMERCIAL_TYPES } from "@/data/mockData";
import { getJijiListings } from "@/data/jijiListings";
import { hasUsablePhone, isContactPendingListing, isGenericScraperSeller, isJijiImage, isLaunchQualityListing } from "@/lib/listingQuality";

export interface SearchFilters {
  q?: string;
  make?: string;
  model?: string;
  condition?: string;
  transmission?: string;
  city?: string;
  country?: string;
  bodyType?: string[];
  fuelType?: string[];
  minPrice?: string;
  maxPrice?: string;
  yearFrom?: string;
  yearTo?: string;
  maxMileage?: string;
  vehicleType?: "car" | "bike" | "commercial" | "boat" | "spare";
}

const BIKE_TYPES = ["Motorcycle", "Scooter", "Dirt Bike", "Sport Bike"];
const BOAT_TYPES = ["Boat", "Yacht", "Powerboat", "Sailboat", "Catamaran"];

function matchesVehicleType(listing: Listing, vehicleType?: SearchFilters["vehicleType"]) {
  if (!vehicleType || vehicleType === "spare") return true;
  const bodyType = listing.bodyType || "";
  if (vehicleType === "bike") return BIKE_TYPES.includes(bodyType);
  if (vehicleType === "commercial") return COMMERCIAL_TYPES.includes(bodyType);
  if (vehicleType === "boat") return BOAT_TYPES.includes(bodyType);
  if (vehicleType === "car") return !BIKE_TYPES.includes(bodyType) && !COMMERCIAL_TYPES.includes(bodyType) && !BOAT_TYPES.includes(bodyType);
  return true;
}

const countryCurrencyMap: Record<string, string[]> = {
  Tanzania: ["TZS"],
  Kenya: ["KES"],
  Uganda: ["UGX"],
  Rwanda: ["RWF"],
  Burundi: ["BIF"],
  Ethiopia: ["ETB"],
  Nigeria: ["NGN"],
};

const countryCitiesMap: Record<string, string[]> = {
  Tanzania: ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Morogoro", "Tanga", "Kigoma", "Moshi", "Zanzibar", "Iringa", "Sumbawanga", "Songea", "Bukoba", "Lindi", "Musoma", "Shinyanga", "Tabhora", "Kahama"],
  Kenya: ["Nairobi", "Mombasa", "Nakuru", "Kisumu", "Eldoret", "Ruiru", "Kikuyu", "Thika", "Kiambu", "Machakos", "Kajiado", "Meru", "Nanyuki", "Nyeri", "Kericho", "Kakamega", "Bungoma", "Busia", "Kitale"],
  Uganda: ["Kampala", "Entebbe", "Jinja", "Mukono", "Mbarara", "Gulu", "Arua", "Lira", "Fort Portal"],
  Rwanda: ["Kigali", "Butare", "Ruhengeri", "Byumba"],
  Burundi: ["Bujumbura"],
  Ethiopia: ["Addis Ababa", "Adama", "Bahir Dar", "Hawassa", "Dire Dawa"],
  Nigeria: ["Lagos", "Abuja", "Ibadan", "Kano", "Port Harcourt", "Benin City", "Kaduna", "Ilorin", "Maiduguri", "Enugu"],
};

const isoToCountry: Record<string, string> = { TZ: "Tanzania", KE: "Kenya", UG: "Uganda", RW: "Rwanda", ET: "Ethiopia", BI: "Burundi", NG: "Nigeria" };
function countryToIso(country: string): string | undefined {
  return Object.entries(isoToCountry).find(([, n]) => n === country)?.[0];
}

export type SortOption = "newest" | "price-low" | "price-high" | "views" | "location";

export function useSearchListings(filters: SearchFilters, sort: SortOption) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      let query = supabase
        .from("listings")
        .select("id, title, price, currency, condition, year, mileage, transmission, city, views, seller_id, body_type, fuel_type, make, model, created_at, listing_images(image_url, display_order)")
        .eq("status", "approved");

      // Text search (keyword)
      if (filters.q?.trim()) {
        const kw = filters.q.trim();
        query = query.or(`title.ilike.%${kw}%,make.ilike.%${kw}%,model.ilike.%${kw}%`);
      }

      if (filters.make) query = query.eq("make", filters.make);
      if (filters.model) query = query.eq("model", filters.model);
      if (filters.condition) query = query.eq("condition", filters.condition);
      if (filters.transmission) query = query.eq("transmission", filters.transmission);
      if (filters.city) query = query.ilike("city", `%${filters.city}%`);
      if (filters.country && filters.country !== "All") {
        const currencies = countryCurrencyMap[filters.country] || [];
        if (currencies.length > 0) {
          query = query.in("currency", currencies);
        }
      }
      if (filters.bodyType?.length) query = query.in("body_type", filters.bodyType);
      if (filters.fuelType?.length) query = query.in("fuel_type", filters.fuelType);
      if (filters.minPrice) query = query.gte("price", Number(filters.minPrice));
      if (filters.maxPrice) query = query.lte("price", Number(filters.maxPrice));
      if (filters.yearFrom) query = query.gte("year", Number(filters.yearFrom));
      if (filters.yearTo) query = query.lte("year", Number(filters.yearTo));
      if (filters.maxMileage) query = query.lte("mileage", Number(filters.maxMileage));

      // Vehicle type filtering
      if (filters.vehicleType) {
        if (filters.vehicleType === "bike") {
          query = query.in("body_type", BIKE_TYPES);
        } else if (filters.vehicleType === "commercial") {
          query = query.in("body_type", COMMERCIAL_TYPES);
        } else if (filters.vehicleType === "boat") {
          query = query.in("body_type", BOAT_TYPES);
        } else if (filters.vehicleType === "car") {
          query = query.not("body_type", "in", [...BIKE_TYPES, ...COMMERCIAL_TYPES, ...BOAT_TYPES]);
        }
      }

      // Sort
      switch (sort) {
        case "price-low": query = query.order("price", { ascending: true }); break;
        case "price-high": query = query.order("price", { ascending: false }); break;
        case "views": query = query.order("views", { ascending: false }); break;
        case "location": query = query.order("city", { ascending: true }); break;
        default: query = query.order("created_at", { ascending: false });
      }

      // Add timeout to prevent hanging queries
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 5000)
      );
      
      let rows;
      let error;
      try {
        const result = await Promise.race([
          query.limit(100),
          timeoutPromise
        ]) as any;
        rows = result.data;
        error = result.error;
      } catch (timeoutErr) {
        console.warn('Query timeout, using mock data');
        rows = null;
        error = timeoutErr;
      }

      if (error) {
        console.error(error);
        const jiji = await getJijiListings(filters.country).catch(() => []);
        let errMocks = [...mockListings].filter(isLaunchQualityListing);
        let errJiji = [...jiji].filter(isLaunchQualityListing);
        const applyCommon = (arr: typeof errMocks) => {
          if (filters.q?.trim()) {
            const kw = filters.q.trim().toLowerCase();
            arr = arr.filter(m => 
              m.title?.toLowerCase().includes(kw) ||
              m.make?.toLowerCase().includes(kw) ||
              m.model?.toLowerCase().includes(kw)
            );
          }
          if (filters.make) arr = arr.filter(m => m.make?.toLowerCase() === filters.make!.toLowerCase());
          if (filters.model) arr = arr.filter(m => m.model?.toLowerCase() === filters.model!.toLowerCase());
          if (filters.condition) arr = arr.filter(m => m.condition === filters.condition);
          if (filters.transmission) arr = arr.filter(m => !m.transmission || m.transmission === filters.transmission);
          if (filters.city) arr = arr.filter(m => m.location?.toLowerCase().includes(filters.city!.toLowerCase()));
          if (filters.bodyType?.length) arr = arr.filter(m => m.bodyType && filters.bodyType!.includes(m.bodyType));
          if (filters.minPrice) arr = arr.filter(m => m.price >= Number(filters.minPrice));
          if (filters.maxPrice) arr = arr.filter(m => m.price <= Number(filters.maxPrice));
          if (filters.yearFrom) arr = arr.filter(m => m.year >= Number(filters.yearFrom));
          if (filters.yearTo) arr = arr.filter(m => m.year <= Number(filters.yearTo));
          if (filters.vehicleType) arr = arr.filter(m => matchesVehicleType(m, filters.vehicleType));
          return arr.filter(l => l.price > 0);
        };
        errMocks = applyCommon(errMocks);
        errJiji = applyCommon(errJiji);
        if (filters.country && filters.country !== "All") {
          const cities = countryCitiesMap[filters.country] || [];
          const iso = countryToIso(filters.country);
          errMocks = errMocks.filter(m => cities.some(c => m.location?.includes(c)) || (iso && m.country === iso));
          errJiji = errJiji.filter(m => cities.some(c => m.location?.includes(c)));
        }
        const combined = [...errMocks, ...errJiji];
        if (sort === "price-low") combined.sort((a, b) => a.price - b.price);
        else if (sort === "price-high") combined.sort((a, b) => b.price - a.price);
        setListings(combined);
        setLoading(false);
        return;
      }

      const sellerIds = [...new Set((rows || []).map((r) => r.seller_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, seller_type, phone")
        .in("user_id", sellerIds);
      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      const mapped: Listing[] = (rows || []).map((r) => {
        const profile = profileMap.get(r.seller_id);
        const imgs = (r.listing_images as { image_url: string; display_order: number }[]) || [];
        const sorted = [...imgs].sort((a, b) => a.display_order - b.display_order);
        const mainImage = sorted[0]?.image_url || "";

        return {
          id: r.id,
          title: r.title,
          price: Number(r.price),
          currency: r.currency,
          condition: r.condition,
          year: r.year,
          mileage: r.mileage || 0,
          transmission: r.transmission || "Automatic",
          location: r.city || "Tanzania",
          image: mainImage,
          views: r.views || 0,
          sellerName: profile?.display_name || "Private Seller",
          sellerRating: Number((4.2 + (r.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 7) / 10).toFixed(1)),
          sellerType: (profile?.seller_type as "dealer" | "private") || "private",
          sellerListingCount: 1,
          sellerPhone: profile?.phone || undefined,
          bodyType: r.body_type || undefined,
          fuelType: r.fuel_type || undefined,
          make: r.make,
          model: r.model,
        };
      });

      const validateListing = (l: Listing, isMock = false) => {
        if ((!l.price || l.price <= 0) && !isContactPendingListing(l)) return false;
        if (!isMock) return true;
        if (l.bodyType === "Boat") return true;
        if (l.mileage === 0 && l.condition !== "New") return false;
        if (!l.transmission) return false;
        return true;
      };

      // Fuzzy deduplication key based on make+model+year+location
      const fuzzyKey = (l: Listing) => `${l.make?.toLowerCase()||''}|${l.model?.toLowerCase()||''}|${l.year}|${l.location?.split(',')[0].toLowerCase().trim()||''}`;

      const jiji = await getJijiListings(filters.country).catch(() => []);
      let jijiFiltered = [...jiji];
      if (filters.q?.trim()) {
        const kw = filters.q.trim().toLowerCase();
        jijiFiltered = jijiFiltered.filter(m =>
          m.title?.toLowerCase().includes(kw) ||
          m.make?.toLowerCase().includes(kw) ||
          m.model?.toLowerCase().includes(kw)
        );
      }
      if (filters.make) jijiFiltered = jijiFiltered.filter(m => m.make?.toLowerCase() === filters.make!.toLowerCase());
      if (filters.model) jijiFiltered = jijiFiltered.filter(m => m.model?.toLowerCase().includes(filters.model!.toLowerCase()));
      if (filters.condition) jijiFiltered = jijiFiltered.filter(m => m.condition === filters.condition);
      if (filters.city) jijiFiltered = jijiFiltered.filter(m => m.location?.toLowerCase().includes(filters.city.toLowerCase()));
      if (filters.minPrice) jijiFiltered = jijiFiltered.filter(m => m.price >= Number(filters.minPrice));
      if (filters.maxPrice) jijiFiltered = jijiFiltered.filter(m => m.price <= Number(filters.maxPrice));
      if (filters.yearFrom) jijiFiltered = jijiFiltered.filter(m => m.year >= Number(filters.yearFrom));
      if (filters.yearTo) jijiFiltered = jijiFiltered.filter(m => m.year <= Number(filters.yearTo));
      if (filters.bodyType?.length) jijiFiltered = jijiFiltered.filter(m => m.bodyType && filters.bodyType!.includes(m.bodyType));
      if (filters.fuelType?.length) jijiFiltered = jijiFiltered.filter(m => m.fuelType && filters.fuelType!.includes(m.fuelType));
      if (filters.vehicleType) jijiFiltered = jijiFiltered.filter(m => matchesVehicleType(m, filters.vehicleType));
      if (filters.country && filters.country !== "All") {
        const cities = countryCitiesMap[filters.country] || [];
        // Jiji country field is corrupted (e.g. Lagos tagged as TZ) — city name only
        jijiFiltered = jijiFiltered.filter(m => cities.some(c => m.location?.includes(c)));
      }

      // Always merge mock data with Supabase data so we don't lose listings
      let mocks = [...mockListings];
      
      // Filter mock data with same filters
      if (filters.q?.trim()) {
        const kw = filters.q.trim().toLowerCase();
        mocks = mocks.filter(m =>
          m.title?.toLowerCase().includes(kw) ||
          m.make?.toLowerCase().includes(kw) ||
          m.model?.toLowerCase().includes(kw)
        );
      }
      if (filters.make) mocks = mocks.filter(m => m.make?.toLowerCase() === filters.make!.toLowerCase());
      if (filters.model) mocks = mocks.filter(m => m.model?.toLowerCase() === filters.model!.toLowerCase());
      if (filters.condition) mocks = mocks.filter(m => m.condition === filters.condition);
      if (filters.transmission) mocks = mocks.filter(m => m.transmission === filters.transmission);
      if (filters.city) mocks = mocks.filter(m => m.location?.toLowerCase().includes(filters.city.toLowerCase()));
      if (filters.country && filters.country !== "All") {
        const cities = countryCitiesMap[filters.country] || [];
        const isoMap: Record<string, string> = { TZ: "Tanzania", KE: "Kenya", UG: "Uganda", RW: "Rwanda", ET: "Ethiopia", BI: "Burundi", NG: "Nigeria" };
        const iso = Object.entries(isoMap).find(([, n]) => n === filters.country)?.[0];
        mocks = mocks.filter(m => cities.some(c => m.location?.includes(c)) || (iso && m.country === iso));
      }
      if (filters.minPrice) mocks = mocks.filter(m => m.price >= Number(filters.minPrice));
      if (filters.maxPrice) mocks = mocks.filter(m => m.price <= Number(filters.maxPrice));
      if (filters.yearFrom) mocks = mocks.filter(m => m.year >= Number(filters.yearFrom));
      if (filters.yearTo) mocks = mocks.filter(m => m.year <= Number(filters.yearTo));
      if (filters.maxMileage) mocks = mocks.filter(m => m.mileage <= Number(filters.maxMileage));
      if (filters.bodyType?.length) mocks = mocks.filter(m => m.bodyType && filters.bodyType!.includes(m.bodyType));
      if (filters.fuelType?.length) mocks = mocks.filter(m => m.fuelType && filters.fuelType!.includes(m.fuelType));
      if (filters.vehicleType) mocks = mocks.filter(m => matchesVehicleType(m, filters.vehicleType));
      
      // Apply validation to mock data
      mocks = mocks.filter(l => validateListing(l, true));

      // Merge: Supabase + mock + Jiji (deduplicate all three sources against each other)
      // When a specific bodyType filter is active and DB returned results, skip mocks to avoid polluting results
      const validMapped = mapped.filter((l) => {
        if (!validateListing(l, false)) return false;
        if (isJijiImage(l.image) || l.images?.some(isJijiImage)) return false;
        if (isGenericScraperSeller(l.sellerName)) return false;
        if (!hasUsablePhone(l.sellerPhone) && !isContactPendingListing(l)) return false;
        return isLaunchQualityListing(l);
      });
      const shouldInjectMocks = filters.bodyType?.includes("Boat") || !filters.bodyType?.length || validMapped.length < 5;
      const realIds = new Set(validMapped.map(r => r.id));
      const uniqueMocks = shouldInjectMocks ? mocks.filter(m => !realIds.has(m.id) && isLaunchQualityListing(m)) : [];
      const mockIds = new Set(uniqueMocks.map(m => m.id));
      const uniqueJiji = jijiFiltered.filter(m => !realIds.has(m.id) && !mockIds.has(m.id) && isLaunchQualityListing(m));
      
      // Fuzzy deduplication: remove duplicates with same make+model+year+location
      const seenKeys = new Set<string>();
      const deduped = [...validMapped, ...uniqueMocks, ...uniqueJiji].filter(l => {
        const key = fuzzyKey(l);
        if (seenKeys.has(key)) return false;
        seenKeys.add(key);
        return true;
      });
      
      const combined = deduped;
      
      // Sort combined results
      if (sort === "price-low") combined.sort((a, b) => a.price - b.price);
      else if (sort === "price-high") combined.sort((a, b) => b.price - a.price);
      else if (sort === "views") combined.sort((a, b) => b.views - a.views);
      else if (sort === "location") combined.sort((a, b) => (a.location || "").localeCompare(b.location || ""));
      else combined.sort((a, b) => {
        // Newest first - use a fallback date if created_at doesn't exist
        const dateA = (a as any).created_at ? new Date((a as any).created_at).getTime() : 0;
        const dateB = (b as any).created_at ? new Date((b as any).created_at).getTime() : 0;
        return dateB - dateA;
      });
      
      setListings(combined);
      setLoading(false);
    };

    fetch();
  }, [JSON.stringify(filters), sort]);

  return { listings, loading };
}
