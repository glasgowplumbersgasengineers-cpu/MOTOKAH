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
    title: "Toyota Alphard for Sale in Tanzania, Kenya & East Africa | Motokah",
    description:
      "Buy a used Toyota Alphard in Tanzania, Kenya, Uganda and East Africa. Browse Alphard listings from dealers and sellers. Find prices, specs and contact sellers directly on Motokah.",
    heroText:
      "The Toyota Alphard is East Africa's most sought-after luxury MPV — find your perfect unit across Tanzania, Kenya, Uganda and beyond.",
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
    title: "Toyota Harrier for Sale in Tanzania, Kenya & East Africa | Motokah",
    description:
      "Find a Toyota Harrier for sale in Tanzania, Kenya and Uganda. Browse Harrier prices and listings from dealers and sellers. Luxury SUV comfort at Japanese-used-car value.",
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
    title: "Toyota Land Cruiser for Sale in Tanzania, Kenya & East Africa | Motokah",
    description:
      "Find a Toyota Land Cruiser for sale in Tanzania, Kenya, Uganda and East Africa. Browse Land Cruiser prices and listings — the most capable 4x4 in Africa.",
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
    title: "Toyota Hilux for Sale in Tanzania, Kenya & East Africa | Motokah",
    description:
      "Buy a Toyota Hilux in Tanzania, Kenya, Uganda and East Africa. Browse Hilux prices from sellers — one of Africa's most reliable pickup trucks.",
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
  "toyota|prado": {
    displayMake: "Toyota",
    displayModel: "Prado",
    title: "Toyota Land Cruiser Prado for Sale in Kenya, Tanzania & East Africa | Motokah",
    description: "Buy a used Toyota Prado in Kenya, Tanzania, Uganda and East Africa. Browse Prado prices from trusted dealers. One of East Africa's most popular 4x4 SUVs.",
    heroText: "The Toyota Land Cruiser Prado is East Africa's most sought-after premium 4x4 — capable on any terrain, refined on tarmac, and holds its value better than almost any other vehicle in the region.",
    guide: {
      heading: "Toyota Prado Price in Kenya & East Africa — Buying Guide",
      body: "The Toyota Land Cruiser Prado (J120 and J150 series) is one of the most popular vehicles across Kenya, Tanzania, Uganda and Rwanda among executives, NGOs, safari operators and families. In Kenya, a used Prado price ranges from KES 3 million for 2005–2008 J120 models to KES 12 million for 2018+ J150 VX Grade units. In Tanzania, expect TZS 35–110 million. The 3.0L diesel (1KD-FTV) in the J120 is the most common import to East Africa — durable and widely serviced. The J150 (2009+) comes in 2.7L petrol and 2.8L diesel variants; the diesel TX and VX grades are the most desirable. When buying a Prado, always inspect the timing chain (the 1KD has a known tensioner weakness on high-mileage engines), check the front differential and transfer case, and verify the rear air suspension (if fitted) operates correctly. The VX grade's leather and rear entertainment make it the premium choice; the TX-L is the value pick.",
    },
    typicalPriceRange: "KES 3M – 12M",
    bodyType: "4x4 SUV",
    faq: [
      { q: "What is the Toyota Prado price in Kenya?", a: "Toyota Prado prices in Kenya range from KES 3 million for 2005–2008 models to over KES 12 million for 2018+ low-mileage VX units. The sweet spot for quality at fair price is KES 4.5–7 million for a 2012–2016 J150." },
      { q: "Which Prado year is best to buy in East Africa?", a: "The 2009–2013 J150 3.0L diesel (1KD) is the most popular buy — good balance of modern features, reliability, and affordable parts. The 2017+ 2.8L GD6 diesel is the best modern option if budget allows." },
      { q: "Is the Toyota Prado good for off-road in East Africa?", a: "Yes — the Prado is fully capable off-road with its Kinetic Dynamic Suspension System (KDSS on VX grade), A-TRAC traction control, and locking rear differential. It handles East African terrain with ease." },
    ],
  },
  "toyota|axio": {
    displayMake: "Toyota",
    displayModel: "Axio",
    title: "Toyota Axio for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description: "Find a Toyota Axio for sale in Kenya, Tanzania and Uganda. Compare Axio prices from verified sellers. A practical and affordable saloon popular across East Africa.",
    heroText: "The Toyota Axio is Kenya and Tanzania's top-selling compact saloon — Toyota reliability, fuel efficiency, and low running costs in one dependable package.",
    guide: {
      heading: "Toyota Axio Price in Kenya — Buying Guide",
      body: "The Toyota Corolla Axio (successor to the Corolla sedan in Japan) is one of the most popular cars in Kenya and Tanzania. In Kenya, a used Axio price ranges from KES 650,000 for 2008–2010 models to KES 1.5 million for clean 2016–2019 units. The 1.3L and 1.5L NZE and NRE-series petrol engines are extremely reliable. The Axio Hybrid (using the 1NZ-FXE hybrid system) is gaining popularity for its 20–26km/L fuel economy, especially in Nairobi traffic. The car is well-suited for both urban commuting and highway driving and is a popular taxi/cab platform in Tanzania. When buying an Axio, check for rust on the undercarriage and rear wheel arches, test all electric windows, and on hybrids verify the HV battery health using an OBD2 scanner.",
    },
    typicalPriceRange: "KES 650K – 1.5M",
    bodyType: "Saloon",
    faq: [
      { q: "What is the Toyota Axio price in Kenya?", a: "Toyota Axio prices in Kenya range from KES 650,000 for 2008–2010 models to KES 1.5 million for 2016+ units. The hybrid variant commands a KES 100,000–200,000 premium over petrol equivalents." },
      { q: "Is the Toyota Axio good for Kenyan roads?", a: "Yes — the Axio has 145mm ground clearance and handles paved and graded roads well. It is not recommended for heavily rutted rural roads but excels in urban and semi-urban environments." },
      { q: "What is the difference between Toyota Axio and Toyota Fielder?", a: "The Axio is a saloon (boot) while the Fielder is a station wagon (estate) with a hatchback tailgate and slightly more luggage space. Both share the same platform and engine options." },
    ],
  },
  "toyota|noah": {
    displayMake: "Toyota",
    displayModel: "Noah",
    title: "Toyota Noah for Sale in Kenya, Tanzania & East Africa | Motokah",
    description: "Buy a used Toyota Noah in Kenya, Tanzania, Uganda and East Africa. Browse Noah prices from trusted dealers. A popular 7-seater family MPV across the region.",
    heroText: "The Toyota Noah is East Africa's go-to 7-seater family MPV — spacious, reliable, and available from KES 1 million across Kenya and Tanzania.",
    guide: {
      heading: "Toyota Noah Price in Kenya & East Africa — Buying Guide",
      body: "The Toyota Noah (and its near-twin, the Voxy) is the dominant 7-seater minivan in Kenya, Tanzania and Uganda. In Kenya, a used Noah price ranges from KES 950,000 for 2003–2006 (R60) models to KES 2.8 million for clean 2014–2019 (R80) units. The 2.0L 1AZ-FSE petrol is the most common engine; the 1.8L 2ZR-FBE on newer models is more fuel-efficient. The Noah is popular with large families, school transport, and informal taxi operations. When buying a Noah, check the power sliding doors operate smoothly (track and motor replacement is expensive), inspect the engine mounts (1AZ can develop knock if mounts are worn), and verify the A/C cools all three rows effectively. The R80 generation (2014+) has noticeably improved build quality over the R60/R70 predecessors.",
    },
    typicalPriceRange: "KES 950K – 2.8M",
    bodyType: "MPV",
    faq: [
      { q: "What is the Toyota Noah price in Kenya?", a: "Toyota Noah prices in Kenya range from KES 950,000 for older R60 models to KES 2.8 million for late-model R80 units. The most practical buying range is KES 1.2–1.8 million for 2010–2015 models." },
      { q: "Toyota Noah vs Nissan Serena — which is better?", a: "The Noah has stronger resale value and wider parts availability across East Africa. The Serena offers a more comfortable ride on smooth roads. For general East African use, the Noah is the safer choice." },
    ],
  },
  "toyota|succeed": {
    displayMake: "Toyota",
    displayModel: "Succeed",
    title: "Toyota Succeed for Sale in Tanzania & East Africa | Motokah",
    description: "Find a Toyota Succeed for sale in Tanzania, Kenya and Uganda. Browse Succeed prices from local dealers. A practical estate popular for business use across East Africa.",
    heroText: "The Toyota Succeed is Tanzania's favourite compact cargo estate — Toyota reliability, practical load space, and proven low running costs.",
    guide: {
      heading: "Toyota Succeed Price in Tanzania — Buying Guide",
      body: "The Toyota Probox Succeed is an estate/wagon variant of the Probox platform, widely used in Tanzania and Kenya by small businesses, medical supply chains, and private buyers who need more cargo space than a saloon. In Tanzania, prices range from TZS 9 million for 2004–2008 models to TZS 22 million for clean 2015–2019 units. In Kenya, expect KES 550,000–1.1 million. The 1.5L NZ-series petrol engine is one of the most reliable and low-maintenance engines ever made. Average fuel economy of 16–20km/L makes it extremely economical for business operations. When buying, check the rear door seal and tailgate latch, inspect the suspension (rear leaf springs on some variants can sag with heavy load use), and verify the odometer hasn't been rolled back — fleet units often have high real mileage.",
    },
    typicalPriceRange: "TZS 9M – 22M",
    bodyType: "Estate",
    faq: [
      { q: "What is the Toyota Succeed price in Tanzania?", a: "Toyota Succeed prices in Tanzania range from TZS 9 million for older models to TZS 22 million for 2015+ units in good condition. In Kenya, equivalent models sell for KES 550,000–1.1 million." },
      { q: "What is the difference between Toyota Probox and Succeed?", a: "The Succeed is the estate variant of the Probox with a larger rear cargo area and separate boot opening. The Probox is a panel van/load-carrier style. Both share engines and mechanical components." },
    ],
  },
  "subaru|forester": {
    displayMake: "Subaru",
    displayModel: "Forester",
    title: "Subaru Forester for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description: "Buy a Subaru Forester in Kenya, Tanzania and Uganda. Browse Forester prices from local sellers. One of Kenya's most trusted AWD SUVs for highlands and rough roads.",
    heroText: "The Subaru Forester is Kenya's most beloved all-wheel-drive SUV — confident in the highlands, capable on dirt roads, and genuinely fun to drive.",
    guide: {
      heading: "Subaru Forester Price in Kenya — Buying Guide",
      body: "The Subaru Forester is one of the most popular vehicles in Kenya, particularly in highland areas like Nakuru, Eldoret, Nyeri, and the Aberdare region where Subaru's symmetrical AWD system provides genuine traction advantage on slippery roads. In Kenya, a used Forester price ranges from KES 700,000 for 2004–2008 SG-generation models to KES 3.2 million for 2016+ SJ models in premium condition. The 2.0L and 2.5L Boxer petrol engines are common, with the 2.5L XT turbo being the highest-performance variant. The EJ25 engine is a solid performer but has a known head gasket weakness on pre-2011 high-mileage examples — always get a coolant test before buying. The FB20 (2012+) and FB25 engines largely resolved this issue. AWD servicing (front and rear differentials plus centre differential) should be done at every 80,000km to avoid expensive driveline repairs.",
    },
    typicalPriceRange: "KES 700K – 3.2M",
    bodyType: "SUV",
    faq: [
      { q: "What is the Subaru Forester price in Kenya?", a: "Subaru Forester prices in Kenya range from KES 700,000 for older SG models to KES 3.2 million for 2016+ SJ units. The most popular buying range is KES 1–2 million for 2010–2014 SH models." },
      { q: "Does the Subaru Forester have AWD in East Africa?", a: "Yes — all Foresters sold in East Africa have Subaru's Symmetrical AWD system. This makes them genuinely capable in the Kenyan highlands, on muddy tracks, and in wet conditions." },
      { q: "Is the Subaru Forester reliable in Kenya?", a: "The Forester is extremely well-regarded for reliability in Kenya. The main concern is the head gasket on pre-2011 EJ25 engines — always do a coolant test and compression check before purchasing an older model." },
    ],
  },
  "subaru|impreza": {
    displayMake: "Subaru",
    displayModel: "Impreza",
    title: "Subaru Impreza for Sale in Kenya & East Africa | Motokah",
    description: "Find a Subaru Impreza for sale in Kenya, Tanzania and Uganda. Browse Impreza prices from local sellers — a popular AWD saloon and hatchback in East Africa.",
    heroText: "The Subaru Impreza brings all-wheel drive to an affordable price — Kenya's favourite practical AWD saloon for highland roads and confident wet-weather driving.",
    guide: {
      heading: "Subaru Impreza Price in Kenya — Buying Guide",
      body: "The Subaru Impreza is the entry point to Subaru's AWD lineup in East Africa and remains very popular in Kenya, particularly in the Rift Valley and Central highlands. In Kenya, a used Impreza price ranges from KES 500,000 for 2003–2007 models to KES 2 million for clean 2014–2018 units. Both saloon and 5-door hatchback body styles are available. The 1.5L and 2.0L FB-series engines (2011+) offer the best reliability. Like the Forester, pre-2011 EJ-series Imprezas carry a head gasket risk on high mileage. The Impreza Sport Wagon is particularly popular in Kenya for its combination of practicality and AWD traction. Check all four wheel-bearing hubs carefully — AWD stress and Kenya's roads accelerate wear on bearing hubs, which is a common maintenance item on older Imprezas.",
    },
    typicalPriceRange: "KES 500K – 2M",
    bodyType: "Saloon/Hatchback",
    faq: [
      { q: "What is the Subaru Impreza price in Kenya?", a: "Subaru Impreza prices in Kenya range from KES 500,000 for 2003–2007 models to KES 2 million for 2014–2018 units in good condition. The 2010–2014 GJ/GP generation offers the best balance of price and reliability." },
      { q: "Subaru Impreza vs Forester — which should I buy?", a: "The Forester gives you more ground clearance, cargo space, and ride height — better for rough roads. The Impreza is lower, more car-like, and cheaper to run. For city/highlands mix, the Forester wins. For pure urban use, the Impreza is sufficient." },
    ],
  },
  "subaru|outback": {
    displayMake: "Subaru",
    displayModel: "Outback",
    title: "Subaru Outback for Sale in Kenya & East Africa | Motokah",
    description: "Buy a Subaru Outback in Kenya, Tanzania and Uganda. Browse Outback prices from dealers. A capable AWD estate popular among Kenya's professional buyers.",
    heroText: "The Subaru Outback combines estate practicality with genuine AWD capability — Kenya's choice for professionals who need space, comfort, and all-weather confidence.",
    guide: {
      heading: "Subaru Outback Price in Kenya — Buying Guide",
      body: "The Subaru Outback is the premium estate option in Subaru's East Africa lineup. In Kenya, prices range from KES 1.2 million for 2006–2009 BP models to KES 4 million for 2015–2019 BS models in top condition. The 2.5L petrol is the standard option; the 3.6L H6 is rare but powerful. The Outback's 220mm ground clearance (higher than the Forester) makes it surprisingly capable off-tarmac. Like all older EJ-series Subarus, pre-2011 models should be checked for head gasket health. The BS generation (2014+) with the FB25 engine largely eliminated this concern. Popular with doctors, researchers, and NGO workers who combine city use with rural travel.",
    },
    typicalPriceRange: "KES 1.2M – 4M",
    bodyType: "Estate AWD",
    faq: [
      { q: "What is the Subaru Outback price in Kenya?", a: "Subaru Outback prices in Kenya range from KES 1.2 million for 2006–2009 models to KES 4 million for 2015–2019 units in good condition. The 2012–2014 BM/BR generation offers the best value." },
      { q: "Can the Subaru Outback go off-road?", a: "Yes — the Outback has 220mm ground clearance and AWD, making it more capable off-tarmac than most crossovers. It's not a dedicated off-roader but handles graded roads, farm tracks, and rural terrain with confidence." },
    ],
  },
  "nissan|x-trail": {
    displayMake: "Nissan",
    displayModel: "X-Trail",
    title: "Nissan X-Trail for Sale in Kenya, Tanzania & East Africa | Motokah",
    description: "Buy a Nissan X-Trail in Kenya, Tanzania, Uganda and East Africa. Browse X-Trail prices from local sellers. One of East Africa's most popular mid-size 4x4 SUVs.",
    heroText: "The Nissan X-Trail is East Africa's favourite mid-range 4x4 SUV — spacious, capable off-road, and available at competitive prices across Kenya, Tanzania and Uganda.",
    guide: {
      heading: "Nissan X-Trail Price in Kenya & East Africa — Buying Guide",
      body: "The Nissan X-Trail (T30, T31 and T32 generations) is one of the most popular mid-range SUVs in East Africa, beloved for its practical interior, genuine 4x4 capability, and competitive pricing. In Kenya, a used X-Trail price ranges from KES 700,000 for T30 (2001–2007) models to KES 4.5 million for T32 (2014+) low-mileage units. The 2.0L QR20DE and 2.5L QR25DE petrol engines are the most common imports. The 2.2L dCi diesel (T30) is available but servicing is harder to find. The T31 (2007–2013) with the 2.5L petrol and All-Mode 4x4 system is the most popular generation in Kenya and Tanzania. When buying, check the 4x4 transfer switch operates correctly (all modes: 2WD/4WD auto/4WD lock), inspect CVT fluid condition on T32 models, and test the climate control.",
    },
    typicalPriceRange: "KES 700K – 4.5M",
    bodyType: "4x4 SUV",
    faq: [
      { q: "What is the Nissan X-Trail price in Kenya?", a: "Nissan X-Trail prices in Kenya range from KES 700,000 for T30 models to KES 4.5 million for T32 2016+ units. The T31 2.5L is the most popular and priced at KES 1.2–2.5 million." },
      { q: "Nissan X-Trail vs Toyota Rav4 — which is better?", a: "The RAV4 has marginally stronger resale value in Kenya. The X-Trail is more affordable for equivalent year/spec and has a roomier interior. Both are reliable; the choice depends on budget and availability in your area." },
      { q: "Is the Nissan X-Trail good for East African roads?", a: "Yes — the X-Trail with its All-Mode 4x4 system handles graded roads, occasional off-road tracks, and wet highland terrain well. It is not designed for serious rock-crawling but manages typical East African road conditions with confidence." },
    ],
  },
  "nissan|navara": {
    displayMake: "Nissan",
    displayModel: "Navara",
    title: "Nissan Navara for Sale in Tanzania, Kenya & East Africa | Motokah",
    description: "Buy a Nissan Navara in Tanzania, Kenya, Uganda and East Africa. Browse Navara prices from local sellers. A capable double-cab pickup competing with the Toyota Hilux.",
    heroText: "The Nissan Navara is a serious rival to the Toyota Hilux — strong towing capacity, comfortable double cab interior, and proven diesel reliability across East Africa.",
    guide: {
      heading: "Nissan Navara Price in East Africa — Buying Guide",
      body: "The Nissan Navara (D40 and D23 NP300 generations) is the primary alternative to the Toyota Hilux in East Africa's pickup truck market. In Tanzania, a used Navara price ranges from TZS 22 million for D40 models to TZS 65 million for NP300 4x4 units. In Kenya, expect KES 1.5–5 million. The 2.5L YD25DDTi diesel (D40) is the most common engine import — very capable but requires careful injector maintenance. The NP300 2.3L twin-turbo diesel is more modern and powerful. When buying a Navara, inspect the front control arm bushings (known wear point on D40), check the diesel injectors (remanufacturing is expensive), and verify the 4x4 system engages smoothly in all modes. The D40 double cab with a canopy is the most popular configuration for NGOs and contractors in Tanzania.",
    },
    typicalPriceRange: "TZS 22M – 65M",
    bodyType: "Pickup",
    faq: [
      { q: "Nissan Navara vs Toyota Hilux — which is better in East Africa?", a: "The Hilux has better parts availability and resale value across East Africa. The Navara offers more on-road comfort and a more refined interior. For reliability and nationwide support, the Hilux wins; for features and comfort, the Navara competes." },
      { q: "What is the Nissan Navara price in Tanzania?", a: "Nissan Navara prices in Tanzania range from TZS 22 million for older D40 models to TZS 65 million for NP300 4x4 double cab units. In Kenya, equivalent models sell for KES 1.5–5 million." },
    ],
  },
  "nissan|note": {
    displayMake: "Nissan",
    displayModel: "Note",
    title: "Nissan Note for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description: "Find a Nissan Note for sale in Kenya, Tanzania and Uganda. Browse Note prices from local sellers. A practical and affordable compact hatchback in East Africa.",
    heroText: "The Nissan Note is a practical, fuel-efficient compact MPV — affordable to buy, cheap to run, and spacious enough for family use across East Africa.",
    guide: {
      heading: "Nissan Note Price in Kenya — Buying Guide",
      body: "The Nissan Note (E11 and E12 generations) is a popular budget choice in Kenya and Tanzania. In Kenya, prices range from KES 450,000 for E11 (2005–2012) models to KES 1.1 million for E12 (2013+) units. The 1.2L and 1.6L petrol engines are economical and reliable. The E12 Note e-Power hybrid variant, while rarer in East Africa, delivers exceptional fuel efficiency. The Note's tall-body design gives surprising interior space relative to its footprint, making it popular for small families and rideshare operators. When buying, check for rust on the rear hatch and wheel arches, inspect the continuously variable transmission (CVT) fluid, and test the electric windows and central locking.",
    },
    typicalPriceRange: "KES 450K – 1.1M",
    bodyType: "Compact MPV",
    faq: [
      { q: "What is the Nissan Note price in Kenya?", a: "Nissan Note prices in Kenya range from KES 450,000 for E11 models to KES 1.1 million for 2016+ E12 units. The E12 1.2L DIG-S is the most fuel-efficient petrol variant." },
      { q: "Nissan Note vs Toyota Vitz — which is better?", a: "The Vitz is smaller and more car-like. The Note has more interior headroom and cargo space. For a single person or couple, the Vitz is sufficient. For a small family needing space, the Note is better value." },
    ],
  },
  "mitsubishi|pajero": {
    displayMake: "Mitsubishi",
    displayModel: "Pajero",
    title: "Mitsubishi Pajero for Sale in Kenya, Tanzania & East Africa | Motokah",
    description: "Buy a Mitsubishi Pajero in Kenya, Tanzania, Uganda and East Africa. Browse Pajero prices from local sellers. One of East Africa's most capable 4x4 SUVs.",
    heroText: "The Mitsubishi Pajero is a legend in East Africa — proven in the Dakar Rally and proven on every challenging track across Kenya, Tanzania and Uganda.",
    guide: {
      heading: "Mitsubishi Pajero Price in East Africa — Buying Guide",
      body: "The Mitsubishi Pajero (V60, V70 and V80 series) is one of the most respected off-road vehicles in East Africa, popular with safari operators, NGOs, government agencies and serious off-road enthusiasts. In Kenya, prices range from KES 1.5 million for V60 (2000–2006) models to KES 7 million for V80 (2006–2019) long-wheelbase units in top condition. In Tanzania, expect TZS 20–70 million. The 3.2L DI-D diesel (4M41) is the most capable and widely serviced engine in the region — used in the V73/V93 variants. The 3.8L GDI petrol is also available. The Super Select 4WD system (2H/4H/4HLc/4LLc) provides outstanding off-road capability. When buying a Pajero, inspect the rear lower control arms and rear differential (common wear areas on high-mileage 4WD use), and check the air suspension if fitted on V80 Exceed models.",
    },
    typicalPriceRange: "KES 1.5M – 7M",
    bodyType: "4x4 SUV",
    faq: [
      { q: "What is the Mitsubishi Pajero price in Kenya?", a: "Mitsubishi Pajero prices in Kenya range from KES 1.5 million for V60 models to KES 7 million for V80 long-wheelbase units. The V73 3.2L diesel is the most sought-after configuration." },
      { q: "Pajero vs Land Cruiser — which is better?", a: "The Land Cruiser has stronger resale value and wider parts support in East Africa. The Pajero is more affordable for equivalent capability and is lighter off-road. For a serious off-road machine at a lower price point, the Pajero is excellent value." },
      { q: "Is the Mitsubishi Pajero reliable?", a: "Yes — the Pajero's 3.2L diesel (4M41) engine has an excellent reputation for reliability. The Super Select 4WD system is proven over decades. Maintenance costs are higher than Toyota equivalents, but the Pajero is a very capable and durable vehicle." },
    ],
  },
  "mitsubishi|outlander": {
    displayMake: "Mitsubishi",
    displayModel: "Outlander",
    title: "Mitsubishi Outlander for Sale in Kenya & East Africa | Motokah",
    description: "Find a Mitsubishi Outlander for sale in Kenya, Tanzania and Uganda. Browse Outlander prices from local dealers. A spacious 7-seater SUV at competitive prices.",
    heroText: "The Mitsubishi Outlander delivers 7-seat SUV practicality with 4WD capability — a strong value proposition across Kenya and Tanzania.",
    guide: {
      heading: "Mitsubishi Outlander Price in Kenya — Buying Guide",
      body: "The Mitsubishi Outlander (2nd and 3rd generation) is a practical 7-seat SUV with 4WD available. In Kenya, prices range from KES 1.1 million for 2006–2012 models to KES 3.5 million for 2016+ 3rd-gen units. The 2.4L MIVEC petrol and 2.0L diesel engines are the most common imports. The PHEV (plug-in hybrid) variant is increasingly available and offers exceptional fuel economy. When buying, check the rear row seats fold flat properly, inspect the S-AWC system if 4WD is required, and verify the climate control works correctly on all three zones (if a Exceed grade).",
    },
    typicalPriceRange: "KES 1.1M – 3.5M",
    bodyType: "7-seat SUV",
    faq: [
      { q: "What is the Mitsubishi Outlander price in Kenya?", a: "Mitsubishi Outlander prices in Kenya range from KES 1.1 million for 2006–2012 models to KES 3.5 million for 2016+ 3rd-gen low-mileage units." },
    ],
  },
  "mazda|demio": {
    displayMake: "Mazda",
    displayModel: "Demio",
    title: "Mazda Demio for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description: "Buy a Mazda Demio in Kenya, Tanzania and Uganda. Browse Demio prices from verified sellers — a stylish, fuel-efficient supermini popular across East Africa.",
    heroText: "The Mazda Demio is the stylish, fuel-efficient choice in the budget supermini segment — popular with young professionals and city drivers across Kenya and Tanzania.",
    guide: {
      heading: "Mazda Demio Price in Kenya — Buying Guide",
      body: "The Mazda Demio (DY, DE and DJ series) is one of Kenya's most popular small hatchbacks, valued for its sporty styling, efficient engines, and Mazda's KODO design language. In Kenya, prices range from KES 500,000 for DY/DE models to KES 1.5 million for DJ-series (2014+) Skyactiv units. The 1.3L and 1.5L SKYACTIV-G engines deliver 20–24km/L fuel economy in real-world use, making them among the most economical non-hybrid options. The DJ Demio with SKYACTIV technology is the standout — sharp steering, composed ride, and genuinely fun to drive. When buying a Demio, check for rust on door bases and wheel arches (DY/DE are susceptible), inspect the automatic transmission fluid (CVT on newer models), and ensure the climate control fan works on all speed settings.",
    },
    typicalPriceRange: "KES 500K – 1.5M",
    bodyType: "Hatchback",
    faq: [
      { q: "What is the Mazda Demio price in Kenya?", a: "Mazda Demio prices in Kenya range from KES 500,000 for DE models to KES 1.5 million for clean 2016–2018 DJ Skyactiv units. The best value is the 2011–2014 DE5FS 1.5L at KES 650,000–900,000." },
      { q: "Is the Mazda Demio good for Kenyan roads?", a: "The Demio handles urban and paved roads excellently. Its low ground clearance (145mm) makes it less suited to heavily rutted rural roads, but it is well-regarded in Nairobi, Mombasa, Kampala, and Dar es Salaam." },
    ],
  },
  "mazda|cx-5": {
    displayMake: "Mazda",
    displayModel: "CX-5",
    title: "Mazda CX-5 for Sale in Kenya & East Africa | Motokah",
    description: "Find a Mazda CX-5 for sale in Kenya, Tanzania and Uganda. Browse CX-5 prices from local sellers — a premium mid-size SUV with SKYACTIV technology.",
    heroText: "The Mazda CX-5 combines premium SUV styling with SKYACTIV efficiency — one of the best-looking and best-driving mid-size SUVs available in East Africa.",
    guide: {
      heading: "Mazda CX-5 Price in Kenya — Buying Guide",
      body: "The Mazda CX-5 (KE and KF generations) is a popular premium crossover in Kenya and Tanzania, competing against the Toyota Rav4 and Honda CRV. In Kenya, prices range from KES 2 million for 2012–2014 KE models to KES 5 million for 2017+ KF units in top condition. The 2.0L and 2.5L SKYACTIV-G petrol engines are the most common imports. The 2.2L SKYACTIV-D diesel is rarer but delivers excellent highway fuel economy. When buying a CX-5, inspect the i-ACTIV AWD system if fitted, verify the infotainment and connectivity features work correctly, and check the front radar sensor area (blind-spot monitoring system) for damage on newer models.",
    },
    typicalPriceRange: "KES 2M – 5M",
    bodyType: "SUV",
    faq: [
      { q: "What is the Mazda CX-5 price in Kenya?", a: "Mazda CX-5 prices in Kenya range from KES 2 million for 2012–2014 KE models to KES 5 million for 2017–2019 KF units. The 2.5L AWD grade commands the highest price." },
    ],
  },
  "mazda|atenza": {
    displayMake: "Mazda",
    displayModel: "Atenza",
    title: "Mazda Atenza for Sale in Kenya & East Africa | Motokah",
    description: "Buy a Mazda Atenza in Kenya, Tanzania and Uganda. Browse Atenza prices from dealers — a stylish full-size saloon and estate with SKYACTIV technology.",
    heroText: "The Mazda Atenza (Mazda6) is the flagship saloon for buyers who want European-level refinement at a Japanese import price.",
    guide: {
      heading: "Mazda Atenza Price in Kenya — Buying Guide",
      body: "The Mazda Atenza (sold as Mazda6 in western markets) is Mazda's flagship saloon, available as a sedan and wagon. In Kenya, prices range from KES 1.5 million for 2008–2012 models to KES 4 million for 2016–2018 SKYACTIV units. The 2.0L and 2.5L SKYACTIV-G petrol engines offer a strong balance of power and efficiency. The wagon/estate body is particularly popular for its generous boot space. The Atenza is chosen by professionals who want a premium-feeling car without the maintenance costs of European brands. Check the front-wheel-drive system's CV joints (common wear on higher-mileage urban examples) and inspect the panoramic sunroof seal on models so equipped.",
    },
    typicalPriceRange: "KES 1.5M – 4M",
    bodyType: "Saloon/Estate",
    faq: [
      { q: "What is the Mazda Atenza price in Kenya?", a: "Mazda Atenza prices in Kenya range from KES 1.5 million for 2008–2012 models to KES 4 million for 2016–2018 SKYACTIV units in good condition." },
    ],
  },
  "honda|vezel": {
    displayMake: "Honda",
    displayModel: "Vezel",
    title: "Honda Vezel for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description: "Buy a Honda Vezel in Kenya, Tanzania and Uganda. Browse Vezel prices from local sellers. A popular compact SUV with hybrid option across East Africa.",
    heroText: "The Honda Vezel is East Africa's rising star compact SUV — stylish, surprisingly spacious, and the hybrid variant delivers exceptional fuel economy in city traffic.",
    guide: {
      heading: "Honda Vezel Price in Kenya — Buying Guide",
      body: "The Honda Vezel (sold as HR-V in some markets) is one of the fastest-growing models in the East African used car market. In Kenya, prices range from KES 1.5 million for standard 2014–2016 Vezel models to KES 3.2 million for hybrid variants with low mileage. The 1.5L VTEC petrol is the standard option; the hybrid uses Honda's i-DCD technology pairing a 1.5L engine with a 7-speed DCT and electric motor. The hybrid averages 25–30km/L in city driving, making it exceptionally economical for Nairobi traffic. When buying a Vezel, check the sensing system radar (on sensing-spec models) isn't damaged, inspect the DCT transmission (hybrid models need careful DCT fluid maintenance), and verify all touch-screen functions work correctly.",
    },
    typicalPriceRange: "KES 1.5M – 3.2M",
    bodyType: "Compact SUV",
    faq: [
      { q: "What is the Honda Vezel price in Kenya?", a: "Honda Vezel prices in Kenya range from KES 1.5 million for standard 2014 models to KES 3.2 million for hybrid 2018+ units with low mileage. The hybrid commands a KES 500,000–700,000 premium." },
      { q: "Honda Vezel vs Toyota Rav4 — which should I choose?", a: "The Rav4 is larger and has better resale value in East Africa. The Vezel is more fuel-efficient (especially the hybrid), more affordable, and better suited to urban use. For a city-primary driver, the Vezel hybrid is an excellent choice." },
    ],
  },
  "honda|fit": {
    displayMake: "Honda",
    displayModel: "Fit",
    title: "Honda Fit for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description: "Find a Honda Fit for sale in Kenya, Tanzania and Uganda. Browse Fit prices from local sellers — a reliable compact hatchback popular across East Africa.",
    heroText: "The Honda Fit is a cleverly packaged compact hatchback — more interior space than its small exterior suggests, and one of the most reliable used cars in East Africa.",
    guide: {
      heading: "Honda Fit Price in Kenya — Buying Guide",
      body: "The Honda Fit (GD, GE and GK series) is one of the most popular small hatchbacks in Kenya and Tanzania. Its Magic Seat system delivers remarkable interior flexibility for a car of its size. In Kenya, prices range from KES 450,000 for GD models to KES 1.4 million for GK (2014–2019) units. The 1.3L and 1.5L L-series VTEC engines are extremely reliable. The Fit Hybrid using Honda's IMA system (and later, i-DCD) offers 22–28km/L. Check the continuously variable transmission (CVT) fluid condition on all generations, and on GD models inspect for rust on the sill and front wheel arch inner panels — a common issue on older examples that were undercoated poorly.",
    },
    typicalPriceRange: "KES 450K – 1.4M",
    bodyType: "Hatchback",
    faq: [
      { q: "What is the Honda Fit price in Kenya?", a: "Honda Fit prices in Kenya range from KES 450,000 for GD models to KES 1.4 million for 2016–2018 GK units. The most popular range is KES 600,000–900,000 for 2010–2015 GE models." },
      { q: "Honda Fit vs Toyota Vitz — which is better?", a: "The Fit offers more interior space and a more versatile rear seat. The Vitz is lighter and marginally cheaper to maintain. Both are excellent budget choices; the Fit wins on practicality, the Vitz on simplicity." },
    ],
  },
  "honda|crv": {
    displayMake: "Honda",
    displayModel: "CRV",
    title: "Honda CR-V for Sale in Kenya & East Africa | Price & Listings | Motokah",
    description: "Buy a Honda CR-V in Kenya, Tanzania and Uganda. Browse CR-V prices from local sellers — a well-regarded compact SUV with strong reputation in East Africa.",
    heroText: "The Honda CR-V is a dependable compact SUV — spacious, well-equipped, and one of East Africa's most sought-after used SUV buys.",
    guide: {
      heading: "Honda CR-V Price in Kenya — Buying Guide",
      body: "The Honda CR-V (3rd, 4th and 5th generations: RE, RM and RW) is a popular compact SUV in Kenya and Uganda. In Kenya, prices range from KES 1.2 million for 2006–2011 RE models to KES 4.5 million for 2017+ RW units. The 2.0L K20 and 2.4L K24 petrol engines are excellent — durable, well-serviced in East Africa, and powerful enough for all road conditions. The 1.5L turbo on the 5th gen is capable but requires premium fuel. When buying a CR-V, inspect the rear differential fluid (4WD models), check for any timing chain rattle on idle (K24 has a chain, not belt), and verify the air conditioning compressor works — a common replacement item on older RE models. The RM (2012–2016) is the best-value generation in East Africa.",
    },
    typicalPriceRange: "KES 1.2M – 4.5M",
    bodyType: "Compact SUV",
    faq: [
      { q: "What is the Honda CR-V price in Kenya?", a: "Honda CR-V prices in Kenya range from KES 1.2 million for 2006–2011 models to KES 4.5 million for 2017+ units. The 2012–2016 RM generation offers the best combination of features and reliability per shilling." },
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
  { name: "Dar es Salaam", slug: "dar-es-salaam" },
  { name: "Arusha", slug: "arusha" },
  { name: "Nairobi", slug: "nairobi" },
  { name: "Kampala", slug: "kampala" },
  { name: "Mombasa", slug: "mombasa" },
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
    `Browse used ${makeTitle} ${modelTitle} cars for sale in Tanzania, Kenya, Uganda and East Africa. Compare prices and contact sellers on Motokah.`;
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
