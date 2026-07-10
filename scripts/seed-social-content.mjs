/**
 * Seed a clean Motokah social content calendar.
 *
 * Defaults to preview mode. Use --apply to write to Supabase.
 * Use --replace-pending to delete existing draft/pending/approved/rejected content first.
 *
 * Examples:
 *   node scripts/seed-social-content.mjs
 *   node scripts/seed-social-content.mjs --days=365 --apply
 *   node scripts/seed-social-content.mjs --days=365 --start=2026-07-10 --apply --replace-pending
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

function addDays(date, offset) {
  const d = new Date(`${date}T09:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

const launchPlan = [
  {
    pillar: "Dealer",
    title: "Dealers: put your stock where buyers search",
    caption: "If your cars are already on Instagram, Motokah can turn that stock into searchable listings with cleaner photos, specs, WhatsApp contact and dealer pages that buyers can find on Google.",
    caption_sw: "Dealer, stock yako inaweza kuonekana vizuri zaidi Motokah na Google.",
  },
  {
    pillar: "Education",
    title: "Ask for car documents before deposit",
    caption: "Before paying a car deposit, ask for ownership documents, chassis details, clear seller contact and inspection time. A serious seller should make vehicle verification easy.",
    caption_sw: "Usitume deposit kabla hujaona documents, seller details na gari lenyewe.",
  },
  {
    pillar: "Listings",
    title: "Toyota Harrier watch in Dar es Salaam",
    caption: "Shopping for a Toyota Harrier in Dar es Salaam? Compare year, mileage, photos and seller details on Motokah before you call or WhatsApp.",
    caption_sw: "Dar es Salaam, compare Toyota Harrier kwa picha, mileage na seller details kabla ya kupiga simu.",
  },
  {
    pillar: "Brand",
    title: "Built for car buyers in Tanzania",
    caption: "Motokah is built for how East Africa buys vehicles: mobile first, WhatsApp friendly, city based and easy to compare. Start with Tanzania, then browse cars near you.",
    caption_sw: "Motokah ni rahisi kwenye simu. Chagua nchi/city, kisha browse magari karibu nawe.",
  },
  {
    pillar: "Dealer",
    title: "Mgaya Motors TZ showroom spotlight",
    caption: "Dealer pages on Motokah help buyers see stock, photos, prices, location and direct contact in one place instead of chasing screenshots across chats.",
    caption_sw: "Dealer page inaonyesha stock, picha, bei na contact sehemu moja.",
  },
  {
    pillar: "Boats",
    title: "Boats are now part of Motokah",
    caption: "Motokah is growing beyond cars. Buyers can now browse selected boats and marine listings too, starting with clean stock pages and direct seller contact.",
    caption_sw: "Sio magari tu. Motokah pia inaongeza boats na marine listings.",
  },
  {
    pillar: "Culture",
    title: "From Arusha: what would you drive?",
    caption: "Arusha buyers are not all looking for the same thing. Some need a safari-ready 4x4, some need a family SUV, some need a daily car. Motokah helps narrow the search.",
    caption_sw: "Arusha: 4x4, SUV au gari ya kila siku? Tafuta kwa filter Motokah.",
  },
  {
    pillar: "Promotion",
    title: "Claim your Motokah dealer page",
    caption: "If your showroom already has cars online, claim your Motokah dealer page so buyers can search your stock by city, price, make and body type.",
    caption_sw: "Claim dealer page yako Motokah ili buyers waone stock yako vizuri.",
  },
  {
    pillar: "Dealer",
    title: "Al-Husnain Motors dealer spotlight",
    caption: "Premium dealer stock deserves a premium page. Motokah helps buyers compare vehicles from showrooms like Al-Husnain by photos, specs and direct contact.",
    caption_sw: "Stock nzuri inahitaji page safi yenye picha, specs na contact.",
  },
  {
    pillar: "Dealer",
    title: "Khushi Motors dealer spotlight",
    caption: "Motokah dealer pages are made for serious showrooms: searchable inventory, local SEO, buyer trust and WhatsApp-friendly contact.",
    caption_sw: "Showroom serious inahitaji inventory inayopatikana kwa search na WhatsApp.",
  },
  {
    pillar: "Dealer",
    title: "Ibaraki Motors dealer spotlight",
    caption: "Clean photos and real dealer pages build trust fast. Motokah helps buyers inspect stock before they call and helps dealers look ready online.",
    caption_sw: "Picha safi na dealer page hujenga trust kabla buyer hajapiga simu.",
  },
  {
    pillar: "Education",
    title: "Instagram post vs searchable listing",
    caption: "An Instagram post disappears fast. A Motokah listing can be searched by make, city, price, mileage and seller, then discovered again from Google.",
    caption_sw: "Post ya Instagram hupotea haraka. Listing Motokah inaweza kutafutwa tena na tena.",
  },
  {
    pillar: "Listings",
    title: "Toyota Hilux watch in Tanzania",
    caption: "Toyota Hilux buyers in Tanzania can compare pickups by year, mileage, photos, price and city before contacting the seller directly.",
    caption_sw: "Tanzania, compare Toyota Hilux kwa year, mileage, picha, bei na city.",
  },
  {
    pillar: "Education",
    title: "Compare similar cars before calling",
    caption: "One price alone does not tell the full story. Compare year, mileage, fuel type, transmission, location and seller details before deciding which car deserves your time.",
    caption_sw: "Bei peke yake haitoshi. Compare year, mileage, fuel, transmission na seller details.",
  },
  {
    pillar: "Listings",
    title: "Toyota Harrier Tanzania buyer search",
    caption: "Toyota Harrier remains one of the most searched SUVs in East Africa. Motokah makes it easier to compare Harrier listings across Tanzanian cities.",
    caption_sw: "Toyota Harrier ni SUV inayotafutwa sana. Motokah inarahisisha compare listings.",
  },
  {
    pillar: "Listings",
    title: "Toyota Prado Tanzania buyer search",
    caption: "Looking for a Toyota Prado in Tanzania? Use Motokah to compare photos, year, mileage and seller contact before arranging an inspection.",
    caption_sw: "Unatafuta Toyota Prado Tanzania? Compare picha, year, mileage na contact Motokah.",
  },
  {
    pillar: "Listings",
    title: "Mazda Demio Tanzania buyer search",
    caption: "Small daily cars matter too. Motokah helps buyers compare compact cars like Mazda Demio by city, price, mileage and seller details.",
    caption_sw: "Gari ndogo za kila siku pia ni muhimu. Compare Mazda Demio Motokah.",
  },
  {
    pillar: "Promotion",
    title: "WhatsApp-friendly car shopping",
    caption: "Motokah keeps the buyer journey simple: browse listings, compare specs, check photos, then call or WhatsApp the seller directly.",
    caption_sw: "Browse, compare, kisha call au WhatsApp seller moja kwa moja.",
  },
  {
    pillar: "Education",
    title: "Photos tell you where to inspect first",
    caption: "Look closely at bumper gaps, tyres, dashboard lights, seat wear and paint tone before visiting a car. Good listing photos help you ask better questions.",
    caption_sw: "Angalia tyres, dashboard, seats na paint kabla ya kwenda inspection.",
  },
  {
    pillar: "Culture",
    title: "From Mwanza: family car or work car?",
    caption: "Different buyers need different vehicles. Motokah helps Mwanza buyers narrow the search by SUV, sedan, hatchback, pickup, van and price.",
    caption_sw: "Mwanza, tafuta SUV, sedan, pickup au van kwa filter Motokah.",
  },
  {
    pillar: "Brand",
    title: "Local pages for local car searches",
    caption: "Motokah is building local pages for Tanzania, Kenya and East Africa so buyers can search cars by country, city, dealer and model.",
    caption_sw: "Motokah inajenga local pages kwa nchi, city, dealer na model.",
  },
  {
    pillar: "Listings",
    title: "Used cars in Dar es Salaam",
    caption: "Dar es Salaam is Tanzania's biggest car market. Motokah helps buyers compare dealer stock in one searchable place.",
    caption_sw: "Dar es Salaam ni soko kubwa la magari Tanzania. Compare stock Motokah.",
  },
  {
    pillar: "Dealer",
    title: "Dealer pages that buyers can trust",
    caption: "A strong dealer page needs real photos, clear contact, city, stock, prices where available and enough detail for a buyer to decide who to call.",
    caption_sw: "Dealer page nzuri ina picha, contact, city, stock, bei na details.",
  },
  {
    pillar: "Boats",
    title: "Marine listings need clear photos too",
    caption: "A good boat listing should show the hull, engine, interior, deck, controls and paperwork. Motokah is building cleaner pages for marine buyers too.",
    caption_sw: "Boat listing nzuri ionyeshe hull, engine, interior, controls na documents.",
  },
  {
    pillar: "Brand",
    title: "Tanzania first, East Africa next",
    caption: "Motokah is starting with strong Tanzania coverage, then growing across Kenya, Uganda, Rwanda and nearby East African markets.",
    caption_sw: "Motokah inaanza Tanzania, kisha Kenya, Uganda, Rwanda na East Africa.",
  },
  {
    pillar: "Listings",
    title: "Commercial vehicles in Tanzania",
    caption: "Vans, pickups, buses and trucks need clean searchable listings too. Motokah helps buyers find commercial vehicles without digging through old posts.",
    caption_sw: "Vans, pickups, buses na trucks pia zinahitaji listings safi.",
  },
  {
    pillar: "Listings",
    title: "Bikes and boda boda listings",
    caption: "Motokah is built for more than cars. Bikes, boda bodas and scooters can be listed and browsed by category as the marketplace grows.",
    caption_sw: "Motokah ni zaidi ya magari. Bikes na boda boda pia zina nafasi.",
  },
  {
    pillar: "Promotion",
    title: "More clean listings every week",
    caption: "Motokah is focusing on fewer, better listings: real photos, better titles, dealer contact and pages buyers can actually use.",
    caption_sw: "Tunachagua listings chache lakini safi: picha, title, contact na details.",
  },
];

const fillerPosts = [
  {
    pillar: "Education",
    title: "Check mileage before you fall in love",
    caption: "Before paying a deposit, compare the mileage with service history, tyres, interior wear and import documents. Clean listings make inspection easier.",
    caption_sw: "Compare mileage na service history kabla ya deposit.",
  },
  {
    pillar: "Listings",
    title: "Toyota Land Cruiser watch in Tanzania",
    caption: "Land Cruiser buyers need clear photos, strong inspection habits and direct seller contact. Motokah helps compare serious 4x4 listings.",
    caption_sw: "Land Cruiser buyers, compare picha, specs na seller contact Motokah.",
  },
  {
    pillar: "Dealer",
    title: "Fresh inventory watch",
    caption: "Dealers can use Motokah to keep stock searchable by city, make, price and category instead of relying only on story highlights.",
    caption_sw: "Dealer, stock yako iwe searchable kwa city, make, price na category.",
  },
  {
    pillar: "Culture",
    title: "What makes a listing feel trustworthy?",
    caption: "Clear photos, realistic title, seller contact, city, mileage, year and inspection readiness. Motokah is built around those basics.",
    caption_sw: "Listing ya trust ina picha, title, contact, city, mileage, year na inspection.",
  },
  {
    pillar: "Brand",
    title: "Browse before you call",
    caption: "Motokah helps buyers narrow down options before calling sellers, saving time for both buyers and dealers.",
    caption_sw: "Browse kwanza, kisha call seller ukiwa na maswali mazuri.",
  },
  {
    pillar: "Promotion",
    title: "Showrooms can look ready online",
    caption: "A showroom with clean inventory, direct contact and searchable pages has a better chance of turning browsing into real enquiries.",
    caption_sw: "Showroom yenye inventory safi hupata enquiries bora.",
  },
  {
    pillar: "Boats",
    title: "From coast roads to coast waters",
    caption: "East Africa does not stop at cars. Motokah is testing boat listings for coastal buyers, tour operators and marine sellers.",
    caption_sw: "East Africa si magari tu. Boats pia zinaanza Motokah.",
  },
];

function postForDay(index) {
  const template = index < launchPlan.length
    ? launchPlan[index]
    : fillerPosts[(index - launchPlan.length) % fillerPosts.length];
  return {
    ...template,
    post_type: "feed",
    platform: "instagram",
    language: "en+sw",
    scheduled_date: addDays(START, index),
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
