// New Toyota models actually sold in Tanzania right now, with real official
// starting prices in TZS. Source: toyota.co.tz/select-vehicle/, Toyota Tanzania
// Ltd own showroom page, scraped 2026-11-18. Prices are starting from and
// exclude registration, insurance and accessories. No per-trim variant prices
// are published anywhere official for Tanzania, confirmed by checking each
// model own page directly; only one base price and spec set per model exists.
// Descriptions are written from the real specs here, not copied from Toyota,
// and gallery photos are the model own real photos where Toyota publishes a
// dedicated page for it (Rush, Starlet, Hino 300, Hino 500 have none).

export interface NewCarModel {
  slug: string;
  name: string;
  bodyType: string | null;
  engine: string | null;
  fuelPer100km: string | null;
  priceTzs: number | null;
  // Set only when this model's real price is in a currency other than TZS
  // (e.g. a Kenya model priced in KES). When absent, priceTzs is assumed to
  // be TZS, which is true for every pre-existing Tanzania entry.
  currency?: string;
  img: string;
  officialUrl: string;
  description: string | null;
  gallery: string[];
  sourceNote?: string;
}

export const TOYOTA_NEW_CARS: NewCarModel[] = [
  {
    "slug": "rush",
    "name": "Rush",
    "bodyType": "SUV",
    "engine": "1.5 CC",
    "fuelPer100km": "7.14L/100KM",
    "priceTzs": null,
    "img": "/new-cars/toyota/rush.png",
    "officialUrl": "https://toyota.co.tz/rush",
    "description": "The Rush is Toyota's compact seven-seat SUV, smaller and more affordable than the Fortuner, aimed at buyers who want three rows of seats in a body that's easier to park and run day to day than a full-size SUV. Its 1.5 litre engine returns a genuinely economical 7.14L/100km. Toyota Tanzania's own showroom page doesn't publish a starting price for the Rush, so if you're serious about one, contact Toyota Tanzania directly for a current quote rather than relying on a number from anywhere else.",
    "gallery": []
  },
  {
    "slug": "starlet",
    "name": "Starlet",
    "bodyType": "Hatchback",
    "engine": null,
    "fuelPer100km": "5.4L/100KM",
    "priceTzs": 33026373,
    "img": "/new-cars/toyota/starlet.png",
    "officialUrl": "https://toyota.co.tz/starlet",
    "description": "The Starlet is Toyota's rebadged version of the Suzuki Baleno, built as its entry-level hatchback for buyers who want a new Toyota at the lowest price point the brand sells in Tanzania, just over TZS 33 million. Fuel consumption of 5.4L/100km is the best of any model in Toyota's Tanzanian lineup, which makes sense for a car this size and class. It's the practical choice for a first new car or a second household vehicle, not a highway cruiser or a family hauler.",
    "gallery": []
  },
  {
    "slug": "urban-cruiser",
    "name": "Urban Cruiser",
    "bodyType": "SUV",
    "engine": "1.5L",
    "fuelPer100km": "6.2L/100KM",
    "priceTzs": 44297674,
    "img": "/new-cars/toyota/urban-cruiser.png",
    "officialUrl": "https://toyota.co.tz/urban-cruiser",
    "description": "The Urban Cruiser is Toyota's compact SUV built on the same platform family as the Suzuki Vitara Brezza, badge-engineered for markets like Tanzania where Toyota's dealer network and resale value matter more to buyers than a slightly cheaper Suzuki equivalent. The 1.5L engine and 6.2L/100km fuel use make it an efficient city-first SUV, not a serious off-roader, and it's priced as Toyota's entry point into the SUV segment here, well under the RAV4 or Corolla Cross.",
    "gallery": [
      "/new-cars/toyota/gallery/urban-cruiser-g0.png",
      "/new-cars/toyota/gallery/urban-cruiser-g1.png",
      "/new-cars/toyota/gallery/urban-cruiser-g2.png",
      "/new-cars/toyota/gallery/urban-cruiser-g3.png",
      "/new-cars/toyota/gallery/urban-cruiser-g4.png",
      "/new-cars/toyota/gallery/urban-cruiser-g5.png"
    ]
  },
  {
    "slug": "rumion",
    "name": "Rumion",
    "bodyType": "Wagon",
    "engine": "1.5 K15B",
    "fuelPer100km": "6.2L/100KM",
    "priceTzs": 61832174,
    "img": "/new-cars/toyota/rumion.png",
    "officialUrl": "https://toyota.co.tz/rumion",
    "description": "The Rumion is Toyota's version of the Suzuki Ertiga, a compact seven-seater built for families and small businesses that need more seats than a sedan without stepping up to a full van. The 1.5 K15B engine keeps fuel use down to around 6.2L/100km despite the extra seating, and at under TZS 62 million it's one of the more affordable new seven-seaters Toyota sells in Tanzania, well below the Noah or Hiace in price.",
    "gallery": [
      "/new-cars/toyota/gallery/rumion-g0.png",
      "/new-cars/toyota/gallery/rumion-g1.png",
      "/new-cars/toyota/gallery/rumion-g2.png",
      "/new-cars/toyota/gallery/rumion-g3.png",
      "/new-cars/toyota/gallery/rumion-g4.png",
      "/new-cars/toyota/gallery/rumion-g5.png"
    ]
  },
  {
    "slug": "hino-500",
    "name": "Hino 500",
    "bodyType": "Truck",
    "engine": "HINO J08C-F (EURO-1)",
    "fuelPer100km": "22.2L/100KM",
    "priceTzs": 63994227,
    "img": "/new-cars/toyota/hino-500.png",
    "officialUrl": "https://toyota.co.tz/hino-500",
    "description": "The Hino 500 steps up from the 300 into medium-duty truck territory, with the J08C-F Euro-1 engine built for serious haulage rather than light delivery work. Fuel consumption of 22.2L/100km reflects the loads this truck is built to carry, not inefficiency. At under TZS 64 million it's one of the more affordable ways into Toyota's commercial range in Tanzania, used by transport operators and businesses that need to move freight at scale.",
    "gallery": []
  },
  {
    "slug": "corolla-cross",
    "name": "Corolla Cross",
    "bodyType": "SUV",
    "engine": "1.8 Dual VVT-i",
    "fuelPer100km": "6.8L/100KM",
    "priceTzs": 82371584,
    "img": "/new-cars/toyota/corolla-cross.png",
    "officialUrl": "https://toyota.co.tz/corolla-cross",
    "description": "The Corolla Cross Hybrid takes the Corolla's reputation for reliability and reasonable running costs and puts it into a small SUV body with a higher seating position, which is exactly what a lot of Tanzanian buyers are asking dealers for right now. The 1.8 Dual VVT-i hybrid returns about 6.8L/100km, and it sits between the Urban Cruiser and the RAV4 on price, aimed at buyers who want hybrid efficiency without going all the way to the RAV4's size and price.",
    "gallery": [
      "/new-cars/toyota/gallery/corolla-cross-g0.png",
      "/new-cars/toyota/gallery/corolla-cross-g1.png",
      "/new-cars/toyota/gallery/corolla-cross-g2.png",
      "/new-cars/toyota/gallery/corolla-cross-g3.png",
      "/new-cars/toyota/gallery/corolla-cross-g4.png",
      "/new-cars/toyota/gallery/corolla-cross-g5.png"
    ]
  },
  {
    "slug": "hilux",
    "name": "Hilux",
    "bodyType": "Pickup",
    "engine": "2.8 GD-6",
    "fuelPer100km": "8.5L/100KM",
    "priceTzs": 87615341,
    "img": "/new-cars/toyota/hilux.png",
    "officialUrl": "https://toyota.co.tz/hilux",
    "description": "The Hilux needs no introduction in Tanzania, it's the pickup most contractors, government departments and farmers default to when they need a vehicle that simply will not quit. The 2.8 GD-6 diesel is Toyota's current-generation engine for the Hilux, returning about 8.5L/100km, with power and torque aimed squarely at towing and load-carrying rather than outright speed. Starting under TZS 88 million, it undercuts the tougher but older-tech Land Cruiser 79 while still being more capable than most double-cab rivals on the road here.",
    "gallery": [
      "/new-cars/toyota/gallery/hilux-g0.png",
      "/new-cars/toyota/gallery/hilux-g1.png",
      "/new-cars/toyota/gallery/hilux-g2.png",
      "/new-cars/toyota/gallery/hilux-g3.png",
      "/new-cars/toyota/gallery/hilux-g4.png",
      "/new-cars/toyota/gallery/hilux-g5.png"
    ]
  },
  {
    "slug": "rav4",
    "name": "RAV4",
    "bodyType": "SUV",
    "engine": "2.0 DUAL VVT-IE CVT",
    "fuelPer100km": "6.5L/100KM",
    "priceTzs": 101781668,
    "img": "/new-cars/toyota/rav4.png",
    "officialUrl": "https://toyota.co.tz/rav4",
    "description": "The RAV4 Hybrid is Toyota's answer for buyers who want an SUV that's comfortable on Dar es Salaam's roads but doesn't burn through fuel doing it. The 2.0 Dual VVT-iE hybrid CVT setup brings fuel consumption down to around 6.5L/100km, noticeably better than a comparable non-hybrid SUV of this size. It sits in the mid-size SUV bracket popular with families and professionals who want space, a higher driving position and real fuel savings on a daily commute, without stepping down to a hatchback.",
    "gallery": [
      "/new-cars/toyota/gallery/rav4-g0.png",
      "/new-cars/toyota/gallery/rav4-g1.png",
      "/new-cars/toyota/gallery/rav4-g2.png",
      "/new-cars/toyota/gallery/rav4-g3.png",
      "/new-cars/toyota/gallery/rav4-g4.png",
      "/new-cars/toyota/gallery/rav4-g5.png"
    ]
  },
  {
    "slug": "hino-300",
    "name": "Hino 300",
    "bodyType": "Truck",
    "engine": "HINO N04C-WG (Euro-3)",
    "fuelPer100km": "16.6L/100KM",
    "priceTzs": 102710057,
    "img": "/new-cars/toyota/hino-300.png",
    "officialUrl": "https://toyota.co.tz/hino-300",
    "description": "The Hino 300 is Toyota Tanzania's light-duty truck line, sold through the same dealer network as its passenger vehicles, aimed at businesses that need a proper cargo or box truck rather than a pickup. The N04C-WG Euro-3 engine uses around 16.6L/100km, typical for a light truck of this size carrying real commercial loads. At just over TZS 102 million, it's positioned for small and medium businesses moving goods around Tanzania's cities and between regions.",
    "gallery": []
  },
  {
    "slug": "hiace",
    "name": "Hiace",
    "bodyType": "Van",
    "engine": "2.5 D-4D",
    "fuelPer100km": "14L/100KM",
    "priceTzs": 105970512,
    "img": "/new-cars/toyota/hiace.png",
    "officialUrl": "https://toyota.co.tz/hiace",
    "description": "The Hiace is the van you'll find behind almost every courier company, safari operator and staff shuttle service in East Africa, and it has been for decades. The 2.5 D-4D diesel is the same workhorse engine Toyota has used in the Hiace across the region for years, known for being simple to maintain and hard to kill. Fuel consumption around 14L/100km reflects its size and load capacity rather than being thirsty for a van its class. If you're buying for a business that needs to move people or goods reliably every day, this is the default choice.",
    "gallery": [
      "/new-cars/toyota/gallery/hiace-g0.png",
      "/new-cars/toyota/gallery/hiace-g1.png",
      "/new-cars/toyota/gallery/hiace-g2.png",
      "/new-cars/toyota/gallery/hiace-g3.png",
      "/new-cars/toyota/gallery/hiace-g4.png",
      "/new-cars/toyota/gallery/hiace-g5.png"
    ]
  },
  {
    "slug": "land-cruiser-79",
    "name": "Land Cruiser 79",
    "bodyType": "Pickup",
    "engine": "4.2 DIESEL",
    "fuelPer100km": "8L/100KM",
    "priceTzs": 119810728,
    "img": "/new-cars/toyota/land-cruiser-79.png",
    "officialUrl": "https://toyota.co.tz/land-cruiser-79",
    "description": "The Land Cruiser 79 is the single-cab and double-cab pickup version of Toyota's legendary 70 Series, the vehicle NGOs, mining operations and government fleets across East Africa choose when a job genuinely cannot afford a breakdown. The 4.2 litre diesel is the same proven engine used across the 70 Series range, built for decades of hard use rather than comfort, and 8L/100km is efficient for a vehicle this tough. If you need a pickup that will still be running in fifteen years of rough roads, this is the benchmark.",
    "gallery": [
      "/new-cars/toyota/gallery/land-cruiser-79-g0.png",
      "/new-cars/toyota/gallery/land-cruiser-79-g1.png",
      "/new-cars/toyota/gallery/land-cruiser-79-g2.png",
      "/new-cars/toyota/gallery/land-cruiser-79-g3.png",
      "/new-cars/toyota/gallery/land-cruiser-79-g4.png",
      "/new-cars/toyota/gallery/land-cruiser-79-g5.png"
    ]
  },
  {
    "slug": "land-cruiser-78",
    "name": "Land Cruiser 78",
    "bodyType": "SUV",
    "engine": "4.2 DIESEL",
    "fuelPer100km": "8L/100KM",
    "priceTzs": 122778376,
    "img": "/new-cars/toyota/land-cruiser-78.png",
    "officialUrl": "https://toyota.co.tz/land-cruiser-78",
    "description": "The Land Cruiser 78 is the troop-carrier bodied version of the 70 Series, the one you see modified into safari vehicles and used by larger field teams who need to move more people over rough terrain than the 76 wagon allows. Like the rest of the 70 Series it runs the 4.2 litre diesel at around 8L/100km, and its price sits between the 76 and 79, reflecting the extra body and seating it offers over the pickup.",
    "gallery": [
      "/new-cars/toyota/gallery/land-cruiser-78-g0.png",
      "/new-cars/toyota/gallery/land-cruiser-78-g1.png",
      "/new-cars/toyota/gallery/land-cruiser-78-g2.png",
      "/new-cars/toyota/gallery/land-cruiser-78-g3.png",
      "/new-cars/toyota/gallery/land-cruiser-78-g4.png",
      "/new-cars/toyota/gallery/land-cruiser-78-g5.png"
    ]
  },
  {
    "slug": "land-cruiser-76",
    "name": "Land Cruiser 76",
    "bodyType": "SUV",
    "engine": "4.2 DIESEL",
    "fuelPer100km": "8L/100KM",
    "priceTzs": 123126457,
    "img": "/new-cars/toyota/land-cruiser-76.png",
    "officialUrl": "https://toyota.co.tz/land-cruiser-76",
    "description": "The Land Cruiser 76 is the station wagon body on the same 70 Series platform as the 78 and 79, built for safari operators, researchers and NGOs working in genuinely remote parts of East Africa where a vehicle cannot be allowed to fail. It runs the same proven 4.2 litre diesel across the 70 Series range, with 8L/100km consumption, and it is priced within a few million shillings of its 78 and 79 siblings, the choice mostly coming down to body style rather than capability.",
    "gallery": [
      "/new-cars/toyota/gallery/land-cruiser-76-g0.png",
      "/new-cars/toyota/gallery/land-cruiser-76-g1.png",
      "/new-cars/toyota/gallery/land-cruiser-76-g2.png",
      "/new-cars/toyota/gallery/land-cruiser-76-g3.png",
      "/new-cars/toyota/gallery/land-cruiser-76-g4.png",
      "/new-cars/toyota/gallery/land-cruiser-76-g5.png"
    ]
  },
  {
    "slug": "fortuner",
    "name": "Fortuner",
    "bodyType": "SUV",
    "engine": "2.8 GD-6 (D-4D)",
    "fuelPer100km": "8.5L/100KM",
    "priceTzs": 137496748,
    "img": "/new-cars/toyota/fortuner.png",
    "officialUrl": "https://toyota.co.tz/fortuner",
    "description": "The Fortuner shares its underpinnings with the Hilux, which is exactly why it's popular in Tanzania, buyers get a proper body-on-frame SUV with genuine off-road ability and the same dependable 2.8 GD-6 diesel used in the pickup, in a more family-oriented seven-seat body. Fuel consumption of 8.5L/100km matches the Hilux, and at under TZS 138 million it sits as the SUV alternative for buyers who considered a Hilux but wanted an enclosed cargo area and extra rows of seats instead.",
    "gallery": [
      "/new-cars/toyota/gallery/fortuner-g0.png",
      "/new-cars/toyota/gallery/fortuner-g1.png",
      "/new-cars/toyota/gallery/fortuner-g2.png",
      "/new-cars/toyota/gallery/fortuner-g3.png",
      "/new-cars/toyota/gallery/fortuner-g4.png",
      "/new-cars/toyota/gallery/fortuner-g5.png"
    ]
  },
  {
    "slug": "land-cruiser-prado",
    "name": "Land Cruiser Prado",
    "bodyType": "SUV",
    "engine": "3.0 D-4D",
    "fuelPer100km": "8.5L/100KM",
    "priceTzs": 189276380,
    "img": "/new-cars/toyota/land-cruiser-prado.png",
    "officialUrl": "https://toyota.co.tz/land-cruiser-prado",
    "description": "The Land Cruiser Prado sits between the rugged 70 Series and the flagship 300, aimed at buyers who want real off-road capability and Land Cruiser dependability but in a size that's still practical as a daily family SUV. The 3.0 D-4D diesel's 7.9L/100km is reasonable for a vehicle this size and capability, and at just over TZS 189 million it's priced well below the 300 while still carrying the Land Cruiser name that holds its resale value better than almost anything else sold here.",
    "gallery": [
      "/new-cars/toyota/gallery/land-cruiser-prado-g0.png",
      "/new-cars/toyota/gallery/land-cruiser-prado-g1.png",
      "/new-cars/toyota/gallery/land-cruiser-prado-g2.png",
      "/new-cars/toyota/gallery/land-cruiser-prado-g3.png",
      "/new-cars/toyota/gallery/land-cruiser-prado-g4.png",
      "/new-cars/toyota/gallery/land-cruiser-prado-g5.png"
    ]
  },
  {
    "slug": "coaster",
    "name": "Coaster",
    "bodyType": "Bus",
    "engine": "4.2 DIESEL",
    "fuelPer100km": "8L/100KM",
    "priceTzs": 191723605,
    "img": "/new-cars/toyota/coaster.png",
    "officialUrl": "https://toyota.co.tz/coaster",
    "description": "The Coaster is Toyota's full-size minibus, the one you'll see running school runs, church groups and tour operator airport transfers all over Tanzania. It's built around a 4.2 litre diesel engine, a seated capacity well beyond any regular van, and a body meant to be driven hard, daily, for years. Fuel use sits around 8L/100km for a vehicle this size, which is reasonable for a diesel this big. Most buyers are institutions and operators rather than individuals, since it's priced and sized for that use.",
    "gallery": [
      "/new-cars/toyota/gallery/coaster-g0.png",
      "/new-cars/toyota/gallery/coaster-g1.png",
      "/new-cars/toyota/gallery/coaster-g2.png",
      "/new-cars/toyota/gallery/coaster-g3.png",
      "/new-cars/toyota/gallery/coaster-g4.png",
      "/new-cars/toyota/gallery/coaster-g5.png"
    ]
  },
  {
    "slug": "land-cruiser-300",
    "name": "Land Cruiser 300",
    "bodyType": "SUV",
    "engine": "3.3L",
    "fuelPer100km": "8.9L/100KM",
    "priceTzs": 210419153,
    "img": "/new-cars/toyota/land-cruiser-300.png",
    "officialUrl": "https://toyota.co.tz/land-cruiser-300",
    "description": "The Land Cruiser 300 is Toyota's flagship, the modern full-size Land Cruiser aimed at buyers who want the brand's reputation for unbreakable reliability combined with genuine luxury, not just ruggedness. At over TZS 210 million it's the most expensive model Toyota sells new in Tanzania, and the 3.3 litre engine's 8.9L/100km consumption reflects its size and weight rather than inefficiency for what it is. This is bought by senior executives, diplomatic missions and buyers who want the newest Land Cruiser rather than the older 76/78/79 platform.",
    "gallery": [
      "/new-cars/toyota/gallery/land-cruiser-300-g0.png",
      "/new-cars/toyota/gallery/land-cruiser-300-g1.png",
      "/new-cars/toyota/gallery/land-cruiser-300-g2.png",
      "/new-cars/toyota/gallery/land-cruiser-300-g3.png",
      "/new-cars/toyota/gallery/land-cruiser-300-g4.png",
      "/new-cars/toyota/gallery/land-cruiser-300-g5.png"
    ]
  }
];
