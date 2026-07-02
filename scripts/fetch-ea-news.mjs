/**
 * Disabled by default.
 *
 * This used to fetch live East African news into content_posts. That created off-brand
 * filler for Motokah, so it now refuses to run unless --allow-news is passed.
 * Sources: The Citizen TZ, Nation Africa KE, Monitor UG, KBC KE, AllAfrica EA
 * Run: node scripts/fetch-ea-news.mjs
 */
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
if (!process.argv.includes("--allow-news")) {
  console.error("Refusing to fetch/post generic news. Use scripts/seed-social-content.mjs for Motokah marketplace content.");
  console.error("If you really need this old behaviour, re-run with --allow-news.");
  process.exit(1);
}

const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, ".env"), "utf8").split("\n")
    .map(l => l.match(/^([A-Z_]+)=["']?(.*?)["']?\s*$/)).filter(Boolean)
    .map(m => [m[1], m[2]])
);
const SUPA_URL = env.VITE_SUPABASE_URL;
const SUPA_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const FEEDS = [
  { name: "The Citizen TZ", url: "https://www.thecitizen.co.tz/tanzania/feed", country: "Tanzania", pillar: "News" },
  { name: "Daily Nation KE", url: "https://nation.africa/kenya/feed", country: "Kenya", pillar: "News" },
  { name: "Daily Monitor UG", url: "https://www.monitor.co.ug/uganda/news/feed", country: "Uganda", pillar: "News" },
  { name: "KBC Kenya", url: "https://www.kbc.co.ke/feed/", country: "Kenya", pillar: "News" },
  { name: "AllAfrica East Africa", url: "https://allafrica.com/tools/headlines/rdf/eastafrica/headlines.rdf", country: "East Africa", pillar: "Regional News" },
];

// STRICT vehicle-only keywords — must match to be included
const CAR_KEYWORDS = [
  "car", "cars", "vehicle", "vehicles", "motor", "motors", "automobile", "auto",
  "petrol", "diesel", "fuel price", "fuel levy",
  "traffic", "road accident", "matatu", "boda boda", "bodaboda", "pikipiki",
  "import duty", "car import", "vehicle import", "duty free",
  "toyota", "nissan", "subaru", "mitsubishi", "honda", "mazda", "bmw", "mercedes",
  "land cruiser", "hilux", "pickup", "truck", "lorry", "bus", "minibus", "daladala",
  "motorcycle", "motorbike", "scooter", "bajaj", "tuk-tuk",
  "boat", "marine", "vessel", "ferry",
  "electric vehicle", "ev car", "hybrid car",
  "car dealer", "car market", "car sales", "used car", "new car",
  "ntsa", "tanroads", "traffic police", "driving licence", "vehicle registration",
];

function fetchRSS(urlStr) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const lib = u.protocol === "https:" ? https : http;
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: { "User-Agent": "Motokah/1.0 (+https://motokah.com)" },
      timeout: 8000,
    };
    const req = lib.request(options, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchRSS(res.headers.location).then(resolve).catch(reject);
      }
      let body = "";
      res.on("data", c => (body += c));
      res.on("end", () => resolve(body));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    req.end();
  });
}

function parseItems(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const inner = m[1];
    const get = tag => {
      const r = new RegExp(`<${tag}[^>]*>(?:<\\!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i");
      const mm = inner.match(r);
      return mm ? mm[1].replace(/<[^>]+>/g, "").trim() : "";
    };
    const title = get("title").slice(0, 120);
    const desc = get("description").slice(0, 300);
    const link = get("link");
    const pubDate = get("pubDate");
    if (title) items.push({ title, desc, link, pubDate });
  }
  return items;
}

function isRelevant(item, source) {
  const text = `${item.title} ${item.desc}`.toLowerCase();
  return CAR_KEYWORDS.some(k => text.includes(k));
}

function toIso(dateStr) {
  try { return new Date(dateStr).toISOString(); } catch { return new Date().toISOString(); }
}

// Swahili caption stubs for common topics
function swahiliStub(title) {
  const t = title.toLowerCase();
  if (t.includes("car") || t.includes("vehicle")) return "Gari hili linapatikana kwenye Motokah — sokoni bora Afrika Mashariki.";
  if (t.includes("fuel") || t.includes("petrol")) return "Bei ya mafuta inabadilika — angalia athari kwa soko la magari.";
  if (t.includes("economy") || t.includes("inflation")) return "Uchumi wa Afrika Mashariki unaendelea kukua.";
  if (t.includes("kenya")) return "Habari kutoka Kenya — toleo la leo.";
  if (t.includes("tanzania")) return "Habari kutoka Tanzania — toleo la leo.";
  if (t.includes("uganda")) return "Habari kutoka Uganda — toleo la leo.";
  return "Habari za leo kutoka Afrika Mashariki.";
}

async function supabaseInsert(posts) {
  const body = JSON.stringify(posts);
  return new Promise((resolve, reject) => {
    const u = new URL(`${SUPA_URL}/rest/v1/content_posts`);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        Prefer: "resolution=ignore-duplicates",
      },
    }, res => {
      let b = ""; res.on("data", c => (b += c)); res.on("end", () => resolve({ status: res.statusCode, body: b }));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const today = new Date();
  const allPosts = [];

  for (const feed of FEEDS) {
    console.log(`Fetching ${feed.name}...`);
    try {
      const xml = await fetchRSS(feed.url);
      const items = parseItems(xml);
      console.log(`  → ${items.length} items`);

      const relevant = items.filter(i => isRelevant(i, feed)).slice(0, 5);
      for (const item of relevant) {
        // Schedule 1 per day, starting tomorrow, spread across next 30 days
        const daysOffset = allPosts.length + 1;
        const scheduledDate = new Date(today);
        scheduledDate.setDate(today.getDate() + daysOffset);

        const cleanTitle = item.title.replace(/&#\d+;/g, " ").replace(/&amp;/g, "and").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
        const cleanDesc = (item.desc || cleanTitle).replace(/&#\d+;/g, " ").replace(/&amp;/g, "and").replace(/\s+/g, " ").trim().slice(0, 280);
        allPosts.push({
          title: cleanTitle.slice(0, 120),
          caption: `${feed.country}: ${cleanDesc}`,
          caption_sw: swahiliStub(cleanTitle),
          platform: "instagram",
          post_type: "news",
          pillar: feed.pillar,
          language: "en",
          status: "draft",
          scheduled_date: scheduledDate.toISOString().split("T")[0],
          media_urls: [],
        });
      }
    } catch (e) {
      console.log(`  ✗ ${e.message}`);
    }
  }

  console.log(`\nTotal posts to insert: ${allPosts.length}`);
  if (allPosts.length === 0) { console.log("No posts — check feed URLs"); return; }

  const result = await supabaseInsert(allPosts);
  console.log(`Supabase: HTTP ${result.status}`);
  if (result.status >= 400) console.log("Error:", result.body.slice(0, 200));
  else console.log("✅ Inserted", allPosts.length, "news posts to content_posts");

  // Print sample
  console.log("\nSample posts:");
  allPosts.slice(0, 3).forEach(p => console.log(`  [${p.country}] ${p.title.slice(0, 60)}`));
}

main().catch(console.error);
