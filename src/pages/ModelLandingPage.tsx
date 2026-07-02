import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { useSearchListings } from "@/hooks/useSearchListings";
import { Button } from "@/components/ui/button";
import { IconLoader2, IconChevronRight } from "@tabler/icons-react";
import { jsonLdScript, breadcrumbJsonLd, collectionPageJsonLd, faqJsonLd } from "@/lib/structuredData";

// --- Static SEO content per model ---

interface ModelInfo {
  displayMake: string;
  displayModel: string;
  title: string;
  description: string;
  heroText: string;
  guide: { heading: string; body: string };
  typicalPriceRange: string;
  bodyType: string;
  faq: { q: string; a: string }[];
}

const MODEL_DATA: Record<string, ModelInfo> = {
  "toyota|alphard": {
    displayMake: "Toyota",
    displayModel: "Alphard",
    title: "Toyota Alphard for Sale in Kenya, Tanzania & East Africa | Motokah",
    description:
      "Buy a used Toyota Alphard in Kenya, Tanzania, Uganda and East Africa. Browse Alphard listings from dealers and sellers. Find prices, specs and contact sellers directly on Motokah.",
    heroText:
      "The Toyota Alphard is East Africa's most sought-after luxury MPV — find your perfect unit across Kenya, Tanzania, Uganda and beyond.",
    guide: {
      heading: "Toyota Alphard Price in Kenya & East Africa — Buying Guide",
      body:
        "The Toyota Alphard is the premium choice for executives, tour operators and families who need maximum comfort with ample space. In Kenya, a used Toyota Alphard price typically ranges from KES 3.5 million to KES 9 million depending on year, spec and import condition. The 2.4L and 3.5L V6 variants are the most popular. In Tanzania, prices are quoted in TZS — expect TZS 30 million to TZS 70 million for a quality unit. When buying an Alphard in East Africa, verify the chassis number against Japan auction records, check the power sliding doors function correctly, confirm the panoramic sunroof opens and closes, and inspect the second-row captain seats for wear. The 3.5L models are more powerful but consume more fuel — the 2.4L automatic is the practical choice for most buyers. Popular years in the market are 2008–2015 (Generation 2) and 2015–present (Generation 3). Always prefer a dealer who can show you a Japan auction report with a grade of 3.5 or above.",
    },
    typicalPriceRange: "KES 3.5M – 9M",
    bodyType: "MPV",
    faq: [
      {
        q: "What is the price of a Toyota Alphard in Kenya?",
        a: "A used Toyota Alphard in Kenya costs between KES 3.5 million and KES 9 million, depending on the year, mileage, and spec. Newer 2018+ models with low mileage command the higher end of the range.",
      },
      {
        q: "Is the Toyota Alphard worth buying in East Africa?",
        a: "Yes — the Alphard is extremely popular in Kenya, Tanzania and Uganda for its reliability, luxury appointments and strong resale value. It holds value better than most luxury MPVs.",
      },
      {
        q: "What engine does the Toyota Alphard have?",
        a: "The Alphard comes in 2.4L petrol (2AZ-FE), 3.5L V6 petrol (2GR-FE) and more recently 2.5L hybrid variants. The 2.4L automatic is the most common import to East Africa.",
      },
      {
        q: "Where can I find Toyota Alphard dealers in Nairobi?",
        a: "Alphard dealers in Nairobi are concentrated along Ngong Road, Mombasa Road, and Kirinyaga Road. Browse Alphard listings on Motokah to contact sellers directly.",
      },
    ],
  },
  "mazda|demio": {
    displayMake: "Mazda",
    displayModel: "Demio",
    title: "Mazda Demio for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description:
      "Find a Mazda Demio for sale in Kenya, Tanzania and Uganda. Compare Demio prices from sellers — the most affordable and fuel-efficient hatchback in East Africa.",
    heroText:
      "The Mazda Demio is Kenya and Tanzania's favourite compact hatchback — affordable to buy, cheap to run, and easy to maintain.",
    guide: {
      heading: "Mazda Demio Price in Kenya — Buying Guide",
      body:
        "The Mazda Demio is one of the top-selling used hatchbacks in East Africa, valued for its compact size, fuel efficiency and reliability. In Kenya, a used Mazda Demio price ranges from KES 550,000 to KES 1.2 million for 2005–2014 models, rising to KES 1.3 million–2 million for the newer 2014–2019 DE/DJ generation with the SKYACTIV engine. The Demio is particularly popular in Nairobi due to its ability to navigate city traffic and its low running costs — averaging 14–17km/L on the 1.3L petrol engine. In Tanzania, expect TZS 10–22 million for a quality unit. When buying a Demio in Kenya, check the suspension for wear (common on older models used on rough roads), inspect the CVT transmission fluid if it's an automatic, and confirm the aircon functions. The newer DJ Demio (2014+) with SKYACTIV-G is significantly more fuel efficient and is the recommended choice for daily commuters.",
    },
    typicalPriceRange: "KES 550K – 2M",
    bodyType: "Hatchback",
    faq: [
      {
        q: "What is the price of a Mazda Demio in Kenya?",
        a: "A used Mazda Demio in Kenya costs between KES 550,000 and KES 2 million depending on the year and generation. Older DE models (2002–2007) start from around KES 500,000; newer DJ SKYACTIV models command KES 1.2 million and above.",
      },
      {
        q: "Is the Mazda Demio fuel-efficient?",
        a: "Yes — the Mazda Demio is one of the most fuel-efficient cars available in East Africa. The 1.3L petrol returns 14–17km/L in city driving, and the SKYACTIV version can exceed 20km/L on the highway.",
      },
      {
        q: "Which Mazda Demio generation is best for Kenya?",
        a: "The DJ generation (2014–2019) with the SKYACTIV engine is the best choice for Kenya — better fuel economy, modern safety features, and a more refined drive. For budget buyers, the DE generation (2007–2014) offers great value.",
      },
    ],
  },
  "honda|vezel": {
    displayMake: "Honda",
    displayModel: "Vezel",
    title: "Honda Vezel for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description:
      "Buy a Honda Vezel in Kenya, Tanzania and Uganda. Browse Vezel prices and listings from dealers and sellers. The stylish Honda Vezel hybrid crossover is popular with East African buyers.",
    heroText:
      "The Honda Vezel is one of the fastest-growing crossovers in Kenya and Tanzania — combining SUV styling with hatchback efficiency and hybrid power.",
    guide: {
      heading: "Honda Vezel Price in Kenya — Buying Guide",
      body:
        "The Honda Vezel (known as the HR-V in some markets) became hugely popular in East Africa after 2016 due to its stylish design, spacious interior and fuel-efficient 1.5L i-VTEC engine, available in both petrol and hybrid. In Kenya, a used Honda Vezel price ranges from KES 1.2 million to KES 2.8 million. The hybrid variant commands a premium but delivers exceptional fuel economy of 18–22km/L, making it a favourite for Nairobi commuters. When buying a Vezel in Kenya, always check the IMA battery health on hybrid models (a dealer scan is recommended), inspect the CVT transmission, and confirm the Honda Sensing safety suite works if buying a 2018+ model. The Vezel's high ground clearance (182mm) makes it practical on Kenyan roads while remaining comfortable enough for daily use. Most Vezels in the Kenyan market are Japanese imports direct from Toyota Auction Japan, so request an auction sheet to verify condition grades.",
    },
    typicalPriceRange: "KES 1.2M – 2.8M",
    bodyType: "SUV",
    faq: [
      {
        q: "What is the price of a Honda Vezel in Kenya?",
        a: "A used Honda Vezel in Kenya typically costs between KES 1.2 million and KES 2.8 million. The hybrid variant is at the higher end while the standard 1.5L petrol models start from around KES 1.2 million.",
      },
      {
        q: "Is the Honda Vezel hybrid good for Kenya roads?",
        a: "Yes — the Vezel hybrid is excellent for Kenya. Its ground clearance handles city roads well, and the fuel savings from the hybrid system make it one of the most economical crossovers available.",
      },
      {
        q: "Honda Vezel vs Toyota C-HR — which is better for East Africa?",
        a: "The Vezel is generally preferred in East Africa due to better parts availability and lower maintenance costs. Both are excellent urban crossovers, but Honda parts are more widely stocked in Nairobi and Dar es Salaam.",
      },
    ],
  },
  "toyota|harrier": {
    displayMake: "Toyota",
    displayModel: "Harrier",
    title: "Toyota Harrier for Sale in Kenya, Tanzania & East Africa | Motokah",
    description:
      "Find a Toyota Harrier for sale in Kenya, Tanzania and Uganda. Browse Harrier prices and listings from dealers and sellers. Luxury SUV comfort at Japanese-used-car value.",
    heroText:
      "The Toyota Harrier is East Africa's premium crossover of choice — combining Land Cruiser reliability with executive-class comfort at an accessible price.",
    guide: {
      heading: "Toyota Harrier Price in East Africa — Buying Guide",
      body:
        "The Toyota Harrier is one of the most desirable used SUVs in East Africa, offering Lexus RX-level luxury at a fraction of the cost. In Kenya, a used Toyota Harrier price ranges from KES 1.8 million to KES 5 million depending on year and trim. The most popular version in the market is the 2.4L 2AZ-FE automatic, which offers a blend of performance and reliability that is very well suited to East African conditions. The newer 2013+ ZSU60 generation with 2.0L and hybrid options is increasingly available. When buying a Harrier in Kenya or Tanzania, check the continuously variable transmission (eCVT on hybrids, conventional CVT on standard), inspect the air suspension if equipped, and ensure the moonroof functions correctly. The Harrier consistently holds its value in East Africa and has excellent parts availability in Nairobi, Dar es Salaam and Kampala.",
    },
    typicalPriceRange: "KES 1.8M – 5M",
    bodyType: "SUV",
    faq: [
      {
        q: "What is the Toyota Harrier price in Kenya?",
        a: "A Toyota Harrier in Kenya costs between KES 1.8 million and KES 5 million. Older ACU35 models (2003–2013) start from KES 1.8 million while newer ZSU60 models (2013–2020) range from KES 2.5 million upward.",
      },
      {
        q: "Is the Toyota Harrier reliable in East Africa?",
        a: "Extremely. The Harrier shares its platform and engine with the Camry and Lexus RX, giving it excellent parts availability and a proven reliability record across Kenya, Tanzania and Uganda.",
      },
      {
        q: "Toyota Harrier vs Nissan X-Trail — which should I buy?",
        a: "The Harrier wins on comfort and prestige; the X-Trail wins on off-road capability. For city use in Nairobi or Dar es Salaam, the Harrier is generally preferred.",
      },
    ],
  },
  "toyota|probox": {
    displayMake: "Toyota",
    displayModel: "Probox",
    title: "Toyota Probox for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description:
      "Buy a Toyota Probox in Kenya, Tanzania and Uganda. Compare Probox prices from sellers — Kenya's popular salesman car, courier vehicle and family workhorse.",
    heroText:
      "The Toyota Probox is Kenya's most popular budget car — impossible to break, cheap to run, and found in every corner of East Africa.",
    guide: {
      heading: "Toyota Probox Price in Kenya — Buying Guide",
      body:
        "The Toyota Probox (also known as Probox Wagon) is one of the most popular cars in Kenya and Tanzania, beloved by salesman, families and small businesses for its exceptional reliability, large boot space and low running costs. In Kenya, a used Toyota Probox price starts from KES 350,000 for older 2002–2005 models and reaches KES 950,000 for clean 2010–2014 units. The 1.3L 2NZ-FE and 1.5L 1NZ-FE petrol engines are both bulletproof and have strong parts availability throughout Kenya and Tanzania. The Probox averages 15–18km/L which makes it one of the cheapest cars to run in East Africa. When buying, check the rear cargo area floor for rust (a common issue on older models), inspect the suspension bushes, and confirm the insurance papers match the chassis number — Proboxes are frequently replaced-bodies repaired after accidents. A clean 2010+ Probox with documented service history is an exceptional buy.",
    },
    typicalPriceRange: "KES 350K – 950K",
    bodyType: "Wagon",
    faq: [
      {
        q: "What is the price of a Toyota Probox in Kenya?",
        a: "Toyota Probox prices in Kenya range from KES 350,000 for older 2002–2005 models to KES 900,000+ for clean 2012–2014 units. The 2007–2010 sweetspot costs around KES 550,000–700,000.",
      },
      {
        q: "Is the Toyota Probox fuel-efficient?",
        a: "Yes — the Probox averages 15–18km/L, making it one of the most fuel-efficient cars available in East Africa. The 1.3L NZ-series engine is particularly economical.",
      },
      {
        q: "What is the difference between Toyota Probox and Succeed?",
        a: "The Succeed is the slightly longer, higher-trim sibling of the Probox, offering a larger boot and slightly more comfort features. Both share the same engines and mechanics.",
      },
    ],
  },
  "subaru|forester": {
    displayMake: "Subaru",
    displayModel: "Forester",
    title: "Subaru Forester for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description:
      "Buy a Subaru Forester in Kenya, Tanzania and Uganda. Browse Forester prices from dealers and sellers — the AWD workhorse built for East African roads.",
    heroText:
      "The Subaru Forester is Kenya's favourite all-wheel-drive family car — powerful, spacious, and built for East Africa's highlands and rough terrain.",
    guide: {
      heading: "Subaru Forester Price in Kenya — Buying Guide",
      body:
        "The Subaru Forester is uniquely popular in Kenya, where its Symmetrical AWD system and raised ground clearance make it ideal for highland roads, red-soil tracks and the occasional off-road adventure. In Kenya, a used Subaru Forester price ranges from KES 750,000 for 2003–2008 SG models to KES 2.5 million for clean 2013–2018 SJ models. The 2.0L and 2.5L EJ-series petrol engines are the most common, with the 2.5L XT turbocharged variant a favourite for performance buyers. Important: head gasket issues are common on the 2.0L EJ20 engine in high-mileage units — always budget for a head gasket check before buying. Transmission options include manual 5-speed and 4-speed/5-speed automatics; the older automatic boxes can slip if not maintained. The SJ series (2013+) represents the best value Forester in the current market — improved interior, better CVT, and stronger resale value.",
    },
    typicalPriceRange: "KES 750K – 2.5M",
    bodyType: "SUV",
    faq: [
      {
        q: "What is the Subaru Forester price in Kenya?",
        a: "Subaru Forester prices in Kenya range from KES 750,000 for older SG series (2002–2008) to KES 2.5 million for clean SJ series (2013–2018) models. The SH series (2008–2013) is the most common in the mid-range, KES 1–1.8 million.",
      },
      {
        q: "Does the Subaru Forester have AWD?",
        a: "Yes — all Subaru Foresters come with Symmetrical All-Wheel Drive (AWD) as standard. This makes it ideal for Kenya's highlands and unpaved roads.",
      },
      {
        q: "Are Subaru parts expensive in Kenya?",
        a: "Subaru parts are widely available in Nairobi's Industrial Area and along Kirinyaga Road. Prices are moderate — slightly above Toyota but significantly below European brands.",
      },
    ],
  },
  "toyota|fielder": {
    displayMake: "Toyota",
    displayModel: "Fielder",
    title: "Toyota Fielder for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description:
      "Buy a Toyota Fielder in Kenya, Tanzania and Uganda. Browse Fielder prices from sellers — the popular estate car in East Africa.",
    heroText:
      "The Toyota Fielder is East Africa's best-selling estate car — spacious, reliable, and available at every budget from KES 700K to over KES 2 million.",
    guide: {
      heading: "Toyota Fielder Price in Kenya — Buying Guide",
      body:
        "The Toyota Fielder (officially Toyota Corolla Fielder) is one of the top-selling cars in Kenya and Tanzania, consistently ranked as a favourite by families, small business owners and private buyers. Its combination of saloon car fuel economy, estate car boot space, and Toyota's legendary reliability makes it ideal for East African conditions. In Kenya, a used Toyota Fielder price ranges from KES 700,000 for early 2000s models to KES 2 million for clean 2016–2020 units. The most popular engine is the 1.5L 1NZ-FE petrol, though the 1.8L models offer more power for less urban driving. The Fielder X and G trims are most commonly found in the Kenyan market. When buying, check the gearbox (both automatic CVT and manual are available — the early CVTs can slip), inspect for accident damage at the rear (common in rear-end collisions), and ensure the engine management light is off. A 2010–2015 Fielder in good condition is among the best used car purchases available in Kenya.",
    },
    typicalPriceRange: "KES 700K – 2M",
    bodyType: "Wagon",
    faq: [
      {
        q: "What is the Toyota Fielder price in Kenya?",
        a: "Toyota Fielder prices in Kenya range from KES 700,000 for early 2000s models to KES 2 million for clean 2015–2020 units. The most popular buying range is KES 900,000–1.4 million for 2010–2014 models.",
      },
      {
        q: "Is the Toyota Fielder good for Kenya roads?",
        a: "Yes — the Fielder's ground clearance is adequate for most Kenyan roads, and its suspension is well-tuned for the mix of tarmac and gravel roads found upcountry.",
      },
      {
        q: "Toyota Fielder vs Toyota Probox — which is better?",
        a: "The Fielder offers better comfort, a nicer interior and is better suited to family use. The Probox has a larger boot and is cheaper to buy and maintain. For family use, choose the Fielder; for business/cargo use, choose the Probox.",
      },
    ],
  },
  "toyota|land-cruiser": {
    displayMake: "Toyota",
    displayModel: "Land Cruiser",
    title: "Toyota Land Cruiser for Sale in Kenya, Tanzania & East Africa | Motokah",
    description:
      "Find a Toyota Land Cruiser for sale in Kenya, Tanzania, Uganda and East Africa. Browse Land Cruiser prices and listings — the most capable 4x4 in Africa.",
    heroText:
      "The Toyota Land Cruiser is Africa's ultimate 4x4 — trusted by safari operators, NGOs, and families across East Africa for generations.",
    guide: {
      heading: "Toyota Land Cruiser Price in East Africa — Buying Guide",
      body:
        "The Toyota Land Cruiser is the most trusted off-road vehicle in East Africa, with a reputation built over decades of safari use, NGO deployments and government fleets. Popular variants in the market include the 70 Series (Land Cruiser 70/78/79 double cab pickup and troop carrier), the 100 Series (LC100, also known as V8), the 200 Series (LC200, also known as V8), and the Prado 120 and 150 Series. In Kenya, Land Cruiser prices vary enormously by spec — a used LC70 double cab starts from KES 3 million; a used LC200 V8 runs KES 8–25 million. In Tanzania, the LC is priced in TZS with equivalent value ranges. When buying a Land Cruiser, the most critical checks are: timing chain condition (especially on the 1FZ-FE and 2UZ-FE engines), differential condition, transfer case function, and rust on the underbody. Land Cruiser parts are available everywhere in East Africa, and there are specialist mechanics in every major city.",
    },
    typicalPriceRange: "KES 3M – 25M+",
    bodyType: "SUV",
    faq: [
      {
        q: "What is the Toyota Land Cruiser price in Kenya?",
        a: "Toyota Land Cruiser prices in Kenya range from KES 3 million for older 70 Series models to KES 25 million for a recent Land Cruiser 200 series V8 in premium condition.",
      },
      {
        q: "Which Land Cruiser is best for off-road use in East Africa?",
        a: "The 70 Series (LC79 double cab) is the most capable off-road Land Cruiser for serious bush use. For a mix of on-road comfort and off-road capability, the Prado 150 or Land Cruiser 200 are excellent choices.",
      },
    ],
  },
  "toyota|hilux": {
    displayMake: "Toyota",
    displayModel: "Hilux",
    title: "Toyota Hilux for Sale in Kenya, Tanzania & East Africa | Motokah",
    description:
      "Buy a Toyota Hilux in Kenya, Tanzania, Uganda and East Africa. Browse Hilux prices from sellers — one of Africa's most reliable pickup trucks.",
    heroText:
      "The Toyota Hilux is Africa's most popular and trusted pickup truck — built for every road and every job across East Africa.",
    guide: {
      heading: "Toyota Hilux Price in East Africa — Buying Guide",
      body:
        "The Toyota Hilux is the definitive workhorse pickup truck of East Africa, used by farmers, contractors, safari companies, NGOs and private buyers alike. Popular configurations include single cab, extra cab, and double cab in both 4x2 and 4x4 options. In Kenya, a used Hilux price ranges from KES 1.2 million for older single cabs to KES 6 million for late-model 4x4 double cabs in premium condition. The 2.5L D-4D diesel (2KD-FTV) and 3.0L D-4D diesel (1KD-FTV) are the most common engines and are well-supported throughout East Africa. The newer 2.8L GD6 diesel (in the 2015+ Revo generation) offers more power with better fuel economy. When buying a Hilux, check the diesel injection system carefully (pump and injector replacement is expensive), inspect the leaf springs and shock absorbers, and test the diff lock if it's a 4x4.",
    },
    typicalPriceRange: "KES 1.2M – 6M",
    bodyType: "Pickup",
    faq: [
      {
        q: "What is the Toyota Hilux price in Kenya?",
        a: "Toyota Hilux prices in Kenya range from KES 1.2 million for older models to KES 6 million for late-model 4x4 double cab Revo models. The most popular mid-range buying zone is KES 2–3.5 million for 2010–2015 models.",
      },
      {
        q: "Hilux vs Nissan Navara — which is better for East Africa?",
        a: "The Hilux wins on reliability and parts availability across East Africa. The Navara offers better on-road refinement but has higher maintenance costs in the region.",
      },
    ],
  },
  "toyota|vitz": {
    displayMake: "Toyota",
    displayModel: "Vitz",
    title: "Toyota Vitz for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description:
      "Find a Toyota Vitz for sale in Kenya, Tanzania and Uganda. Compare Vitz prices from sellers — a popular budget hatchback in East Africa.",
    heroText:
      "The Toyota Vitz is East Africa's most popular budget hatchback — ultra-reliable, fuel-efficient, and available from as little as KES 400,000.",
    guide: {
      heading: "Toyota Vitz Price in Kenya — Buying Guide",
      body:
        "The Toyota Vitz (sold as the Yaris in some markets) is one of the top-selling used cars in Kenya and Tanzania, offering Toyota reliability at the most accessible price point in the market. In Kenya, a used Toyota Vitz price ranges from KES 400,000 for 2002–2005 models to KES 1.1 million for clean 2013–2017 units. The 1.0L and 1.3L SZ and NZ-series petrol engines are both extremely durable with excellent parts availability. The Vitz averages 16–20km/L making it one of the most fuel-efficient cars in East Africa. Popular in Nairobi, Mombasa, and Dar es Salaam for urban commuting. When buying a Vitz, check for rust on the lower door panels (common on older units), inspect the CV joints (knocking on turns indicates wear), and confirm the aircon works if specified. The 2011–2014 XP130 Vitz is a particularly good buy — improved safety, modern interior, and SKYACTIV-level efficiency from the 1NR-FE engine.",
    },
    typicalPriceRange: "KES 400K – 1.1M",
    bodyType: "Hatchback",
    faq: [
      {
        q: "What is the Toyota Vitz price in Kenya?",
        a: "Toyota Vitz prices in Kenya range from KES 400,000 for 2002–2005 models to KES 1.1 million for clean 2013–2017 units. The most popular range is KES 550,000–800,000 for 2008–2012 models.",
      },
      {
        q: "Is the Toyota Vitz good for Kenyan roads?",
        a: "The Vitz is well-suited for urban and peri-urban roads but its low ground clearance (145mm) makes it less ideal for rough rural roads. It excels in city driving environments.",
      },
    ],
  },
};

function slugToTitle(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

const RELATED_MODELS: Record<string, { make: string; model: string }[]> = {
  "toyota|alphard": [
    { make: "toyota", model: "vellfire" },
    { make: "toyota", model: "noah" },
    { make: "toyota", model: "estima" },
    { make: "honda", model: "odyssey" },
  ],
  "mazda|demio": [
    { make: "toyota", model: "vitz" },
    { make: "honda", model: "fit" },
    { make: "nissan", model: "note" },
    { make: "suzuki", model: "swift" },
  ],
  "honda|vezel": [
    { make: "toyota", model: "harrier" },
    { make: "nissan", model: "x-trail" },
    { make: "mazda", model: "cx-3" },
    { make: "honda", model: "crv" },
  ],
  "toyota|harrier": [
    { make: "honda", model: "vezel" },
    { make: "nissan", model: "x-trail" },
    { make: "subaru", model: "forester" },
    { make: "toyota", model: "land-cruiser" },
  ],
  "toyota|probox": [
    { make: "toyota", model: "fielder" },
    { make: "toyota", model: "succeed" },
    { make: "nissan", model: "ad-wagon" },
    { make: "toyota", model: "vitz" },
  ],
  "subaru|forester": [
    { make: "toyota", model: "harrier" },
    { make: "nissan", model: "x-trail" },
    { make: "subaru", model: "outback" },
    { make: "honda", model: "crv" },
  ],
  "toyota|fielder": [
    { make: "toyota", model: "probox" },
    { make: "toyota", model: "succeed" },
    { make: "mazda", model: "demio" },
    { make: "subaru", model: "impreza" },
  ],
};

const TOP_CITIES = [
  { name: "Nairobi", slug: "nairobi" },
  { name: "Dar es Salaam", slug: "dar-es-salaam" },
  { name: "Kampala", slug: "kampala" },
  { name: "Mombasa", slug: "mombasa" },
  { name: "Arusha", slug: "arusha" },
  { name: "Kigali", slug: "kigali" },
];

export default function ModelLandingPage() {
  const { make = "", model = "" } = useParams<{ make: string; model: string }>();

  const makeTitle = slugToTitle(make);
  const modelTitle = slugToTitle(model);
  const key = `${make.toLowerCase()}|${model.toLowerCase()}`;

  const info = MODEL_DATA[key];
  const pageTitle = info?.title ?? `${makeTitle} ${modelTitle} for Sale in East Africa | Motokah`;
  const pageDesc =
    info?.description ??
    `Browse used ${makeTitle} ${modelTitle} cars for sale in Kenya, Tanzania, Uganda and East Africa. Compare prices and contact sellers on Motokah.`;
  const heroText =
    info?.heroText ??
    `Find your perfect ${makeTitle} ${modelTitle} across East Africa. Compare prices and contact sellers directly.`;

  const { listings, loading } = useSearchListings(
    { make: makeTitle, model: modelTitle },
    "newest"
  );

  const related = RELATED_MODELS[key] ?? [];

  const canonicalUrl = `https://www.motokah.com/cars/${make}/${model}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.motokah.com/pwa-512x512.png" />
        {jsonLdScript(breadcrumbJsonLd([
          { name: "Home", url: "https://www.motokah.com/" },
          { name: "Cars for Sale", url: "https://www.motokah.com/search" },
          { name: makeTitle, url: `https://www.motokah.com/search?make=${encodeURIComponent(makeTitle)}` },
          { name: `${makeTitle} ${modelTitle}`, url: canonicalUrl },
        ]))}
        {jsonLdScript(collectionPageJsonLd({
          name: `${makeTitle} ${modelTitle} for Sale in East Africa`,
          description: pageDesc,
          url: canonicalUrl,
          itemCount: listings.length,
        }))}
        {info?.faq && jsonLdScript(faqJsonLd(info.faq))}
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <div className="bg-primary/5 border-b border-border">
          <div className="container mx-auto py-12 px-4">
            <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4 flex-wrap">
              <Link to="/" className="hover:text-primary">Home</Link>
              <IconChevronRight size={14} />
              <Link to="/search" className="hover:text-primary">Search</Link>
              <IconChevronRight size={14} />
              <Link
                to={`/search?make=${encodeURIComponent(makeTitle)}`}
                className="hover:text-primary"
              >
                {makeTitle}
              </Link>
              <IconChevronRight size={14} />
              <span className="text-foreground">{modelTitle}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              {makeTitle} {modelTitle} for Sale in East Africa
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">{heroText}</p>

            {info?.typicalPriceRange && (
              <p className="mt-2 text-sm font-semibold text-primary">
                Typical price range: {info.typicalPriceRange}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to={`/search?make=${encodeURIComponent(makeTitle)}&model=${encodeURIComponent(modelTitle)}`}>
                  View All {makeTitle} {modelTitle}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/sell">Sell Your Car</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="container mx-auto py-10 px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <IconLoader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : listings.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {listings.length} {makeTitle} {modelTitle} listing{listings.length !== 1 ? "s" : ""} available
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {listings.map((listing) => (
                  <VehicleCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No {makeTitle} {modelTitle} listings found right now.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <Link
                  to={`/search?make=${encodeURIComponent(makeTitle)}`}
                  className="text-primary hover:underline"
                >
                  Browse all {makeTitle} cars
                </Link>{" "}
                or{" "}
                <Link to="/sell" className="text-primary hover:underline">
                  list your {makeTitle} {modelTitle}
                </Link>.
              </p>
            </div>
          )}
        </div>

        {/* Buying Guide */}
        {info?.guide && (
          <div className="border-t border-border bg-secondary/20">
            <div className="container mx-auto py-12 px-4 max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">{info.guide.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{info.guide.body}</p>
            </div>
          </div>
        )}

        {/* By City links */}
        <div className="border-t border-border">
          <div className="container mx-auto py-10 px-4">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {makeTitle} {modelTitle} by City
            </h2>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  to={`/search?make=${encodeURIComponent(makeTitle)}&model=${encodeURIComponent(modelTitle)}&city=${encodeURIComponent(city.name)}`}
                  className="px-4 py-2 bg-card border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  {makeTitle} {modelTitle} in {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        {info?.faq && (
          <div className="border-t border-border bg-secondary/20">
            <div className="container mx-auto py-10 px-4 max-w-3xl">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Frequently Asked Questions — {makeTitle} {modelTitle}
              </h2>
              <div className="space-y-5">
                {info.faq.map((item, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-foreground mb-1">{item.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Models */}
        {related.length > 0 && (
          <div className="border-t border-border">
            <div className="container mx-auto py-10 px-4">
              <h2 className="text-xl font-bold text-foreground mb-4">Similar Models</h2>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={`${r.make}|${r.model}`}
                    to={`/cars/${r.make}/${r.model}`}
                    className="px-4 py-2 bg-card border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                  >
                    {slugToTitle(r.make)} {slugToTitle(r.model)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
