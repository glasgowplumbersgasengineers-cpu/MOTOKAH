// Production app URL - change this to your actual domain
export const APP_URL =
  import.meta.env.VITE_APP_URL ||
  (typeof window !== "undefined" &&
   window.location.origin &&
   !window.location.origin.includes("localhost") &&
   !window.location.origin.includes("capacitor://")
    ? window.location.origin
    : "https://www.motokah.com");

// Helper to ensure we always use the production URL for auth redirects
export function getAppUrl(path?: string): string {
  const base = APP_URL.replace(/\/$/, '');
  if (path) {
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }
  return base;
}