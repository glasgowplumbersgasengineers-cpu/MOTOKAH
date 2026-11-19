import { chromium } from "playwright";

// Loads key pages at phone size and checks every listing photo: where it comes from
// (should be images.motokah.com, never r2.dev) and that it actually rendered.
const BASE = process.argv[2] || "http://localhost:4173";
const b = await chromium.launch({ executablePath: "C:/Users/rapid/AppData/Local/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-win64/chrome-headless-shell.exe" });
let fails = 0;

for (const path of ["/", "/search", "/dealers"]) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const p = await ctx.newPage();
  await p.route(/clarity\.ms|google-analytics|googletagmanager|facebook/, (r) => r.abort());
  const t0 = Date.now();
  await p.goto(`${BASE}${path}`, { waitUntil: "load" });
  await p.waitForTimeout(4000);
  for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, 900); await p.waitForTimeout(800); }
  await p.waitForTimeout(3000);
  const imgs = await p.$$eval("img", (els) => els.map((e) => ({ src: e.currentSrc || e.src, ok: e.complete && e.naturalWidth > 0, lazy: e.loading === "lazy", inView: e.getBoundingClientRect().top < innerHeight * 6 })));
  const photos = imgs.filter((i) => /images\.motokah\.com|r2\.dev|supabase\.co\/storage/.test(i.src));
  const r2dev = photos.filter((i) => i.src.includes("r2.dev"));
  const newHost = photos.filter((i) => i.src.includes("images.motokah.com"));
  const broken = photos.filter((i) => !i.ok && i.inView);
  const ok = r2dev.length === 0 && broken.length === 0 && photos.length > 0;
  if (!ok) fails++;
  await p.screenshot({ path: `D:/MOTOKAH/reports/native-check/images-${path.replace(/\W+/g, "_") || "home"}.png` });
  console.log(`${ok ? "PASS" : "FAIL"} ${path}: photos=${photos.length} new-domain=${newHost.length} r2dev=${r2dev.length} broken=${broken.length} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  for (const x of broken.slice(0, 5)) console.log("   broken:", x.src);
  await ctx.close();
}
await b.close();
process.exit(fails ? 1 : 0);
