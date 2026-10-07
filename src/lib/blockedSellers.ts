import type { Listing } from "@/data/mockData";

const STORAGE_KEY = "motokah_blocked_sellers";

export function sellerBlockKey(listing: Pick<Listing, "sellerId" | "sellerName">): string {
  return (listing.sellerId || listing.sellerName || "unknown-seller").trim().toLowerCase();
}

export function getBlockedSellerKeys(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return new Set(Array.isArray(stored) ? stored.filter((value): value is string => typeof value === "string") : []);
  } catch {
    return new Set();
  }
}

export function blockSeller(listing: Pick<Listing, "sellerId" | "sellerName">): void {
  const blocked = getBlockedSellerKeys();
  blocked.add(sellerBlockKey(listing));
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...blocked]));
}

export function isSellerBlocked(listing: Pick<Listing, "sellerId" | "sellerName">): boolean {
  return getBlockedSellerKeys().has(sellerBlockKey(listing));
}
