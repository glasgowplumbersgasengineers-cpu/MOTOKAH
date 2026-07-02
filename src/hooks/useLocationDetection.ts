import { useState, useEffect } from "react";

export type Country = "Tanzania" | "Kenya" | "Uganda" | "Rwanda" | "Burundi" | "Ethiopia" | "Nigeria" | "All";

interface DetectedLocation {
  country: Country;
  city: string;
  method: "gps" | "ip" | "timezone" | "manual";
}

const countryCitiesMap: Record<string, string[]> = {
  Tanzania: ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Morogoro", "Tanga", "Kigoma", "Moshi", "Zanzibar"],
  Kenya: ["Nairobi", "Mombasa", "Nakuru", "Kisumu", "Eldoret", "Ruiru", "Kikuyu", "Thika", "Kiambu"],
  Uganda: ["Kampala", "Entebbe", "Jinja", "Mukono", "Mbarara", "Gulu", "Arua", "Lira"],
  Rwanda: ["Kigali", "Butare", "Ruhengeri", "Byumba"],
  Burundi: ["Bujumbura"],
  Ethiopia: ["Addis Ababa", "Adama", "Bahir Dar", "Hawassa", "Dire Dawa"],
  Nigeria: ["Lagos", "Abuja", "Ibadan", "Kano", "Port Harcourt", "Benin City", "Kaduna"],
};

const countryFromCoords = (lat: number, lon: number): Country | null => {
  // Rough bounding boxes for East African countries
  if (lat >= -12 && lat <= -1 && lon >= 29 && lon <= 41) return "Tanzania";
  if (lat >= -5 && lat <= 5 && lon >= 33 && lon <= 42) return "Kenya";
  if (lat >= -2 && lat <= 4 && lon >= 29 && lon <= 35) return "Uganda";
  if (lat >= -3 && lat <= -1 && lon >= 28 && lon <= 31) return "Rwanda";
  if (lat >= -4.5 && lat <= -2.3 && lon >= 29 && lon <= 30.9) return "Burundi";
  if (lat >= 3 && lat <= 15 && lon >= 33 && lon <= 48) return "Ethiopia";
  if (lat >= 4 && lat <= 14 && lon >= 2 && lon <= 15) return "Nigeria";
  return null;
};

const detectFromTimezone = (): Country => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes("Nairobi") || tz.includes("Mombasa")) return "Kenya";
    if (tz.includes("Dar_es_Salaam") || tz.includes("Tanzania")) return "Tanzania";
    if (tz.includes("Kampala") || tz.includes("Uganda")) return "Uganda";
    if (tz.includes("Kigali") || tz.includes("Rwanda")) return "Rwanda";
    if (tz.includes("Addis")) return "Ethiopia";
    if (tz.includes("Lagos") || tz.includes("Abuja")) return "Nigeria";
    
    const lang = navigator.language;
    if (lang === "sw") return "Tanzania";
    if (lang === "en-KE" || lang === "sw-KE") return "Kenya";
    if (lang === "en-NG") return "Nigeria";
    
    return "Tanzania"; // Default fallback
  } catch {
    return "Tanzania";
  }
};

export function useLocationDetection() {
  const [location, setLocation] = useState<DetectedLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detect = async () => {
      setLoading(true);
      setError(null);

      // Check if already saved
      const saved = localStorage.getItem("motokah_location");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setLocation(parsed);
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem("motokah_location");
        }
      }

      // Method 1: GPS/Geolocation API
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            });
          });

          const { latitude, longitude } = position.coords;
          const country = countryFromCoords(latitude, longitude);

          if (country) {
            const result: DetectedLocation = {
              country,
              city: countryCitiesMap[country]?.[0] || "",
              method: "gps",
            };
            setLocation(result);
            localStorage.setItem("motokah_location", JSON.stringify(result));
            setLoading(false);
            return;
          }
        } catch (err) {
          console.log("GPS detection failed:", err);
        }
      }

      // Method 2: IP-based geolocation via our Vercel proxy.
      try {
        const response = await fetch("/api/geo", {
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
          const data = await response.json();
          const countryMap: Record<string, Country> = {
            TZ: "Tanzania", KE: "Kenya", UG: "Uganda",
            RW: "Rwanda", BI: "Burundi", ET: "Ethiopia", NG: "Nigeria",
          };
          const country = countryMap[data.country_code];
          if (country) {
            const result: DetectedLocation = {
              country,
              city: data.city || countryCitiesMap[country]?.[0] || "",
              method: "ip",
            };
            setLocation(result);
            localStorage.setItem("motokah_location", JSON.stringify(result));
            setLoading(false);
            return;
          }
        }
      } catch {
        console.log("IP detection failed");
      }

      // Method 3: Timezone fallback
      const country = detectFromTimezone();
      const result: DetectedLocation = {
        country,
        city: countryCitiesMap[country]?.[0] || "",
        method: "timezone",
      };
      setLocation(result);
      localStorage.setItem("motokah_location", JSON.stringify(result));
      setLoading(false);
    };

    detect();
  }, []);

  const setManualLocation = (country: Country, city: string) => {
    const result: DetectedLocation = { country, city, method: "manual" };
    setLocation(result);
    localStorage.setItem("motokah_location", JSON.stringify(result));
  };

  const clearLocation = () => {
    localStorage.removeItem("motokah_location");
    setLocation(null);
  };

  return { location, loading, error, setManualLocation, clearLocation, countryCitiesMap };
}
