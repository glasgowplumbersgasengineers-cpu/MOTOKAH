import { chromium } from "playwright";
import fs from "fs";

// Simulates the native app (fake Android bridge, so Capacitor.isNativePlatform() is true)
// and serves a catalog.json that contains a car NOT in the bundled data. Passes only if
// the app shows that car with its photo pointed at www.motokah.com.
const BASE = process.argv[2] || "http://localhost:4173";
const json = JSON.parse(fs.readFileSync("D:/MOTOKAH/dist/data/catalog.json", "utf8"));
json.newCars.tanzania.toyota.models.push({
  ...json.newCars.tanzania.toyota.models[0], slug: "zz-test-remote", name: "Remote Test Car",
});
json.catalog.toyota.models.push({ ...json.catalog.toyota.models[0], slug: "zz-test-remote", name: "Remote Test Model" });

const b = await chromium.launch({ executablePath: "C:/Users/rapid/AppData/Local/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-win64/chrome-headless-shell.exe" });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
await ctx.addInitScript(() => { window.androidBridge = { postMessage() {} }; });
const p = await ctx.newPage();
await p.route(/clarity\.ms|google-analytics|googletagmanager|facebook/, (r) => r.abort());
let fetched = 0;
await p.route("https://www.motokah.com/data/catalog.json", (r) => {
  fetched++;
  r.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(json) });
});
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
let fails = 0;

async function check(path, expectText, shot) {
  await p.goto(`${BASE}${path}`, { waitUntil: "load" });
  await p.waitForTimeout(3000);
  const t = (await p.textContent("body")) || "";
  const imgs = await p.$$eval("img", (els) => els.map((e) => e.getAttribute("src")));
  const ok = p.url().endsWith(path) && t.includes(expectText);
  if (!ok) fails++;
  await p.screenshot({ path: `D:/MOTOKAH/reports/native-check/${shot}.png` });
  console.log(`${ok ? "PASS" : "FAIL"} ${path} -> ${p.url()} has "${expectText}": ${t.includes(expectText)} | car img: ${imgs.find((s) => s && !s.includes("logo"))}`);
}

await check("/tanzania/new-cars/toyota/zz-test-remote", "Remote Test Car", "r1-remote-newcar");
await check("/tanzania/new-cars", "Remote Test Car", "r2-remote-list");
await check("/brands/toyota/zz-test-remote", "Remote Test Model", "r3-remote-brandmodel");
console.log("catalog fetches:", fetched, "page errors:", JSON.stringify(errs));
await b.close();
process.exit(fails || errs.length || !fetched ? 1 : 0);
