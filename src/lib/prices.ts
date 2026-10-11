import { useEffect, useMemo, useState } from "react";
import { type Country } from "@/contexts/LocationContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const COUNTRY_CURRENCY: Record<Exclude<Country, "All">, string> = {
  Tanzania: "TZS",
  Kenya: "KES",
  Uganda: "UGX",
  Rwanda: "RWF",
  Burundi: "BIF",
  Ethiopia: "ETB",
  Nigeria: "NGN",
};

const FALLBACK_USD_RATES: Record<string, number> = {
  USD: 1,
  TZS: 2600,
  KES: 129,
  UGX: 3600,
  RWF: 1450,
  BIF: 2950,
  ETB: 130,
  NGN: 1550,
};

const CACHE_KEY = "motokah_exchange_rates_usd";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

interface CachedRates {
  fetchedAt: number;
  rates: Record<string, number>;
}

function readCachedRates(): Record<string, number> | null {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null") as CachedRates | null;
    if (!cached?.rates || Date.now() - cached.fetchedAt > CACHE_TTL_MS) return null;
    return cached.rates;
  } catch {
    return null;
  }
}

async function fetchUsdRates(): Promise<Record<string, number>> {
  const response = await fetch("https://open.er-api.com/v6/latest/USD", {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Exchange rate request failed");
  const data = await response.json();
  if (!data?.rates) throw new Error("Exchange rate response missing rates");
  return data.rates as Record<string, number>;
}

function convertPrice(amount: number, fromCurrency: string, toCurrency: string, rates: Record<string, number>) {
  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  if (!amount || amount <= 0 || !fromRate || !toRate) return null;
  return Math.round((amount / fromRate) * toRate);
}

export function currencyForCountry(country: Country): string | null {
  if (country === "All") return null;
  return COUNTRY_CURRENCY[country] || null;
}

export function formatVehiclePrice(
  amount: number,
  currency: string,
  options?: { targetCurrency?: string | null; rates?: Record<string, number> | null; showApprox?: boolean },
) {
  if (!amount || amount <= 0) return "Contact for price";

  const targetCurrency = options?.targetCurrency || currency;
  const converted = targetCurrency === currency
    ? amount
    : convertPrice(amount, currency, targetCurrency, options?.rates || FALLBACK_USD_RATES);
  const displayAmount = converted ?? amount;
  const displayCurrency = converted ? targetCurrency : currency;
  const prefix = options?.showApprox && displayCurrency !== currency ? "≈ " : "";

  return `${prefix}${displayCurrency} ${displayAmount.toLocaleString()}`;
}

export function usePriceFormatter() {
  const { currency: targetCurrency } = useCurrency();
  const [rates, setRates] = useState<Record<string, number> | null>(() => readCachedRates());

  useEffect(() => {
    let cancelled = false;
    if (rates) return;

    fetchUsdRates()
      .then((nextRates) => {
        if (cancelled) return;
        setRates(nextRates);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), rates: nextRates }));
      })
      .catch(() => {
        if (!cancelled) setRates(FALLBACK_USD_RATES);
      });

    return () => {
      cancelled = true;
    };
  }, [rates]);

  return useMemo(() => ({
    targetCurrency,
    rates: rates || FALLBACK_USD_RATES,
    format: (amount: number, currency: string) => formatVehiclePrice(amount, currency, {
      targetCurrency,
      rates: rates || FALLBACK_USD_RATES,
      showApprox: true,
    }),
  }), [targetCurrency, rates]);
}
