// Typical specs for the cars people sell most in East Africa. Picking one in the Sell form
// fills make, model, body type, gearbox, fuel and common features in one tap. These are
// typical for the model, not exact for every trim, so the seller can still change anything.

export interface VehiclePreset {
  make: string;
  model: string;
  bodyType: "SUV" | "Sedan" | "Hatchback" | "Pickup" | "Van" | "Wagon" | "Coupe" | "Truck";
  transmission: "Automatic" | "Manual" | "CVT";
  fuelType: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  features: string[];
}

const BASIC = ["Air Conditioning", "Power Windows & Mirrors", "Airbags & ABS"];
const COMFORT = [...BASIC, "Bluetooth / Touchscreen", "Steering Controls"];
const PREMIUM = [...COMFORT, "Alloy Wheels", "Reverse Camera", "Push to Start", "Keyless Entry", "Leather Seats", "Cruise Control"];
const FOUR_BY_FOUR = "4WD / All-Wheel Drive";

type Row = [string, string, VehiclePreset["bodyType"], VehiclePreset["transmission"], VehiclePreset["fuelType"], string[]];

const rows: Row[] = [
  ["Toyota", "Harrier", "SUV", "Automatic", "Petrol", [...PREMIUM, "Roof Rails"]],
  ["Toyota", "Land Cruiser Prado", "SUV", "Automatic", "Diesel", [...PREMIUM, FOUR_BY_FOUR, "Roof Rails", "Fog Lights"]],
  ["Toyota", "Land Cruiser V8", "SUV", "Automatic", "Diesel", [...PREMIUM, FOUR_BY_FOUR, "Sunroof / Moonroof", "Roof Rails", "Fog Lights"]],
  ["Toyota", "Land Cruiser 70 Series", "SUV", "Manual", "Diesel", [...BASIC, FOUR_BY_FOUR]],
  ["Toyota", "RAV4", "SUV", "Automatic", "Petrol", [...COMFORT, "Alloy Wheels", "Reverse Camera", "Roof Rails"]],
  ["Toyota", "Vanguard", "SUV", "Automatic", "Petrol", [...COMFORT, "Alloy Wheels", "Roof Rails"]],
  ["Toyota", "Rush", "SUV", "Automatic", "Petrol", [...COMFORT, "Alloy Wheels"]],
  ["Toyota", "Kluger", "SUV", "Automatic", "Petrol", [...COMFORT, "Alloy Wheels", "Roof Rails"]],
  ["Toyota", "Fortuner", "SUV", "Automatic", "Diesel", [...COMFORT, FOUR_BY_FOUR, "Alloy Wheels", "Reverse Camera", "Roof Rails"]],
  ["Toyota", "C-HR", "SUV", "Automatic", "Hybrid", [...COMFORT, "Alloy Wheels", "Reverse Camera", "Push to Start"]],
  ["Toyota", "Hilux", "Pickup", "Manual", "Diesel", [...BASIC, FOUR_BY_FOUR]],
  ["Toyota", "Alphard", "Van", "Automatic", "Petrol", [...PREMIUM, "Sunroof / Moonroof"]],
  ["Toyota", "Vellfire", "Van", "Automatic", "Petrol", [...PREMIUM, "Sunroof / Moonroof"]],
  ["Toyota", "Noah", "Van", "Automatic", "Petrol", [...COMFORT, "Reverse Camera"]],
  ["Toyota", "Voxy", "Van", "Automatic", "Petrol", [...COMFORT, "Reverse Camera"]],
  ["Toyota", "Sienta", "Van", "CVT", "Petrol", COMFORT],
  ["Toyota", "Hiace", "Van", "Manual", "Diesel", BASIC],
  ["Toyota", "Probox", "Wagon", "Automatic", "Petrol", BASIC],
  ["Toyota", "Fielder", "Wagon", "CVT", "Petrol", COMFORT],
  ["Toyota", "Spacio", "Wagon", "Automatic", "Petrol", BASIC],
  ["Toyota", "Wish", "Wagon", "Automatic", "Petrol", COMFORT],
  ["Toyota", "Premio", "Sedan", "CVT", "Petrol", COMFORT],
  ["Toyota", "Allion", "Sedan", "CVT", "Petrol", COMFORT],
  ["Toyota", "Axio", "Sedan", "CVT", "Petrol", COMFORT],
  ["Toyota", "Corolla", "Sedan", "Automatic", "Petrol", COMFORT],
  ["Toyota", "Camry", "Sedan", "Automatic", "Petrol", [...COMFORT, "Alloy Wheels", "Reverse Camera"]],
  ["Toyota", "Crown", "Sedan", "Automatic", "Petrol", [...PREMIUM]],
  ["Toyota", "Mark X", "Sedan", "Automatic", "Petrol", [...COMFORT, "Alloy Wheels", "Push to Start"]],
  ["Toyota", "Belta", "Sedan", "Automatic", "Petrol", BASIC],
  ["Toyota", "Prius", "Hatchback", "CVT", "Hybrid", [...COMFORT, "Push to Start", "Reverse Camera"]],
  ["Toyota", "Aqua", "Hatchback", "CVT", "Hybrid", [...COMFORT, "Push to Start"]],
  ["Toyota", "Vitz", "Hatchback", "CVT", "Petrol", BASIC],
  ["Toyota", "IST", "Hatchback", "Automatic", "Petrol", BASIC],
  ["Toyota", "Passo", "Hatchback", "CVT", "Petrol", BASIC],
  ["Toyota", "Ractis", "Hatchback", "CVT", "Petrol", BASIC],
  ["Nissan", "X-Trail", "SUV", "CVT", "Petrol", [...COMFORT, FOUR_BY_FOUR, "Alloy Wheels", "Roof Rails"]],
  ["Nissan", "Patrol", "SUV", "Automatic", "Petrol", [...PREMIUM, FOUR_BY_FOUR, "Roof Rails"]],
  ["Nissan", "Dualis", "SUV", "CVT", "Petrol", [...COMFORT, "Alloy Wheels"]],
  ["Nissan", "Juke", "SUV", "CVT", "Petrol", [...COMFORT, "Alloy Wheels"]],
  ["Nissan", "Navara", "Pickup", "Manual", "Diesel", [...BASIC, FOUR_BY_FOUR]],
  ["Nissan", "Note", "Hatchback", "CVT", "Petrol", BASIC],
  ["Nissan", "March", "Hatchback", "CVT", "Petrol", BASIC],
  ["Nissan", "Tiida", "Hatchback", "CVT", "Petrol", BASIC],
  ["Nissan", "Sylphy", "Sedan", "CVT", "Petrol", COMFORT],
  ["Nissan", "Serena", "Van", "CVT", "Petrol", COMFORT],
  ["Nissan", "Caravan", "Van", "Manual", "Diesel", BASIC],
  ["Subaru", "Forester", "SUV", "CVT", "Petrol", [...COMFORT, FOUR_BY_FOUR, "Alloy Wheels", "Roof Rails"]],
  ["Subaru", "XV", "SUV", "CVT", "Petrol", [...COMFORT, FOUR_BY_FOUR, "Alloy Wheels"]],
  ["Subaru", "Outback", "Wagon", "CVT", "Petrol", [...COMFORT, FOUR_BY_FOUR, "Alloy Wheels", "Roof Rails"]],
  ["Subaru", "Legacy", "Wagon", "CVT", "Petrol", [...COMFORT, FOUR_BY_FOUR, "Alloy Wheels"]],
  ["Subaru", "Impreza", "Hatchback", "CVT", "Petrol", [...COMFORT, FOUR_BY_FOUR]],
  ["Mazda", "CX-5", "SUV", "Automatic", "Petrol", [...COMFORT, "Alloy Wheels", "Reverse Camera", "Push to Start"]],
  ["Mazda", "Demio", "Hatchback", "Automatic", "Petrol", BASIC],
  ["Mazda", "Axela", "Hatchback", "Automatic", "Petrol", COMFORT],
  ["Mazda", "Atenza", "Sedan", "Automatic", "Petrol", [...COMFORT, "Alloy Wheels"]],
  ["Honda", "CR-V", "SUV", "Automatic", "Petrol", [...COMFORT, "Alloy Wheels", "Reverse Camera"]],
  ["Honda", "Vezel", "SUV", "Automatic", "Hybrid", [...COMFORT, "Alloy Wheels", "Push to Start"]],
  ["Honda", "Fit", "Hatchback", "CVT", "Petrol", BASIC],
  ["Mitsubishi", "Pajero", "SUV", "Automatic", "Diesel", [...COMFORT, FOUR_BY_FOUR, "Alloy Wheels", "Roof Rails"]],
  ["Mitsubishi", "Outlander", "SUV", "CVT", "Petrol", [...COMFORT, FOUR_BY_FOUR, "Alloy Wheels"]],
  ["Mitsubishi", "L200", "Pickup", "Manual", "Diesel", [...BASIC, FOUR_BY_FOUR]],
  ["Mitsubishi", "Canter", "Truck", "Manual", "Diesel", ["Power Windows & Mirrors"]],
  ["Isuzu", "D-Max", "Pickup", "Manual", "Diesel", [...BASIC, FOUR_BY_FOUR]],
  ["Land Rover", "Range Rover Sport", "SUV", "Automatic", "Diesel", [...PREMIUM, FOUR_BY_FOUR, "Navigation / GPS", "Parking Sensors"]],
  ["Land Rover", "Range Rover Vogue", "SUV", "Automatic", "Diesel", [...PREMIUM, FOUR_BY_FOUR, "Sunroof / Moonroof", "Navigation / GPS", "Parking Sensors"]],
  ["Land Rover", "Discovery", "SUV", "Automatic", "Diesel", [...PREMIUM, FOUR_BY_FOUR, "Navigation / GPS"]],
  ["Land Rover", "Defender", "SUV", "Automatic", "Diesel", [...PREMIUM, FOUR_BY_FOUR]],
  ["Lexus", "RX", "SUV", "Automatic", "Petrol", [...PREMIUM, "Navigation / GPS", "Parking Sensors"]],
  ["Lexus", "LX", "SUV", "Automatic", "Petrol", [...PREMIUM, FOUR_BY_FOUR, "Sunroof / Moonroof", "Navigation / GPS"]],
  ["Mercedes-Benz", "C-Class", "Sedan", "Automatic", "Petrol", [...PREMIUM, "Parking Sensors"]],
  ["Mercedes-Benz", "E-Class", "Sedan", "Automatic", "Petrol", [...PREMIUM, "Navigation / GPS", "Parking Sensors"]],
  ["Mercedes-Benz", "GLE", "SUV", "Automatic", "Diesel", [...PREMIUM, FOUR_BY_FOUR, "Navigation / GPS", "Parking Sensors"]],
  ["BMW", "X5", "SUV", "Automatic", "Diesel", [...PREMIUM, FOUR_BY_FOUR, "Navigation / GPS", "Parking Sensors"]],
  ["BMW", "3 Series", "Sedan", "Automatic", "Petrol", [...PREMIUM, "Navigation / GPS"]],
  ["Volkswagen", "Golf", "Hatchback", "Automatic", "Petrol", COMFORT],
  ["Volkswagen", "Tiguan", "SUV", "Automatic", "Petrol", [...COMFORT, "Alloy Wheels", "Parking Sensors"]],
  ["Volkswagen", "Touareg", "SUV", "Automatic", "Diesel", [...PREMIUM, FOUR_BY_FOUR, "Navigation / GPS"]],
  ["Suzuki", "Swift", "Hatchback", "Automatic", "Petrol", BASIC],
  ["Suzuki", "Escudo", "SUV", "Automatic", "Petrol", [...COMFORT, FOUR_BY_FOUR]],
  ["Hyundai", "Tucson", "SUV", "Automatic", "Petrol", [...COMFORT, "Alloy Wheels", "Reverse Camera"]],
];

export const vehiclePresets: VehiclePreset[] = rows.map(([make, model, bodyType, transmission, fuelType, features]) => ({
  make,
  model,
  bodyType,
  transmission,
  fuelType,
  features: [...new Set(features)],
}));

// "harrier", "toyota har", "prado", "land cruiser" all find the right car.
export function searchVehiclePresets(query: string, limit = 6): VehiclePreset[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return vehiclePresets
    .filter((p) => {
      const name = `${p.make} ${p.model}`.toLowerCase();
      return words.every((w) => name.includes(w));
    })
    .sort((a, b) => {
      const q = words.join(" ");
      const score = (p: VehiclePreset) => (p.model.toLowerCase().startsWith(q) ? 0 : 1);
      return score(a) - score(b);
    })
    .slice(0, limit);
}
