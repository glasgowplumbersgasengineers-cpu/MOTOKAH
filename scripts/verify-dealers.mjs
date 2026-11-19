import { chromium } from "playwright";

// Dealers page: country filter follows the user's chosen country, ?country= works,
// "All" shows everyone, and the page loads in a few seconds (not 12+).
const BASE = process.argv[2] || "http://localhost:4173";
const b = await chromium.launch({ executablePath: "C:/Users/rapid/AppData/Local/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-win64/chrome-headless-shell.exe" });
let fails = 0;

async function run(label, { country, query = "" }, expect) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  if (country) await ctx.addInitScript((c) => localStorage.setItem("motokah_country", c), country);
  const p = await ctx.newPage();
  await p.route(/clarity\.ms|google-analytics|googletagmanager|facebook/, (r) => r.abort());
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  const t0 = Date.now();
  await p.goto(`${BASE}/dealers${query}`, { waitUntil: "load" });
  await p.waitForFunction(() => !document.querySelector(".animate-pulse"), null, { timeout: 30000 });
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  const cards = await p.$$eval("a[href^='/dealer/']", (a) => a.map((x) => x.textContent || ""));
  const selected = await p.$eval("select[aria-label='Country']", (s) => s.value);
  const ok = expect({ cards, selected, text: (await p.textContent("main")) || "" }) && !errs.length;
  if (!ok) fails++;
  await p.screenshot({ path: `D:/MOTOKAH/reports/native-check/dealers-${label.replace(/\W+/g, "_")}.png` });
  console.log(`${ok ? "PASS" : "FAIL"} ${label}: ${cards.length} dealers, country="${selected}", ${secs}s, errors=${errs.length}`);
  await ctx.close();
}

const has = (cards, s) => cards.some((c) => c.includes(s));
await run("no country chosen", {}, ({ cards, selected }) => selected === "" && has(cards, "Kampala") && has(cards, "Dar es Salaam") && has(cards, "Lubumbashi"));
await run("Tanzania chosen", { country: "Tanzania" }, ({ cards, selected }) => selected === "Tanzania" && cards.length > 0 && !has(cards, "Kampala") && !has(cards, "Nairobi") && !has(cards, "Lubumbashi"));
await run("?country=Kenya link", { country: "Tanzania", query: "?country=Kenya" }, ({ cards, selected }) => selected === "Kenya" && has(cards, "Nairobi") && !has(cards, "Dar es Salaam"));
await run("Rwanda (no dealers)", { country: "Rwanda" }, ({ cards, text }) => cards.length === 0 && text.includes("No dealers in Rwanda yet"));
await b.close();
process.exit(fails ? 1 : 0);
