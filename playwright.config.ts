import { defineConfig, devices } from "@playwright/test";

const PORT = 18090;

export default defineConfig({
  testDir: "./tests/e2e",
  // Not fully parallel: a single `vite preview` instance backs all tests, and
  // the app's mockData chunk is ~5.6MB — hammering it concurrently caused
  // real timeouts/blank-page false positives, not actual app bugs. See
  // docs/qa/BUG_REGISTER.md for the diagnosis.
  fullyParallel: false,
  // Fully serialized: two projects (mobile-chrome, desktop-chrome) × 24 tests
  // all hit the same single `vite preview` instance. workers:4 reintroduced
  // the exact resource-contention timeouts this was fixed for, just under CI's
  // weaker shared CPU instead of a local machine. Reliability over speed here.
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "mobile-chrome", use: { ...devices["Pixel 7"], channel: "chrome" } },
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
  ],
  webServer: {
    command: `npx vite preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
