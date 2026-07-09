import { useEffect, useState } from "react";
import VehicleCard from "./VehicleCard";
import { supabase } from "@/integrations/supabase/client";
import { type Listing } from "@/data/mockData";
import { hasUsablePhone, isLaunchQualityListing } from "@/lib/listingQuality";

interface SimilarListingsProps {
  currentId: string;
  make?: string;
  bodyType?: string;
}

export default function SimilarListings({ currentId, make, bodyType }: SimilarListingsProps) {
  const [similar, setSimilar] = useState<Listing[]>([]);

  useEffect(() => {
    const fetch = async () => {
      let query = supabase
        .from("listings")
        .select("*, listing_images(image_url, display_order)")
        .eq("status", "approved")
        .neq("id", currentId)
        .limit(4);

      if (make) query = query.eq("make", make);
      else if (bodyType) query = query.eq("body_type", bodyType);

      const { data } = await query;
      const rows = data && data.length > 0 ? data : (await supabase
        .from("listings")
        .select("*, listing_images(image_url, display_order)")
        .eq("status", "approved")
        .neq("id", currentId)
        .limit(4)).data || [];

      const sellerIds = [...new Set(rows.map((r) => r.seller_id).filter(Boolean))];
      const { data: profiles } = sellerIds.length
        ? await supabase.from("profiles").select("user_id, display_name, seller_type, phone").in("user_id", sellerIds)
        : { data: [] };
      const profileMap = new Map((profiles || []).map((profile) => [profile.user_id, profile]));
      setSimilar(mapRows(rows, profileMap).filter((listing) => hasUsablePhone(listing.sellerPhone) && isLaunchQualityListing(listing)));
    };
    fetch();
  }, [currentId, make, bodyType]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRows = (rows: any[], profileMap: Map<string, any>): Listing[] =>
    rows.map((r) => {
      const imgs = (r.listing_images as { image_url: string; display_order: number }[]) || [];
      const sorted = [...imgs].sort((a, b) => a.display_order - b.display_order);
      const profile = profileMap.get(r.seller_id);
      return {
        id: r.id,
        title: r.title,
        price: Number(r.price),
        currency: r.currency,
        condition: r.condition,
        year: r.year,
        mileage: r.mileage || 0,
        transmission: r.transmission || "Manual",
        location: r.city || "Tanzania",
        image: sorted[0]?.image_url || "",
        views: r.views || 0,
        sellerName: profile?.display_name || "Seller",
        sellerRating: 4.5,
        sellerType: (profile?.seller_type as "dealer" | "private") || "private",
        sellerListingCount: 1,
        sellerPhone: profile?.phone || undefined,
        bodyType: r.body_type || undefined,
        fuelType: r.fuel_type || undefined,
        make: r.make,
        model: r.model,
      };
    });

  if (similar.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Similar Vehicles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {similar.map((l) => (
          <VehicleCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
