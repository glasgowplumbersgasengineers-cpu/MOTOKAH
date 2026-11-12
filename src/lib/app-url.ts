// Dev/loopback origins that must never leak into a real signup/reset email's
// redirect_to — found live 2026-11-12: a local `vite preview --host 127.0.0.1`
// test run leaked a 127.0.0.1 link into a real confirmation email because this
// check only matched the literal string "localhost", not other loopback forms.
const DEV_ORIGIN_PATTERNS = [
  /localhost/,
  /^https?:\/\/127\.\d+\.\d+\.\d+/,
  /^https?:\/\/0\.0\.0\.0/,
  /^https?:\/\/\[::1\]/,
  /^capacitor:\/\//,
];

// Production app URL - change this to your actual domain
export const APP_URL =
  import.meta.env.VITE_APP_URL ||
  (typeof window !== "undefined" &&
   window.location.origin &&
   !DEV_ORIGIN_PATTERNS.some((re) => re.test(window.location.origin))
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