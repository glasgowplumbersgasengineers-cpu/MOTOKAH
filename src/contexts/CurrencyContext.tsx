import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "@/contexts/LocationContext";

export const CURRENCIES = ["TZS", "KES", "UGX", "RWF", "BIF", "ETB", "NGN", "USD"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  Tanzania: "TZS", Kenya: "KES", Uganda: "UGX", Rwanda: "RWF",
  Burundi: "BIF", Ethiopia: "ETB", Nigeria: "NGN",
};

interface CurrencyContextValue {
  currency: CurrencyCode | null;
  setCurrency: (currency: CurrencyCode | null) => void;
  followsLocation: boolean;
}

const STORAGE_KEY = "motokah_currency";
const CurrencyContext = createContext<CurrencyContextValue>({ currency: null, setCurrency: () => undefined, followsLocation: true });

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { country } = useLocation();
  const [preference, setPreference] = useState<CurrencyCode | "auto">(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return CURRENCIES.includes(stored as CurrencyCode) ? stored as CurrencyCode : "auto";
  });
  const setCurrency = useCallback((next: CurrencyCode | null) => {
    const value = next ?? "auto";
    setPreference(value);
    localStorage.setItem(STORAGE_KEY, value);
  }, []);
  const currency = preference === "auto" ? COUNTRY_CURRENCY[country] ?? null : preference;
  const value = useMemo(() => ({ currency, setCurrency, followsLocation: preference === "auto" }), [currency, preference, setCurrency]);

  useEffect(() => { document.documentElement.dataset.currency = currency ?? "original"; }, [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export const useCurrency = () => useContext(CurrencyContext);
