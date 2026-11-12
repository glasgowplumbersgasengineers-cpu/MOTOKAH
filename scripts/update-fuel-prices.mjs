#!/usr/bin/env node
// Scrapes real pump prices from globalpetrolprices.com (which sources them from
// EWURA/EPRA/RURA/etc regulatory gazettes) and writes src/data/fuelPrices.json.
// Run manually: node scripts/update-fuel-prices.mjs
// Run automatically: .github/workflows/update-fuel-prices.yml (monthly cron)
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "..", "src", "data", "fuelPrices.json");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Each country lists the fuels that have a real, live-tracked source on
// globalpetrolprices.com. Fuels with no reliable live data (e.g. Uganda
// kerosene, which the source reports as 0.000) are intentionally left out
// rather than frozen at a stale manual number forever.
const COUNTRIES = [
  {
    name: "Tanzania",
    source: "EWURA Monthly Energy Regulatory Cap",
    fuels: [
      { name: "Super Petrol", slug: "gasoline_prices" },
      { name: "Automotive Diesel", slug: "diesel_prices" },
      { name: "Kerosene", slug: "kerosene_prices" },
    ],
  },
  {
    name: "Kenya",
    source: "EPRA Petroleum Pricing Pump Guidelines",
    fuels: [
      { name: "Super Petrol", slug: "gasoline_prices" },
      { name: "Diesel", slug: "diesel_prices" },
      { name: "Kerosene", slug: "kerosene_prices" },
    ],
  },
  {
    name: "Uganda",
    source: "Ministry of Energy & Mineral Development",
    fuels: [
      { name: "Petrol (PMS)", slug: "gasoline_prices" },
      { name: "Diesel (AGO)", slug: "diesel_prices" },
    ],
  },
  {
    name: "Rwanda",
    source: "RURA Energy Regulatory Board",
    fuels: [
      { name: "Premium Petrol", slug: "gasoline_prices" },
      { name: "Gas Oil (Diesel)", slug: "diesel_prices" },
    ],
  },
  {
    name: "Ethiopia",
    source: "Ministry of Trade and Regional Integration",
    fuels: [
      { name: "Benzene / Petrol", slug: "gasoline_prices" },
      { name: "Automotive Diesel", slug: "diesel_prices" },
    ],
  },
  {
    name: "Burundi",
    source: "Ministry of Hydraulics, Energy & Mines",
    fuels: [
      { name: "Super Essence", slug: "gasoline_prices" },
      { name: "Gasoil Diesel", slug: "diesel_prices" },
    ],
  },
  {
    name: "Nigeria",
    source: "NMDPRA Downstream Petroleum Authority",
    fuels: [
      { name: "Premium Motor Spirit (PMS)", slug: "gasoline_prices" },
      { name: "Automotive Gas Oil (AGO)", slug: "diesel_prices" },
    ],
  },
];

function toNumber(raw) {
  return Number(raw.replace(/,/g, ""));
}

function formatIsoDate(iso) {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

function formatH1Date(h1) {
  // e.g. "09-Nov-2026" -> "Nov 2026"
  const match = h1.match(/(\d{2})-([A-Za-z]{3})-(\d{4})/);
  if (!match) return null;
  return `${match[2]} ${match[3]}`;
}

// Weekly-tracked countries (Tanzania, Kenya, Rwanda, Nigeria): the page has a
// "Current price" row inside a "Price (CUR/Liter)" table plus a "Last update"
// date, and a second historical table with a real "One month ago" value we
// use to compute an honest trend instead of a fabricated one.
function parseWeeklyPattern(html) {
  const priceMatch = html.match(
    /Price \((\w{3})\/Liter\)[\s\S]*?Current price<\/td>\s*<td[^>]*>([\d,.]+)<\/td>/
  );
  const dateMatch = html.match(/Last update<\/td>\s*<td[^>]*>([\d-]+)<\/td>/);
  if (!priceMatch || !dateMatch) return null;

  const currency = priceMatch[1];
  const price = toNumber(priceMatch[2]);
  const updated = formatIsoDate(dateMatch[1]);

  // Second table: Current price / One month ago / Three months ago / One year ago
  const historyMatch = html.match(
    /Current price<\/td>\s*<td[^>]*align="center">[\d,.]+<\/td>\s*<td[^>]*align="center">-<\/td>\s*<\/tr>\s*<tr>\s*<td[^>]*>&nbsp;One month ago<\/td>\s*<td[^>]*align="center">([\d,.]+)<\/td>\s*<td[^>]*align="center">([\d.-]+)\s*%<\/td>/
  );

  let trend;
  let change;
  if (historyMatch) {
    const monthAgo = toNumber(historyMatch[1]);
    const pctRaw = Number(historyMatch[2]);
    // globalpetrolprices reports "percent change" as the drop from monthAgo to
    // current (positive = current is lower). Recompute directly from the two
    // prices so the sign matches "current vs a month ago" semantics the UI expects.
    const pct = monthAgo > 0 ? ((price - monthAgo) / monthAgo) * 100 : 0;
    trend = pct > 0.05 ? "up" : pct < -0.05 ? "down" : "stable";
    change = `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
  }

  return { currency, price, updated, trend, change };
}

// Monthly-regulated countries (Uganda, Ethiopia, Burundi): simpler table, no
// "Current price" label, no historical comparison available from this page —
// so no trend is reported rather than guessing one.
function parseMonthlyPattern(html) {
  const h1Match = html.match(/<h1>([^<]*)<\/h1>/);
  const rowMatch = html.match(/<th[^>]*>&nbsp;(\w{3})<\/th>\s*<td[^>]*>([\d,.]+)<\/td>/);
  if (!h1Match || !rowMatch) return null;

  const price = toNumber(rowMatch[2]);
  if (price === 0) return null; // source reports no real data for this fuel/country

  return {
    currency: rowMatch[1],
    price,
    updated: formatH1Date(h1Match[1]) || "recently",
  };
}

async function fetchFuelPrice(country, fuel) {
  const url = `https://www.globalpetrolprices.com/${country}/${fuel.slug}/`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  const html = await res.text();
  return parseWeeklyPattern(html) || parseMonthlyPattern(html);
}

async function main() {
  const result = {};

  for (const country of COUNTRIES) {
    const fuels = [];
    let currency = null;
    let updated = null;

    for (const fuel of country.fuels) {
      try {
        const parsed = await fetchFuelPrice(country.name, fuel);
        if (!parsed) {
          console.warn(`[skip] ${country.name} ${fuel.name}: no live data on source`);
          continue;
        }
        currency = parsed.currency;
        updated = parsed.updated;
        fuels.push({
          name: fuel.name,
          price: parsed.price,
          ...(parsed.trend ? { trend: parsed.trend, change: parsed.change } : {}),
        });
      } catch (err) {
        console.error(`[fail] ${country.name} ${fuel.name}:`, err.message);
      }
      // Be polite to the source — small delay between requests.
      await new Promise((r) => setTimeout(r, 500));
    }

    if (fuels.length === 0) {
      console.error(`[fail] ${country.name}: no fuels resolved, keeping previous data`);
      continue;
    }

    result[country.name] = {
      currency,
      source: country.source,
      updated,
      fuels,
    };
  }

  if (Object.keys(result).length === 0) {
    console.error("No countries resolved — refusing to overwrite fuelPrices.json with empty data");
    process.exit(1);
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(result).length} countries to ${OUTPUT_PATH}`);
}

main();
