import { TOYOTA_NEW_CARS } from "./newCarsToyota";
import { SUZUKI_NEW_CARS } from "./newCarsSuzuki";
import { MERCEDES_NEW_CARS } from "./newCarsMercedes";
import type { NewCarModel } from "./newCarsToyota";

export interface NewCarBrand {
  name: string;
  models: NewCarModel[];
}

// Every brand whose own official Tanzania site was checked directly. Toyota
// is the only one that publishes real prices; Suzuki and Mercedes-Benz show
// real models and (for Suzuki) real photos, with price honestly "Contact
// dealer" because that's what their own sites say. A brand is added here
// only once its real official site has been checked, never guessed at.
export const NEW_CAR_BRANDS: Record<string, NewCarBrand> = {
  toyota: { name: "Toyota", models: TOYOTA_NEW_CARS },
  suzuki: { name: "Suzuki", models: SUZUKI_NEW_CARS },
  "mercedes-benz": { name: "Mercedes-Benz", models: MERCEDES_NEW_CARS },
};

export const NEW_CAR_BRAND_SLUGS = Object.keys(NEW_CAR_BRANDS);
