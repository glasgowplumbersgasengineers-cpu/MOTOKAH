import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type Listing, mockListings, getShowroomListings } from "@/data/mockData";
import { hasUsablePhone, isGenericScraperSeller, isJijiImage, isLaunchQualityListing, isStaticListingId } from "@/lib/listingQuality";

export interface ListingWithDescription extends Listing {
  description?: string | null;
}

export function useListing(id: string | undefined) {
  const [listing, setListing] = useState<ListingWithDescription | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    const staticId = id.startsWith("mock-") ? id.replace(/^mock-/, "stock-") : id;
    if (isStaticListingId(staticId)) {
      let mock: Listing | undefined = mockListings.find((m) => m.id === staticId);

      // ig- listings created by getShowroomListings aren't in mockListings
      // Parse username from id format: ig-{username}-{shortcode}
      if (!mock && staticId.startsWith("ig-")) {
        const withoutPrefix = staticId.slice(3);
        const lastDash = withoutPrefix.lastIndexOf("-");
        if (lastDash > 0) {
          const username = withoutPrefix.slice(0, lastDash);
          const showroomListings = getShowroomListings(username);
          mock = showroomListings.find(l => l.id === staticId);
        }
      }

      if (mock) {
        if (!isLaunchQualityListing(mock)) {
          setLoading(false);
          return;
        }
        setListing({ ...mock, description: mock.description ?? null });
        setImages(mock.images?.length ? mock.images : mock.image ? [mock.image] : []);
      }
      setLoading(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);
      const { data: r, error } = await supabase
        .from("listings")
        .select("*, listing_images(image_url, display_order)")
        .eq("id", id)
        .single();

      if (error || !r) { setLoading(false); return; }

      // Get seller profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, seller_type, phone")
        .eq("user_id", r.seller_id)
        .single();

      const imgs = (r.listing_images as { image_url: string; display_order: number }[]) || [];
      const sorted = [...imgs].sort((a, b) => a.display_order - b.display_order).map((i) => i.image_url);
      const sellerName = profile?.display_name || "Private Seller";
      if (sorted.some(isJijiImage) || isGenericScraperSeller(sellerName) || !hasUsablePhone(profile?.phone)) {
        setLoading(false);
        return;
      }

      setImages(sorted);
      setListing({
        id: r.id,
        title: r.title,
        price: Number(r.price),
        currency: r.currency,
        condition: r.condition,
        year: r.year,
        mileage: r.mileage || 0,
        transmission: r.transmission || "Automatic",
        location: r.city || "Tanzania",
        image: sorted[0] || "",
        views: r.views || 0,
        sellerName,
        sellerRating: Number((4.2 + (r.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 7) / 10).toFixed(1)),
        sellerType: (profile?.seller_type as "dealer" | "private") || "private",
        sellerListingCount: 1,
        bodyType: r.body_type || undefined,
        fuelType: r.fuel_type || undefined,
        make: r.make,
        model: r.model,
        sellerId: r.seller_id,
        sellerPhone: profile?.phone || undefined,
        description: r.description || null,
      });
      setLoading(false);
    };

    fetch();
  }, [id]);

  return { listing, images, loading };
}
