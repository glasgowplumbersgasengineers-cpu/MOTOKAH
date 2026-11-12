import { test, expect } from "@playwright/test";

// Every PUBLIC route from src/App.tsx (no auth required). Keep this list in
// sync with App.tsx — it's the real route table, not a guessed subset.
// Dynamic-param routes use a placeholder that 404s gracefully (NotFound page),
// which is itself a valid thing to verify (no blank screen / crash on bad slug).
const PUBLIC_ROUTES = [
  "/welcome",
  "/",
  "/search",
  "/auth",
  "/reset-password",
  "/compare",
  "/about",
  "/contact",
  "/faq",
  "/how-it-works",
  "/safety",
  "/blog",
  "/careers",
  "/terms",
  "/privacy",
  "/stationery",
  "/dealers",
  "/promo",
  "/brand-centre",
  "/buy-car-for-family-in-east-africa",
  "/duty-calculator",
  "/this-route-does-not-exist-qa-probe",
];

for (const route of PUBLIC_ROUTES) {
  test(`${route} loads without crashing, no console errors, no horizontal overflow`, async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.addInitScript(() => localStorage.setItem("motokah_welcome_completed", "true"));
    const response = await page.goto(route, { waitUntil: "commit", timeout: 45000 });
    expect(response?.status(), `${route} should not 5xx`).toBeLessThan(500);

    await page.locator("body").waitFor({ state: "attached" });
    await page.waitForTimeout(1000);

    const bodyText = await page.evaluate(() => document.body.innerText.trim().length);
    expect(bodyText, `${route} rendered a blank/near-blank page`).toBeGreaterThan(20);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${route} has horizontal overflow (${overflow}px) — likely clipped/mispositioned element`).toBeLessThanOrEqual(2);

    expect(pageErrors, `${route} threw uncaught JS errors: ${pageErrors.join(" | ")}`).toHaveLength(0);
    // NotFound.tsx intentionally logs a 404 analytics error — expected, not a bug.
    const realConsoleErrors = consoleErrors.filter((e) => !/favicon|ERR_INTERNET_DISCONNECTED|User attempted to access non-existent route/i.test(e));
    expect(realConsoleErrors, `${route} logged console errors: ${realConsoleErrors.join(" | ")}`).toHaveLength(0);
  });
}

// NOTE: the notification-bell dropdown overflow fix (2026-11-12) can't be
// regression-tested here yet — NotificationBell renders null for a logged-out
// user, and there's no authenticated test account credential available (see
// FEATURE_INVENTORY.md blockers). Add a real test once that's unblocked;
// don't fake one in the meantime.

test("search page: input accepts focus, keyboard typing, and text appears", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("motokah_welcome_completed", "true"));
  await page.goto("/search");
  const searchInputs = page.getByRole("textbox");
  const count = await searchInputs.count();
  expect(count, "/search should have at least one text input").toBeGreaterThan(0);
  const input = searchInputs.first();
  await input.click();
  await expect(input).toBeFocused();
  await page.keyboard.type("Toyota");
  await expect(input).toHaveValue(/Toyota/);
});

test("auth page: email and password inputs accept focus and typing, no leftover social-login buttons", async ({ page }) => {
  await page.goto("/auth");
  const email = page.getByLabel(/email/i).or(page.locator('input[type="email"]')).first();
  await expect(email).toBeVisible({ timeout: 10000 });
  await email.click();
  await email.fill("qa-probe@example.com");
  await expect(email).toHaveValue("qa-probe@example.com");

  // Regression guard: social login was deliberately removed for the Apple
  // rejection fix. If this starts failing, someone re-added it — flag, don't
  // silently "fix" by deleting the assertion.
  await expect(page.getByText(/sign in with apple/i)).toHaveCount(0);
  await expect(page.getByText(/continue with google/i)).toHaveCount(0);
  await expect(page.getByText(/continue with facebook/i)).toHaveCount(0);
});
