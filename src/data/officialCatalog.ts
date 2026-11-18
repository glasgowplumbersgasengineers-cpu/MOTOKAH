// Official brand and model catalog: a browsable section separate from user-posted
// listings, close to how PakWheels shows new-car brands and models. Prices here are
// not factory prices (these are used Japan-import cars, never sold new in East
// Africa) — they are real min/median/max asking prices built from live Jiji
// listings for the same make and model (see priceGuard.ts for the same approach
// used on the Sell form). Specs come from vehiclePresets.ts where available.
// Built 2026-11-18 from 1752 scraped listings across Tanzania, Kenya and Uganda.
// Covers the brands that matter most to East African buyers; more can be added
// the same way once there is enough real listing data behind them.

export interface CatalogModel {
  slug: string;
  name: string;
  bodyType: string | null;
  transmission: string | null;
  fuelType: string | null;
  minUsd: number;
  medianUsd: number;
  maxUsd: number;
  sampleSize: number;
  img: string | null;
}

export interface CatalogBrand {
  name: string;
  logo: string | null;
  models: CatalogModel[];
}

export const OFFICIAL_CATALOG: Record<string, CatalogBrand> = {
  "toyota": {
    "name": "Toyota",
    "logo": "/catalog/logos/toyota.svg",
    "models": [
      {
        "slug": "land-cruiser-prado",
        "name": "Land Cruiser Prado",
        "bodyType": "SUV",
        "transmission": "Automatic",
        "fuelType": "Diesel",
        "minUsd": 5426,
        "medianUsd": 42984,
        "maxUsd": 104651,
        "sampleSize": 94,
        "img": "/catalog/images/Toyota_Land_Cruiser_Prado.webp"
      },
      {
        "slug": "harrier",
        "name": "Harrier",
        "bodyType": "SUV",
        "transmission": "Automatic",
        "fuelType": "Petrol",
        "minUsd": 2306,
        "medianUsd": 18992,
        "maxUsd": 44231,
        "sampleSize": 87,
        "img": "/catalog/images/Toyota_Harrier.webp"
      },
      {
        "slug": "land-cruiser",
        "name": "Land Cruiser",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 10833,
        "medianUsd": 57500,
        "maxUsd": 176923,
        "sampleSize": 86,
        "img": "/catalog/images/Toyota_Land_Cruiser.webp"
      },
      {
        "slug": "alphard",
        "name": "Alphard",
        "bodyType": "Van",
        "transmission": "Automatic",
        "fuelType": "Petrol",
        "minUsd": 3889,
        "medianUsd": 10654,
        "maxUsd": 59154,
        "sampleSize": 53,
        "img": "/catalog/images/Toyota_Alphard.webp"
      },
      {
        "slug": "noah",
        "name": "Noah",
        "bodyType": "Van",
        "transmission": "Automatic",
        "fuelType": "Petrol",
        "minUsd": 3611,
        "medianUsd": 10193,
        "maxUsd": 23077,
        "sampleSize": 52,
        "img": "/catalog/images/Toyota_Noah.webp"
      },
      {
        "slug": "hilux",
        "name": "Hilux",
        "bodyType": "Pickup",
        "transmission": "Manual",
        "fuelType": "Diesel",
        "minUsd": 6389,
        "medianUsd": 37692,
        "maxUsd": 63269,
        "sampleSize": 51,
        "img": "/catalog/images/Toyota_Hilux.webp"
      }
    ]
  },
  "nissan": {
    "name": "Nissan",
    "logo": "/catalog/logos/nissan.svg",
    "models": [
      {
        "slug": "x-trail",
        "name": "X-Trail",
        "bodyType": "SUV",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 3333,
        "medianUsd": 9922,
        "maxUsd": 43077,
        "sampleSize": 31,
        "img": "/catalog/images/Nissan_X-Trail.webp"
      },
      {
        "slug": "note",
        "name": "Note",
        "bodyType": "Hatchback",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 4167,
        "medianUsd": 7907,
        "maxUsd": 13178,
        "sampleSize": 15,
        "img": "/catalog/images/Nissan_Note.webp"
      },
      {
        "slug": "juke",
        "name": "Juke",
        "bodyType": "SUV",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 6346,
        "medianUsd": 7752,
        "maxUsd": 13953,
        "sampleSize": 9,
        "img": "/catalog/images/Nissan_Juke.webp"
      },
      {
        "slug": "serena",
        "name": "Serena",
        "bodyType": "Van",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 10853,
        "medianUsd": 14651,
        "maxUsd": 16124,
        "sampleSize": 5,
        "img": "/catalog/images/Nissan_Serena.webp"
      },
      {
        "slug": "dualis",
        "name": "Dualis",
        "bodyType": "SUV",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 4167,
        "medianUsd": 5462,
        "maxUsd": 8527,
        "sampleSize": 4,
        "img": "/catalog/images/Nissan_Dualis.webp"
      },
      {
        "slug": "hardbody",
        "name": "Hardbody",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 5000,
        "medianUsd": 9444,
        "maxUsd": 25308,
        "sampleSize": 4,
        "img": "/catalog/images/Nissan_Hardbody.webp"
      }
    ]
  },
  "subaru": {
    "name": "Subaru",
    "logo": "/catalog/logos/subaru.svg",
    "models": [
      {
        "slug": "forester",
        "name": "Forester",
        "bodyType": "SUV",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 2500,
        "medianUsd": 13769,
        "maxUsd": 33846,
        "sampleSize": 103,
        "img": "/catalog/images/Subaru_Forester.webp"
      },
      {
        "slug": "impreza",
        "name": "Impreza",
        "bodyType": "Hatchback",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 2778,
        "medianUsd": 8462,
        "maxUsd": 26389,
        "sampleSize": 19,
        "img": "/catalog/images/Subaru_Impreza.webp"
      },
      {
        "slug": "legacy",
        "name": "Legacy",
        "bodyType": "Wagon",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 4861,
        "medianUsd": 7207,
        "maxUsd": 12500,
        "sampleSize": 16,
        "img": "/catalog/images/Subaru_Legacy.webp"
      },
      {
        "slug": "outback",
        "name": "Outback",
        "bodyType": "Wagon",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 4722,
        "medianUsd": 14574,
        "maxUsd": 27907,
        "sampleSize": 15,
        "img": "/catalog/images/Subaru_Outback.webp"
      },
      {
        "slug": "xv",
        "name": "XV",
        "bodyType": "SUV",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 10962,
        "medianUsd": 12222,
        "maxUsd": 18992,
        "sampleSize": 9,
        "img": "/catalog/images/Subaru_XV.webp"
      },
      {
        "slug": "trezia",
        "name": "Trezia",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 6385,
        "medianUsd": 7364,
        "maxUsd": 8615,
        "sampleSize": 3,
        "img": "/catalog/images/Subaru_Trezia.webp"
      }
    ]
  },
  "honda": {
    "name": "Honda",
    "logo": "/catalog/logos/honda.svg",
    "models": [
      {
        "slug": "vezel",
        "name": "Vezel",
        "bodyType": "SUV",
        "transmission": "Automatic",
        "fuelType": "Hybrid",
        "minUsd": 15116,
        "medianUsd": 19302,
        "maxUsd": 20543,
        "sampleSize": 10,
        "img": "/catalog/images/Honda_Vezel.webp"
      },
      {
        "slug": "fit",
        "name": "Fit",
        "bodyType": "Hatchback",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 3611,
        "medianUsd": 6468,
        "maxUsd": 13101,
        "sampleSize": 8,
        "img": "/catalog/images/Honda_Fit.webp"
      },
      {
        "slug": "cr-v",
        "name": "CR-V",
        "bodyType": "SUV",
        "transmission": "Automatic",
        "fuelType": "Petrol",
        "minUsd": 2222,
        "medianUsd": 9302,
        "maxUsd": 32558,
        "sampleSize": 7,
        "img": "/catalog/images/Honda_CR-V.webp"
      },
      {
        "slug": "fit-shuttle",
        "name": "Fit Shuttle",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 12403,
        "medianUsd": 12636,
        "maxUsd": 13178,
        "sampleSize": 3,
        "img": "/catalog/images/Honda_Fit_Shuttle.webp"
      },
      {
        "slug": "stepwgn",
        "name": "Stepwgn",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 22093,
        "medianUsd": 22674,
        "maxUsd": 23256,
        "sampleSize": 2,
        "img": "/catalog/images/Honda_Stepwgn.webp"
      },
      {
        "slug": "grace",
        "name": "Grace",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 13178,
        "medianUsd": 13914,
        "maxUsd": 14651,
        "sampleSize": 2,
        "img": "/catalog/images/Honda_Grace.webp"
      }
    ]
  },
  "mitsubishi": {
    "name": "Mitsubishi",
    "logo": "/catalog/logos/mitsubishi.svg",
    "models": [
      {
        "slug": "outlander",
        "name": "Outlander",
        "bodyType": "SUV",
        "transmission": "CVT",
        "fuelType": "Petrol",
        "minUsd": 5556,
        "medianUsd": 11923,
        "maxUsd": 27124,
        "sampleSize": 35,
        "img": "/catalog/images/Mitsubishi_Outlander.webp"
      },
      {
        "slug": "pajero",
        "name": "Pajero",
        "bodyType": "SUV",
        "transmission": "Automatic",
        "fuelType": "Diesel",
        "minUsd": 3333,
        "medianUsd": 7612,
        "maxUsd": 30556,
        "sampleSize": 26,
        "img": "/catalog/images/Mitsubishi_Pajero.webp"
      },
      {
        "slug": "rvr",
        "name": "RVR",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 3093,
        "medianUsd": 9538,
        "maxUsd": 11462,
        "sampleSize": 5,
        "img": "/catalog/images/Mitsubishi_RVR.webp"
      },
      {
        "slug": "pajero-sport",
        "name": "Pajero Sport",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 4167,
        "medianUsd": 8045,
        "maxUsd": 11923,
        "sampleSize": 2,
        "img": "/catalog/images/Mitsubishi_Pajero_Sport.webp"
      },
      {
        "slug": "delica",
        "name": "Delica",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 8597,
        "medianUsd": 15151,
        "maxUsd": 21705,
        "sampleSize": 2,
        "img": "/catalog/images/Mitsubishi_Delica.webp"
      },
      {
        "slug": "pajero-io",
        "name": "Pajero iO",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 2361,
        "medianUsd": 2570,
        "maxUsd": 2778,
        "sampleSize": 2,
        "img": "/catalog/images/Mitsubishi_Pajero_iO.webp"
      }
    ]
  },
  "isuzu": {
    "name": "Isuzu",
    "logo": null,
    "models": [
      {
        "slug": "d-max",
        "name": "D-Max",
        "bodyType": "Pickup",
        "transmission": "Manual",
        "fuelType": "Diesel",
        "minUsd": 9302,
        "medianUsd": 13566,
        "maxUsd": 66667,
        "sampleSize": 7,
        "img": "/catalog/images/Isuzu_D-Max.webp"
      }
    ]
  },
  "bmw": {
    "name": "BMW",
    "logo": "/catalog/logos/bmw.svg",
    "models": [
      {
        "slug": "x5",
        "name": "X5",
        "bodyType": "SUV",
        "transmission": "Automatic",
        "fuelType": "Diesel",
        "minUsd": 3488,
        "medianUsd": 13566,
        "maxUsd": 62015,
        "sampleSize": 13,
        "img": "/catalog/images/BMW_X5.webp"
      },
      {
        "slug": "3-series",
        "name": "3 Series",
        "bodyType": "Sedan",
        "transmission": "Automatic",
        "fuelType": "Petrol",
        "minUsd": 4885,
        "medianUsd": 8524,
        "maxUsd": 13462,
        "sampleSize": 12,
        "img": "/catalog/images/BMW_3_Series.webp"
      },
      {
        "slug": "x1",
        "name": "X1",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 6000,
        "medianUsd": 10676,
        "maxUsd": 25581,
        "sampleSize": 8,
        "img": "/catalog/images/BMW_X1.webp"
      },
      {
        "slug": "x3",
        "name": "X3",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 4264,
        "medianUsd": 15154,
        "maxUsd": 32115,
        "sampleSize": 7,
        "img": "/catalog/images/BMW_X3.webp"
      },
      {
        "slug": "z4",
        "name": "Z4",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 8269,
        "medianUsd": 17808,
        "maxUsd": 42636,
        "sampleSize": 4,
        "img": "/catalog/images/BMW_Z4.webp"
      },
      {
        "slug": "x6",
        "name": "X6",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 12615,
        "medianUsd": 22093,
        "maxUsd": 34231,
        "sampleSize": 3,
        "img": "/catalog/images/BMW_X6.webp"
      }
    ]
  },
  "mercedes-benz": {
    "name": "Mercedes-Benz",
    "logo": "/catalog/logos/mercedes-benz.svg",
    "models": [
      {
        "slug": "gle",
        "name": "GLE",
        "bodyType": "SUV",
        "transmission": "Automatic",
        "fuelType": "Diesel",
        "minUsd": 44961,
        "medianUsd": 74419,
        "maxUsd": 147287,
        "sampleSize": 11,
        "img": "/catalog/images/Mercedes-Benz_GLE.webp"
      },
      {
        "slug": "glc",
        "name": "GLC",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 25769,
        "medianUsd": 45000,
        "maxUsd": 58132,
        "sampleSize": 9,
        "img": "/catalog/images/Mercedes-Benz_GLC.webp"
      },
      {
        "slug": "g-class",
        "name": "G-Class",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 83333,
        "medianUsd": 146154,
        "maxUsd": 230769,
        "sampleSize": 5,
        "img": "/catalog/images/Mercedes-Benz_G-Class.webp"
      },
      {
        "slug": "s-class",
        "name": "S-Class",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 4167,
        "medianUsd": 65891,
        "maxUsd": 127907,
        "sampleSize": 5,
        "img": "/catalog/images/Mercedes-Benz_S-Class.webp"
      },
      {
        "slug": "c-class",
        "name": "C-Class",
        "bodyType": "Sedan",
        "transmission": "Automatic",
        "fuelType": "Petrol",
        "minUsd": 3333,
        "medianUsd": 11666,
        "maxUsd": 20000,
        "sampleSize": 2,
        "img": "/catalog/images/Mercedes-Benz_C-Class.webp"
      },
      {
        "slug": "b-class",
        "name": "B-Class",
        "bodyType": null,
        "transmission": null,
        "fuelType": null,
        "minUsd": 10620,
        "medianUsd": 11240,
        "maxUsd": 11860,
        "sampleSize": 2,
        "img": "/catalog/images/Mercedes-Benz_B-Class.webp"
      }
    ]
  }
};

export const CATALOG_BRAND_SLUGS = Object.keys(OFFICIAL_CATALOG);
