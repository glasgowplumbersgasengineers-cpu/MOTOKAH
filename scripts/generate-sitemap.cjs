/**
 * Generates public/sitemap.xml at build time.
 * Run: node scripts/generate-sitemap.cjs
 */
const fs = require("fs");
const path = require("path");

const BASE = "https://www.motokah.com";
const TODAY = new Date().toISOString().split("T")[0];

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
  { path: "/contact",        freq: "monthly", pri: 0.5 },
  { path: "/faq",            freq: "monthly", pri: 0.4 },
  { path: "/safety",         freq: "monthly", pri: 0.4 },
  { path: "/terms",          freq: "monthly", pri: 0.3 },
  { path: "/privacy",        freq: "monthly", pri: 0.3 },
  ...igShowrooms.map(u => ({ path: `/showroom/${u}`, freq: "weekly", pri: 0.7 })),
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
const priorityCities = ["Nairobi", "Mombasa", "Dar es Salaam", "Arusha", "Kampala", "Kigali", "Addis Ababa"];
const makePages = priorityMakes.map((make) => ({
  path: `/search?make=${encodeURIComponent(make)}`,
  freq: "daily",
  pri: 0.75,
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
  { path: "/search?bodyType=Boat", freq: "weekly", pri: 0.65 },
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

// Blog posts (add slug here when publishing new posts)
const blogPostSlugs = [
  "how-to-import-a-car-to-kenya-2026",
  "best-used-cars-under-2-million-nairobi-2026",
  "bei-ya-magari-mitumba-tanzania-2026",
  "toyota-alphard-price-kenya-2026",
];
const blogPostPages = blogPostSlugs.map(slug => ({
  path: `/blog/${slug}`,
  freq: "monthly",
  pri: 0.7,
}));

// Country-level landing pages
const countryPages = ["Kenya","Tanzania","Uganda","Rwanda","Ethiopia","Nigeria","Burundi"].map(c => ({
  path: `/country/${c.toLowerCase().replace(/\s+/g, "-")}`,
  freq: "daily",
  pri: 0.85,
}));

function url(loc, changefreq, priority, lastmod = TODAY) {
  return `  <url>
    <loc>${loc.replace(/&/g, "&amp;")}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
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
  "  <!-- City landing pages -->",
  ...cities.map(c => url(`${BASE}/city/${c.slug}`, "daily", c.pri)),
  "",
  "  <!-- Curated search landing pages -->",
  ...makePages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  ...cityMakePages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  ...categorySearchPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  "",
  "  <!-- Country landing pages -->",
  ...countryPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  "",
  "  <!-- Model landing pages -->",
  ...modelPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  "",
  "  <!-- Blog posts -->",
  ...blogPostPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
  "",
  "</urlset>",
];

const out = lines.join("\n");
const dest = path.join(__dirname, "../public/sitemap.xml");
fs.writeFileSync(dest, out, "utf8");
console.log(`Sitemap written: ${dest}`);
console.log(`URLs: ${staticPages.length + cities.length + makePages.length + cityMakePages.length + categorySearchPages.length + countryPages.length + modelPages.length + blogPostPages.length}`);
