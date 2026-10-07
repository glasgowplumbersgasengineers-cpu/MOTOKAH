import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type Listing, mockListings } from "@/data/mockData";
import { getJijiListings } from "@/data/jijiListings";
import { hasUsablePhone, isGenericScraperSeller, isJijiImage, isLaunchQualityListing } from "@/lib/listingQuality";
import { getBlockedSellerKeys, sellerBlockKey } from "@/lib/blockedSellers";

// Only select columns we actually need — much faster
const LISTING_COLUMNS = [
  "id", "title", "price", "currency", "condition", "year", "mileage",
  "transmission", "city", "views", "seller_id", "body_type", "fuel_type",
  "make", "model", "created_at"
].join(",");

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

export function useListings(options?: { limit?: number; orderBy?: string; country?: string }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const limit = options?.limit || 20;
      const country = options?.country;

      let query = supabase
        .from("listings")
        .select(`${LISTING_COLUMNS}, listing_images(image_url, display_order)`)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(limit);

      // Filter by country if specified
      if (country && country !== "All") {
        const currencies = countryCurrencyMap[country] || [];
        if (currencies.length > 0) {
          query = query.in("currency", currencies);
        }
      }

      const { data: rows, error } = await query;

      if (error || !rows || rows.length === 0) {
        const jiji = await getJijiListings(country);
        let mocks = [...mockListings];
        let jijiItems = [...jiji];
        if (country && country !== "All") {
          const cities = countryCitiesMap[country] || [];
          const iso = countryToIso(country);
          // Mock data is hand-crafted — trust both city name and country ISO
          mocks = mocks.filter(m => cities.some(c => m.location?.includes(c)) || (iso && m.country === iso));
          // Jiji country field is unreliable (e.g. Nigerian cities tagged as TZ) — use city name only
          jijiItems = jijiItems.filter(m => cities.some(c => m.location?.includes(c)));
        }
        const blockedSellers = getBlockedSellerKeys();
        const fallback = [...mocks.filter(isLaunchQualityListing), ...jijiItems.filter(isLaunchQualityListing)]
          .filter((listing) => !blockedSellers.has(sellerBlockKey(listing)));
        fallback.sort(() => Math.random() - 0.5);
        setListings(fallback.slice(0, limit));
        setLoading(false);
        return;
      }

      const sellerIds = [...new Set(rows.map((r) => r.seller_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, seller_type, phone")
        .in("user_id", sellerIds);

      const profileMap = new Map(
        (profiles || []).map((p) => [p.user_id, p])
      );

      const mapped: Listing[] = rows.map((r) => {
        const profile = profileMap.get(r.seller_id);
        const imgs = (r.listing_images as { image_url: string; display_order: number }[]) || [];
        const sortedImages = [...imgs].sort((a, b) => a.display_order - b.display_order);
        const mainImage = sortedImages[0]?.image_url || "";
        // Deterministic 4.2–4.8 rating per row so cards are not all flat 4.5
        const ratingSeed = r.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

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
          sellerRating: Number((4.2 + (ratingSeed % 7) / 10).toFixed(1)),
          sellerType: (profile?.seller_type as "dealer" | "private") || "private",
          sellerListingCount: 1,
          sellerPhone: profile?.phone || undefined,
          sellerId: r.seller_id,
          bodyType: r.body_type || undefined,
          fuelType: r.fuel_type || undefined,
          make: r.make,
          model: r.model,
        };
      }).filter(isLaunchQualityListing);

      const dbIds = new Set(mapped.map((m) => m.id));
      const jiji = await getJijiListings(country);
      let fillMocks = [...mockListings].filter((m) => !dbIds.has(m.id) && isLaunchQualityListing(m));
      let fillJiji = [...jiji].filter((m) => !dbIds.has(m.id) && isLaunchQualityListing(m));

      if (country && country !== "All") {
        const cities = countryCitiesMap[country] || [];
        const iso = countryToIso(country);
        fillMocks = fillMocks.filter(m => cities.some(c => m.location?.includes(c)) || (iso && m.country === iso));
        fillJiji = fillJiji.filter(m => cities.some(c => m.location?.includes(c)));
      }
      const fillFrom = [...fillMocks, ...fillJiji];
      fillFrom.sort(() => Math.random() - 0.5);

      const blockedSellers = getBlockedSellerKeys();
      const combined = [...mapped, ...fillFrom]
        .filter((listing) => !blockedSellers.has(sellerBlockKey(listing)))
        .slice(0, limit);
      setListings(combined);
      setLoading(false);
    };

    fetchListings().catch(async () => {
      const catchCountry = options?.country;
      const jiji = await getJijiListings(catchCountry).catch(() => []);
      let catchMocks = [...mockListings];
      let catchJiji = [...jiji];
      if (catchCountry && catchCountry !== "All") {
        const cities = countryCitiesMap[catchCountry] || [];
        const iso = countryToIso(catchCountry);
        catchMocks = catchMocks.filter(m => cities.some(c => m.location?.includes(c)) || (iso && m.country === iso));
        catchJiji = catchJiji.filter(m => cities.some(c => m.location?.includes(c)));
      }
      const blockedSellers = getBlockedSellerKeys();
      const all = [...catchMocks.filter(isLaunchQualityListing), ...catchJiji.filter(isLaunchQualityListing)]
        .filter((listing) => !blockedSellers.has(sellerBlockKey(listing)));
      all.sort(() => Math.random() - 0.5);
      setListings(all.slice(0, options?.limit || 20));
      setLoading(false);
    });
  }, [options?.limit, options?.orderBy, options?.country]);

  return { listings, loading };
}
