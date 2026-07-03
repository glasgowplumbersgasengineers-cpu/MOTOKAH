/**
 * Seed a clean Motokah social content calendar.
 *
 * Defaults to preview mode. Use --apply to write to Supabase.
 * Use --replace-pending to delete existing draft/pending/approved non-published content first.
 *
 * Examples:
 *   node scripts/seed-social-content.mjs
 *   node scripts/seed-social-content.mjs --days=365 --apply
 *   node scripts/seed-social-content.mjs --days=365 --apply --replace-pending
 */
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadEnv, requireEnv } from "./lib/env.mjs";
import { isSafeMotokahPost, safetyReason } from "../content/instagram/content-strategy.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const env = loadEnv(ROOT);

const APPLY = process.argv.includes("--apply");
const REPLACE_PENDING = process.argv.includes("--replace-pending");
const daysArg = process.argv.find((arg) => arg.startsWith("--days="));
const startArg = process.argv.find((arg) => arg.startsWith("--start="));
const DAYS = Number(daysArg?.split("=")[1] || 365);
const START = startArg?.split("=")[1] || new Date().toISOString().slice(0, 10);

const cities = [
  { city: "Dar es Salaam", country: "Tanzania", sw: "Dar es Salaam, magari yapo Motokah." },
  { city: "Nairobi", country: "Kenya", sw: "Nairobi, pata gari yako kwa urahisi." },
  { city: "Kampala", country: "Uganda", sw: "Kampala, compare magari kabla ya kupiga simu." },
  { city: "Mombasa", country: "Kenya", sw: "Mombasa, tafuta gari safi karibu nawe." },
  { city: "Arusha", country: "Tanzania", sw: "Arusha, gari ya safari au familia iko Motokah." },
  { city: "Kigali", country: "Rwanda", sw: "Kigali, browse stock mpya kila wiki." },
  { city: "Addis Ababa", country: "Ethiopia", sw: "Addis Ababa, compare listings before you call." },
];

const vehiclePairs = [
  ["Toyota", "Harrier"],
  ["Toyota", "Land Cruiser"],
  ["Toyota", "Hilux"],
  ["Toyota", "Prado"],
  ["Toyota", "RAV4"],
  ["Nissan", "X-Trail"],
  ["Nissan", "Navara"],
  ["Subaru", "Forester"],
  ["Subaru", "XV"],
  ["Mazda", "CX-5"],
  ["Honda", "Vezel"],
  ["Mitsubishi", "Outlander"],
  ["BMW", "320i"],
  ["Mercedes-Benz", "C-Class"],
];
const dealerNames = ["Al-Husnain Motors", "Mgaya Motors TZ", "Khushi Motors", "Nairobi Drive", "Gari Gurus Kenya"];

function addDays(date, offset) {
  const d = new Date(`${date}T09:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

function pick(list, index) {
  return list[index % list.length];
}

function postForDay(index) {
  const date = addDays(START, index);
  const city = pick(cities, index);
  const [make, model] = pick(vehiclePairs, index);
  const dealer = pick(dealerNames, index);
  const weekday = new Date(`${date}T09:00:00Z`).getUTCDay();
  const week = Math.floor(index / 7);
  const buyerTips = [
    ["Check mileage before you fall in love", "Quick buyer tip: before paying a deposit, compare the mileage with the service history, tyres, interior wear and import documents. A clean listing should make inspection easier, not harder."],
    ["Ask for the logbook before deposit", "A serious seller should be comfortable showing ownership documents and matching details before you send money. View the car, verify the paperwork, then negotiate."],
    ["Photos tell you where to inspect first", "Motokah buyer tip: look closely at bumper gaps, tyres, dashboard lights, seat wear and paint tone before visiting a car. Good listing photos save time and help you ask better questions."],
    ["Compare similar cars before calling", "One price alone does not tell the full story. Compare year, mileage, condition, fuel type and location before deciding which seller deserves your time."],
  ];
  const dealerAngles = [
    "stock spotlight",
    "dealer page spotlight",
    "fresh inventory watch",
    "showroom trust check",
  ];
  const boatAngles = [
    ["Boats are now part of Motokah", "Motokah is growing beyond cars. Buyers can now browse selected boats and marine listings too, starting with clean stock pages and direct seller contact."],
    ["Marine listings need clear photos too", "A good boat listing should show the hull, engine, interior, deck, controls and paperwork. Motokah is building cleaner pages for buyers who want details before they call."],
    ["From coast roads to coast waters", "East Africa does not stop at cars. Motokah is testing boat listings for coastal buyers, tour operators and marine sellers who need direct enquiries."],
  ];
  const [tipTitle, tipCaption] = pick(buyerTips, week);
  const [boatTitle, boatCaption] = pick(boatAngles, week);

  const templates = [
    {
      post_type: "feed",
      pillar: "Listings",
      title: `${make} ${model} watch in ${city.city}`,
      caption: `Looking for a ${make} ${model} in ${city.city}? Browse real vehicle listings on Motokah, compare year, mileage, photos and seller details, then call or WhatsApp directly. No noise, just cars worth checking.`,
      caption_sw: `${city.sw} Angalia picha, bei, mileage na details kabla ya kuwasiliana na seller.`,
    },
    {
      post_type: "feed",
      pillar: "Education",
      title: tipTitle,
      caption: tipCaption,
      caption_sw: "Kidokezo: usitume deposit kabla hujaona gari, documents na seller details.",
    },
    {
      post_type: "feed",
      pillar: "Dealer",
      title: `${dealer} ${pick(dealerAngles, week)}`,
      caption: `${dealer} is the kind of dealer page Motokah is built for: real photos, direct contact and cars buyers can compare by city, price and specs. Dealers can bring stock online without making buyers chase screenshots.`,
      caption_sw: "Dealer akipakia magari vizuri, buyer anaweza kuona stock, picha na details haraka.",
    },
    {
      post_type: "feed",
      pillar: "Brand",
      title: `Built for car buyers in ${city.country}`,
      caption: `Motokah is built for how East Africa actually buys vehicles: mobile first, WhatsApp friendly, city based and easy to compare. Start with your country, then browse cars near you.`,
      caption_sw: "Motokah ni rahisi kutumia kwenye simu. Chagua nchi/city, kisha browse magari karibu nawe.",
    },
    {
      post_type: "feed",
      pillar: "Promotion",
      title: "Dealers: put your stock where buyers search",
      caption: `If your cars are already on Instagram, Motokah can turn that stock into searchable listings with cleaner photos, specs, WhatsApp contact and dealer pages that rank on Google.`,
      caption_sw: "Dealer, stock yako inaweza kuonekana vizuri zaidi Motokah na Google.",
    },
    {
      post_type: "feed",
      pillar: "Culture",
      title: `From ${city.city}: what would you drive?`,
      caption: `${city.city} buyers are not all looking for the same thing. Some need a family SUV, some need a pickup for work, some need a small daily car. Motokah helps each buyer narrow the search.`,
      caption_sw: `${city.city}: SUV, pickup au gari ndogo ya kila siku? Tafuta kwa filter Motokah.`,
    },
    {
      post_type: "feed",
      pillar: "Boats",
      title: boatTitle,
      caption: boatCaption,
      caption_sw: "Sio magari tu. Motokah pia inaongeza boats na marine listings.",
    },
  ];

  return {
    ...templates[weekday],
    platform: "instagram",
    language: "en+sw",
    scheduled_date: date,
    media_urls: [],
    status: "pending",
  };
}

const posts = Array.from({ length: DAYS }, (_, index) => postForDay(index))
  .filter((post) => {
    const safe = isSafeMotokahPost(post);
    if (!safe) console.warn(`Blocked generated post "${post.title}": ${safetyReason(post)}`);
    return safe;
  });

console.log(`Prepared ${posts.length} safe posts from ${START} for ${DAYS} days.`);
console.log(posts.slice(0, 10).map((post) => `${post.scheduled_date} | ${post.pillar} | ${post.title}`).join("\n"));

if (!APPLY) {
  const out = path.join(ROOT, "content", "instagram", "year-plan-preview.json");
  fs.writeFileSync(out, JSON.stringify(posts, null, 2));
  console.log(`Preview written: ${out}`);
  console.log("No database changes. Re-run with --apply to seed Supabase.");
  process.exit(0);
}

requireEnv(env, ["VITE_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

if (REPLACE_PENDING) {
  const { error } = await supabase
    .from("content_posts")
    .delete()
    .in("status", ["draft", "pending", "approved", "rejected"]);
  if (error) throw error;
  console.log("Deleted existing draft/pending/approved/rejected content_posts.");
}

const batchSize = 100;
for (let i = 0; i < posts.length; i += batchSize) {
  const batch = posts.slice(i, i + batchSize);
  const { error } = await supabase.from("content_posts").insert(batch);
  if (error) throw error;
  console.log(`Inserted ${Math.min(i + batch.length, posts.length)}/${posts.length}`);
}

console.log("Done. Review the queue in /admin/content, approve the ones you want, then run auto-post.");
