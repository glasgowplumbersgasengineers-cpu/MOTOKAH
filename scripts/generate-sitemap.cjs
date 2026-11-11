/**
 * Generates public/sitemap.xml at build time.
 * Run: node scripts/generate-sitemap.cjs
 */
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local"), quiet: true });

const BASE = "https://www.motokah.com";

const BLOCKED_SHOWROOM_USERS = new Set(["servemarinekenya", "ukajapantz", "twenderide", "toyota.tanzania"]);

function normalizeDigits(value = "") {
  return Array.from(value).map((c) => {
    const cp = c.codePointAt(0) || 0;
    if (cp >= 0x1D7CE && cp <= 0x1D7D7) return String.fromCharCode(cp - 0x1D7CE + 48);
    if (cp >= 0x1D7EC && cp <= 0x1D7F5) return String.fromCharCode(cp - 0x1D7EC + 48);
    return c;
  }).join("");
}

function hasUsablePhone(phone = "") {
  const digits = normalizeDigits(phone).replace(/\D/g, "");
  if (digits.length < 9) return false;
  if (/^(?:254)?700000000$/.test(digits)) return false;
  if (/^(?:255)?700000000$/.test(digits)) return false;
  return true;
}

function loadShowrooms() {
  const showroomsDir = path.join(__dirname, "../src/data/showrooms");
  return fs.readdirSync(showroomsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const fullPath = path.join(showroomsDir, file);
      const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
      const username = data.username || file.replace(/\.json$/, "");
      return {
        username,
        phone: data.phone || "",
        posts: Array.isArray(data.posts) ? data.posts : [],
      };
    })
    .filter(({ username, phone, posts }) => (
      !BLOCKED_SHOWROOM_USERS.has(username)
      && username !== "ibaraki"
      && hasUsablePhone(phone)
      && posts.some((post) => Array.isArray(post.images) && post.images.length > 0)
    ))
    .map(({ username }) => username)
    .sort((a, b) => a.localeCompare(b));
}

const igShowrooms = loadShowrooms();

const staticPages = [
  { path: "/",               freq: "daily",   pri: 1.0 },
  { path: "/search",         freq: "daily",   pri: 0.9 },
  { path: "/sell",           freq: "weekly",  pri: 0.8 },
  { path: "/dealers",        freq: "weekly",  pri: 0.8 },
  { path: "/how-it-works",   freq: "monthly", pri: 0.7 },
  { path: "/duty-calculator",freq: "monthly", pri: 0.7 },
  { path: "/compare",        freq: "weekly",  pri: 0.6 },
  { path: "/blog",           freq: "weekly",  pri: 0.6 },
  { path: "/about",          freq: "monthly", pri: 0.5 },
  { path: "/brand-centre",   freq: "monthly", pri: 0.5 },
  { path: "/contact",        freq: "monthly", pri: 0.5 },
  { path: "/faq",            freq: "monthly", pri: 0.4 },
  { path: "/safety",         freq: "monthly", pri: 0.4 },
];

const showroomPages = igShowrooms.map(u => ({ path: `/showroom/${u}`, freq: "weekly", pri: 0.65 }));

const dealerPages = [
  { path: "/dealer/dealer-khushimotorsdaressalaam", freq: "weekly", pri: 0.8 },
  { path: "/dealer/dealer-al_husnainmotors", freq: "weekly", pri: 0.8 },
  { path: "/dealer/dealer-mgayamotors", freq: "weekly", pri: 0.8 },
  { path: "/dealer/dealer-expert_motors_tz", freq: "weekly", pri: 0.75 },
  { path: "/dealer/dealer-njari_motors", freq: "weekly", pri: 0.75 },
  { path: "/dealer/dealer-breemotors", freq: "weekly", pri: 0.75 },
  { path: "/dealer/dealer-magari_empire1", freq: "weekly", pri: 0.7 },
  { path: "/dealer/dealer-nicolette-boats", freq: "weekly", pri: 0.7 },
  { path: "/dealer/dealer-kk_magic_cars_", freq: "weekly", pri: 0.7 },
  { path: "/dealer/dealer-ibaraki", freq: "weekly", pri: 0.7 },
];

const cities = [
  // Tanzania
  { slug: "dar-es-salaam",  pri: 0.9 }, { slug: "arusha",          pri: 0.8 },
  { slug: "mwanza",         pri: 0.8 }, { slug: "dodoma",          pri: 0.7 },
  { slug: "zanzibar",       pri: 0.8 }, { slug: "mbeya",           pri: 0.7 },
  { slug: "moshi",          pri: 0.7 }, { slug: "tanga",           pri: 0.6 },
  { slug: "morogoro",       pri: 0.6 }, { slug: "iringa",          pri: 0.5 },
  { slug: "kigoma",         pri: 0.5 }, { slug: "tabora",          pri: 0.5 },
  { slug: "lindi",          pri: 0.5 }, { slug: "shinyanga",       pri: 0.5 },
  { slug: "kahama",         pri: 0.5 }, { slug: "musoma",          pri: 0.5 },
  { slug: "sumbawanga",     pri: 0.4 }, { slug: "songea",          pri: 0.4 },
  { slug: "bukoba",         pri: 0.4 }, { slug: "mtwara",          pri: 0.4 },
  // Kenya
  { slug: "nairobi",        pri: 0.9 }, { slug: "mombasa",         pri: 0.8 },
  { slug: "nakuru",         pri: 0.7 }, { slug: "kisumu",          pri: 0.7 },
  { slug: "eldoret",        pri: 0.7 }, { slug: "thika",           pri: 0.6 },
  { slug: "naivasha",       pri: 0.6 }, { slug: "nyeri",           pri: 0.5 },
  { slug: "machakos",       pri: 0.5 }, { slug: "meru",            pri: 0.5 },
  { slug: "kitale",         pri: 0.5 }, { slug: "malindi",         pri: 0.5 },
  // Uganda
  { slug: "kampala",        pri: 0.8 }, { slug: "entebbe",         pri: 0.7 },
  { slug: "jinja",          pri: 0.6 }, { slug: "mbarara",         pri: 0.6 },
  { slug: "gulu",           pri: 0.5 }, { slug: "fort-portal",     pri: 0.5 },
  // Rwanda
  { slug: "kigali",         pri: 0.7 }, { slug: "butare",          pri: 0.5 },
  // Ethiopia
  { slug: "addis-ababa",    pri: 0.7 }, { slug: "adama",           pri: 0.5 },
  { slug: "dire-dawa",      pri: 0.5 },
];

// Curated search landing pages. Keep this intentionally small and high-intent:
// these URLs have crawlable copy in SearchResults and target real buyer searches.
const priorityMakes = ["Toyota", "Nissan", "Subaru", "Mazda", "Honda", "Mitsubishi"];
const priorityCities = ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Nairobi", "Mombasa", "Kampala", "Kigali", "Addis Ababa"];
const countrySearchPages = [
  { path: "/search?country=Tanzania", freq: "daily", pri: 0.85 },
  { path: "/search?country=Kenya", freq: "daily", pri: 0.8 },
  { path: "/search?country=Tanzania&condition=New", freq: "daily", pri: 0.75 },
  { path: "/search?country=Tanzania&vehicleType=commercial", freq: "weekly", pri: 0.7 },
  { path: "/search?country=Tanzania&vehicleType=bike", freq: "weekly", pri: 0.7 },
  { path: "/search?country=Tanzania&vehicleType=boat", freq: "weekly", pri: 0.65 },
  { path: "/search?country=Kenya&condition=New", freq: "daily", pri: 0.7 },
  { path: "/search?country=Kenya&vehicleType=commercial", freq: "weekly", pri: 0.65 },
];
const makePages = priorityMakes.map((make) => ({
  path: `/search?make=${encodeURIComponent(make)}`,
  freq: "daily",
  pri: 0.75,
}));
const modelCountryPages = [
  ["Toyota", "Harrier", "Tanzania"],
  ["Toyota", "Land Cruiser", "Tanzania"],
  ["Toyota", "Hilux", "Tanzania"],
  ["Toyota", "Prado", "Tanzania"],
  ["Toyota", "Fortuner", "Tanzania"],
  ["Toyota", "Vitz", "Tanzania"],
  ["Mazda", "Demio", "Tanzania"],
  ["Mazda", "CX-5", "Tanzania"],
  ["Nissan", "Patrol", "Tanzania"],
  ["Nissan", "Navara", "Tanzania"],
  ["Subaru", "Forester", "Tanzania"],
  ["Subaru", "Forester", "Kenya"],
  ["Toyota", "Probox", "Kenya"],
  ["Honda", "Vezel", "Kenya"],
  ["Mazda", "Demio", "Kenya"],
  ["Toyota", "Harrier", "Kenya"],
].map(([make, model, country]) => ({
  path: `/search?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&country=${encodeURIComponent(country)}`,
  freq: "daily",
  pri: country === "Tanzania" ? 0.78 : 0.72,
}));
const cityMakePages = priorityCities.flatMap((city) =>
  priorityMakes.map((make) => ({
    path: `/search?make=${encodeURIComponent(make)}&city=${encodeURIComponent(city)}`,
    freq: "daily",
    pri: city === "Nairobi" || city === "Dar es Salaam" ? 0.8 : 0.7,
  }))
);
const categorySearchPages = [
  { path: "/search?condition=New", freq: "daily", pri: 0.7 },
  { path: "/search?vehicleType=commercial", freq: "weekly", pri: 0.65 },
  { path: "/search?vehicleType=bike", freq: "weekly", pri: 0.65 },
  { path: "/search?vehicleType=boat", freq: "weekly", pri: 0.65 },
  { path: "/search?country=Kenya&vehicleType=bike", freq: "weekly", pri: 0.6 },
  { path: "/search?country=Kenya&bodyType=SUV", freq: "weekly", pri: 0.65 },
  { path: "/search?country=Tanzania&bodyType=Sedan", freq: "weekly", pri: 0.65 },
  { path: "/search?country=Tanzania&bodyType=Pickup", freq: "weekly", pri: 0.7 },
  { path: "/search?country=Tanzania&bodyType=SUV", freq: "weekly", pri: 0.75 },
];

// Model landing pages — /cars/:make/:model (high-volume keyword targets)
const modelPages = [
  { make: "toyota",   model: "alphard",      pri: 0.9 },
  { make: "toyota",   model: "harrier",      pri: 0.9 },
  { make: "toyota",   model: "probox",       pri: 0.9 },
  { make: "toyota",   model: "fielder",      pri: 0.9 },
  { make: "toyota",   model: "vitz",         pri: 0.9 },
  { make: "toyota",   model: "land-cruiser", pri: 0.9 },
  { make: "toyota",   model: "hilux",        pri: 0.9 },
  { make: "toyota",   model: "prado",        pri: 0.8 },
  { make: "toyota",   model: "noah",         pri: 0.8 },
  { make: "toyota",   model: "succeed",      pri: 0.7 },
  { make: "toyota",   model: "axio",         pri: 0.8 },
  { make: "mazda",    model: "demio",        pri: 0.9 },
  { make: "mazda",    model: "cx-5",         pri: 0.8 },
  { make: "mazda",    model: "atenza",       pri: 0.7 },
  { make: "honda",    model: "vezel",        pri: 0.9 },
  { make: "honda",    model: "fit",          pri: 0.8 },
  { make: "honda",    model: "crv",          pri: 0.8 },
  { make: "subaru",   model: "forester",     pri: 0.9 },
  { make: "subaru",   model: "outback",      pri: 0.8 },
  { make: "subaru",   model: "impreza",      pri: 0.8 },
  { make: "nissan",   model: "x-trail",      pri: 0.8 },
  { make: "nissan",   model: "note",         pri: 0.8 },
  { make: "nissan",   model: "navara",       pri: 0.8 },
  { make: "mitsubishi", model: "pajero",     pri: 0.8 },
  { make: "mitsubishi", model: "outlander",  pri: 0.7 },
].map(({ make, model, pri }) => ({
  path: `/cars/${make}/${model}`,
  freq: "weekly",
  pri,
}));

// Blog posts — pulled live from Supabase so the sitemap can never list a
// slug that isn't actually published (a hardcoded list silently drifts).
async function loadPublishedBlogPosts() {
  const endpoint = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!endpoint || !key) return [];
  const query = new URL(`${endpoint.replace(/\/$/, "")}/rest/v1/blog_posts`);
  query.searchParams.set("select", "slug,created_at");
  query.searchParams.set("published", "eq.true");
  const response = await fetch(query, { headers: { apikey: key }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Published blog post sitemap query failed (${response.status})`);
  return await response.json();
}

// Country-level landing pages
const countryPages = [
  { country: "Tanzania", pri: 0.95 },
  { country: "Kenya", pri: 0.9 },
  { country: "Uganda", pri: 0.82 },
  { country: "Rwanda", pri: 0.78 },
  { country: "Ethiopia", pri: 0.78 },
  { country: "Burundi", pri: 0.7 },
  { country: "Nigeria", pri: 0.65 },
].map(({ country, pri }) => ({
  path: `/country/${country.toLowerCase().replace(/\s+/g, "-")}`,
  freq: "daily",
  pri,
}));

function url(loc, _changefreq, _priority, lastmod) {
  return `  <url>
    <loc>${loc.replace(/&/g, "&amp;")}</loc>
${/^\d{4}-\d{2}-\d{2}$/.test(lastmod || "") ? `    <lastmod>${lastmod}</lastmod>\n` : ""}
  </url>`;
}

async function loadApprovedListings() {
  const endpoint = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!endpoint || !key) return [];

  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const query = new URL(`${endpoint.replace(/\/$/, "")}/rest/v1/listings`);
    query.searchParams.set("select", "id,seller_id,updated_at,listing_images(image_url)");
    query.searchParams.set("status", "eq.approved");
    query.searchParams.set("order", "updated_at.desc");
    query.searchParams.set("limit", "1000");
    query.searchParams.set("offset", String(offset));
    const response = await fetch(query, { headers: { apikey: key }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Approved listing sitemap query failed (${response.status})`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }

  const candidates = rows.filter((row) => /^[0-9a-f-]{36}$/i.test(row.id)
    && row.listing_images?.some((image) => /^https:\/\//.test(image.image_url || "")));
  const visible = [];
  for (let start = 0; start < candidates.length; start += 100) {
    const batch = candidates.slice(start, start + 100);
    const ids = [...new Set(batch.map((row) => row.seller_id))];
    const query = new URL(`${endpoint.replace(/\/$/, "")}/rest/v1/profiles`);
    query.searchParams.set("select", "user_id,phone");
    query.searchParams.set("user_id", `in.(${ids.join(",")})`);
    const response = await fetch(query, { headers: { apikey: key }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Seller sitemap query failed (${response.status})`);
    const profiles = await response.json();
    const sellers = new Set(profiles.filter((profile) => hasUsablePhone(profile.phone)).map((profile) => profile.user_id));
    visible.push(...batch.filter((row) => sellers.has(row.seller_id)));
  }
  return visible;
}

const lines = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
  `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`,
  `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9`,
  `          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`,
  "",
  "  <!-- Static pages -->",
  ...staticPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  "",
  "  <!-- Country landing pages -->",
  ...countryPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  "",
  "  <!-- Curated search landing pages -->",
  ...countrySearchPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  ...makePages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  ...modelCountryPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  ...cityMakePages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  ...categorySearchPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  "",
  "  <!-- City landing pages -->",
  ...cities.map(c => url(`${BASE}/city/${c.slug}`, "daily", c.pri)),
  "",
  "  <!-- Dealer landing pages -->",
  ...dealerPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  "",
  "  <!-- Instagram showroom pages -->",
  ...showroomPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  "",
  "  <!-- Model landing pages -->",
  ...modelPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  "",
  "</urlset>",
];

Promise.all([loadApprovedListings(), loadPublishedBlogPosts()]).then(([listings, posts]) => {
  lines.splice(-1, 0,
    "  <!-- Approved listings with images and seller contact -->",
    ...listings.map((listing) => url(`${BASE}/listing/${listing.id}`, undefined, undefined, listing.updated_at?.slice(0, 10))),
    "",
    "  <!-- Blog posts (live from Supabase, published only) -->",
    ...posts.map((post) => url(`${BASE}/blog/${post.slug}`, "monthly", 0.7, post.created_at?.slice(0, 10))),
    "",
  );
  const dest = path.join(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(dest, lines.join("\n"), "utf8");
  console.log(`Sitemap written: ${dest}`);
  console.log(`URLs: ${(lines.join("\n").match(/<url>/g) || []).length} (${listings.length} approved listings, ${posts.length} blog posts)`);
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
