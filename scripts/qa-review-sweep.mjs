// App Review sweep: every main screen at iPhone and iPad sizes, logged out and signed in as the review account. Run after `npm run build`: node scripts/qa-review-sweep.mjs
import { spawn } from "node:child_process";
import fs from "node:fs";
import { chromium } from "playwright";

const port = 18090;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { stdio: "ignore" });
const creds = fs.readFileSync("secrets/apple-review-account.txt", "utf8");
const email = /[\w.+-]+@[\w.-]+\.\w+/.exec(creds)[0];
const password = /pass(?:word)?\s*[:=]\s*(\S+)/i.exec(creds)[1];

const publicRoutes = ["/", "/search", "/search?bodyType=SUV", "/search?make=Toyota&condition=Used", "/auth", "/how-it-works", "/faq", "/about", "/contact", "/safety", "/terms", "/privacy", "/dealers", "/duty-calculator", "/compare", "/blog", "/careers", "/reset-password", "/no-such-page"];
const authedRoutes = ["/sell", "/profile", "/messages", "/wishlist", "/become-dealer"];
const devices = [
  { name: "iPhone SE", viewport: { width: 375, height: 667 } },
  { name: "iPhone Pro Max", viewport: { width: 430, height: 932 } },
  { name: "iPad portrait", viewport: { width: 820, height: 1180 } },
  { name: "iPad landscape", viewport: { width: 1180, height: 820 } },
];

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(base)).ok) return; } catch { /* starting */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("preview did not start");
}

const findings = [];
let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ channel: "chrome", headless: true });
  for (const device of devices) {
    const context = await browser.newContext({ viewport: device.viewport, isMobile: true, hasTouch: true });
    await context.addInitScript(() => localStorage.setItem("motokah_welcome_completed", "true"));
    const page = await context.newPage();
    let current = "";
    const note = (msg) => findings.push(`${device.name} ${current}: ${msg}`);
    page.on("pageerror", (e) => note(`JS error: ${e.message.slice(0, 140)}`));
    page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|net::ERR|favicon|clarity/i.test(m.text())) note(`console: ${m.text().slice(0, 140)}`); });

    const check = async (route) => {
      current = route;
      await page.goto(`${base}${route}`, { waitUntil: "commit", timeout: 45000 });
      await page.waitForFunction(() => (document.body?.innerText || "").trim().length >= 50, null, { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(900);
      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const wide = [...document.querySelectorAll("body *")].filter((e) => {
          const b = e.getBoundingClientRect();
          if (!b.width || !b.height || b.right <= vw + 2) return false;
          for (let p = e.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === "auto" || o === "scroll" || o === "hidden") return false; }
          return true;
        }).slice(0, 2).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 40)}`);
        const small = [...document.querySelectorAll("button, a[href], input, select")].filter((e) => {
          const b = e.getBoundingClientRect(); const s = getComputedStyle(e);
          return b.width > 0 && b.height > 0 && s.visibility !== "hidden" && (b.width < 24 || b.height < 24) && (e.innerText || e.getAttribute("aria-label") || "").trim();
        }).length;
        return { text: document.body.innerText.trim().length, overflow: document.documentElement.scrollWidth - vw, wide, small, path: location.pathname, errorBoundary: /Something went wrong/.test(document.body.innerText) };
      });
      if (r.errorBoundary) note("crash screen (Something went wrong)");
      if (r.text < 50) note("blank or nearly blank");
      if (r.overflow > 2) note(`horizontal overflow ${r.overflow}px ${r.wide.join(", ")}`);
      if (r.small > 3) note(`${r.small} tap targets under 24px`);
      return r;
    };

    for (const route of publicRoutes) await check(route);
    // A real listing page: open the first result.
    current = "/search -> listing";
    await page.goto(`${base}/search`, { waitUntil: "commit" });
    const first = page.locator('a[href^="/listing/"]').first();
    await first.waitFor({ timeout: 20000 }).catch(() => {});
    const href = await first.getAttribute("href").catch(() => null);
    if (href) await check(href); else note("no listing link found on /search");

    // Sign in with the review account, then the signed-in screens.
    current = "/auth sign-in";
    await page.goto(`${base}/auth`, { waitUntil: "commit" });
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('form button[type="submit"]').click();
    await page.waitForURL((u) => !u.pathname.startsWith("/auth"), { timeout: 20000 }).catch(() => note("sign-in did not leave /auth"));
    for (const route of authedRoutes) {
      const r = await check(route);
      if (r.path.startsWith("/auth")) note("bounced to /auth while signed in");
    }
    if (device.name === "iPhone Pro Max") {
      current = "/profile";
      await page.goto(`${base}/profile`, { waitUntil: "commit" });
      await page.waitForTimeout(2500);
      const hasDelete = await page.getByText(/delete (my )?account/i).count();
      if (!hasDelete) note("no Delete Account control found");
    }
    await context.close();
    console.log(`${device.name}: swept`);
  }
} finally {
  await browser?.close();
  server.kill();
}
console.log(findings.length ? `FINDINGS (${findings.length}):\n` + [...new Set(findings)].join("\n") : "NO FINDINGS");
