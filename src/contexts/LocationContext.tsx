import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { getDevicePosition, nearestCity } from "@/lib/geo";

export type Country = "Tanzania" | "Kenya" | "Uganda" | "Rwanda" | "Burundi" | "Ethiopia" | "Nigeria" | "All";

interface LocationContextType {
  country: Country;
  city: string;
  setCountry: (c: Country) => void;
  setCity: (c: string) => void;
}

const COUNTRY_KEY = "motokah_country";
const CITY_KEY = "motokah_city";

const LocationContext = createContext<LocationContextType>({
  country: "All",
  city: "",
  setCountry: () => {},
  setCity: () => {},
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<Country>(() => {
    const saved = localStorage.getItem(COUNTRY_KEY) as Country;
    return saved || "All";
  });
  const [city, setCityState] = useState(() => localStorage.getItem(CITY_KEY) || "");

  const setCountry = useCallback((c: Country) => {
    setCountryState(c);
    localStorage.setItem(COUNTRY_KEY, c);
    window.dispatchEvent(new Event("motokah-location-updated"));
  }, []);

  const setCity = useCallback((c: string) => {
    setCityState(c);
    localStorage.setItem(CITY_KEY, c);
    window.dispatchEvent(new Event("motokah-location-updated"));
  }, []);

  // Listen for storage changes from Welcome page
  useEffect(() => {
    const handleStorage = () => {
      const savedCountry = localStorage.getItem(COUNTRY_KEY) as Country;
      const savedCity = localStorage.getItem(CITY_KEY);
      if (savedCountry) setCountryState(savedCountry);
      if (savedCity) setCityState(savedCity);
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("motokah-location-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("motokah-location-updated", handleStorage);
    };
  }, []);

  // Follow the device's real city on every open/resume, unless the user explicitly chose one.
  // Users from before this existed have no source recorded; their saved value came from the old
  // (buggy) detection, so they are treated as auto.
  useEffect(() => {
    let running = false;
    const refresh = async () => {
      if (running) return;
      if (!localStorage.getItem("motokah_welcome_completed")) return;
      if (localStorage.getItem("motokah_location_source") === "manual") return;
      running = true;
      try {
        const pos = await getDevicePosition(Capacitor.isNativePlatform());
        const near = pos && nearestCity(pos.lat, pos.lon);
        if (!near) return;
        localStorage.setItem("motokah_location_source", "auto");
        if (near.country !== localStorage.getItem(COUNTRY_KEY)) setCountry(near.country);
        if (near.city !== localStorage.getItem(CITY_KEY)) setCity(near.city);
      } finally {
        running = false;
      }
    };
    refresh();
    if (Capacitor.isNativePlatform()) {
      const sub = App.addListener("appStateChange", ({ isActive }) => { if (isActive) refresh(); });
      return () => { sub.then((s) => s.remove()); };
    }
  }, [setCountry, setCity]);

  const value = useMemo(() => ({ country, city, setCountry, setCity }), [country, city, setCountry, setCity]);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
