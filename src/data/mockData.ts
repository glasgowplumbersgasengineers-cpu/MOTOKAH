import mgayaJson from "./showrooms/mgayamotors.json";
import { cdnImagePath, normalizeImageUrl } from "@/lib/imageUrls";

// Load all other showroom JSONs
const _showroomMods = import.meta.glob("./showrooms/*.json", { eager: true }) as Record<string, { default: { username: string; full_name: string; phone: string; posts: Array<{ shortcode: string; date: string; caption: string; likes: number; images: string[]; url: string; price?: number; currency?: string }> } }>;

export const DEALER_CITY: Record<string, string> = {
  hupa_motors_ltd: "Mwanza, TZ",
  justin_motors_ltd: "Dar es Salaam, TZ",
  ibaraki: "Dar es Salaam, TZ",
  al_husnainmotors: "Nairobi, KE",
  kk_magic_cars_: "Dar es Salaam, TZ",
  fau_motors: "Dodoma, TZ",
  hanami_japan: "Dar es Salaam, TZ",
  livy_motors_tz: "Dar es Salaam, TZ",
  expert_motors_tz: "Dar es Salaam, TZ",
  // new accounts
  servemarinekenya: "Mombasa, KE",
  hondamotorcyclekenyaltd: "Nairobi, KE",
  daressalaam__pikipikiusedtz: "Dar es Salaam, TZ",
  pikipiki_bajaji_used: "Dar es Salaam, TZ",
  bongoland_motors: "Dar es Salaam, TZ",
  dream_motors_safari: "Dar es Salaam, TZ",
  autocomjapantanzaniacars: "Dar es Salaam, TZ",
  usedcarstanzania: "Dar es Salaam, TZ",
  epicmotors_tz: "Dar es Salaam, TZ",
  // confirmed real accounts batch
  used_cars_magari_used: "Dar es Salaam, TZ",
  "automark.tanzania": "Dar es Salaam, TZ",
  international_cars_dealership: "Dar es Salaam, TZ",
  magari_motors_co_ltd: "Dar es Salaam, TZ",
  car_dealers_tanzania: "Dar es Salaam, TZ",
  "hm.autodeals": "Dar es Salaam, TZ",
  luxury_cars_tz: "Dar es Salaam, TZ",
  carpointtanzania: "Dar es Salaam, TZ",
  smartautoske: "Nairobi, KE",
  gariguruske: "Nairobi, KE",
  rnn_motors: "Nairobi, KE",
  "affordable.cars.kenya": "Nairobi, KE",
  house_of_cars_kenya: "Nairobi, KE",
  _used_cars_kenya: "Nairobi, KE",
  olpans_carsforsale: "Kigali, RW",
  // Uganda
  khushimotorsuganda: "Kampala, UG",
  used_cars_in_kampala: "Kampala, UG",
  mighty__rides: "Kampala, UG",
  // Kenya new
  nairobidrive: "Nairobi, KE",
  peachcarske: "Nairobi, KE",
  aminicar_: "Nairobi, KE",
  magarideals: "Nairobi, KE",
  // Ethiopia
  ethiocarsmarket: "Addis Ababa, ET",
  direcarsale: "Addis Ababa, ET",
  // Discovered via hashtag
  "toyota.tanzania": "Dar es Salaam, TZ",
  "hm.autodealz": "Dar es Salaam, TZ",
  inspiring_investment_ltd: "Dar es Salaam, TZ",
  chimbo_la_magari_dodoma: "Dodoma, TZ",
  magari_arusha_beipoa: "Arusha, TZ",
  ufsautotanzania: "Dar es Salaam, TZ",
  muu_motors: "Dar es Salaam, TZ",
};

export const DEALER_CURRENCY: Record<string, string> = {
  al_husnainmotors: "KES",
  servemarinekenya: "KES",
  hondamotorcyclekenyaltd: "KES",
  smartautoske: "KES",
  gariguruske: "KES",
  rnn_motors: "KES",
  "affordable.cars.kenya": "KES",
  house_of_cars_kenya: "KES",
  _used_cars_kenya: "KES",
  olpans_carsforsale: "RWF",
  khushimotorsuganda: "UGX",
  used_cars_in_kampala: "UGX",
  mighty__rides: "UGX",
  ethiocarsmarket: "ETB",
  direcarsale: "ETB",
};

const LOCAL_SHOWROOM_IMAGE_USERS = new Set(["mgayamotors"]);
export const BLOCKED_SHOWROOM_USERS = new Set(["servemarinekenya", "ukajapantz", "twenderide", "toyota.tanzania"]);
export const LAUNCH_SHOWROOM_USERS = new Set([
  "ibaraki",
  "al_husnainmotors",
  "khushimotorsdaressalaam",
  "mgayamotors",
  "nairobidrive",
  "gariguruske",
  "rakincars.tz",
  "ethiocarsmarket",
  "used_cars_in_kampala",
  "kk_magic_cars_",
  "hm.autodeals",
  "breemotors",
  "peachcarske",
  "smartautoske",
  "house_of_cars_kenya",
  "aminicar_",
]);

function _isLaunchShowroom(username: string): boolean {
  return LAUNCH_SHOWROOM_USERS.has(username) && !BLOCKED_SHOWROOM_USERS.has(username);
}

function _dealerListingLimit(username: string): number {
  const limits: Record<string, number> = {
    khushimotorsdaressalaam: 32,
    al_husnainmotors: 28,
    mgayamotors: 24,
    nairobidrive: 24,
    gariguruske: 24,
    rakincars: 20,
    "rakincars.tz": 20,
    ethiocarsmarket: 18,
    used_cars_in_kampala: 18,
    "kk_magic_cars_": 18,
    "hm.autodeals": 16,
    breemotors: 16,
    peachcarske: 12,
    smartautoske: 12,
    house_of_cars_kenya: 12,
    aminicar_: 10,
  };
  return limits[username] ?? 12;
}

function _dealerCountry(username: string): string {
  return DEALER_CITY[username]?.match(/\b([A-Z]{2})$/)?.[1] || "TZ";
}

function _dealerCurrency(username: string): string {
  return DEALER_CURRENCY[username] || "TZS";
}

function _hasUsableDealerPhone(phone?: string | null): boolean {
  const digits = _normalizeUnicode(phone || "").replace(/\D/g, "");
  if (digits.length < 9) return false;
  if (/^(?:254)?700000000$/.test(digits)) return false;
  return true;
}

function _supabaseImage(username: string, filename: string): string {
  return cdnImagePath(username, filename);
}

function _postImagePrefix(username: string, shortcode: string): string {
  return shortcode.startsWith(`${username}_`) ? shortcode.slice(username.length + 1) : shortcode;
}

function _postImages(username: string, post: { shortcode?: string; images?: string[] }, index = 0): string[] {
  const sourceImages = Array.isArray(post.images) ? post.images.filter(Boolean) : [];
  const shortcode = post.shortcode || `post_${index + 1}`;
  const prefix = _postImagePrefix(username, shortcode);

  if (sourceImages.length > 0) {
    return sourceImages.map((image, imageIndex) => {
      if (image.includes("supabase.co/storage")) return normalizeImageUrl(image);
      if (/^https?:\/\//i.test(image)) return image;
      if (LOCAL_SHOWROOM_IMAGE_USERS.has(username) && image.startsWith("/")) return image;
      return _supabaseImage(username, `${prefix}_${imageIndex + 1}.jpg`);
    });
  }

  return [];
}

export const carMakes = [
  "Toyota", "Nissan", "Subaru", "Land Rover", "Jeep", "Mitsubishi",
  "BMW", "Audi", "Mazda", "Mercedes-Benz", "Honda", "Hyundai",
  "Volkswagen", "Kia", "Suzuki", "Great Wall", "Isuzu",
];

export const carModels: Record<string, string[]> = {
  Toyota: ["Hilux", "Land Cruiser", "Land Cruiser Prado", "Fortuner", "Harrier", "Vellfire", "Alphard", "RAV4", "Crown", "Prius", "Aqua", "Vanguard", "Rush", "Kluger", "Wish", "Vitz", "Ractis"],
  Nissan: ["Patrol", "Navara", "X-Trail", "Hardbody"],
  Subaru: ["Forester", "Outback", "Impreza"],
  "Land Rover": ["Discovery", "Defender", "Range Rover"],
  Jeep: ["Wrangler", "Grand Cherokee"],
  Mitsubishi: ["Outlander", "Pajero", "Canter"],
  BMW: ["X3", "X5", "3 Series", "5 Series"],
  Audi: ["Q5", "Q7", "A4"],
  Mazda: ["CX-5", "CX-3", "Demio", "Verisa"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC"],
  Honda: ["CR-V", "Fit", "Civic"],
  Hyundai: ["Tucson", "Santa Fe"],
  default: ["Select make first"],
};

export const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Wagon", "Pickup", "Van", "Minibus", "Bus", "Truck", "Tipper", "Motorcycle", "Scooter", "Boat", "Tuk-tuk"];
export const conditions = ["New", "Used", "Foreign Used"];
export const transmissions = ["Manual", "Automatic", "CVT"];
export const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];

export const bikeTypes = ["Sport", "Cruiser", "Touring", "Scooter", "Dirt Bike"];
export const bikeMakes = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "Bajaj", "TVS", "KTM"];
export const ccRanges = ["50cc", "125cc", "250cc", "500cc", "750cc", "1000cc+"];

export const commercialTypes = ["Truck", "Van", "Bus", "Pickup", "Minibus", "Tipper", "Tuk-tuk"];

export const africanCities = [
  "Dar es Salaam", "Dodoma", "Arusha", "Mwanza", "Zanzibar", "Mbeya", "Moshi", "Tanga",
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Kiambu", "Machakos",
  "Kampala", "Entebbe", "Jinja", "Mukono", "Mbarara",
  "Kigali", "Addis Ababa", "Adama", "Bujumbura",
  "Lagos", "Abuja", "Ibadan", "Kano", "Port Harcourt",
];

export const cityToCountry: Record<string, string> = {
  "Dar es Salaam": "Tanzania", "Dodoma": "Tanzania", "Arusha": "Tanzania",
  "Mwanza": "Tanzania", "Zanzibar": "Tanzania", "Mbeya": "Tanzania",
  "Moshi": "Tanzania", "Tanga": "Tanzania",
  "Nairobi": "Kenya", "Mombasa": "Kenya", "Kisumu": "Kenya", "Nakuru": "Kenya",
  "Eldoret": "Kenya", "Thika": "Kenya", "Kiambu": "Kenya", "Machakos": "Kenya",
  "Kampala": "Uganda", "Entebbe": "Uganda", "Jinja": "Uganda", "Mukono": "Uganda", "Mbarara": "Uganda",
  "Kigali": "Rwanda",
  "Bujumbura": "Burundi",
  "Addis Ababa": "Ethiopia", "Adama": "Ethiopia",
  "Lagos": "Nigeria", "Abuja": "Nigeria", "Ibadan": "Nigeria", "Kano": "Nigeria", "Port Harcourt": "Nigeria",
};

export const currencies = [
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "RWF", symbol: "RF", name: "Rwandan Franc" },
  { code: "BIF", symbol: "FBu", name: "Burundian Franc" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "USD", symbol: "$", name: "US Dollar" },
];

export const languages = [
  { code: "en", name: "English" },
  { code: "sw", name: "Swahili" },
];

export interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  condition: string;
  year: number;
  mileage: number;
  transmission: string;
  location: string;
  image: string;
  images?: string[];
  views: number;
  sellerName: string;
  sellerRating: number;
  sellerType: "dealer" | "private";
  sellerListingCount: number;
  badge?: "hot" | "featured" | "new";
  bodyType?: string;
  fuelType?: string;
  make: string;
  model: string;
  cc?: number;
  originalPrice?: number;
  discount?: number;
  sellerId?: string;
  sellerPhone?: string;
  description?: string;
  color?: string;
  chassis?: string;
  dutyPaid?: boolean;
  sourceUrl?: string;
  country?: string;
}

// ─── Scraped Instagram listings — Mgaya Motors TZ ────────────────────────────

// Normalize Unicode mathematical bold/italic chars (𝗧𝗼𝘆𝗼𝘁𝗮 → Toyota)
// Must use Array.from() — split('') breaks surrogate pairs
function _normalizeUnicode(s: string): string {
  return Array.from(s).map(c => {
    const cp = c.codePointAt(0) ?? 0;
    if (cp >= 0x1D400 && cp <= 0x1D419) return String.fromCharCode(cp - 0x1D400 + 65); // Bold Cap A-Z
    if (cp >= 0x1D41A && cp <= 0x1D433) return String.fromCharCode(cp - 0x1D41A + 97);  // Bold Small a-z
    if (cp >= 0x1D468 && cp <= 0x1D481) return String.fromCharCode(cp - 0x1D468 + 65); // Bold Italic Cap
    if (cp >= 0x1D482 && cp <= 0x1D49B) return String.fromCharCode(cp - 0x1D482 + 97);  // Bold Italic Small
    if (cp >= 0x1D5D4 && cp <= 0x1D5ED) return String.fromCharCode(cp - 0x1D5D4 + 65); // Sans Bold Cap
    if (cp >= 0x1D5EE && cp <= 0x1D607) return String.fromCharCode(cp - 0x1D5EE + 97);  // Sans Bold Small
    if (cp >= 0x1D7CE && cp <= 0x1D7D7) return String.fromCharCode(cp - 0x1D7CE + 48);  // Bold Digits
    if (cp >= 0x1D7EC && cp <= 0x1D7F5) return String.fromCharCode(cp - 0x1D7EC + 48);  // Sans Bold Digits
    return c;
  }).join("");
}

function _parseMgayaPrice(raw: string | null): number {
  if (!raw) return 0;
  const spacedMillion = raw.match(/\b(\d{2,3})\s+(\d)\s*(?:m|mil|mln|million|milion)\b/i);
  if (spacedMillion) return Math.round(parseFloat(`${spacedMillion[1]}.${spacedMillion[2]}`) * 1_000_000);
  const s = raw
    .replace(/\b(KES|KSH|TZS|TZshs|TSh|UGX|USh|USD|RWF|RF|ETB)\b/gi, "")
    .replace(/[,\s]/g, "")
    .replace(/[/=\-+➕]/g, "");
  const mMatch = s.match(/^(\d+(?:\.\d+)?)(?:m|mln|mil(?:ion|lion))/i);
  if (mMatch) return Math.round(parseFloat(mMatch[1]) * 1_000_000);
  const numMatch = s.match(/^(\d+(?:\.\d+)?)/);
  if (numMatch) {
    const n = parseFloat(numMatch[1]);
    return n >= 1 && n < 10_000 ? Math.round(n * 1_000_000) : Math.round(n);
  }
  return 0;
}

function _normalizePriceForCurrency(price: number, currency: string): number {
  if (!price || price <= 0) return 0;
  if (currency === "KES" && price > 60_000_000) return Math.round(price / 1000);
  if (currency === "UGX" && price > 2_500_000_000) return Math.round(price / 1000);
  if (currency === "TZS" && price > 1_500_000_000) return Math.round(price / 1000);
  return price;
}

// Known East African car brands for first-line extraction
const _CAR_BRANDS = ["toyota","nissan","mitsubishi","subaru","honda","mazda","bmw","mercedes","benz","mercedes-benz","audi","volkswagen","vw","land rover","range rover","hyundai","kia","isuzu","suzuki","ford","jeep","lexus","peugeot","volvo","porsche","maserati","ferrari","lamborghini","bentley","rolls royce","cadillac","dodge","chrysler","buick","opel","renault","fiat","alfa romeo","jaguar","infiniti","acura","lincoln","buick","hummer","pontiac","saturn","mercury","oldsmobile","daewoo","ssangyong","mahindra","tata","bajaj","tvs","yamaha","honda","kawasaki","ktm","piaggio","vespa","triumph","harley","ducati","royal enfield"];

function _extractMakeModelFromLine(line: string): { make: string | null; model: string | null } {
  const clean = line.replace(/[*#✅☎️▶️🚘🏎️💰➡️]/gu, "").trim();
  const lower = clean.toLowerCase();
  for (const brand of _CAR_BRANDS) {
    if (lower.startsWith(brand) || lower.includes(` ${brand} `) || lower.includes(` ${brand}\n`)) {
      const makeCapitalized = brand.replace(/\b\w/g, c => c.toUpperCase());
      const rest = clean.slice(clean.toLowerCase().indexOf(brand) + brand.length).trim();
      // Rest is the model — take up to 40 chars, drop price/number lines
      const modelRaw = rest.replace(/^\s*[-:]\s*/, "")
        .split(/[,\n|]/)[0]           // stop at comma, newline, or pipe (AL-HUSNAIN format)
        .replace(/\b(19|20)\d{2}\b/g, "") // strip duplicate years from model
        .replace(/\b(?:asking\s+)?(?:price|bei)\b.*$/i, "")
        .replace(/\b(?:TZS|TSh|KES|KSh|KSH|UGX|USh|RWF|RF|ETB|USD)\s*[\d,.]+.*$/i, "")
        .replace(/\b(?:contact|call|whatsapp|dm|inbox)\b.*$/i, "")
        .replace(/\b(?:model\s+)?(?:on sale|for sale|available|negotiable|buy\s*and\s*drive|buyanddrive)\b.*$/i, "")
        .replace(/\b(?:combines|is the|the perfect|where power|finished in|in excellent condition|magari|kuagiza|agiza|carsforsale|carmarket|dreamcars|getitfromtoyota|i_beipoa)\b.*$/i, "")
        .replace(/\b(?:alloy rims?|rims?|tyres?|tires?|spare parts?)\b.*$/i, "")
        .replace(/\bmodel\b$/i, "")
        .replace(/\s{2,}/g, " ").trim().slice(0, 40);
      return { make: makeCapitalized, model: modelRaw || null };
    }
  }
  return { make: null, model: null };
}

function _cleanListingTitle(title: string): string {
  return title
    .replace(/[\uD800-\uDFFF]/g, "")
    .replace(/\b(?:asking\s+)?(?:price|bei)\b.*$/i, "")
    .replace(/\b(?:TZS|TSh|KES|KSh|KSH|UGX|USh|RWF|RF|ETB|USD)\s*[\d,.]+.*$/i, "")
    .replace(/\b(?:contact|call|whatsapp|dm|inbox)\b.*$/i, "")
    .replace(/\b(?:model\s+)?(?:on sale|for sale|available|negotiable|buy\s*and\s*drive|buyanddrive)\b.*$/i, "")
    .replace(/\b(?:combines|is the|the perfect|where power|finished in|in excellent condition|magari|kuagiza|agiza|carsforsale|carmarket|dreamcars|getitfromtoyota|i_beipoa)\b.*$/i, "")
    .replace(/\.\s*(?:petrol|diesel|hybrid|unregistered|registered)\b.*$/i, "")
    .replace(/\b(?:alloy rims?|rims?|tyres?|tires?|spare parts?)\b.*$/i, "")
    .replace(/\s+-\s*model\b/i, "")
    .replace(/\bmodel\b$/i, "")
    .replace(/[_]+/g, " ")
    .replace(/\s*\.\s*$/g, "")
    .replace(/[(/\\|,-]+$/g, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function _buildInstagramDescription(info: ReturnType<typeof _parseMgayaCaption>, sellerName: string, city: string): string {
  const location = city.split(",")[0].trim();
  const specs = [
    info.year ? `${info.year}` : null,
    "Foreign Used",
    info.transmission,
    info.fuel,
    info.cc ? `${info.cc}cc` : null,
    info.mileage ? `${info.mileage.toLocaleString()} km` : null,
    info.bodyType,
    info.color ? `${info.color} exterior` : null,
  ].filter(Boolean).join(" · ");
  return `${info.title} listed by ${sellerName}. ${specs}. Clean dealer-sourced listing with verified contact details and photos. Available in ${location}.`;
}

function _parseMgayaCaption(caption: string) {
  // Strip lone surrogates from source (corrupted emoji in some scraped JSON)
  const caption_norm = _normalizeUnicode(caption).replace(/[\uD800-\uDFFF]/g, "");
  // Strip leading bullets/symbols (•, *, -, ▶️, etc.) from each line
  const lines = caption_norm.split("\n")
    .map((l) => l.trim().replace(/^[•\-*▶️➡️✅🔹🔸◾◽▪▫►●○·⁃⊙⊚]\s*/, "").replace(/[\uD800-\uDFFF]/g, ""))
    .filter(Boolean);
  const get = (...keys: string[]) => {
    for (const key of keys) {
      const re = new RegExp(`^${key}[:\\s]+(.+)`, "i");
      for (const line of lines) {
        const m = line.match(re);
        if (m) return m[1].replace(/[*✅☎️]/g, "").trim();
      }
    }
    return null;
  };

  // Labeled fields first — "maker"/"name" handles Japan vehicle-info tab format
  let make = get("make", "maker", "brand");
  let modelRaw = get("model", "name");

  // If model value is a bare year (e.g. "Model:2014"), use it as year and grab next line as actual model
  if (modelRaw && /^\d{4}$/.test(modelRaw.trim())) {
    const modelIdx = lines.findIndex(l => /^model\s*[:]\s*\d{4}/i.test(l));
    const nextLine = modelIdx >= 0 ? lines[modelIdx + 1] : null;
    if (nextLine && !/^(?:price|bei|mileage|km|fuel|engine|trans|yom|year|color|colour|ext|int|drive|seats|cc)/i.test(nextLine)) {
      modelRaw = nextLine.replace(/[\uD800-\uDFFF]/g, "").trim();
    } else {
      modelRaw = null;
    }
  }

  const yearStr = get("year of manufacture", "year model", "year", "yom") ||
    (() => { for (const l of lines.slice(0, 5)) { const m = l.match(/\b(19[89]\d|20[012]\d)\b/); if (m) return m[1]; } return null; })();
  const year = yearStr ? parseInt(String(yearStr).match(/\d{4}/)?.[0] ?? "0") : 0;
  let model: string | null = modelRaw;

  // Fallback: extract make/model from first non-price/non-label/non-phone line
  if (!make) {
    for (const line of lines.slice(0, 5)) {
      if (/^\d|price|bei|asking|☎|http|yom|ext:|int:|engine|trans|drive|seats|call\s*[\d☎]|whatsapp|official|date\s+reveal|follow|subscribe|www\.|\.com/i.test(line)) continue;
      const extracted = _extractMakeModelFromLine(line);
      if (extracted.make) { make = extracted.make; model = model || extracted.model; break; }
    }
  }

  // "Price Starts From X TZS" must be checked FIRST — otherwise get("price") grabs "Starts From…" as garbage
  const rawPrice =
    (() => { for (const l of lines) { const m = l.match(/price\s+starts?\s+from\s+([\d,.]+)/i); if (m) return m[1]; } return null; })() ||
    (() => { for (const l of lines) { const m = l.match(/(?:asking\s+(?:only|price|for)?|ask(?:ing)?\s+price|price|bei)\s*[:/;-]?\s*(?:(?:TZS|TSh|KES|KSh|KSH|UGX|USh|RWF|RF|ETB|USD)\s*)?([\d,.]+(?:\s+\d)?\s*(?:M|m|MLN|mln|Mil(?:ion|lion)|million|milion)?)/i); if (m) return m[1]; } return null; })() ||
    (() => { for (const l of lines) { const m = l.match(/\bbei\s*(?:ni|ya)?\s*[:/]?\s*([\d,.]+(?:\s+\d)?\s*(?:M|m|MLN|mln|Mil(?:ion|lion)|million|milion)?)/i); if (m) return m[1]; } return null; })() ||
    (() => { for (const l of lines) { const m = l.match(/^([\d,.]+(?:\s+\d)?\s*(?:M|m|MLN|mln|Mil(?:ion|lion)|million|milion)?)\s*(?:\/[-=]|TZS|TSh|KES|KSh|KSH|UGX|USh|RWF|RF|ETB|USD)/i); if (m) return m[1]; } return null; })() ||
    (() => { for (const l of lines) { const m = l.match(/(?:TZS|TSh|KES|KSh|KSH|UGX|USh|RWF|RF|ETB|USD)\s*([\d,.]+(?:\s+\d)?\s*(?:M|m|MLN|mln|Mil(?:ion|lion)|million|milion)?)/i); if (m) return m[1]; } return null; })() ||
    (() => { for (const l of lines) { const m = l.match(/([\d,.]+(?:\s+\d)?\s*(?:M|m|MLN|mln|Mil(?:ion|lion)|million|milion)?)\s*(?:TZS|TSh|KES|KSh|KSH|UGX|USh|RWF|RF|ETB|USD)/i); if (m) return m[1]; } return null; })() ||
    // "Ask Price Milion 20.9" — million precedes number
    (() => { for (const l of lines) { const m = l.match(/(?:m(?:il(?:ion|lion)|illion)|mln)\s+([\d,.]+)/i); if (m) return `${m[1]}m`; } return null; })() ||
    (() => { for (const l of lines) { const m = l.match(/([\d,.]+(?:\s+\d)?)\s*(?:m|mln|million|milion)\b/i); if (m) return `${m[1]}m`; } return null; })() ||
    get("bei", "price/bei", "bei/price");
  const price = _parseMgayaPrice(rawPrice);

  const fuelRaw = get("fuel", "fuel type", "engine size") ?? caption_norm;
  const fuel = /diesel/i.test(fuelRaw) ? "Diesel" : "Petrol";

  // "kilometer", "kilometres", "odometer" in addition to "mileage","km","kms"
  const mileageStr = get("mileage", "odometer", "milleage", "kilometer", "kilometres", "kilometre");
  // Inline scan: "81,000 km" but NOT "km/h" (acceleration specs like "0–100 km/h: 4.6s")
  const mileageInline = !mileageStr
    ? (() => { for (const l of lines) { const m = l.match(/(\d[\d,]+)\s*(?:km|kms)\b(?!\s*\/)/i); if (m) return m[1]; } return null; })()
    : null;
  const mileageRaw = mileageStr || mileageInline;
  const parsedMileageRaw = mileageRaw ? parseInt(mileageRaw.replace(/[^0-9]/g, "")) || 0 : 0;
  // Reject suspiciously low values — likely acceleration specs (0-100km), not odometer
  const parsedMileage = parsedMileageRaw >= 500 ? parsedMileageRaw : 0;
  // Default mileage estimate when none provided: based on year
  const estimatedMileage = year >= 2020 ? 30000 : year >= 2015 ? 80000 : year >= 2010 ? 130000 : year >= 2005 ? 170000 : 200000;
  const mileage = parsedMileage > 0 ? parsedMileage : estimatedMileage;

  const color = get("color", "colour", "ext", "exterior") ?? undefined;
  const transRaw = get("transmission") ?? caption_norm;
  const transmission: "Automatic" | "Manual" = /\bmanual\b/i.test(transRaw) ? "Manual" : "Automatic";
  const ccRaw = get("cc", "engine capacity", "engine cc", "capacity", "engine size");
  const ccNum = ccRaw ? parseFloat(ccRaw.replace(/[^0-9.]/g, "")) : 0;
  const cc = ccNum > 100 ? Math.round(ccNum) : ccNum > 0 ? Math.round(ccNum * 1000) : undefined;
  const emojiRe = /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}☎️▶️✅🔥🥷🏻🙌🤝💸👇]/gu;
  // Find first line that looks like a car name (not phone/promo/label)
  const titleFallbackLine = lines.find(l =>
    !(/^(?:call|☎|📞|tel|phone|whatsapp|official|follow|subscribe|www\.|\.com|\d{6,}|price|bei|yom|model:|ext:|int:|engine|trans|drive|seats|mileage|color|colour|fuel|km:|cc:|nearly|almost|very\s+clean|clean\s+car|top\s+of)/i.test(l))
  ) || lines[0];
  let title = make && model
    ? `${year ? year + " " : ""}${make} ${model}`.trim()
    : make
    ? `${year ? year + " " : ""}${make}`.trim()
    : model
    ? `${year ? year + " " : ""}${model}`.trim()
    : titleFallbackLine.replace(emojiRe, "").replace(/[*#]/g, "").trim().slice(0, 80) || "Vehicle";
  title = title.split("|")[0].trim(); // strip "| description" suffix (AL-HUSNAIN format)
  title = title.replace(/\b(?:asking\s+)?price\s*[:/]?.*$/i, "").trim();
  title = title.replace(/\b(?:TZS|TSh|KES|KSh|KSH|UGX|RWF|RF|ETB|USD)\s*[\d,.]+.*$/i, "").trim();
  title = _cleanListingTitle(title);
  title = title.replace(/\b\w/g, (c) => c.toUpperCase());

  // Detect bodyType from make+model+caption keywords
  const bodyHint = `${make || ""} ${model || ""} ${caption}`.toLowerCase();
  let bodyType: string | undefined;
  if (/hilux|navara|ranger|d-max|l200|double.?cab|single.?cab|dmax|tundra|triton|bt-50|\bpickup\b/i.test(bodyHint)) {
    bodyType = "Pickup";
  } else if (/canter|dyna|lorry|\belf\b|fuso|hino|actros|\btruck\b/i.test(bodyHint)) {
    bodyType = "Truck";
  } else if (/daladala|coaster|rosa|hiace.{0,10}bus|minibus|mini.?bus/i.test(bodyHint)) {
    bodyType = "Minibus";
  } else if (/\bbus\b/i.test(bodyHint) && !/airbus|minibus/i.test(bodyHint)) {
    bodyType = "Bus";
  } else if (/alphard|vellfire|estima|serena|sienna|odyssey|elysion|\bmpv\b/i.test(bodyHint)) {
    bodyType = "MPV";
  } else if (/hiace|noah|voxy|\bvan\b|probox|succeed/i.test(bodyHint)) {
    bodyType = "Van";
  } else if (/motorbike|motorcycle|bodaboda|boda.?boda|pikipiki|tvs|bajaj|yamaha.{0,10}(125|150|250)/i.test(bodyHint)) {
    bodyType = "Motorcycle";
  } else if (/scooter|vespa|piaggio/i.test(bodyHint)) {
    bodyType = "Scooter";
  } else if (/\bboat\b|marine|vessel|ferry|speedboat|fibreglass|aluminium.{0,10}boat/i.test(bodyHint)) {
    bodyType = "Boat";
  } else if (/tuk.?tuk|bajaji|auto.?rickshaw/i.test(bodyHint)) {
    bodyType = "Tuk-tuk";
  } else if (/tipper|dumper|dump.?truck/i.test(bodyHint)) {
    bodyType = "Tipper";
  } else if (/prado|landcruiser|land.?cruiser|patrol|fortuner|harrier|rav4|rav 4|rush|raize|vanguard|cx-3|cx-5|cx5|tucson|santa.?fe|forester|outback|x-trail|xtrail|escudo|airtrek|outlander|vitara|tiguan|crv|hr-v|brv|\bsuv\b/i.test(bodyHint)) {
    bodyType = "SUV";
  } else if (/\bvitz\b|\bfit\b|demio|belta|\bnote\b|\bmarch\b|\bswift\b|auris|aqua|prius|\bhatchback\b/i.test(bodyHint)) {
    bodyType = "Hatchback";
  } else if (/fielder|estates?|\bwagon\b/i.test(bodyHint)) {
    bodyType = "Wagon";
  } else if (/crown|mark.?x|mark.?ii|premio|allion|\baxio\b|camry|accord|\bcivic\b|lancer|galant|corolla(?!.*suv)|impreza(?!.*suv)|\bsedan\b/i.test(bodyHint)) {
    bodyType = "Sedan";
  }

  return { title, make, model, year, price, fuel, mileage, color, transmission, cc, bodyType };
}

function _isMgayaCarPost(caption: string, isVideo = false): boolean {
  if (isVideo) return false;
  const norm = _normalizeUnicode(caption).replace(/[\uD800-\uDFFF]/g, "");
  // Reject obvious non-car promo/anniversary/event/social posts
  if (/decade of trust|decade of movement|decade of excellence|years of (service|trust)|new season.*new stock|official.*date.*reveal|follow.*us|hiring|vacancy|we are looking|job opportunity|eid mubarak|happy.*new year|merry christmas|congratulat|grand opening|meet our team|thank.*customer|asante.*mteja|delivered.*customer|another unit deliver|customer delivery|handover|tumekabidhi|tumekagua na tumekabidhi|ilirushwa.*kuuzwa|ya mteja wetu imefika|wateja wetu kwa kutuamini|safari kwenda.*kwa supply|taarifa muhimu kwa wateja/i.test(norm)) return false;
  // Word-boundary brand matching (prevents "kia" in "Tunawatakia" false-positives)
  const hasBrand = /\b(toyota|nissan|honda|subaru|mazda|mitsubishi|bmw|mercedes|benz|audi|ford|range rover|land rover|maserati|yamaha|bajaj|tvs|ktm|piaggio|suzuki|hyundai|kia|isuzu|lexus|peugeot|volvo|jeep|porsche|crown|alphard|harrier|prado|hilux|corolla|vitz|axio|fielder|rush|raize|landcruiser|land.?cruiser|fortuner|navara|ranger|hilux)\b/i.test(norm);
  const hasYear = /\b(19[89]\d|20[012]\d)\b/.test(norm);
  // "bei" must be followed by a digit/colon (actual price) not a Swahili phrase like "bei nafuu"
  const hasPriceLabel = /(?:price|bei)\s*[:/]\s*\d|price\s+starts?\s+from\s+\d|bei\s+\d[\d,]/i.test(norm);
  const hasStructuredData = /(?:fuel|cc|engine|transmission|mileage|km|make|model|yom)\s*[:/]/i.test(norm);
  const hasMarine = /\b(boat|boti|mashua|marine|panga|fiberglass|fibreglass|outboard|inboard|speedboat|vessel|dinghy)\b/i.test(norm);
  const hasBike = /\b(pikipiki|bodaboda|motorcycle|motorbike|boxer|scooter|boda.?boda)\b/i.test(norm);
  return hasBrand || hasYear || hasPriceLabel || hasStructuredData || hasMarine || hasBike;
}

function _convertMgayaToListings(): Listing[] {
  const posts = (mgayaJson.posts as Array<{ shortcode: string; date: string; caption: string; likes: number; images: string[]; url: string; is_video?: boolean }>)
    .filter((p) => _isMgayaCarPost(p.caption, p.is_video))
    .filter((p, i, arr) => {
      const key = p.caption.slice(0, 120).replace(/\s+/g, " ").toLowerCase();
      return arr.findIndex((x) => x.caption.slice(0, 120).replace(/\s+/g, " ").toLowerCase() === key) === i;
    })
    .slice(0, _dealerListingLimit("mgayamotors"));
  return posts.map((post, i) => {
    const info = _parseMgayaCaption(post.caption);
    const images = _postImages("mgayamotors", post, i);
    return {
      id: `ig-mgaya-${post.shortcode}`,
      title: info.title,
      price: info.price,
      currency: "TZS",
      condition: "Foreign Used" as const,
      year: info.year || new Date(post.date).getFullYear(),
      mileage: info.mileage,
      transmission: info.transmission,
      location: "Dar es Salaam, TZ",
      country: "TZ",
      image: images[0] || "",
      images,
      views: Math.max(post.likes * 3, 50),
      sellerName: "Mgaya Motors TZ",
      sellerRating: 4.8,
      sellerType: "dealer" as const,
      sellerListingCount: posts.length,
      sellerId: "dealer-mgayamotors",
      sellerPhone: "+255712986630",
      badge: i < 3 ? "hot" as const : undefined,
      fuelType: info.fuel,
      bodyType: info.bodyType,
      make: info.make ?? "Unknown",
      model: info.model ?? "Unknown",
      cc: info.cc,
      color: info.color,
      dutyPaid: false,
      description: _buildInstagramDescription(info, "Mgaya Motors TZ", "Dar es Salaam, TZ"),
    };
  });
}

function _convertAllShowroomsToListings(): Listing[] {
  const results: Listing[] = [];
  for (const [path, mod] of Object.entries(_showroomMods)) {
    const username = path.split("/").pop()!.replace(".json", "");
    if (username === "mgayamotors") continue; // already handled separately
    if (!_isLaunchShowroom(username)) continue;
    const dealer = mod.default;
    if (!_hasUsableDealerPhone(dealer.phone)) continue;
    const city = DEALER_CITY[username] ?? "Dar es Salaam, TZ";
    const currency = _dealerCurrency(username);
    const country = _dealerCountry(username);
    const carPosts = (dealer.posts as Array<{ shortcode: string; date: string; caption: string; likes: number; images: string[]; url: string; price?: number; currency?: string; is_video?: boolean }>)
      .filter((p) => _isMgayaCarPost(p.caption, p.is_video))
      .filter((p, i, arr) => {
        const key = p.caption.slice(0, 120).replace(/\s+/g, " ").toLowerCase();
        return arr.findIndex((x) => x.caption.slice(0, 120).replace(/\s+/g, " ").toLowerCase() === key) === i;
      })
      .slice(0, _dealerListingLimit(username));
    for (const post of carPosts) {
      const info = _parseMgayaCaption(post.caption);
      const images = _postImages(username, post);
      const postPrice = typeof post.price === "number" && post.price > 0 ? post.price : 0;
      const price = postPrice || _normalizePriceForCurrency(info.price, currency);
      results.push({
        id: `ig-${username}-${post.shortcode}`,
        title: info.title,
        price,
        currency,
        condition: "Foreign Used" as const,
        year: info.year || (post.date ? new Date(post.date).getFullYear() : 0),
        mileage: info.mileage,
        transmission: info.transmission,
        location: city,
        image: images[0] || "",
        images,
        views: Math.max(post.likes * 3, 50),
        sellerName: dealer.full_name || username,
        sellerRating: 4.5,
        sellerType: "dealer" as const,
        sellerListingCount: carPosts.length,
        sellerId: `dealer-${username}`,
        sellerPhone: dealer.phone || "",
        make: info.make ?? "Unknown",
        model: info.model ?? "Unknown",
        bodyType: info.bodyType,
        cc: info.cc,
        color: info.color,
        fuelType: info.fuel,
        dutyPaid: false,
        description: _buildInstagramDescription(info, dealer.full_name || username, city),
        sourceUrl: post.url,
        country,
      });
    }
  }
  return results;
}

function _isLaunchQualityListing(listing: Listing): boolean {
  const title = (listing.title || "").replace(/\s+/g, " ").trim();
  const images = listing.images?.filter(Boolean) || (listing.image ? [listing.image] : []);
  const contactPending = listing.sellerId === "ibaraki" || listing.sellerId === "dealer-ibaraki" || listing.id.startsWith("ib-");
  if (listing.id.startsWith("jiji-")) return false;
  if ((!listing.price || listing.price <= 0) && !contactPending) return false;
  if (listing.price > 0 && listing.currency === "KES" && (listing.price < 100_000 || listing.price > 60_000_000)) return false;
  if (listing.price > 0 && listing.currency === "TZS" && (listing.price < 1_000_000 || listing.price > 1_500_000_000)) return false;
  if (listing.price > 0 && listing.currency === "UGX" && (listing.price < 5_000_000 || listing.price > 2_500_000_000)) return false;
  if (listing.price > 0 && listing.currency === "USD" && (listing.price < 1_000 || listing.price > 1_000_000)) return false;
  if (!listing.make || /unknown|select|n\/a/i.test(listing.make)) return false;
  if (!listing.model || /unknown|select|n\/a|^na$|^ine$|^model$|alloy|rims?|tyres?|tires?|spare|magari|agiza|kuagiza|carsforsale|carmarket|dreamcars|reliable/i.test(listing.model)) return false;
  if (!listing.year || (listing.bodyType !== "Boat" && listing.year < 2000) || listing.year > new Date().getFullYear() + 1) return false;
  if (title.length < 10 || title.length > 90) return false;
  if (/^(vehicle|car|cars|used cars?|magari|stock|new stock|available|sold|ask|asking|price|bei|contact|call|whatsapp|official|import|imports)$/i.test(title)) return false;
  if (/\b(ask|asking|contact for price|call for price|dm for price|price on request|inbox|whatsapp|call now|official|follow|subscribe|sold out|sold|reserved)\b/i.test(title)) return false;
  if (/\b(price|bei|whatsapp|contact|call|dm|inbox)\b/i.test(title)) return false;
  if (/\b(?:TZS|TSh|KES|KSh|KSH|UGX|USh|RWF|RF|ETB|USD)\b/i.test(title)) return false;
  if (/\b(on sale|for sale|negotiable|buyanddrive|buy\s*and\s*drive|combines|is the|the perfect|where power|finished in|in excellent condition|magari|kuagiza|agiza|carsforsale|carmarket|dreamcars|getitfromtoyota|i_beipoa|unregistered|alloy rims?|rims?|tyres?|tires?|spare parts?)\b/i.test(title)) return false;
  if (/\bmodel\b$/i.test(title)) return false;
  if (/^(price|bei|engine|mileage|transmission|fuel|color|colour|location)\b/i.test(title)) return false;
  if (listing.id.startsWith("ig-") && images.length < 2 && !contactPending) return false;
  if (images.length < 1) return false;
  if ((listing.description || "").length < 40 && listing.id.startsWith("ig-")) return false;
  return true;
}

function _boatImages(slug: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => `/boats/nicolette/${slug}-${String(index + 1).padStart(2, "0")}.webp`);
}

function _nicoletteBoatListings(): Listing[] {
  const seller = {
    sellerName: "Nicolette",
    sellerRating: 4.7,
    sellerType: "dealer" as const,
    sellerListingCount: 7,
    sellerPhone: "+255765407462",
    sellerId: "dealer-nicolette-boats",
    location: "Dar es Salaam, TZ",
    country: "TZ",
    bodyType: "Boat",
    fuelType: "Petrol",
    condition: "Used" as const,
    transmission: "Automatic",
  };
  const rows: Array<Omit<Listing, keyof typeof seller | "image" | "images" | "views"> & { slug: string; imageCount: number; views: number }> = [
    {
      id: "boat-nicolette-island-spirit-38-40",
      title: "2000 Island Spirit 38/40 Catamaran",
      make: "Island Spirit",
      model: "38/40 Catamaran",
      year: 2000,
      price: 175000,
      currency: "USD",
      mileage: 0,
      cc: 0,
      slug: "island-spirit-38-40",
      imageCount: 22,
      views: 146,
      description: "Island Spirit 38/40 bluewater cruising catamaran located in Dar es Salaam. One-owner vessel with a major November 2024 refit, new engines, new plumbing and seacocks, complete electrical rewiring, new trampolines, four double cabins and a spacious liveaboard layout. Ready for tropical and Indian Ocean cruising.",
    },
    {
      id: "boat-nicolette-jonmeri-40",
      title: "Jonmeri 40 Classic Bluewater Cruiser",
      make: "Jonmeri",
      model: "40 Bluewater Cruiser",
      year: 1985,
      price: 60000,
      currency: "USD",
      mileage: 0,
      cc: 0,
      slug: "jonmeri-40",
      imageCount: 8,
      views: 118,
      description: "Jonmeri 40 classic Finnish bluewater cruiser priced to sell. Built for serious sailing, with a solid hull design, deep fin keel and balanced sail plan. Located in Dar es Salaam with access to Zanzibar, Mafia, Pemba, Comoros, Mayotte, Seychelles and Madagascar cruising routes.",
    },
    {
      id: "boat-nicolette-social-cruiser-12m",
      title: "2021 Custom 12m Guest And Island Trip Boat",
      make: "Custom",
      model: "12m Guest Boat",
      year: 2021,
      price: 48000,
      currency: "USD",
      mileage: 0,
      cc: 0,
      slug: "social-cruiser-12m",
      imageCount: 3,
      views: 102,
      description: "Classy 12 meter guest boat for up to 24 passengers. Suitable for sundowner trips, snorkeling trips, island transfers and scuba-diving groups. Equipped with a 400 liter fuel tank and twin Yamaha 250 hp engines. Well maintained and ready for seasonal commercial use.",
    },
    {
      id: "boat-nicolette-sea-ray-26ft",
      title: "2021 Refurbished Sea Ray 26ft Centre Console",
      make: "Sea Ray",
      model: "26ft Centre Console",
      year: 2021,
      price: 29900,
      currency: "USD",
      mileage: 0,
      cc: 0,
      slug: "sea-ray-26ft-centre-console",
      imageCount: 6,
      views: 96,
      description: "8 meter / 26 ft Sea Ray centre-console boat refurbished in 2021. Family, cruising, fishing and watersports setup with seating for 8 people, storage, twin V-drive Yamaha 150 hp two-stroke engines, GPS fish finder, safety equipment and comfortable deck layout.",
    },
    {
      id: "boat-nicolette-catamaran-hull-19ft",
      title: "2024 Custom 19ft Catamaran-Hull Powerboat",
      make: "Custom",
      model: "19ft Catamaran-Hull Powerboat",
      year: 2024,
      price: 19000,
      currency: "USD",
      mileage: 0,
      cc: 0,
      slug: "catamaran-hull-19ft-powerboat",
      imageCount: 3,
      views: 88,
      description: "Full fibre 19 ft catamaran-hull centre-console powerboat. Recently fitted with two brand-new Mercury Seapro 60 hp four-stroke engines. Stable double-hull design suitable for fishing, leisure cruising, island hopping and towing watersports gear.",
    },
    {
      id: "boat-nicolette-kaptein-18ft",
      title: "2026 Kaptein 18ft Leisure And Fishing Boat",
      make: "Kaptein",
      model: "18ft Leisure Boat",
      year: 2026,
      price: 17000,
      currency: "USD",
      mileage: 0,
      cc: 0,
      slug: "kaptein-18ft",
      imageCount: 8,
      views: 84,
      description: "Kaptein 18 ft leisure and fishing boat with room for a small group. Comes with trailer, swimming ladder and documented maintenance history. Suitable for fishing, short cruises and leisure days on the water.",
    },
    {
      id: "boat-nicolette-shirin-18-5ft",
      title: "2013 Shirin 18.5ft Powerboat",
      make: "Shirin",
      model: "18.5ft Powerboat",
      year: 2013,
      price: 15000,
      currency: "USD",
      mileage: 0,
      cc: 3000,
      slug: "shirin-18-5ft-powerboat",
      imageCount: 5,
      views: 91,
      description: "Shirin 18.5 ft powerboat from 2013 with a 135 hp 3.0 liter Mercury MerCruiser engine. Engine recently overhauled. Built for cruising, island hopping, wakeboarding and waterskiing, with a reduced asking price.",
    },
  ];

  return rows.map((row) => {
    const images = _boatImages(row.slug, row.imageCount);
    const { slug, imageCount, ...listing } = row;
    return {
      ...listing,
      ...seller,
      image: images[0],
      images,
    };
  });
}

export const mockListings: Listing[] = [
  ..._convertMgayaToListings(),
  ..._convertAllShowroomsToListings(),
  ..._nicoletteBoatListings(),

  // ─── Additional private seller listings — various cities across East Africa ──
  {
    id: "stock-11", title: "2018 Toyota Vitz F 1.0 Hatchback", price: 18_500_000, currency: "TZS",
    condition: "Foreign Used", year: 2018, mileage: 42000, transmission: "Automatic",
    location: "Arusha, TZ", country: "TZ", image: "/cars/patrol-2022-1.jpg", images: ["/cars/patrol-2022-1.jpg"],
    views: 312, sellerName: "Arusha Auto Center", sellerRating: 4.3, sellerType: "dealer",
    sellerListingCount: 8, sellerPhone: "+255754000011", make: "Toyota", model: "Vitz",
    bodyType: "Hatchback", fuelType: "Petrol", cc: 1000, dutyPaid: true,
    description: "Toyota Vitz 2018 F grade 1.0L petrol automatic. Excellent fuel economy — perfect city car for Arusha. Low mileage 42,000km. Clean interior, well maintained.",
  },
  {
    id: "stock-12", title: "2019 Mazda Demio 1.3 Hatchback", price: 22_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2019, mileage: 38000, transmission: "Automatic",
    location: "Mwanza, TZ", country: "TZ", image: "/cars/hilux-gray-2019-1.jpg", images: ["/cars/hilux-gray-2019-1.jpg"],
    views: 198, sellerName: "Hassan Mwanza", sellerRating: 4.0, sellerType: "private",
    sellerListingCount: 1, sellerPhone: "+255766000012", make: "Mazda", model: "Demio",
    bodyType: "Hatchback", fuelType: "Petrol", cc: 1300, dutyPaid: true,
    description: "Mazda Demio 2019 1.3L automatic. Very economical, perfect for city and family use. First owner. No accidents. Available for viewing in Mwanza.",
  },
  {
    id: "stock-13", title: "2020 Toyota Rush 1.5 SUV", price: 48_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2020, mileage: 28000, transmission: "Automatic",
    location: "Dar es Salaam, TZ", country: "TZ", image: "/cars/fortuner-white-2019-1.jpg", images: ["/cars/fortuner-white-2019-1.jpg"],
    views: 521, sellerName: "Dar Auto Hub", sellerRating: 4.5, sellerType: "dealer",
    sellerListingCount: 15, sellerPhone: "+255752000013", badge: "hot" as const, make: "Toyota", model: "Rush",
    bodyType: "SUV", fuelType: "Petrol", cc: 1500, dutyPaid: true,
    description: "Toyota Rush 2020 1.5L automatic SUV. 7-seater, perfect for families. Clean and well maintained. Fuel efficient. New tyres.",
  },
  {
    id: "stock-14", title: "2017 Toyota Wish 1.8 Minivan", price: 38_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2017, mileage: 65000, transmission: "Automatic",
    location: "Zanzibar, TZ", country: "TZ", image: "/cars/subaru-forester-2022-1.jpg", images: ["/cars/subaru-forester-2022-1.jpg"],
    views: 276, sellerName: "Zanzibar Cars", sellerRating: 4.1, sellerType: "dealer",
    sellerListingCount: 6, sellerPhone: "+255777000014", make: "Toyota", model: "Wish",
    bodyType: "Van", fuelType: "Petrol", cc: 1800, dutyPaid: true,
    description: "Toyota Wish 2017 1.8L automatic. 7-seater family minivan. Clean interior. Good condition. Zanzibar registered.",
  },
  {
    id: "stock-15", title: "2016 Toyota Vanguard 2.0 4WD SUV", price: 55_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2016, mileage: 78000, transmission: "Automatic",
    location: "Mbeya, TZ", country: "TZ", image: "/cars/landrover-disco-2020-1.jpg", images: ["/cars/landrover-disco-2020-1.jpg"],
    views: 189, sellerName: "Mbeya Motors", sellerRating: 3.9, sellerType: "dealer",
    sellerListingCount: 4, sellerPhone: "+255765000015", make: "Toyota", model: "Vanguard",
    bodyType: "SUV", fuelType: "Petrol", cc: 2000, dutyPaid: true,
    description: "Toyota Vanguard 2016 2.0L 4WD. 7-seater SUV, ideal for mountain terrain around Mbeya. Well maintained, all services done.",
  },
  {
    id: "stock-16", title: "2021 Toyota Prius 1.8 Hybrid", price: 35_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2021, mileage: 22000, transmission: "CVT",
    location: "Dar es Salaam, TZ", country: "TZ", image: "/cars/hilux-white-2019-1.jpg", images: ["/cars/hilux-white-2019-1.jpg"],
    views: 445, sellerName: "EcoMotors TZ", sellerRating: 4.6, sellerType: "dealer",
    sellerListingCount: 11, sellerPhone: "+255752000016", badge: "featured" as const, make: "Toyota", model: "Prius",
    bodyType: "Sedan", fuelType: "Hybrid", cc: 1800, dutyPaid: true,
    description: "Toyota Prius 2021 1.8L Hybrid. Ultra-low fuel consumption — 26km/L. Perfect for Dar es Salaam traffic. Lane assist, adaptive cruise. Low 22,000km.",
  },
  {
    id: "stock-17", title: "2020 Toyota Aqua 1.5 Hybrid", price: 25_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2020, mileage: 35000, transmission: "CVT",
    location: "Arusha, TZ", country: "TZ", image: "/cars/navara-2017-1.jpg", images: ["/cars/navara-2017-1.jpg"],
    views: 367, sellerName: "Kilimanjaro Auto", sellerRating: 4.2, sellerType: "dealer",
    sellerListingCount: 7, sellerPhone: "+255754000017", make: "Toyota", model: "Aqua",
    bodyType: "Hatchback", fuelType: "Hybrid", cc: 1500, dutyPaid: true,
    description: "Toyota Aqua 2020 1.5L Hybrid hatchback. Excellent fuel economy. Perfect for Arusha city and safari trips. Clean condition.",
  },
  {
    id: "stock-18", title: "2015 BMW 320i 2.0 Turbo Sedan", price: 45_000_000, currency: "TZS",
    condition: "Used", year: 2015, mileage: 95000, transmission: "Automatic",
    location: "Dar es Salaam, TZ", country: "TZ", image: "/cars/wrangler-2016-1.jpg", images: ["/cars/wrangler-2016-1.jpg"],
    views: 534, sellerName: "Prestige Motors TZ", sellerRating: 4.4, sellerType: "dealer",
    sellerListingCount: 9, sellerPhone: "+255752000018", make: "BMW", model: "3 Series",
    bodyType: "Sedan", fuelType: "Petrol", cc: 2000, dutyPaid: true,
    description: "BMW 320i 2015 F30 2.0T. Luxury sedan in excellent condition. Leather interior, sunroof, navigation. Full service history. Locally used.",
  },
  {
    id: "stock-19", title: "2016 Mercedes-Benz C200 1.8 Turbo", price: 3_800_000, currency: "KES",
    condition: "Used", year: 2016, mileage: 87000, transmission: "Automatic",
    location: "Nairobi, KE", image: "/cars/hilux-arb-2019-1.jpg", images: ["/cars/hilux-arb-2019-1.jpg"],
    views: 412, sellerName: "Nairobi Premium Cars", sellerRating: 4.5, sellerType: "dealer",
    sellerListingCount: 13, sellerPhone: "+254720000019", country: "KE",
    make: "Mercedes-Benz", model: "C-Class", bodyType: "Sedan", fuelType: "Petrol",
    cc: 1800, dutyPaid: true,
    description: "Mercedes-Benz C200 2016 W205. Premium executive sedan. AMG styling package. Panoramic sunroof. Nairobi registered. Clean title.",
  },
  {
    id: "stock-20", title: "2018 Mazda CX-5 2.0 SUV", price: 52_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2018, mileage: 52000, transmission: "Automatic",
    location: "Dar es Salaam, TZ", country: "TZ", image: "/cars/subaru-forester-2022b-1.jpg", images: ["/cars/subaru-forester-2022b-1.jpg"],
    views: 298, sellerName: "Mazda Centre TZ", sellerRating: 4.3, sellerType: "dealer",
    sellerListingCount: 5, sellerPhone: "+255752000020", make: "Mazda", model: "CX-5",
    bodyType: "SUV", fuelType: "Petrol", cc: 2000, dutyPaid: true,
    description: "Mazda CX-5 2018 Skyactiv-G 2.0. Premium crossover SUV. BOSE sound system, leather, blind spot monitoring. Japanese import.",
  },
  {
    id: "stock-21", title: "2019 Mitsubishi Outlander 2.4 SUV", price: 155_000_000, currency: "UGX",
    condition: "Foreign Used", year: 2019, mileage: 44000, transmission: "CVT",
    location: "Kampala, UG", image: "/cars/patrol-2022-2.jpg", images: ["/cars/patrol-2022-2.jpg"],
    views: 187, sellerName: "Kampala Cars Ltd", sellerRating: 4.0, sellerType: "dealer",
    sellerListingCount: 6, sellerPhone: "+256700000021", country: "UG",
    make: "Mitsubishi", model: "Outlander", bodyType: "SUV", fuelType: "Petrol",
    cc: 2400, dutyPaid: true,
    description: "Mitsubishi Outlander 2019 2.4L CVT. 7-seater SUV. All wheel drive. Well maintained, clean history. Available in Kampala.",
  },
  {
    id: "stock-26", title: "2022 Toyota Rumion 1.5 Hatchback", price: 28_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2022, mileage: 15000, transmission: "Automatic",
    location: "Moshi, TZ", country: "TZ", image: "/cars/navara-2017-2.jpg", images: ["/cars/navara-2017-2.jpg"],
    views: 245, sellerName: "Moshi Auto Sales", sellerRating: 4.1, sellerType: "dealer",
    sellerListingCount: 3, sellerPhone: "+255754000026", badge: "new" as const,
    make: "Toyota", model: "Rumion", bodyType: "Hatchback", fuelType: "Petrol",
    cc: 1500, dutyPaid: true,
    description: "Toyota Rumion 2022 1.5L automatic. Brand new import with only 15,000km. Modern safety features, Apple CarPlay. Perfect condition.",
  },
  {
    id: "stock-27", title: "2021 Toyota Kluger 3.5 V6 AWD SUV", price: 5_700_000, currency: "KES",
    condition: "Foreign Used", year: 2021, mileage: 24000, transmission: "Automatic",
    location: "Nairobi, KE", image: "/cars/subaru-forester-2022-3.jpg", images: ["/cars/subaru-forester-2022-3.jpg"],
    views: 334, sellerName: "Westlands Auto KE", sellerRating: 4.4, sellerType: "dealer",
    sellerListingCount: 11, sellerPhone: "+254720000027", country: "KE",
    make: "Toyota", model: "Kluger", bodyType: "SUV", fuelType: "Petrol",
    cc: 3500, dutyPaid: true,
    description: "Toyota Kluger 2021 3.5L V6 AWD. 8-seater premium SUV. Dual sunroof, captain seats, wireless charging. Excellent condition.",
  },
  {
    id: "stock-28", title: "2018 Mitsubishi Pajero 3.2 Diesel 4WD", price: 88_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2018, mileage: 62000, transmission: "Automatic",
    location: "Dar es Salaam, TZ", country: "TZ", image: "/cars/hilux-arb-2019-2.jpg", images: ["/cars/hilux-arb-2019-2.jpg"],
    views: 467, sellerName: "Safari Auto TZ", sellerRating: 4.3, sellerType: "dealer",
    sellerListingCount: 8, sellerPhone: "+255752000028", make: "Mitsubishi", model: "Pajero",
    bodyType: "SUV", fuelType: "Diesel", cc: 3200, dutyPaid: true,
    description: "Mitsubishi Pajero 2018 V93 3.2D 4WD. Full-size luxury 4x4. Super select 4WD, locking diff, terrain management. Perfect for safaris and rough terrain.",
  },
  {
    id: "stock-29", title: "2020 Toyota Hilux Surf 3.0 4WD Diesel", price: 72_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2020, mileage: 45000, transmission: "Automatic",
    location: "Arusha, TZ", country: "TZ", image: "/cars/patrol-2022-3.jpg", images: ["/cars/patrol-2022-3.jpg"],
    views: 389, sellerName: "Arusha 4x4 Centre", sellerRating: 4.2, sellerType: "dealer",
    sellerListingCount: 7, sellerPhone: "+255754000029", make: "Toyota", model: "Hilux Surf",
    bodyType: "SUV", fuelType: "Diesel", cc: 3000, dutyPaid: true,
    description: "Toyota Hilux Surf 2020 (4Runner) 3.0D 4WD. Premium mid-size SUV. KDSS, locking rear diff, crawl control. Ideal for Arusha–Nairobi runs.",
  },
  {
    id: "stock-30", title: "2019 Nissan Civilian 4.2 Minibus 28-seater", price: 45_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2019, mileage: 95000, transmission: "Manual",
    location: "Dar es Salaam, TZ", country: "TZ", image: "/cars/hilux-gray-2019-3.jpg", images: ["/cars/hilux-gray-2019-3.jpg"],
    views: 156, sellerName: "Daladala Motors TZ", sellerRating: 3.8, sellerType: "dealer",
    sellerListingCount: 4, sellerPhone: "+255752000030", make: "Nissan", model: "Civilian",
    bodyType: "Minibus", fuelType: "Diesel", cc: 4200, dutyPaid: false,
    description: "Nissan Civilian 2019 4.2L diesel 28-seater. Japanese import. Right-hand drive, A/C, well maintained. Ideal for school or hotel shuttle. Duty not paid.",
  },
  {
    id: "stock-31", title: "2020 Mitsubishi Canter 4WD Truck", price: 65_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2020, mileage: 78000, transmission: "Manual",
    location: "Mwanza, TZ", country: "TZ", image: "/cars/hilux-white-2019-2.jpg", images: ["/cars/hilux-white-2019-2.jpg"],
    views: 134, sellerName: "Mwanza Trucks", sellerRating: 4.0, sellerType: "dealer",
    sellerListingCount: 3, sellerPhone: "+255766000031", make: "Mitsubishi", model: "Canter",
    bodyType: "Truck", fuelType: "Diesel", cc: 3900, dutyPaid: false,
    description: "Mitsubishi Canter 4WD 2020 3.9L diesel. Flat bed truck, 3-tonne payload. Excellent for mining and rough terrain. Duty not paid — good price.",
  },
  {
    id: "stock-32", title: "2022 Mazda Verisa 1.5 Hatchback", price: 22_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2022, mileage: 18000, transmission: "Automatic",
    location: "Dodoma, TZ", country: "TZ", image: "/cars/subaru-forester-2022b-2.jpg", images: ["/cars/subaru-forester-2022b-2.jpg"],
    views: 212, sellerName: "Capital Cars Dodoma", sellerRating: 4.0, sellerType: "dealer",
    sellerListingCount: 5, sellerPhone: "+255763000032", badge: "new" as const,
    make: "Mazda", model: "Verisa", bodyType: "Hatchback", fuelType: "Petrol",
    cc: 1500, dutyPaid: true,
    description: "Mazda Verisa 2022 1.5L hatchback. Stylish and economical. Only 18,000km. Perfect for city driving in Dodoma. All papers in order.",
  },
  {
    id: "stock-33", title: "2019 Subaru Forester 2.0 AWD XT Turbo", price: 82_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2019, mileage: 47000, transmission: "CVT",
    location: "Dar es Salaam, TZ", country: "TZ", image: "/cars/subaru-forester-2022-4.jpg", images: ["/cars/subaru-forester-2022-4.jpg"],
    views: 478, sellerName: "Subaru Specialists TZ", sellerRating: 4.5, sellerType: "dealer",
    sellerListingCount: 9, sellerPhone: "+255752000033", make: "Subaru", model: "Forester",
    bodyType: "SUV", fuelType: "Petrol", cc: 2000, dutyPaid: true,
    description: "Subaru Forester 2019 2.0XT Turbo AWD. EyeSight driver assist, X-mode off-road, apple carplay. Turbocharged for mountain performance.",
  },
  {
    id: "stock-34", title: "2021 Subaru Forester 2.5 AWD E-Boxer", price: 6_800_000, currency: "KES",
    condition: "Foreign Used", year: 2021, mileage: 29000, transmission: "CVT",
    location: "Nairobi, KE", image: "/cars/subaru-forester-2022b-3.jpg", images: ["/cars/subaru-forester-2022b-3.jpg"],
    views: 356, sellerName: "Subaru Kenya", sellerRating: 4.6, sellerType: "dealer",
    sellerListingCount: 12, sellerPhone: "+254720000034", country: "KE",
    badge: "featured" as const, make: "Subaru", model: "Forester", bodyType: "SUV",
    fuelType: "Hybrid", cc: 2500, dutyPaid: true,
    description: "Subaru Forester 2021 2.5L e-Boxer hybrid AWD. EyeSight 4.0, SI-drive, X-mode. Hybrid efficiency with Subaru all-terrain capability.",
  },
  {
    id: "stock-35", title: "2020 Toyota Corolla 1.8 Sedan", price: 32_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2020, mileage: 38000, transmission: "CVT",
    location: "Tanga, TZ", country: "TZ", image: "/cars/hilux-gray-2019-4.jpg", images: ["/cars/hilux-gray-2019-4.jpg"],
    views: 287, sellerName: "Tanga Auto Sales", sellerRating: 4.0, sellerType: "dealer",
    sellerListingCount: 4, sellerPhone: "+255753000035", make: "Toyota", model: "Corolla",
    bodyType: "Sedan", fuelType: "Petrol", cc: 1800, dutyPaid: true,
    description: "Toyota Corolla 2020 1.8L CVT sedan. Pre-collision system, lane departure alert, radar cruise control. Fuel efficient family saloon.",
  },
  {
    id: "stock-36", title: "2018 Toyota Ipsum 2.4 MPV 7-seater", price: 25_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2018, mileage: 72000, transmission: "Automatic",
    location: "Dar es Salaam, TZ", country: "TZ", image: "/cars/navara-2017-3.jpg", images: ["/cars/navara-2017-3.jpg"],
    views: 198, sellerName: "Family Cars TZ", sellerRating: 3.9, sellerType: "private",
    sellerListingCount: 1, sellerPhone: "+255755000036", make: "Toyota", model: "Ipsum",
    bodyType: "Van", fuelType: "Petrol", cc: 2400, dutyPaid: true,
    description: "Toyota Ipsum 2018 2.4L automatic 7-seater MPV. Spacious family car. Good condition. Duty paid. Viewable in Dar es Salaam.",
  },
  {
    id: "stock-37", title: "2019 Toyota IST 1.5 Hatchback", price: 20_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2019, mileage: 41000, transmission: "Automatic",
    location: "Moshi, TZ", country: "TZ", image: "/cars/fortuner-white-2019-3.jpg", images: ["/cars/fortuner-white-2019-3.jpg"],
    views: 156, sellerName: "Kilimanjaro Autos", sellerRating: 4.0, sellerType: "dealer",
    sellerListingCount: 4, sellerPhone: "+255754000037", make: "Toyota", model: "IST",
    bodyType: "Hatchback", fuelType: "Petrol", cc: 1500, dutyPaid: true,
    description: "Toyota IST 2019 1.5L automatic hatchback. Compact and fuel efficient. Clean interior. Duty paid. Near Kilimanjaro.",
  },
  {
    id: "stock-38", title: "2022 Mazda CX-3 2.0 Crossover", price: 38_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2022, mileage: 16000, transmission: "Automatic",
    location: "Dar es Salaam, TZ", country: "TZ", image: "/cars/wrangler-2016-3.jpg", images: ["/cars/wrangler-2016-3.jpg"],
    views: 321, sellerName: "Mazda Centre TZ", sellerRating: 4.3, sellerType: "dealer",
    sellerListingCount: 5, sellerPhone: "+255752000020", badge: "new" as const,
    make: "Mazda", model: "CX-3", bodyType: "SUV", fuelType: "Petrol",
    cc: 2000, dutyPaid: true,
    description: "Mazda CX-3 2022 2.0L Skyactiv crossover. Sport compact SUV. Head-up display, G-Vectoring Control Plus. Low mileage import.",
  },
  {
    id: "stock-39", title: "2020 Honda CR-V 1.5T AWD SUV", price: 55_000_000, currency: "TZS",
    condition: "Foreign Used", year: 2020, mileage: 33000, transmission: "CVT",
    location: "Dar es Salaam, TZ", country: "TZ", image: "/cars/patrol-2022-4.jpg", images: ["/cars/patrol-2022-4.jpg"],
    views: 412, sellerName: "Honda Centre TZ", sellerRating: 4.4, sellerType: "dealer",
    sellerListingCount: 8, sellerPhone: "+255752000039", make: "Honda", model: "CR-V",
    bodyType: "SUV", fuelType: "Petrol", cc: 1500, dutyPaid: true,
    description: "Honda CR-V 2020 1.5T Turbo AWD. Honda Sensing safety suite, wireless CarPlay, panoramic roof. Comfortable family SUV.",
  },
].filter(_isLaunchQualityListing);

export const priceRanges = [
  { label: "Under 30M",   min: 0,           max: 30_000_000 },
  { label: "30M – 60M",   min: 30_000_000,  max: 60_000_000 },
  { label: "60M – 100M",  min: 60_000_000,  max: 100_000_000 },
  { label: "100M – 150M", min: 100_000_000, max: 150_000_000 },
  { label: "150M+",       min: 150_000_000, max: Infinity },
];

export interface MockDealer {
  user_id: string;
  display_name: string;
  city: string;
  phone: string;
  avatar_url: null;
  verified_at: string | null;
  listing_count: number;
  rating: number;
  description: string;
  address?: string;
  postal_code?: string;
  instagram?: string;
}

// Strip Unicode decorative/bold chars from Instagram display names
function _cleanName(s: string): string {
  return s.replace(/[^\x20-\x7EÀ-ɏЀ-ӿ]/g, "").replace(/\s+/g, " ").trim();
}

// Detect city from bio text
function _cityFromBio(bio: string, username: string): string {
  const b = (bio || "").toLowerCase();
  if (/nairobi|kenya|nbi/.test(b)) return "Nairobi";
  if (/kampala|uganda/.test(b)) return "Kampala";
  if (/mwanza/.test(b)) return "Mwanza";
  if (/arusha/.test(b)) return "Arusha";
  if (/mombasa/.test(b)) return "Mombasa";
  if (/zanzibar/.test(b)) return "Zanzibar";
  if (/dodoma/.test(b)) return "Dodoma";
  return DEALER_CITY[username]?.split(",")[0] ?? "Dar es Salaam";
}

// Auto-generate dealer entries for showroom accounts not already in the hardcoded list
function _generateMissingDealers(existingIds: Set<string>): MockDealer[] {
  return Object.entries(_showroomMods)
    .filter(([path]) => {
      const username = path.split("/").pop()!.replace(".json", "");
      return !existingIds.has(`dealer-${username}`) && _isLaunchShowroom(username);
    })
    .map(([path, mod]) => {
      const username = path.split("/").pop()!.replace(".json", "");
      const dealer = mod.default;
      const rawName = dealer.full_name || "";
      const displayName = _cleanName(rawName) || username.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const bio = dealer.bio || "";
      const phone = _normalizeUnicode(dealer.phone || "").replace(/\s+/g, " ").trim();
      if (!_hasUsableDealerPhone(phone)) return null;
      const city = _cityFromBio(bio, username);
      const postCount = (dealer.posts || []).length;
      return {
        user_id: `dealer-${username}`,
        display_name: displayName,
        city,
        phone,
        avatar_url: null,
        verified_at: "2026-01-01T00:00:00Z",
        listing_count: postCount,
        rating: 4.4,
        description: bio ? `${displayName} — ${_cleanName(bio).slice(0, 120)}` : `${displayName} — Quality vehicles in East Africa.`,
        address: `${city}, Tanzania`,
        postal_code: "",
        instagram: username,
      };
    })
    .filter((dealer): dealer is MockDealer => dealer !== null);
}

export const mockDealers: MockDealer[] = [
  {
    user_id: "dealer-nicolette-boats",
    display_name: "Nicolette",
    city: "Dar es Salaam",
    phone: "+255 765 407 462",
    avatar_url: null,
    verified_at: "2026-06-30T00:00:00Z",
    listing_count: 7,
    rating: 4.7,
    description: "Nicolette — boats and marine listings in Dar es Salaam, including cruising yachts, centre-console powerboats and leisure boats.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-mgayamotors",
    display_name: "Mgaya Motors TZ",
    city: "Dar es Salaam",
    phone: "+255 712 986 630",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 20,
    rating: 4.8,
    description: "Mgaya Motors TZ — trusted importer of quality Japanese vehicles in Dar es Salaam. 129K+ Instagram followers.",
    address: "Kinondoni, Dar es Salaam, Tanzania",
    postal_code: "14111",
  },
  {
    user_id: "dealer-livy_motors_tz",
    display_name: "Livy Motors TZ",
    city: "Dar es Salaam",
    phone: "+255765772216",
    avatar_url: null,
    verified_at: "2026-05-07T00:00:00Z",
    listing_count: 11,
    rating: 4.5,
    description: "Livy Motors TZ — quality foreign used cars and Japanese imports in Dar es Salaam.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
    instagram: "livy_motors_tz",
  },
  {
    user_id: "dealer-expert_motors_tz",
    display_name: "Expert Motors TZ",
    city: "Dar es Salaam",
    phone: "0657777001",
    avatar_url: null,
    verified_at: "2026-05-11T00:00:00Z",
    listing_count: 21,
    rating: 4.5,
    description: "Expert Motors TZ — new stock arrivals. Registration free, services free, number plates free. Call 0657777001.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
    instagram: "expert_motors_tz",
  },
  {
    user_id: "dealer-ibaraki",
    display_name: "Ibaraki Motors",
    city: "Dar es Salaam",
    phone: "+255 798 785 871",
    avatar_url: null,
    verified_at: "2026-01-10T00:00:00Z",
    listing_count: 9,
    rating: 4.6,
    description: "Ibaraki Motors — verified Dar es Salaam dealer with dealer-sourced SUVs, double-cabin pickups, 4x4s and Japanese imports including Nissan Patrol, Toyota Hilux, Land Rover Discovery, Subaru Forester and Jeep Wrangler stock.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "14104",
    instagram: "ibaraki",
  },
  {
    user_id: "dealer-khushimotorsdaressalaam",
    display_name: "Khushi Motors Dar es Salaam",
    city: "Dar es Salaam",
    phone: "+255 765 315 555",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 86,
    rating: 4.8,
    description: "Driven by Excellence in Luxury, Premium & Low Mileage Cars. Mombasa | Nairobi | Kisumu | Kampala | Dar es Salaam",
    address: "Ursino, Mwaikibaki Road, Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-njari_motors",
    display_name: "NJARI AUTOMOBILE LIMITED",
    city: "Dar es Salaam",
    phone: "+255 713 332 019",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 60,
    rating: 4.7,
    description: "NJARI AUTOMOBILE LIMITED — quality cars at competitive prices in Tanzania. 124K+ Instagram followers.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-ruge_magari",
    display_name: "Ruge Magari",
    city: "Dar es Salaam",
    phone: "+255 677 775 690",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 8,
    rating: 4.9,
    description: "Ruge Magari — Tanzania's most followed car dealer with 204K+ Instagram followers.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-fau_motors",
    display_name: "FAU MOTORS",
    city: "Dodoma",
    phone: "+255 652 604 375",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 6,
    rating: 4.6,
    description: "FAU MOTORS — quality used vehicles in Dodoma and across Tanzania. 104K+ Instagram followers.",
    address: "Dodoma, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-tgworldimports",
    display_name: "Tg World International Limited",
    city: "Dar es Salaam",
    phone: "+255 754 441 146",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 17,
    rating: 4.7,
    description: "Tg World International Limited — international car imports for East Africa. 87K+ Instagram followers.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-al_husnainmotors",
    display_name: "AL-HUSNAIN MOTORS LTD",
    city: "Dar es Salaam",
    phone: "+255 702 400 400",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 21,
    rating: 4.6,
    description: "AL-HUSNAIN MOTORS LTD — premium used vehicles. 47K+ Instagram followers.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-ezy_auto_motors",
    display_name: "Ezy Auto Motors Co Ltd",
    city: "Dar es Salaam",
    phone: "+255 735 990 336",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 7,
    rating: 4.5,
    description: "Ezy Auto Motors Co Ltd — making car buying easy. 26K+ Instagram followers.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-hanami.japan",
    display_name: "Hanami Japan",
    city: "Dar es Salaam",
    phone: "",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 5,
    rating: 4.7,
    description: "Hanami Japan — direct importer of quality Japanese vehicles to East Africa. 32K+ Instagram followers.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-magari_empire1",
    display_name: "Magari Empire",
    city: "Dar es Salaam",
    phone: "+255 719 223 839",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 40,
    rating: 4.5,
    description: "Magari Empire — wide selection of quality used cars. 31K+ Instagram followers.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-breemotors",
    display_name: "Magari ya Uhakika",
    city: "Dar es Salaam",
    phone: "+255 716 077 838",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 32,
    rating: 4.6,
    description: "Bree Motors — magari ya uhakika (reliable vehicles). 27K+ Instagram followers.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-cholloh_magari_tz",
    display_name: "Cholloh Magari TZ",
    city: "Dar es Salaam",
    phone: "+255 716 071 575",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 23,
    rating: 4.4,
    description: "Cholloh Magari TZ — affordable quality cars. 11K+ Instagram followers.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-ndinga_bei_poa",
    display_name: "Ndinga Bei Poa",
    city: "Dar es Salaam",
    phone: "+255 789 046 698",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 19,
    rating: 4.5,
    description: "Ndinga Bei Poa — cars at fair prices. 19K+ Instagram followers.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-lomaautos_",
    display_name: "Loma Auto TZ",
    city: "Dar es Salaam",
    phone: "+255 782 115 311",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 72,
    rating: 4.4,
    description: "Loma Auto TZ — large inventory of quality used vehicles in Tanzania.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-dula_magari",
    display_name: "Dula Magari",
    city: "Dar es Salaam",
    phone: "+255 715 425 158",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 61,
    rating: 4.4,
    description: "Dula Magari — affordable vehicles across Tanzania.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-evanamotors",
    display_name: "Evana Motors",
    city: "Dar es Salaam",
    phone: "+255 738 205 707",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 7,
    rating: 4.5,
    description: "Evana Motors — quality cars at competitive prices. 15K+ Instagram followers.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-rwanko_motors",
    display_name: "Rwanko Motors",
    city: "Dar es Salaam",
    phone: "+255 616 158 269",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 43,
    rating: 4.3,
    description: "Rwanko Motors — trusted local car dealer.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-barari_motorstz",
    display_name: "Barari Motors TZ",
    city: "Dar es Salaam",
    phone: "+255 698 118 249",
    avatar_url: null,
    verified_at: "2026-01-15T00:00:00Z",
    listing_count: 10,
    rating: 4.5,
    description: "Barari Motors Tanzania — foreign used cars and Japanese imports. DM for price and payment plan.",
    address: "Kimanya Avenue, Mwai Kibaki Road, Kinondoni, Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-extreme_biketz_",
    display_name: "Extreme Bikes TZ",
    city: "Dar es Salaam",
    phone: "+255754860060",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 23,
    rating: 4.5,
    description: "New & used motorcycles — sport bikes, scooters, and electric bikes. Kinondoni Studio, Dar es Salaam.",
    address: "Kinondoni, Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-hupa_motors_ltd",
    display_name: "Magari Mwanza",
    city: "Mwanza",
    phone: "+255718699061",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 33,
    rating: 4.5,
    description: "Car importation, sales, new and used cars, and exchange deals. Block 11 Makongoro Road, Mwanza.",
    address: "Block 11 Makongoro Road, Mwanza, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-pikipiki_quality_tanzania",
    display_name: "Tuntu Motors",
    city: "Dar es Salaam",
    phone: "+255658377013",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 45,
    rating: 4.5,
    description: "Award-winning motorcycle dealer since 2011. Buy & sell quality bikes. Call 0658377013 / 0783405607.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-tera_automobiles",
    display_name: "TERA AUTOMOBILES LIMITED",
    city: "Dar es Salaam",
    phone: "+255754771436",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 36,
    rating: 4.5,
    description: "Car importation, sales, exchange deals, and auto loan facility. Email: teraautomobiles2@gmail.com.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-tesha_pikipiki_usedtz",
    display_name: "Tesha Pikipiki Used TZ",
    city: "Dar es Salaam",
    phone: "+255673358192",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 4,
    rating: 4.5,
    description: "Buy and sell used motorcycles. Ubungo Kibo, Dar es Salaam. Call 0673358192 / 0746368192.",
    address: "Ubungo Kibo, Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-gody_motorstz",
    display_name: "Gody Magari Tz",
    city: "Dar es Salaam",
    phone: "+255769381827",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 44,
    rating: 4.5,
    description: "Buy, sell & import all car types. Gody MotorsTZ — Drive With Us. Mlimani City, opposite Total, Dar es Salaam.",
    address: "Mlimani City, Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-mapigo_saba_magari",
    display_name: "Mapigo Saba Magari",
    city: "Dar es Salaam",
    phone: "+255744500111",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 42,
    rating: 4.5,
    description: "Used car sales in Tanzania. Call +255744500111.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-mr_pikipiki",
    display_name: "MR PIKIPIKI Trading",
    city: "Dar es Salaam",
    phone: "+255676238482",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 26,
    rating: 4.5,
    description: "Buy & sell used motorcycles — 6 years experience. Free consultation. Call 0676238482 / 0762696900.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-_svgmotors",
    display_name: "SVG Motors",
    city: "Dar es Salaam",
    phone: "",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 46,
    rating: 4.5,
    description: "Used car dealers in Tanzania.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-jambo_magari",
    display_name: "Jambo Magari",
    city: "Dar es Salaam",
    phone: "+255745335036",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 32,
    rating: 4.5,
    description: "Buy, sell, import & exchange all car types. Call 0745335036.",
    address: "Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-justin_motors_ltd",
    display_name: "Justin Motors Ltd",
    city: "Dar es Salaam",
    phone: "+255762483424",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 41,
    rating: 4.5,
    description: "Online car broker — buy, sell & import. Mwenge Stand Mpya, Munawara House, Dar es Salaam.",
    address: "Mwenge, Dar es Salaam, Tanzania",
    postal_code: "",
  },
  {
    user_id: "dealer-kk_magic_cars_",
    display_name: "KK Magic Cars",
    city: "Dar es Salaam",
    phone: "+255675117195",
    avatar_url: null,
    verified_at: "2026-01-01T00:00:00Z",
    listing_count: 44,
    rating: 4.5,
    description: "Buy & sell new and used cars, exchange, top-up deals, and importation. Kinondoni, Dar es Salaam.",
    address: "Kinondoni, Dar es Salaam, Tanzania",
    postal_code: "",
    instagram: "kk_magic_cars_",
  },
];

// Collect IDs of hardcoded dealers so we don't duplicate
const _hardcodedIds = new Set(mockDealers.map(d => d.user_id));
// Append auto-generated dealers for all other showroom accounts
mockDealers.push(..._generateMissingDealers(_hardcodedIds));
for (let i = mockDealers.length - 1; i >= 0; i -= 1) {
  const username = mockDealers[i].instagram || mockDealers[i].user_id.replace(/^dealer-/, "");
  const isLaunchDealer = mockDealers[i].user_id === "dealer-nicolette-boats" || LAUNCH_SHOWROOM_USERS.has(username);
  if (
    !isLaunchDealer ||
    BLOCKED_SHOWROOM_USERS.has(username) ||
    (!_hasUsableDealerPhone(mockDealers[i].phone) && mockDealers[i].user_id !== "dealer-ibaraki")
  ) {
    mockDealers.splice(i, 1);
  }
}

/**
 * Returns car listings for a specific Instagram dealer by username.
 * Filters non-car posts and deduplicates by caption prefix.
 */
export function getShowroomListings(username: string): Listing[] {
  if (!_isLaunchShowroom(username)) return [];
  const key = Object.keys(_showroomMods).find(k => k.includes(`/${username}.json`));
  if (!key) return [];
  const dealer = (_showroomMods[key] as any).default;
  if (!dealer?.posts?.length) return [];
  if (!_hasUsableDealerPhone(dealer.phone) && username !== "ibaraki") return [];

  // Filter to car posts only + deduplicate + sort newest-first (fresh CDN URLs float to top)
  const seenCaptions = new Set<string>();
  const carPosts = (dealer.posts as any[])
    .slice()
    .sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""))
    .filter((post: any) => {
      if (!_isMgayaCarPost(post.caption || "", post.is_video)) return false;
      const dedupeKey = (post.caption || "").slice(0, 120).replace(/\s+/g, " ").toLowerCase();
      if (seenCaptions.has(dedupeKey)) return false;
      seenCaptions.add(dedupeKey);
      return true;
    })
    .slice(0, _dealerListingLimit(username));

  return carPosts.map((post: any, i: number) => {
    const info = _parseMgayaCaption(post.caption || "");
    const imgs = _postImages(username, post, i);
    return {
      id: `ig-${username}-${post.shortcode || i}`,
      title: info.title || `${username} — Vehicle`,
      price: info.price || 0,
      currency: _dealerCurrency(username),
      condition: "Foreign Used" as const,
      year: info.year || 0,
      mileage: info.mileage,
      transmission: info.transmission || "Automatic",
      location: DEALER_CITY[username] || "Dar es Salaam, TZ",
      country: _dealerCountry(username),
      image: imgs[0] || "",
      images: imgs,
      views: post.likes ? post.likes * 3 : 50,
      sellerName: dealer.full_name || username,
      sellerRating: 4.5,
      sellerType: "dealer" as const,
      sellerListingCount: carPosts.length,
      sellerId: username,
      sellerPhone: dealer.phone || "",
      make: info.make ?? undefined,
      model: info.model ?? undefined,
      bodyType: info.bodyType,
      fuelType: info.fuel,
      cc: info.cc,
      color: info.color,
      description: _buildInstagramDescription(info, dealer.full_name || username, DEALER_CITY[username] || "Dar es Salaam, TZ"),
      sourceUrl: post.url || "",
    };
  }).filter(_isLaunchQualityListing);
}
