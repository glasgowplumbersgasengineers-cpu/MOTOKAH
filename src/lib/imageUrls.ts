const OLD_SUPABASE_LISTING_IMAGES_BASE = "https://eiofmomywxcsezbyzjth.supabase.co/storage/v1/object/public/listing-images";
// Current (live) Supabase project's public Storage URL prefix for real user-submitted listing photos.
// Unlike the old bucket above, these are NOT routed through R2 — they're served straight from
// Supabase Storage, uncompressed, at whatever resolution the seller's phone uploaded (often several MB).
const SUPABASE_STORAGE_OBJECT_PREFIX = "/storage/v1/object/public/";
const SUPABASE_STORAGE_RENDER_PREFIX = "/storage/v1/render/image/public/";

export const IMAGE_CDN_BASE = (import.meta.env.VITE_IMAGE_CDN_BASE || "https://pub-cc57e4688ac040d4bd2525d4db978c41.r2.dev").replace(/\/$/, "");
const IMAGE_VARIANTS_ENABLED = import.meta.env.VITE_IMAGE_VARIANTS_ENABLED === "true";

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

// Supabase Storage's built-in image transform endpoint (same project, swap object -> render/image
// and add width/quality). Falls back to the original image untouched if the URL isn't a Supabase
// Storage object URL (e.g. already an R2 URL, or some other host).
function supabaseStorageVariantUrl(image: string, width: number): string | null {
  const objectIndex = image.indexOf(SUPABASE_STORAGE_OBJECT_PREFIX);
  if (objectIndex === -1) return null;
  const rewritten = image.slice(0, objectIndex) + SUPABASE_STORAGE_RENDER_PREFIX + image.slice(objectIndex + SUPABASE_STORAGE_OBJECT_PREFIX.length);
  const separator = rewritten.includes("?") ? "&" : "?";
  return `${rewritten}${separator}width=${width}&quality=75`;
}

export function cdnVariantUrl(image: string, width: 640 | 960 | 1400): string {
  const normalized = normalizeImageUrl(image);
  const supabaseVariant = supabaseStorageVariantUrl(normalized, width);
  if (supabaseVariant) return supabaseVariant;
  if (!IMAGE_VARIANTS_ENABLED || !normalized.startsWith(`${IMAGE_CDN_BASE}/`)) return normalized;
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
