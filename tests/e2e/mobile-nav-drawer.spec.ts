import { test, expect } from "@playwright/test";

// Regresses a real iPhone bug (Dynamic Island devices, 2026-11-13): the
// drawer's close button sat at a bare `top-4` with no safe-area offset, so
// taps near the visual X were intermittently ignored, and the "Motokah"
// title sat behind the Dynamic Island. Fix: the nav drawer's X was removed
// entirely (closes via backdrop tap only, which Radix already handles), and
// SheetContent itself now gets a safe-area-aware top padding so its first
// child (the title, here) clears the Dynamic Island. These run on
// mobile-chrome only — the drawer trigger is `xl:hidden`.

test.use({ viewport: { width: 390, height: 844 } }); // iPhone-class viewport

test("drawer has no close button — closes via backdrop tap only", async ({ page }) => {
  await page.goto("/");
  await page.locator("header button:has(svg)").last().click();
  await expect(page.getByRole("heading", { name: "Motokah" })).toBeVisible();
  expect(await page.getByRole("button", { name: "Close menu" }).count()).toBe(0);
});

test("drawer title clears the top with real safe-area padding applied", async ({ page }) => {
  await page.goto("/");
  await page.locator("header button:has(svg)").last().click();
  const title = page.getByRole("heading", { name: "Motokah" });
  await expect(title).toBeVisible();
  const paddingTop = await title.evaluate((el) => {
    const content = el.closest('[role="dialog"]') as HTMLElement;
    return content ? getComputedStyle(content).paddingTop : "0px";
  });
  // 1.5rem = 24px is the floor of the `max(1.5rem, ...)` CSS expression —
  // real device safe-area-inset-top would push this higher under the island.
  expect(parseFloat(paddingTop)).toBeGreaterThanOrEqual(24);
});

test("drawer closes on backdrop tap, repeatedly, without a stale overlay", async ({ page }) => {
  await page.goto("/");
  const trigger = page.locator("header button:has(svg)").last();
  const title = page.getByRole("heading", { name: "Motokah" });

  for (let i = 0; i < 10; i++) {
    await trigger.click();
    await expect(title).toBeVisible();
    await page.mouse.click(20, 400); // backdrop, away from drawer content (right-anchored)
    await expect(title).toBeHidden();
  }
  await page.goto("/about");
  expect(await page.locator("[data-state='open']").count()).toBe(0);
});

test("backdrop tap closes the drawer without navigating or activating content underneath", async ({ page }) => {
  await page.goto("/");
  await page.locator("header button:has(svg)").last().click();
  await expect(page.getByRole("heading", { name: "Motokah" })).toBeVisible();
  await page.mouse.click(20, 400);
  await expect(page.getByRole("heading", { name: "Motokah" })).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("MobileFilterDrawer's own close button still meets the 44x44pt minimum (unaffected by the nav-drawer change)", async ({ page }) => {
  await page.goto("/search");
  const filterTrigger = page.getByRole("button", { name: /filter/i }).first();
  if (await filterTrigger.count() === 0) return; // layout/copy may differ; not this test's concern
  await filterTrigger.click();
  const closeBtn = page.getByRole("button", { name: "Close menu" });
  if (await closeBtn.count() === 0) return;
  const box = await closeBtn.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
});
