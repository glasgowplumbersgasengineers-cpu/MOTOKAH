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
const modelPageDefs = [
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
];

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

// --- Thin-content gating ---------------------------------------------------
// 2026-11 SEO audit: 91% of programmatic landing pages (city, city x make,
// model x city, make/model, country x make) rendered with ZERO real listings
// after an earlier fix gated listing quality on real image health. A sitemap
// full of near-empty doorway pages is a strong negative ranking/indexing
// signal, so every programmatic URL below is now only written to the sitemap
// once we've actually counted real quality-gated listings for it.
//
// "Real quality-gated listings" here means the exact same data + filter a
// visitor sees on the page: src/data/mockData.ts's `mockListings` (currently
// the dominant inventory source — the live Supabase `listings` table is
// close to empty) filtered by src/lib/listingQuality.ts's
// `isLaunchQualityListing`, plus live approved Supabase listings run through
// the same gate, matched with src/lib/pageListingCounts.ts's
// `matchesListingFilter` (the same pure function a future client change could
// call too — see that file's header comment for why the logic lives there
// once instead of being re-derived per page).
//
// mockData.ts uses Vite-only `import.meta.glob`, so this plain Node/CJS
// script can't `require()` it directly. Instead we spin up Vite's
// `ssrLoadModule` just for this computation (no dev server, no HTTP) — this
// runs the actual production source files, so there is no second copy of the
// caption-parsing/image-health logic to keep in sync.
const ANCHOR_CITY_SLUGS = new Set(["dar-es-salaam", "nairobi", "kampala", "addis-ababa"]);
const ANCHOR_COUNTRY_SLUGS = new Set(["tanzania", "kenya", "uganda", "ethiopia"]);

function cityNameFromSlug(slug) {
  // Mirrors CityLandingPage.tsx's `slug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())`
  // exactly, so the count here matches what useSearchListings actually filters by on the page.
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
// Mirrors ModelLandingPage.tsx's local `slugToTitle` — same transform, used for make/model slugs.
const titleFromSlug = cityNameFromSlug;

// Turns a hardcoded "/search?make=Toyota&city=Nairobi" sitemap path into the same
// ListingCountFilter shape SearchResults.tsx itself would build from those query params,
// so these curated search pages get the identical >= MIN_LISTINGS_FOR_SITEMAP gate every
// other programmatic page type already has (see pageListingCounts.ts header comment —
// this was the one page type the 2026-11 doorway-page fix never reached).
function filterFromSearchPath(searchPath) {
  const query = new URLSearchParams(searchPath.split("?")[1] || "");
  const filter = {};
  if (query.get("make")) filter.make = query.get("make");
  if (query.get("model")) filter.model = query.get("model");
  if (query.get("city")) filter.city = query.get("city");
  if (query.get("country")) filter.country = query.get("country");
  if (query.get("condition")) filter.condition = query.get("condition");
  if (query.get("vehicleType")) filter.vehicleType = query.get("vehicleType");
  if (query.get("bodyType")) filter.bodyType = [query.get("bodyType")];
  return filter;
}

async function loadQualityCheckedListings() {
  const { createServer } = await import("vite");
  const server = await createServer({
    configFile: path.join(__dirname, "../vite.config.ts"),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "warn",
  });
  try {
    const mockMod = await server.ssrLoadModule("/src/data/mockData.ts");
    const qualityMod = await server.ssrLoadModule("/src/lib/listingQuality.ts");
    const countMod = await server.ssrLoadModule("/src/lib/pageListingCounts.ts");
    const approved = await loadApprovedListingsForCounting();
    const listings = [...mockMod.mockListings, ...approved].filter(qualityMod.isLaunchQualityListing);
    return { listings, countQualityListings: countMod.countQualityListings, MIN_LISTINGS_FOR_SITEMAP: countMod.MIN_LISTINGS_FOR_SITEMAP };
  } finally {
    await server.close();
  }
}

const reverseCurrencyCountry = { TZS: "TZ", KES: "KE", UGX: "UG", RWF: "RW", ETB: "ET", BIF: "BI", NGN: "NG" };

// Same live Supabase 'listings' table as loadApprovedListings() below, but with the extra
// columns needed to test city/make/model/country membership, shaped like the Listing type
// so it can be run through the real `isLaunchQualityListing` gate.
async function loadApprovedListingsForCounting() {
  const endpoint = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!endpoint || !key) return [];

  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const query = new URL(`${endpoint.replace(/\/$/, "")}/rest/v1/listings`);
    query.searchParams.set("select", "id,title,price,currency,condition,year,city,make,model,body_type,fuel_type,description,seller_id,listing_images(image_url)");
    query.searchParams.set("status", "eq.approved");
    query.searchParams.set("limit", "1000");
    query.searchParams.set("offset", String(offset));
    const response = await fetch(query, { headers: { apikey: key }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Approved listing count query failed (${response.status})`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  if (rows.length === 0) return [];

  const sellerIds = [...new Set(rows.map((row) => row.seller_id))];
  const profileQuery = new URL(`${endpoint.replace(/\/$/, "")}/rest/v1/profiles`);
  profileQuery.searchParams.set("select", "user_id,display_name,seller_type,phone");
  profileQuery.searchParams.set("user_id", `in.(${sellerIds.join(",")})`);
  const profileResponse = await fetch(profileQuery, { headers: { apikey: key }, signal: AbortSignal.timeout(15000) });
  const profiles = profileResponse.ok ? await profileResponse.json() : [];
  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));

  return rows.map((row) => {
    const profile = profileMap.get(row.seller_id);
    const images = (row.listing_images || []).map((i) => i.image_url);
    return {
      id: row.id,
      title: row.title,
      price: Number(row.price),
      currency: row.currency,
      condition: row.condition,
      year: row.year,
      mileage: 0,
      transmission: "Automatic",
      location: row.city || "",
      country: reverseCurrencyCountry[row.currency],
      image: images[0] || "",
      images,
      views: 0,
      sellerName: profile?.display_name || "Private Seller",
      sellerType: profile?.seller_type || "private",
      sellerListingCount: 1,
      sellerPhone: profile?.phone || undefined,
      sellerId: row.seller_id,
      bodyType: row.body_type || undefined,
      fuelType: row.fuel_type || undefined,
      make: row.make,
      model: row.model,
      description: row.description || "",
    };
  });
}

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

async function main() {
  const [{ listings: qualityListings, countQualityListings, MIN_LISTINGS_FOR_SITEMAP }, approvedListings, blogPosts] = await Promise.all([
    loadQualityCheckedListings(),
    loadApprovedListings(),
    loadPublishedBlogPosts(),
  ]);

  const countFor = (filter) => countQualityListings(qualityListings, filter);

  // City pages: keep only cities with >= MIN_LISTINGS_FOR_SITEMAP real listings, PLUS the
  // named anchor cities (real stock confirmed by audit) even if their count is thin — never
  // a city with zero, though.
  const keptCities = cities.filter((c) => {
    const n = countFor({ city: cityNameFromSlug(c.slug) });
    return n >= MIN_LISTINGS_FOR_SITEMAP || (ANCHOR_CITY_SLUGS.has(c.slug) && n > 0);
  });
  const droppedCities = cities.filter((c) => !keptCities.includes(c));

  // Country pages: same rule, anchor countries named by the audit.
  const countryPageDefs = ["Tanzania", "Kenya", "Uganda", "Rwanda", "Ethiopia", "Burundi", "Nigeria"]
    .map((country) => ({ country, slug: country.toLowerCase().replace(/\s+/g, "-") }));
  const keptCountrySlugs = new Set(
    countryPageDefs
      .filter((c) => {
        const n = countFor({ country: c.country });
        return n >= MIN_LISTINGS_FOR_SITEMAP || (ANCHOR_COUNTRY_SLUGS.has(c.slug) && n > 0);
      })
      .map((c) => c.slug)
  );
  const keptCountryPages = countryPages.filter((p) => keptCountrySlugs.has(p.path.split("/").pop()));
  const droppedCountryPages = countryPages.filter((p) => !keptCountryPages.includes(p));

  // Make/model pages (/cars/:make/:model): no anchor exception here — these are thin almost
  // everywhere (caption-derived model text rarely matches the clean model name the page uses).
  const keptModelDefs = modelPageDefs.filter((m) => countFor({ make: titleFromSlug(m.make), model: titleFromSlug(m.model) }) >= MIN_LISTINGS_FOR_SITEMAP);
  const keptModelPages = keptModelDefs.map(({ make, model, pri }) => ({ path: `/cars/${make}/${model}`, freq: "weekly", pri }));
  const droppedModelDefs = modelPageDefs.filter((m) => !keptModelDefs.includes(m));

  // City x make pages (/cars/:make/in/:city) and country x make pages (/country/:country/:make):
  // these were absent from the sitemap entirely before this pass. Only add a combination that
  // actually clears the threshold today — computed from real data, not a hand-picked list.
  const cityMakeLandingPages = [];
  for (const c of cities) {
    for (const make of priorityMakes) {
      const n = countFor({ city: cityNameFromSlug(c.slug), make });
      if (n >= MIN_LISTINGS_FOR_SITEMAP) {
        cityMakeLandingPages.push({ path: `/cars/${make.toLowerCase()}/in/${c.slug}`, freq: "weekly", pri: 0.75 });
      }
    }
  }
  const countryMakeLandingPages = [];
  for (const cdef of countryPageDefs) {
    for (const make of priorityMakes) {
      const n = countFor({ country: cdef.country, make });
      if (n >= MIN_LISTINGS_FOR_SITEMAP) {
        countryMakeLandingPages.push({ path: `/country/${cdef.slug}/${make.toLowerCase()}`, freq: "weekly", pri: 0.7 });
      }
    }
  }

  console.log(`City pages: ${keptCities.length} kept / ${droppedCities.length} dropped (0 or thin listings): ${droppedCities.map((c) => c.slug).join(", ")}`);
  console.log(`Country pages: ${keptCountryPages.length} kept / ${droppedCountryPages.length} dropped: ${droppedCountryPages.map((p) => p.path).join(", ")}`);
  console.log(`Make/model pages: ${keptModelPages.length} kept / ${droppedModelDefs.length} dropped`);
  console.log(`City x make pages added: ${cityMakeLandingPages.length}`);
  console.log(`Country x make pages added: ${countryMakeLandingPages.length}`);

  // Curated search pages (/search?make=...&city=...): same gate as every other
  // programmatic page type. These were hardcoded with zero quality checking before.
  const allSearchPages = [...countrySearchPages, ...makePages, ...modelCountryPages, ...cityMakePages, ...categorySearchPages];
  const keptSearchPages = allSearchPages.filter((p) => countFor(filterFromSearchPath(p.path)) >= MIN_LISTINGS_FOR_SITEMAP);
  const droppedSearchPages = allSearchPages.filter((p) => !keptSearchPages.includes(p));
  console.log(`Curated search pages: ${keptSearchPages.length} kept / ${droppedSearchPages.length} dropped (thin): ${droppedSearchPages.map((p) => p.path).join(", ")}`);

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
    ...keptCountryPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
    "",
    "  <!-- Country x make landing pages (>= 3 real listings) -->",
    ...countryMakeLandingPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
    "",
    "  <!-- Curated search landing pages (>= 3 real listings) -->",
    ...keptSearchPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
    "",
    "  <!-- City landing pages (>= 3 real listings, or an anchor city with stock) -->",
    ...keptCities.map(c => url(`${BASE}/city/${c.slug}`, "daily", c.pri)),
    "",
    "  <!-- City x make landing pages (>= 3 real listings) -->",
    ...cityMakeLandingPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
    "",
    "  <!-- Dealer landing pages -->",
    ...dealerPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
    "",
    "  <!-- Instagram showroom pages -->",
    ...showroomPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
    "",
    "  <!-- Model landing pages (>= 3 real listings) -->",
    ...keptModelPages.map(p => url(`${BASE}${p.path}`, p.freq, p.pri)),
    "",
    "</urlset>",
  ];

  lines.splice(-1, 0,
    "  <!-- Approved listings with images and seller contact -->",
    ...approvedListings.map((listing) => url(`${BASE}/listing/${listing.id}`, undefined, undefined, listing.updated_at?.slice(0, 10))),
    "",
    "  <!-- Blog posts (live from Supabase, published only) -->",
    ...blogPosts.map((post) => url(`${BASE}/blog/${post.slug}`, "monthly", 0.7, post.created_at?.slice(0, 10))),
    "",
  );
  const dest = path.join(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(dest, lines.join("\n"), "utf8");
  console.log(`Sitemap written: ${dest}`);
  console.log(`URLs: ${(lines.join("\n").match(/<url>/g) || []).length} (${approvedListings.length} approved listings, ${blogPosts.length} blog posts)`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
