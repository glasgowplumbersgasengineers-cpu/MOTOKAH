/**
 * Upload generated Instagram images to @motokahafrica
 * Flow: local PNG -> Supabase Storage (public URL) -> IG Graph API -> publish
 * Usage: node scripts/upload-to-instagram.mjs [--count=3]
 */
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import { loadEnv, requireEnv } from "./lib/env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GENERATED = path.join(ROOT, "content", "instagram", "generated");

const env = loadEnv(ROOT);
requireEnv(env, ["VITE_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "IG_GRAPH_TOKEN", "IG_USER_ID"]);
const SUPA_URL = env.VITE_SUPABASE_URL;
const SUPA_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const IG_TOKEN = env.IG_GRAPH_TOKEN;
const IG_UID = env.IG_USER_ID;
const BUCKET = "ig-posts";

async function ensureBucket() {
  const body = JSON.stringify({ id: BUCKET, name: BUCKET, public: true });
  return new Promise(resolve => {
    const u = new URL(`${SUPA_URL}/storage/v1/bucket`);
    const req = https.request({
      hostname: u.hostname, path: u.pathname, method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body), apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    }, res => { let b = ""; res.on("data", c => b += c); res.on("end", () => resolve({ status: res.statusCode, body: b })); });
    req.on("error", resolve);
    req.write(body); req.end();
  });
}

async function uploadToStorage(filePath, key) {
  const data = fs.readFileSync(filePath);
  return new Promise((resolve, reject) => {
    const u = new URL(`${SUPA_URL}/storage/v1/object/${BUCKET}/${key}`);
    const req = https.request({
      hostname: u.hostname, path: u.pathname, method: "POST",
      headers: { "Content-Type": "image/png", "Content-Length": data.length, apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "x-upsert": "true" },
    }, res => {
      let b = ""; res.on("data", c => b += c); res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(`${SUPA_URL}/storage/v1/object/public/${BUCKET}/${key}`);
        } else {
          reject(new Error(`Storage upload HTTP ${res.statusCode}: ${b.slice(0, 200)}`));
        }
      });
    });
    req.on("error", reject);
    req.write(data); req.end();
  });
}

function igPost(endpoint, params) {
  const qs = new URLSearchParams(params).toString();
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: "graph.facebook.com",
      path: `/v19.0/${endpoint}`,
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(qs) },
    }, res => {
      let b = ""; res.on("data", c => b += c); res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(b) }); }
        catch { resolve({ status: res.statusCode, data: { raw: b } }); }
      });
    });
    req.on("error", reject);
    req.write(qs); req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Clean launch posts only. Do not add generic news/fuel/holiday filler here.
const POSTS = [
  {
    file: "01-brand-reveal-welcome-to-motokah.png",
    caption: `Africa's first truly pan-African car marketplace is here. Buy and sell cars across East Africa.

Karibu Motokah. Sehemu moja ya kununua na kuuza magari kote Afrika Mashariki.

motokah.com

#motokah #eastafrica #cars #marketplace #kenya #tanzania #uganda #nairobi #daressalaam`,
  },
  {
    file: "02-what-is-motokah.png",
    caption: `Motokah helps buyers compare real cars, bikes, commercial vehicles and boats across East Africa.

Search by city, make, model and price. Then call or WhatsApp sellers directly.

Tafuta gari kwa city, bei, make na model. Rahisi, clear, direct.

motokah.com

#motokah #eastafrica #usedcars #carsforsale #kenya #tanzania #uganda`,
  },
  {
    file: "04-list-free-seller-cta.png",
    caption: `Got a car to sell? List it on Motokah FREE. No commission. Add photos, set your price, post - done.

Weka gari lako Motokah bure. Bila commission. Rahisi.

motokah.com

#motokah #sellcar #eastafrica #kenya #tanzania #freelist #marketplace`,
  },
];

async function main() {
  const countArg = process.argv.find(a => a.startsWith("--count="));
  const count = parseInt(countArg?.split("=")[1] || "3");

  console.log("Ensuring Supabase 'ig-posts' bucket...");
  const bucket = await ensureBucket();
  // 409 = already exists, 200/201 = created
  console.log(`  HTTP ${bucket.status} (409 = already exists)`);

  const toPost = POSTS.slice(0, count);
  for (let i = 0; i < toPost.length; i++) {
    const p = toPost[i];
    const filePath = path.join(GENERATED, p.file);
    if (!fs.existsSync(filePath)) {
      console.log(`\n[${i + 1}/${toPost.length}] SKIP: ${p.file} not found`);
      continue;
    }

    console.log(`\n[${i + 1}/${toPost.length}] ${p.file}`);
    console.log("  Uploading to Supabase Storage...");
    let imageUrl;
    try {
      imageUrl = await uploadToStorage(filePath, `motokah/${p.file}`);
      console.log(`  Public URL: ${imageUrl}`);
    } catch (e) {
      console.log(`  Upload ERROR: ${e.message}`);
      continue;
    }

    console.log("  Creating IG media container...");
    const container = await igPost(`${IG_UID}/media`, {
      image_url: imageUrl,
      caption: p.caption,
      access_token: IG_TOKEN,
    });
    console.log(`  Container HTTP ${container.status}:`, JSON.stringify(container.data).slice(0, 200));

    if (container.data.error) {
      console.log(`  IG ERROR: ${container.data.error.message} (code ${container.data.error.code})`);
      continue;
    }

    const creationId = container.data.id;
    console.log(`  Waiting 5s for IG to process image...`);
    await sleep(5000);

    console.log(`  Publishing creation_id ${creationId}...`);
    const pub = await igPost(`${IG_UID}/media_publish`, {
      creation_id: creationId,
      access_token: IG_TOKEN,
    });
    console.log(`  Publish HTTP ${pub.status}:`, JSON.stringify(pub.data).slice(0, 200));

    if (pub.data.id) {
      console.log(`  POSTED: https://www.instagram.com/p/... (IG Media ID: ${pub.data.id})`);
    } else if (pub.data.error) {
      console.log(`  Publish ERROR: ${pub.data.error.message}`);
    }

    if (i < toPost.length - 1) await sleep(3000); // rate limit gap
  }

  console.log("\nDone.");
}

main().catch(console.error);
