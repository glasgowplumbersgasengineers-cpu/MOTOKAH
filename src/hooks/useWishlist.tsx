import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { isRealUuid } from "@/lib/uuid";

interface WishlistContextType {
  wishlistIds: Set<string>;
  toggle: (listingId: string) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: new Set(),
  toggle: async () => {},
  loading: false,
});

const isDemoUser = (userId?: string) => Boolean(userId?.startsWith("demo-"));
const demoWishlistKey = (userId: string) => `motokah_demo_wishlist_${userId}`;
// Scraped (Instagram/Jiji) listings have synthetic non-UUID ids;
// wishlist.listing_id is a uuid column, so an insert always failed for them —
// silently, since the result was never checked, while the optimistic local
// state still showed "Saved". Found live 2026-11-13. Backend can't reference
// these rows anyway, so they're saved client-side only (per-browser), same
// mechanism already used for demo accounts.
const localWishlistKey = (userId: string) => `motokah_local_wishlist_${userId}`;

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setWishlistIds(new Set());
      return;
    }
    if (isDemoUser(user.id)) {
      const stored = localStorage.getItem(demoWishlistKey(user.id));
      setWishlistIds(new Set(stored ? JSON.parse(stored) : []));
      return;
    }
    const fetch = async () => {
      const { data } = await supabase
        .from("wishlist")
        .select("listing_id")
        .eq("user_id", user.id);
      const localStored = localStorage.getItem(localWishlistKey(user.id));
      const localIds: string[] = localStored ? JSON.parse(localStored) : [];
      setWishlistIds(new Set([...(data || []).map((w) => w.listing_id), ...localIds]));
    };
    fetch();
  }, [user]);

  const toggle = useCallback(async (listingId: string) => {
    if (!user) return;
    setLoading(true);
    const demo = isDemoUser(user.id);
    const useLocalOnly = demo || !isRealUuid(listingId);
    // Demo accounts persist their whole wishlist locally, unfiltered (never touch Supabase
    // at all). Real accounts only persist non-UUID (scraped-listing) ids locally; real UUID
    // listings always go through Supabase, same as before.
    const persistLocal = (next: Set<string>) => {
      if (demo) {
        localStorage.setItem(demoWishlistKey(user.id), JSON.stringify([...next]));
      } else {
        localStorage.setItem(localWishlistKey(user.id), JSON.stringify([...next].filter((id) => !isRealUuid(id))));
      }
    };
    if (wishlistIds.has(listingId)) {
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(listingId);
        if (useLocalOnly) persistLocal(next);
        return next;
      });
      if (!useLocalOnly) {
        await supabase.from("wishlist").delete().eq("user_id", user.id).eq("listing_id", listingId);
      }
    } else {
      setWishlistIds((prev) => {
        const next = new Set(prev).add(listingId);
        if (useLocalOnly) persistLocal(next);
        return next;
      });
      if (!useLocalOnly) {
        const { error } = await supabase.from("wishlist").insert({ user_id: user.id, listing_id: listingId });
        if (error) console.error("[useWishlist] failed to save:", error.message);
      }
    }
    setLoading(false);
  }, [user, wishlistIds]);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggle, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
