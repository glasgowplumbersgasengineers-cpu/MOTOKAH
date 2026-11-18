import { supabase } from "@/integrations/supabase/client";
import { convertPrice, FALLBACK_USD_RATES } from "./prices";

// Protects against listings priced far off from what the same make and model
// is actually selling for on Motokah, e.g. a car worth around 30M typed in as
// 300M, or a typo that drops a zero. Requested by a user (Shajeel), who gave
// the Harrier (roughly 30M-40M) as the example of a bracket that should not
// let someone list it at 25M or 60M.
//
// There is no fixed price table per model: those go stale and vary by year,
// trim and country. Instead this compares the new price to the median of
// other approved listings for the same make and model already on Motokah,
// which is real, current, crowd-sourced data. New or rare models with too
// few listings to compare against are left alone rather than guessed at.

export interface PriceCheckResult {
  status: "ok" | "unusual" | "not_enough_data";
  sampleSize: number;
  medianUsd?: number;
  enteredUsd?: number;
  ratio?: number;
}

const MIN_SAMPLE = 3;
// Outside this band of the market median, the seller is asked to confirm
// before posting. This is deliberately wide: real price negotiation, rare
// trims and damaged cars can land outside the usual range, so this catches
// only the typo-level, order-of-magnitude mistakes Shajeel described.
const LOW_RATIO = 0.25;
const HIGH_RATIO = 4;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export async function checkPriceAgainstMarket(
  make: string,
  model: string,
  price: number,
  currency: string,
  rates: Record<string, number> = FALLBACK_USD_RATES,
): Promise<PriceCheckResult> {
  if (!make || !model || !price || price <= 0) return { status: "not_enough_data", sampleSize: 0 };

  const { data, error } = await supabase
    .from("listings")
    .select("price, currency")
    .eq("status", "approved")
    .ilike("make", make)
    .ilike("model", model)
    .not("price", "is", null)
    .gt("price", 0)
    .limit(60);

  if (error || !data) return { status: "not_enough_data", sampleSize: 0 };

  const usdValues = data
    .map((row) => convertPrice(Number(row.price), row.currency, "USD", rates))
    .filter((v): v is number => v != null && v > 0);

  if (usdValues.length < MIN_SAMPLE) return { status: "not_enough_data", sampleSize: usdValues.length };

  const enteredUsd = convertPrice(price, currency, "USD", rates);
  if (!enteredUsd) return { status: "not_enough_data", sampleSize: usdValues.length };

  const medianUsd = median(usdValues);
  const ratio = enteredUsd / medianUsd;
  const status = ratio < LOW_RATIO || ratio > HIGH_RATIO ? "unusual" : "ok";
  return { status, sampleSize: usdValues.length, medianUsd, enteredUsd, ratio };
}
