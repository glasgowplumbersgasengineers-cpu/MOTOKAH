import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { getDevicePosition, nearestCity } from "@/lib/geo";

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

      // Method 1: device location (native plugin in the app, so the prompt names Motokah).
      const pos = await getDevicePosition(true);
      const near = pos && nearestCity(pos.lat, pos.lon);
      if (near) {
        const result: DetectedLocation = { ...near, method: "gps" };
        setLocation(result);
        localStorage.setItem("motokah_location", JSON.stringify(result));
        setLoading(false);
        return;
      }

      // Method 2: IP-based geolocation via our Vercel proxy.
      try {
        const geoUrl = Capacitor.isNativePlatform() ? "https://www.motokah.com/api/geo" : "/api/geo";
        const response = await fetch(geoUrl, {
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
