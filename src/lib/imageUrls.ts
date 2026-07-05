const OLD_SUPABASE_LISTING_IMAGES_BASE = "https://eiofmomywxcsezbyzjth.supabase.co/storage/v1/object/public/listing-images";

export const IMAGE_CDN_BASE = (import.meta.env.VITE_IMAGE_CDN_BASE || "https://pub-cc57e4688ac040d4bd2525d4db978c41.r2.dev").replace(/\/$/, "");

export function normalizeImageUrl(image: string): string {
  if (!image) return image;
  if (image.startsWith(`${OLD_SUPABASE_LISTING_IMAGES_BASE}/`)) {
    return `${IMAGE_CDN_BASE}/${image.slice(OLD_SUPABASE_LISTING_IMAGES_BASE.length + 1)}`;
  }
  return image;
}

export function cdnImagePath(...parts: string[]): string {
  return `${IMAGE_CDN_BASE}/${parts.map((part) => part.replace(/^\/+|\/+$/g, "")).join("/")}`;
}

export function cdnVariantUrl(image: string, width: 640 | 960 | 1400): string {
  const normalized = normalizeImageUrl(image);
  if (!normalized.startsWith(`${IMAGE_CDN_BASE}/`)) return normalized;
  const key = normalized.slice(IMAGE_CDN_BASE.length + 1);
  return `${IMAGE_CDN_BASE}/_variants/w${width}/${key}`;
}

export function cardImageUrl(image: string): string {
  return cdnVariantUrl(image, 640);
}

export function galleryImageUrl(image: string): string {
  return cdnVariantUrl(image, 960);
}

export function fullImageUrl(image: string): string {
  return normalizeImageUrl(image);
}
