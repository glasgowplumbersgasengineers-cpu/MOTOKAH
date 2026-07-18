export type SeoLink = {
  label: string;
  to: string;
};

export const priorityCityLinks: SeoLink[] = [
  { label: "Used cars in Dar es Salaam", to: "/city/dar-es-salaam" },
  { label: "Used cars in Arusha", to: "/city/arusha" },
  { label: "Used cars in Mwanza", to: "/city/mwanza" },
  { label: "Used cars in Dodoma", to: "/city/dodoma" },
  { label: "Used cars in Zanzibar", to: "/city/zanzibar" },
  { label: "Used cars in Nairobi", to: "/city/nairobi" },
  { label: "Used cars in Mombasa", to: "/city/mombasa" },
  { label: "Used cars in Kampala", to: "/city/kampala" },
  { label: "Used cars in Kigali", to: "/city/kigali" },
  { label: "Used cars in Addis Ababa", to: "/city/addis-ababa" },
];

export const priorityCountryLinks: SeoLink[] = [
  { label: "Cars for sale in Tanzania", to: "/country/tanzania" },
  { label: "Cars for sale in Kenya", to: "/country/kenya" },
  { label: "Cars for sale in Uganda", to: "/country/uganda" },
  { label: "Cars for sale in Rwanda", to: "/country/rwanda" },
  { label: "Cars for sale in Ethiopia", to: "/country/ethiopia" },
];

export const priorityCategoryLinks: SeoLink[] = [
  { label: "New cars in Tanzania", to: "/search?country=Tanzania&condition=New" },
  { label: "SUVs in Tanzania", to: "/search?country=Tanzania&bodyType=SUV" },
  { label: "Pickup trucks in Tanzania", to: "/search?country=Tanzania&bodyType=Pickup" },
  { label: "Commercial vehicles in Tanzania", to: "/search?country=Tanzania&vehicleType=commercial" },
  { label: "Bikes in Tanzania", to: "/search?country=Tanzania&vehicleType=bike" },
  { label: "Boats in Tanzania", to: "/search?country=Tanzania&vehicleType=boat" },
  { label: "Dealer showrooms in Tanzania", to: "/dealer-leads?country=Tanzania" },
  { label: "Dealer showrooms in Kenya", to: "/dealer-leads?country=Kenya" },
];

export const priorityModelLinks: SeoLink[] = [
  { label: "Toyota Harrier Tanzania", to: "/search?make=Toyota&model=Harrier&country=Tanzania" },
  { label: "Toyota Land Cruiser Tanzania", to: "/search?make=Toyota&model=Land%20Cruiser&country=Tanzania" },
  { label: "Toyota Hilux Tanzania", to: "/search?make=Toyota&model=Hilux&country=Tanzania" },
  { label: "Toyota Prado Tanzania", to: "/search?make=Toyota&model=Prado&country=Tanzania" },
  { label: "Toyota Fortuner Tanzania", to: "/search?make=Toyota&model=Fortuner&country=Tanzania" },
  { label: "Mazda Demio Tanzania", to: "/search?make=Mazda&model=Demio&country=Tanzania" },
  { label: "Mazda CX-5 Tanzania", to: "/search?make=Mazda&model=CX-5&country=Tanzania" },
  { label: "Subaru Forester Tanzania", to: "/search?make=Subaru&model=Forester&country=Tanzania" },
  { label: "Nissan Patrol Tanzania", to: "/search?make=Nissan&model=Patrol&country=Tanzania" },
  { label: "Honda Vezel Kenya", to: "/search?make=Honda&model=Vezel&country=Kenya" },
  { label: "Subaru Forester Kenya", to: "/search?make=Subaru&model=Forester&country=Kenya" },
  { label: "Toyota Probox Kenya", to: "/search?make=Toyota&model=Probox&country=Kenya" },
];

export const priorityDealerLinks: SeoLink[] = [
  { label: "Mgaya Motors TZ", to: "/dealer/dealer-mgayamotors" },
  { label: "Al-Husnain Motors", to: "/dealer/dealer-al_husnainmotors" },
  { label: "Khushi Motors Dar es Salaam", to: "/dealer/dealer-khushimotorsdaressalaam" },
  { label: "Ibaraki Motors Dar es Salaam", to: "/dealer/dealer-ibaraki" },
  { label: "Expert Motors TZ", to: "/dealer/dealer-expert_motors_tz" },
  { label: "Nicolette Boats", to: "/dealer/dealer-nicolette-boats" },
];

export const cityModelLinks: SeoLink[] = [
  { label: "Toyota Harrier in Dar es Salaam", to: "/search?make=Toyota&model=Harrier&city=Dar%20es%20Salaam" },
  { label: "Toyota Hilux in Dar es Salaam", to: "/search?make=Toyota&model=Hilux&city=Dar%20es%20Salaam" },
  { label: "Toyota Prado in Dar es Salaam", to: "/search?make=Toyota&model=Prado&city=Dar%20es%20Salaam" },
  { label: "Nissan Patrol in Dar es Salaam", to: "/search?make=Nissan&model=Patrol&city=Dar%20es%20Salaam" },
  { label: "Toyota Harrier in Arusha", to: "/search?make=Toyota&model=Harrier&city=Arusha" },
  { label: "Toyota Land Cruiser in Arusha", to: "/search?make=Toyota&model=Land%20Cruiser&city=Arusha" },
  { label: "Toyota Probox in Nairobi", to: "/search?make=Toyota&model=Probox&city=Nairobi" },
  { label: "Subaru Forester in Nairobi", to: "/search?make=Subaru&model=Forester&city=Nairobi" },
];
