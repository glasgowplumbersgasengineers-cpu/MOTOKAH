// New Toyota models actually sold in Tanzania right now, with real official
// starting prices in TZS. Source: toyota.co.tz/select-vehicle/, Toyota Tanzania
// Ltd's own showroom page, scraped 2026-11-18. Prices are 'starting from' and
// exclude registration, insurance and accessories, same as the source states.
// This is the only East African market where an official distributor publishes
// real new-car prices; Toyota Kenya does not (confirmed by phone/email enquiry
// only). Rush has no published price on the source page, contact the dealer.

export interface NewCarModel {
  slug: string;
  name: string;
  bodyType: string | null;
  engine: string | null;
  fuelPer100km: string | null;
  priceTzs: number | null;
  img: string;
  officialUrl: string;
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
    "officialUrl": "https://toyota.co.tz/rush"
  },
  {
    "slug": "starlet",
    "name": "Starlet",
    "bodyType": "Hatchback",
    "engine": null,
    "fuelPer100km": "5.4L/100KM",
    "priceTzs": 33026373,
    "img": "/new-cars/toyota/starlet.png",
    "officialUrl": "https://toyota.co.tz/starlet"
  },
  {
    "slug": "urban-cruiser",
    "name": "Urban Cruiser",
    "bodyType": "SUV",
    "engine": "1.5L",
    "fuelPer100km": "6.2L/100KM",
    "priceTzs": 44297674,
    "img": "/new-cars/toyota/urban-cruiser.png",
    "officialUrl": "https://toyota.co.tz/urban-cruiser"
  },
  {
    "slug": "rumion",
    "name": "Rumion",
    "bodyType": "Wagon",
    "engine": "1.5 K15B",
    "fuelPer100km": "6.2L/100KM",
    "priceTzs": 61832174,
    "img": "/new-cars/toyota/rumion.png",
    "officialUrl": "https://toyota.co.tz/rumion"
  },
  {
    "slug": "hino-500",
    "name": "Hino 500",
    "bodyType": "Truck",
    "engine": "HINO J08C-F (EURO-1)",
    "fuelPer100km": "22.2L/100KM",
    "priceTzs": 63994227,
    "img": "/new-cars/toyota/hino-500.png",
    "officialUrl": "https://toyota.co.tz/hino-500"
  },
  {
    "slug": "corolla-cross",
    "name": "Corolla Cross",
    "bodyType": "SUV",
    "engine": "1.8 Dual VVT-i",
    "fuelPer100km": "6.8L/100KM",
    "priceTzs": 82371584,
    "img": "/new-cars/toyota/corolla-cross.png",
    "officialUrl": "https://toyota.co.tz/corolla-cross"
  },
  {
    "slug": "hilux",
    "name": "Hilux",
    "bodyType": "Pickup",
    "engine": "2.8 GD-6",
    "fuelPer100km": "8.5L/100KM",
    "priceTzs": 87615341,
    "img": "/new-cars/toyota/hilux.png",
    "officialUrl": "https://toyota.co.tz/hilux"
  },
  {
    "slug": "rav4",
    "name": "RAV4",
    "bodyType": "SUV",
    "engine": "2.0 DUAL VVT-IE CVT",
    "fuelPer100km": "6.5L/100KM",
    "priceTzs": 101781668,
    "img": "/new-cars/toyota/rav4.png",
    "officialUrl": "https://toyota.co.tz/rav4"
  },
  {
    "slug": "hino-300",
    "name": "Hino 300",
    "bodyType": "Truck",
    "engine": "HINO N04C-WG (Euro-3)",
    "fuelPer100km": "16.6L/100KM",
    "priceTzs": 102710057,
    "img": "/new-cars/toyota/hino-300.png",
    "officialUrl": "https://toyota.co.tz/hino-300"
  },
  {
    "slug": "hiace",
    "name": "Hiace",
    "bodyType": "Van",
    "engine": "2.5 D-4D",
    "fuelPer100km": "14L/100KM",
    "priceTzs": 105970512,
    "img": "/new-cars/toyota/hiace.png",
    "officialUrl": "https://toyota.co.tz/hiace"
  },
  {
    "slug": "land-cruiser-79",
    "name": "Land Cruiser 79",
    "bodyType": "Pickup",
    "engine": "4.2 DIESEL",
    "fuelPer100km": "8L/100KM",
    "priceTzs": 119810728,
    "img": "/new-cars/toyota/land-cruiser-79.png",
    "officialUrl": "https://toyota.co.tz/land-cruiser-79"
  },
  {
    "slug": "land-cruiser-78",
    "name": "Land Cruiser 78",
    "bodyType": "SUV",
    "engine": "4.2 DIESEL",
    "fuelPer100km": "8L/100KM",
    "priceTzs": 122778376,
    "img": "/new-cars/toyota/land-cruiser-78.png",
    "officialUrl": "https://toyota.co.tz/land-cruiser-78"
  },
  {
    "slug": "land-cruiser-76",
    "name": "Land Cruiser 76",
    "bodyType": "SUV",
    "engine": "4.2 DIESEL",
    "fuelPer100km": "8L/100KM",
    "priceTzs": 123126457,
    "img": "/new-cars/toyota/land-cruiser-76.png",
    "officialUrl": "https://toyota.co.tz/land-cruiser-76"
  },
  {
    "slug": "fortuner",
    "name": "Fortuner",
    "bodyType": "SUV",
    "engine": "2.8 GD-6 (D-4D)",
    "fuelPer100km": "8.5L/100KM",
    "priceTzs": 137496748,
    "img": "/new-cars/toyota/fortuner.png",
    "officialUrl": "https://toyota.co.tz/fortuner"
  },
  {
    "slug": "land-cruiser-prado",
    "name": "Land Cruiser Prado",
    "bodyType": "SUV",
    "engine": "3.0 D-4D",
    "fuelPer100km": "8.5L/100KM",
    "priceTzs": 189276380,
    "img": "/new-cars/toyota/land-cruiser-prado.png",
    "officialUrl": "https://toyota.co.tz/land-cruiser-prado"
  },
  {
    "slug": "coaster",
    "name": "Coaster",
    "bodyType": "Bus",
    "engine": "4.2 DIESEL",
    "fuelPer100km": "8L/100KM",
    "priceTzs": 191723605,
    "img": "/new-cars/toyota/coaster.png",
    "officialUrl": "https://toyota.co.tz/coaster"
  },
  {
    "slug": "land-cruiser-300",
    "name": "Land Cruiser 300",
    "bodyType": "SUV",
    "engine": "3.3L",
    "fuelPer100km": "8.9L/100KM",
    "priceTzs": 210419153,
    "img": "/new-cars/toyota/land-cruiser-300.png",
    "officialUrl": "https://toyota.co.tz/land-cruiser-300"
  }
];
