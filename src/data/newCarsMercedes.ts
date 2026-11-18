// Mercedes-Benz models sold new in Tanzania, from mercedes-benz-tanzania.com
// (CFAO Mobility Tanzania's own site), checked 2026-11-18. The site's van
// range page was the only part that loaded reliably; it publishes no price
// for any model, same as every other non-Toyota brand checked. No real photo
// could be pulled from this site without risking the wrong image, so none is
// shown here, that's left honest rather than guessed.
import type { NewCarModel } from "./newCarsToyota";

export const MERCEDES_NEW_CARS: NewCarModel[] = [
  { slug: "v-class", name: "V-Class", bodyType: "Van", engine: null, fuelPer100km: null, priceTzs: null, img: "", officialUrl: "https://www.mercedes-benz-tanzania.com/", description: null, gallery: [] },
  { slug: "vito-panel-van", name: "Vito Panel Van", bodyType: "Van", engine: null, fuelPer100km: null, priceTzs: null, img: "", officialUrl: "https://www.mercedes-benz-tanzania.com/", description: null, gallery: [] },
  { slug: "vito-tourer", name: "Vito Tourer", bodyType: "Van", engine: null, fuelPer100km: null, priceTzs: null, img: "", officialUrl: "https://www.mercedes-benz-tanzania.com/en/range/vito-tourer", description: null, gallery: [] },
];
