import { chromium } from "playwright";

// Phone-size check for every public page: scroll to the very bottom and make sure no page
// content (and no other floating bar) sits behind the fixed bottom tab bar.
// Pass a base URL; add "native" as 3rd arg to simulate the Capacitor app.
const BASE = process.argv[2] || "http://localhost:4173";
const NATIVE = process.argv[3] === "native";
const PATHS = [
  "/", "/search", "/dealers", "/compare", "/about", "/contact", "/faq", "/how-it-works", "/safety",
  "/blog", "/careers", "/terms", "/privacy", "/duty-calculator", "/tanzania/duty-calculator",
  "/tanzania/new-cars", "/kenya/new-cars", "/brands/toyota", "/city/dar-es-salaam", "/country/tanzania",
  "/buy-car-for-family-in-east-africa", "/cars/toyota/in/dar-es-salaam", "/brand-centre", "/nope-404",
];

const b = await chromium.launch({ executablePath: "C:/Users/rapid/AppData/Local/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-win64/chrome-headless-shell.exe" });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
if (NATIVE) await ctx.addInitScript(() => { window.androidBridge = { postMessage() {} }; });
await ctx.addInitScript(() => { try { localStorage.setItem("motokah_country", "Tanzania"); localStorage.setItem("motokah_welcome_seen", "1"); } catch {} });
await ctx.route(/clarity\.ms|google-analytics|googletagmanager|facebook/, (r) => r.abort());

// Discover a real dealer, listing, brand model and new-car model page from the site itself.
const p0 = await ctx.newPage();
await p0.goto(`${BASE}/dealers`, { waitUntil: "load" });
await p0.waitForTimeout(6000);
const dealer = await p0.$eval("a[href^='/dealer/']", (a) => a.getAttribute("href")).catch(() => null);
await p0.goto(`${BASE}/search`, { waitUntil: "load" });
await p0.waitForTimeout(6000);
const listing = await p0.$eval("a[href^='/listing/']", (a) => a.getAttribute("href")).catch(() => null);
await p0.goto(`${BASE}/brands/toyota`, { waitUntil: "load" });
await p0.waitForTimeout(3000);
const model = await p0.$eval("a[href^='/brands/toyota/']", (a) => a.getAttribute("href")).catch(() => null);
await p0.goto(`${BASE}/tanzania/new-cars`, { waitUntil: "load" });
await p0.waitForTimeout(3000);
const newCar = await p0.$eval("a[href^='/tanzania/new-cars/']", (a) => a.getAttribute("href")).catch(() => null);
await p0.close();
for (const extra of [dealer, listing, model, newCar]) if (extra) PATHS.push(extra);

let fails = 0;
for (const path of PATHS) {
  const p = await ctx.newPage();
  await p.goto(`${BASE}${path}`, { waitUntil: "load" });
  await p.waitForTimeout(3500);
  // Scroll in steps so lazy content loads, then sit at the true bottom.
  for (let i = 0; i < 30; i++) {
    const done = await p.evaluate(() => { scrollBy(0, 1500); return innerHeight + scrollY >= document.documentElement.scrollHeight - 2; });
    await p.waitForTimeout(250);
    if (done) break;
  }
  await p.waitForTimeout(1200);
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const nav = document.querySelector(".bottom-nav");
    if (!nav || getComputedStyle(nav).display === "none") return { nav: false };
    const navTop = nav.getBoundingClientRect().top;
    const isFixed = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const pos = getComputedStyle(e).position; if (pos === "fixed" || pos === "sticky") return e; } return null; };
    const hidden = [];
    const overlapBars = [];
    for (const el of document.body.querySelectorAll("a, button, h1, h2, h3, h4, p, img, input, select, li, span")) {
      if (nav.contains(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) continue;
      if (rect.right < 0 || rect.left > innerWidth) continue; // off-screen carousel items
      const fixedParent = isFixed(el);
      if (fixedParent) {
        if (getComputedStyle(fixedParent).position === "fixed" && rect.bottom > navTop + 1 && rect.top < innerHeight && !fixedParent.closest("[role=dialog]")) {
          overlapBars.push((el.textContent || el.tagName).trim().slice(0, 40));
        }
        continue;
      }
      if (rect.bottom > navTop + 1 && rect.top < innerHeight) hidden.push((el.textContent || el.getAttribute("alt") || el.tagName).trim().slice(0, 40));
    }
    return { nav: true, navTop: Math.round(navTop), hidden: [...new Set(hidden)].slice(0, 4), overlapBars: [...new Set(overlapBars)].slice(0, 4) };
  });
  const ok = !r.nav || (r.hidden.length === 0 && r.overlapBars.length === 0);
  if (!ok) fails++;
  const shot = `D:/MOTOKAH/reports/native-check/bottom-${path.replace(/\W+/g, "_")}.png`;
  await p.screenshot({ path: shot });
  console.log(`${ok ? "PASS" : "FAIL"} ${path}${r.nav ? "" : " (no tab bar)"}${r.hidden?.length ? " hidden: " + JSON.stringify(r.hidden) : ""}${r.overlapBars?.length ? " bar-overlap: " + JSON.stringify(r.overlapBars) : ""}`);
  await p.close();
}
await b.close();
console.log(fails ? `${fails} page(s) FAILED` : "ALL PAGES CLEAR");
process.exit(fails ? 1 : 0);
