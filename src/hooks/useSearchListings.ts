import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type Listing, mockListings, commercialTypes as COMMERCIAL_TYPES } from "@/data/mockData";
import { getJijiListings } from "@/data/jijiListings";
import { hasUsablePhone, isContactPendingListing, isGenericScraperSeller, isJijiImage, isLaunchQualityListing } from "@/lib/listingQuality";
import { getBlockedSellerKeys, sellerBlockKey } from "@/lib/blockedSellers";
import { trackEvent } from "@/lib/analytics";

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

const norm = (v?: string | null) => (v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const MAKE_ALIASES: Record<string, string> = { mercedes: "mercedesbenz", benz: "mercedesbenz", merc: "mercedesbenz", rangerover: "landrover", vw: "volkswagen" };
const canonMake = (v?: string | null) => MAKE_ALIASES[norm(v)] || norm(v);
type Matchable = { make?: string; model?: string; title?: string; condition?: string; bodyType?: string };
export const matchesMake = (l: Matchable, make: string) => canonMake(l.make) === canonMake(make);
// Dealer captions write models loosely ("LANDCRUISER PRADO", "Rav 4"), so match inside model or title.
export const matchesModel = (l: Matchable, model: string) => norm(l.model).includes(norm(model)) || norm(l.title).includes(norm(model));
export const matchesCondition = (l: Matchable, condition: string) => {
  const c = (l.condition || "").toLowerCase();
  if (condition === "Used") return c.includes("used");
  if (condition === "New") return c.includes("new") && !c.includes("used");
  return c === condition.toLowerCase();
};
// Wagon and MPV are one category in the UI ("Wagon / MPV").
export const expandBodyTypes = (types: string[]) => [...new Set(types.flatMap(t => (t === "Wagon" || t === "MPV" ? ["Wagon", "MPV"] : [t])))];
export const matchesBodyType = (l: Matchable, types: string[]) => !!l.bodyType && expandBodyTypes(types).includes(l.bodyType);

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
        .select("id, title, price, currency, condition, year, mileage, transmission, city, views, seller_id, body_type, fuel_type, make, model, created_at, video_url, listing_images(image_url, display_order)")
        .eq("status", "approved");

      // Text search (keyword)
      if (filters.q?.trim()) {
        const kw = filters.q.trim();
        query = query.or(`title.ilike.%${kw}%,make.ilike.%${kw}%,model.ilike.%${kw}%`);
        trackEvent("search_performed", { query: kw, city: filters.city, make: filters.make });
      }

      if (filters.make) query = query.ilike("make", filters.make);
      if (filters.model) query = query.ilike("model", `%${filters.model}%`);
      if (filters.condition === "Used") query = query.ilike("condition", "%used%");
      else if (filters.condition) query = query.eq("condition", filters.condition);
      if (filters.transmission) query = query.eq("transmission", filters.transmission);
      if (filters.city) query = query.ilike("city", `%${filters.city}%`);
      if (filters.country && filters.country !== "All") {
        const currencies = countryCurrencyMap[filters.country] || [];
        if (currencies.length > 0) {
          query = query.in("currency", currencies);
        }
      }
      if (filters.bodyType?.length) query = query.in("body_type", expandBodyTypes(filters.bodyType));
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
          const excluded = [...BIKE_TYPES, ...COMMERCIAL_TYPES, ...BOAT_TYPES];
          query = query.not("body_type", "in", `(${excluded.map((v) => `"${v}"`).join(",")})`);
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
        setTimeout(() => reject(new Error('Query timeout')), 15000)
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
          if (filters.make) arr = arr.filter(m => matchesMake(m, filters.make!));
          if (filters.model) arr = arr.filter(m => matchesModel(m, filters.model!));
          if (filters.condition) arr = arr.filter(m => matchesCondition(m, filters.condition!));
          if (filters.transmission) arr = arr.filter(m => !m.transmission || m.transmission === filters.transmission);
          if (filters.city) arr = arr.filter(m => m.location?.toLowerCase().includes(filters.city!.toLowerCase()));
          if (filters.bodyType?.length) arr = arr.filter(m => matchesBodyType(m, filters.bodyType!));
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
        const blockedSellers = getBlockedSellerKeys();
        const combined = [...errMocks, ...errJiji].filter((listing) => !blockedSellers.has(sellerBlockKey(listing)));
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
          images: sorted.map((image) => image.image_url),
          videoUrl: r.video_url || undefined,
          views: r.views || 0,
          sellerName: profile?.display_name || "Private Seller",
          sellerType: (profile?.seller_type as "dealer" | "private") || "private",
          sellerListingCount: 1,
          sellerPhone: profile?.phone || undefined,
          sellerId: r.seller_id,
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
      if (filters.make) jijiFiltered = jijiFiltered.filter(m => matchesMake(m, filters.make!));
      if (filters.model) jijiFiltered = jijiFiltered.filter(m => matchesModel(m, filters.model!));
      if (filters.condition) jijiFiltered = jijiFiltered.filter(m => matchesCondition(m, filters.condition!));
      if (filters.city) jijiFiltered = jijiFiltered.filter(m => m.location?.toLowerCase().includes(filters.city.toLowerCase()));
      if (filters.minPrice) jijiFiltered = jijiFiltered.filter(m => m.price >= Number(filters.minPrice));
      if (filters.maxPrice) jijiFiltered = jijiFiltered.filter(m => m.price <= Number(filters.maxPrice));
      if (filters.yearFrom) jijiFiltered = jijiFiltered.filter(m => m.year >= Number(filters.yearFrom));
      if (filters.yearTo) jijiFiltered = jijiFiltered.filter(m => m.year <= Number(filters.yearTo));
      if (filters.bodyType?.length) jijiFiltered = jijiFiltered.filter(m => matchesBodyType(m, filters.bodyType!));
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
      if (filters.make) mocks = mocks.filter(m => matchesMake(m, filters.make!));
      if (filters.model) mocks = mocks.filter(m => matchesModel(m, filters.model!));
      if (filters.condition) mocks = mocks.filter(m => matchesCondition(m, filters.condition!));
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
      if (filters.bodyType?.length) mocks = mocks.filter(m => matchesBodyType(m, filters.bodyType!));
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
      
      const blockedSellers = getBlockedSellerKeys();
      const combined = deduped.filter((listing) => !blockedSellers.has(sellerBlockKey(listing)));
      
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
