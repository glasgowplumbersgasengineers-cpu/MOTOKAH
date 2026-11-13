import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import type { Country } from "@/hooks/useLocationDetection";

// Approximate city centres. The first city listed per country is its hub.
const CITIES: { city: string; country: Exclude<Country, "All">; lat: number; lon: number; hub?: boolean }[] = [
  { city: "Dar es Salaam", country: "Tanzania", lat: -6.79, lon: 39.21, hub: true },
  { city: "Arusha", country: "Tanzania", lat: -3.37, lon: 36.68 },
  { city: "Mwanza", country: "Tanzania", lat: -2.52, lon: 32.9 },
  { city: "Dodoma", country: "Tanzania", lat: -6.16, lon: 35.75 },
  { city: "Mbeya", country: "Tanzania", lat: -8.9, lon: 33.46 },
  { city: "Morogoro", country: "Tanzania", lat: -6.82, lon: 37.66 },
  { city: "Tanga", country: "Tanzania", lat: -5.07, lon: 39.1 },
  { city: "Kigoma", country: "Tanzania", lat: -4.88, lon: 29.63 },
  { city: "Moshi", country: "Tanzania", lat: -3.35, lon: 37.34 },
  { city: "Zanzibar", country: "Tanzania", lat: -6.16, lon: 39.2 },
  { city: "Nairobi", country: "Kenya", lat: -1.29, lon: 36.82, hub: true },
  { city: "Mombasa", country: "Kenya", lat: -4.04, lon: 39.67 },
  { city: "Nakuru", country: "Kenya", lat: -0.3, lon: 36.07 },
  { city: "Kisumu", country: "Kenya", lat: -0.09, lon: 34.77 },
  { city: "Eldoret", country: "Kenya", lat: 0.51, lon: 35.27 },
  { city: "Ruiru", country: "Kenya", lat: -1.15, lon: 36.96 },
  { city: "Kikuyu", country: "Kenya", lat: -1.25, lon: 36.66 },
  { city: "Thika", country: "Kenya", lat: -1.03, lon: 37.07 },
  { city: "Kiambu", country: "Kenya", lat: -1.17, lon: 36.83 },
  { city: "Kampala", country: "Uganda", lat: 0.35, lon: 32.58, hub: true },
  { city: "Entebbe", country: "Uganda", lat: 0.06, lon: 32.46 },
  { city: "Jinja", country: "Uganda", lat: 0.42, lon: 33.2 },
  { city: "Mukono", country: "Uganda", lat: 0.35, lon: 32.76 },
  { city: "Mbarara", country: "Uganda", lat: -0.61, lon: 30.66 },
  { city: "Gulu", country: "Uganda", lat: 2.77, lon: 32.3 },
  { city: "Arua", country: "Uganda", lat: 3.02, lon: 30.91 },
  { city: "Lira", country: "Uganda", lat: 2.25, lon: 32.9 },
  { city: "Kigali", country: "Rwanda", lat: -1.95, lon: 30.06, hub: true },
  { city: "Butare", country: "Rwanda", lat: -2.6, lon: 29.74 },
  { city: "Ruhengeri", country: "Rwanda", lat: -1.5, lon: 29.63 },
  { city: "Byumba", country: "Rwanda", lat: -1.58, lon: 30.07 },
  { city: "Bujumbura", country: "Burundi", lat: -3.38, lon: 29.36, hub: true },
  { city: "Addis Ababa", country: "Ethiopia", lat: 9.03, lon: 38.74, hub: true },
  { city: "Adama", country: "Ethiopia", lat: 8.54, lon: 39.27 },
  { city: "Bahir Dar", country: "Ethiopia", lat: 11.59, lon: 37.39 },
  { city: "Hawassa", country: "Ethiopia", lat: 7.06, lon: 38.48 },
  { city: "Dire Dawa", country: "Ethiopia", lat: 9.59, lon: 41.86 },
  { city: "Lagos", country: "Nigeria", lat: 6.52, lon: 3.38, hub: true },
  { city: "Abuja", country: "Nigeria", lat: 9.08, lon: 7.4 },
  { city: "Ibadan", country: "Nigeria", lat: 7.38, lon: 3.95 },
  { city: "Kano", country: "Nigeria", lat: 12.0, lon: 8.52 },
  { city: "Port Harcourt", country: "Nigeria", lat: 4.82, lon: 7.03 },
  { city: "Benin City", country: "Nigeria", lat: 6.34, lon: 5.63 },
  { city: "Kaduna", country: "Nigeria", lat: 10.52, lon: 7.44 },
];

const MAX_DISTANCE_KM = 300;
// Suburbs this close to a country's hub (e.g. Kiambu, Ruiru near Nairobi) resolve to the hub,
// which is where the listings are.
const HUB_RADIUS_KM = 40;

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const r = (d: number) => (d * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

export function nearestCity(lat: number, lon: number): { country: Exclude<Country, "All">; city: string } | null {
  let best: (typeof CITIES)[number] | null = null;
  let bestKm = Infinity;
  for (const c of CITIES) {
    const km = distanceKm(lat, lon, c.lat, c.lon);
    if (km < bestKm) { best = c; bestKm = km; }
  }
  if (!best || bestKm > MAX_DISTANCE_KM) return null;
  const hub = CITIES.find((c) => c.hub && c.country === best!.country);
  if (hub && distanceKm(lat, lon, hub.lat, hub.lon) <= HUB_RADIUS_KM) return { country: hub.country, city: hub.city };
  return { country: best.country, city: best.city };
}

// Returns coordinates, or null if unavailable/denied. Only shows the permission prompt when `prompt` is true.
export async function getDevicePosition(prompt: boolean): Promise<{ lat: number; lon: number } | null> {
  try {
    if (Capacitor.isNativePlatform()) {
      let perm = await Geolocation.checkPermissions();
      if (perm.location !== "granted" && perm.coarseLocation !== "granted") {
        if (!prompt || perm.location === "denied") return null;
        perm = await Geolocation.requestPermissions({ permissions: ["location", "coarseLocation"] });
        if (perm.location !== "granted" && perm.coarseLocation !== "granted") return null;
      }
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 });
      return { lat: pos.coords.latitude, lon: pos.coords.longitude };
    }
    if (!("geolocation" in navigator)) return null;
    if (!prompt && navigator.permissions) {
      const state = await navigator.permissions.query({ name: "geolocation" as PermissionName });
      if (state.state !== "granted") return null;
    }
    const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }),
    );
    return { lat: pos.coords.latitude, lon: pos.coords.longitude };
  } catch {
    return null;
  }
}
