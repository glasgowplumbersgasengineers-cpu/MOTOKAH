import type { Listing } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "motokah_blocked_sellers";

// In-memory cache, seeded synchronously from localStorage at module load so every
// existing synchronous call site (list filters) keeps working without an async
// refactor. `syncBlockedSellersFromServer` reconciles it with the real DB-backed
// list once a user is authenticated, so blocks persist across devices instead of
// only hiding a seller on the one browser that clicked it.
let cache: Set<string> = loadFromLocalStorage();

function loadFromLocalStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return new Set(Array.isArray(stored) ? stored.filter((value): value is string => typeof value === "string") : []);
  } catch {
    return new Set();
  }
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...cache]));
}

export function sellerBlockKey(listing: Pick<Listing, "sellerId" | "sellerName">): string {
  return (listing.sellerId || listing.sellerName || "unknown-seller").trim().toLowerCase();
}

export function getBlockedSellerKeys(): Set<string> {
  return cache;
}

export function isSellerBlocked(listing: Pick<Listing, "sellerId" | "sellerName">): boolean {
  return cache.has(sellerBlockKey(listing));
}

export function blockSeller(listing: Pick<Listing, "sellerId" | "sellerName">, userId?: string): void {
  const key = sellerBlockKey(listing);
  cache.add(key);
  persist();
  if (!userId) return;
  supabase.from("blocked_sellers").insert({ user_id: userId, seller_key: key }).then(({ error }) => {
    if (error && error.code !== "23505") console.error("[blockedSellers] failed to persist block:", error.message);
  });
}

export function unblockSeller(key: string, userId?: string): void {
  cache.delete(key);
  persist();
  if (!userId) return;
  supabase.from("blocked_sellers").delete().eq("user_id", userId).eq("seller_key", key).then(({ error }) => {
    if (error) console.error("[blockedSellers] failed to remove block:", error.message);
  });
}

// Call once after a user's session resolves (e.g. in the auth provider) to pull
// their real cross-device block list and merge it into the local cache.
export async function syncBlockedSellersFromServer(userId: string): Promise<void> {
  const { data, error } = await supabase.from("blocked_sellers").select("seller_key").eq("user_id", userId);
  if (error) {
    console.error("[blockedSellers] failed to sync from server:", error.message);
    return;
  }
  for (const row of data || []) cache.add(row.seller_key);
  persist();
}
