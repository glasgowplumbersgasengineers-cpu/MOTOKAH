import { chromium } from "playwright";
import http from "http";

// Mimics the native app: a page on a DIFFERENT origin embeds www.motokah.com in an iframe,
// exactly like WebContentGate does from capacitor://localhost. Passes only if real content renders.
const paths = (process.argv[2] || "").split(",").filter(Boolean);
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`<iframe id="f" src="https://www.motokah.com${u.searchParams.get("p")}" style="width:400px;height:800px"></iframe>`);
}).listen(5599);

const browser = await chromium.launch({
  executablePath: "C:/Users/rapid/AppData/Local/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-win64/chrome-headless-shell.exe",
});
const page = await browser.newPage({ viewport: { width: 420, height: 820 } });
let fails = 0;
for (const p of paths) {
  await page.goto(`http://localhost:5599/?p=${encodeURIComponent(p)}`);
  await page.waitForTimeout(7000);
  const frame = page.frames().find((f) => f.url().includes("motokah.com"));
  let text = "";
  try { text = frame ? ((await frame.textContent("body")) || "").trim() : ""; } catch {}
  const ok = text.length > 200;
  if (!ok) fails++;
  const shot = `D:/MOTOKAH/reports/iframe-check/${p.replace(/[^a-z0-9]+/gi, "_")}.png`;
  await page.screenshot({ path: shot });
  console.log(`${ok ? "PASS" : "FAIL"}  ${p}  (frame text ${text.length} chars)  ${shot}`);
}
await browser.close();
server.close();
process.exit(fails ? 1 : 0);
