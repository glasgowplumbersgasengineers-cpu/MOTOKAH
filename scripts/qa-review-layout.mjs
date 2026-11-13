import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 18080;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
  stdio: "ignore",
});

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch { /* Server still starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Vite did not start");
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chrome", headless: true });
  for (const device of [
    { name: "iphone", viewport: { width: 430, height: 932 }, isMobile: true },
    { name: "ipad", viewport: { width: 820, height: 1180 }, isMobile: true },
  ]) {
    const context = await browser.newContext({ viewport: device.viewport, isMobile: device.isMobile });
    await context.addInitScript(() => localStorage.setItem("motokah_welcome_completed", "true"));
    const page = await context.newPage();
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));

    for (const route of ["/", "/search", "/auth"]) {
      await page.goto(`${base}${route}`, { waitUntil: "commit", timeout: 45000 });
      await page.locator("body").waitFor({ state: "attached" });
      // CI Mac runners are slow; wait for the route to paint instead of a fixed delay.
      await page.waitForFunction(() => document.body.innerText.trim().length >= 50, null, { timeout: 20000 }).catch(() => {});
      if (route === "/search") await page.getByRole("textbox", { name: "Search vehicles" }).waitFor({ timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(500);
      const layout = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyText: document.body.innerText.trim().length,
      }));
      if (layout.scrollWidth > layout.width + 2) failures.push(`${route}: horizontal overflow ${layout.scrollWidth - layout.width}px`);
      if (layout.bodyText < 50) failures.push(`${route}: blank or nearly blank screen`);
      if (route === "/auth") {
        // Social login was deliberately removed (Apple rejection fix) — assert
        // the real current form (email/password) renders, and that no
        // orphaned social-login button has come back.
        if (!(await page.locator('input[type="email"]').isVisible())) {
          failures.push("/auth: email input missing");
        }
        if (await page.getByText(/sign in with apple|continue with google|continue with facebook/i).count()) {
          failures.push("/auth: a removed social-login button has reappeared");
        }
      }
      if (route === "/search" && !(await page.getByRole("textbox", { name: "Search vehicles" }).isVisible())) {
        failures.push("/search: search field missing");
      }
    }
    await context.close();
    if (failures.length) throw new Error(`${device.name}: ${failures.join("; ")}`);
    console.log(`${device.name}: home, search and auth layout passed`);
  }
} finally {
  await browser?.close();
  server.kill();
}
