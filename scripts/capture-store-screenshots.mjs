import fs from "fs";
import path from "path";
import { execFileSync, spawn } from "child_process";
import { chromium } from "playwright";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "reports", "store-screenshots");
fs.mkdirSync(OUT, { recursive: true });

const CHROME_CANDIDATES = [
  "C:/Users/rapid/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe",
  "C:/Users/rapid/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
const executablePath = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await wait(500);
  }
  throw new Error(`Server did not start: ${url}`);
}

const server = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1"], {
  cwd: ROOT,
  shell: true,
  stdio: "pipe",
});

try {
  await waitForServer("http://127.0.0.1:8080");

  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
  const context = await browser.newContext({
    viewport: { width: 393, height: 873 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36",
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.setItem("motokah_welcome_completed", "true");
    localStorage.setItem("motokah_country", "Tanzania");
    localStorage.setItem("motokah_city", "Dar es Salaam");
  });

  const shots = [
    ["01-home", "/"],
    ["02-search-tanzania", "/search"],
    ["03-dealers", "/dealers"],
    ["04-ibaraki-dealer", "/dealer/dealer-ibaraki"],
    ["05-sell", "/sell"],
  ];

  for (const [name, route] of shots) {
    await page.goto(`http://127.0.0.1:8080${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("body", { timeout: 10000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
    console.log(`${name}: ${route}`);
  }

  await browser.close();
  console.log(`Screenshots written: ${OUT}`);
} finally {
  if (process.platform === "win32" && server.pid) {
    try {
      execFileSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
    } catch {}
  } else {
    server.kill();
  }
}
