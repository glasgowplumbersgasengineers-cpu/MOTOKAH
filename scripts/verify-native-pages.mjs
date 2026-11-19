import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:4173";
const b = await chromium.launch({ executablePath: "C:/Users/rapid/AppData/Local/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-win64/chrome-headless-shell.exe" });
const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await p.route(/clarity\.ms|google-analytics|googletagmanager|facebook/, (r) => r.abort());
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
let fails = 0;
async function check(label, shot) {
  await p.waitForTimeout(2500);
  const t = ((await p.textContent("body")) || "").trim();
  const ok = t.length > 400 && !/Something went wrong/i.test(t);
  if (!ok) fails++;
  await p.screenshot({ path: `D:/MOTOKAH/reports/native-check/${shot}.png` });
  console.log(`${ok ? "PASS" : "FAIL"} ${label} -> ${p.url()} (${t.length} chars)`);
}
await p.goto(`${BASE}/tanzania/new-cars`, { waitUntil: "load" }); await check("new cars list", "1-newcars");
await p.click("a[href^='/tanzania/new-cars/']"); await check("click first model", "2-newcar-model");
await p.goto(`${BASE}/kenya/new-cars`, { waitUntil: "load" }); await check("kenya new cars", "3-kenya");
await p.goto(`${BASE}/brands/toyota`, { waitUntil: "load" }); await check("brand toyota", "4-brand");
await p.click("a[href^='/brands/toyota/']"); await check("click brand model", "5-brand-model");
console.log("page errors:", JSON.stringify(errs));
await b.close();
process.exit(fails || errs.length ? 1 : 0);
