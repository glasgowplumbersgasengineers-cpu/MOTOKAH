export interface SearchSuggestion {
  text: string;
  type: "make" | "model" | "city";
  category?: string;
}

export const POPULAR_SEARCH_ITEMS: SearchSuggestion[] = [
  // Top African models
  { text: "Toyota Alphard", type: "model", category: "Toyota" },
  { text: "Toyota Harrier", type: "model", category: "Toyota" },
  { text: "Toyota Land Cruiser", type: "model", category: "Toyota" },
  { text: "Toyota Prado", type: "model", category: "Toyota" },
  { text: "Toyota Hilux", type: "model", category: "Toyota" },
  { text: "Toyota Vitz", type: "model", category: "Toyota" },
  { text: "Toyota Fielder", type: "model", category: "Toyota" },
  { text: "Toyota Probox", type: "model", category: "Toyota" },
  { text: "Toyota Rav4", type: "model", category: "Toyota" },
  { text: "Toyota Crown", type: "model", category: "Toyota" },
  { text: "Toyota Noah", type: "model", category: "Toyota" },
  { text: "Toyota Voxy", type: "model", category: "Toyota" },
  { text: "Toyota Premio", type: "model", category: "Toyota" },
  { text: "Toyota Allion", type: "model", category: "Toyota" },
  { text: "Toyota Mark X", type: "model", category: "Toyota" },
  { text: "Toyota Fortuner", type: "model", category: "Toyota" },
  { text: "Toyota HiAce", type: "model", category: "Toyota" },
  { text: "Toyota Wish", type: "model", category: "Toyota" },
  { text: "Toyota Vanguard", type: "model", category: "Toyota" },
  { text: "Toyota Passo", type: "model", category: "Toyota" },
  { text: "Toyota Ractis", type: "model", category: "Toyota" },

  // Subaru
  { text: "Subaru Forester", type: "model", category: "Subaru" },
  { text: "Subaru Outback", type: "model", category: "Subaru" },
  { text: "Subaru Impreza", type: "model", category: "Subaru" },
  { text: "Subaru Legacy", type: "model", category: "Subaru" },
  { text: "Subaru XV", type: "model", category: "Subaru" },

  // Nissan
  { text: "Nissan X-Trail", type: "model", category: "Nissan" },
  { text: "Nissan Patrol", type: "model", category: "Nissan" },
  { text: "Nissan Dualis", type: "model", category: "Nissan" },
  { text: "Nissan Note", type: "model", category: "Nissan" },
  { text: "Nissan Juke", type: "model", category: "Nissan" },
  { text: "Nissan Navara", type: "model", category: "Nissan" },
  { text: "Nissan Caravan", type: "model", category: "Nissan" },

  // Mazda
  { text: "Mazda Demio", type: "model", category: "Mazda" },
  { text: "Mazda CX-5", type: "model", category: "Mazda" },
  { text: "Mazda Axela", type: "model", category: "Mazda" },
  { text: "Mazda Atenza", type: "model", category: "Mazda" },

  // Honda
  { text: "Honda Vezel", type: "model", category: "Honda" },
  { text: "Honda Fit", type: "model", category: "Honda" },
  { text: "Honda CR-V", type: "model", category: "Honda" },

  // Mercedes & BMW & Luxury
  { text: "Mercedes-Benz G-Wagon", type: "model", category: "Mercedes-Benz" },
  { text: "Mercedes-Benz C-Class", type: "model", category: "Mercedes-Benz" },
  { text: "Mercedes-Benz E-Class", type: "model", category: "Mercedes-Benz" },
  { text: "BMW X5", type: "model", category: "BMW" },
  { text: "BMW X3", type: "model", category: "BMW" },
  { text: "Land Rover Defender", type: "model", category: "Land Rover" },
  { text: "Range Rover Sport", type: "model", category: "Land Rover" },

  // Suzuki & Mitsubishi
  { text: "Suzuki Swift", type: "model", category: "Suzuki" },
  { text: "Suzuki Jimny", type: "model", category: "Suzuki" },
  { text: "Mitsubishi Pajero", type: "model", category: "Mitsubishi" },
  { text: "Mitsubishi Outlander", type: "model", category: "Mitsubishi" },
  { text: "Mitsubishi Canter", type: "model", category: "Mitsubishi" },

  // Makes
  { text: "Toyota", type: "make" },
  { text: "Nissan", type: "make" },
  { text: "Subaru", type: "make" },
  { text: "Mazda", type: "make" },
  { text: "Honda", type: "make" },
  { text: "Mercedes-Benz", type: "make" },
  { text: "BMW", type: "make" },
  { text: "Land Rover", type: "make" },
  { text: "Mitsubishi", type: "make" },
  { text: "Suzuki", type: "make" },
  { text: "Hyundai", type: "make" },
  { text: "Isuzu", type: "make" },
  { text: "Ford", type: "make" },
  { text: "Volkswagen", type: "make" },

  // Major cities
  { text: "Dar es Salaam", type: "city" },
  { text: "Nairobi", type: "city" },
  { text: "Mombasa", type: "city" },
  { text: "Kampala", type: "city" },
  { text: "Arusha", type: "city" },
  { text: "Mwanza", type: "city" },
  { text: "Dodoma", type: "city" },
  { text: "Kigali", type: "city" },
  { text: "Zanzibar", type: "city" },
];

export function getSearchSuggestions(query: string, limit = 6): SearchSuggestion[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 1) return [];

  return POPULAR_SEARCH_ITEMS.filter((item) => {
    return item.text.toLowerCase().includes(q) || (item.category && item.category.toLowerCase().includes(q));
  }).slice(0, limit);
}
