import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { useSearchListings } from "@/hooks/useSearchListings";
import { Button } from "@/components/ui/button";
import { IconLoader2 } from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";
import { jsonLdScript, breadcrumbJsonLd, faqJsonLd } from "@/lib/structuredData";
import { robotsContentForCount } from "@/lib/pageListingCounts";

const MAKE_DISPLAY: Record<string, string> = {
  toyota: "Toyota", nissan: "Nissan", subaru: "Subaru", mitsubishi: "Mitsubishi",
  honda: "Honda", mazda: "Mazda", isuzu: "Isuzu", mercedes: "Mercedes-Benz",
  bmw: "BMW", kia: "Kia", hyundai: "Hyundai", suzuki: "Suzuki",
};

interface CountryMakeData {
  countryName: string;
  currency: string;
  authority: string;
  cities: string[];
  citySlugs: string[];
  guide: string;
  priceRange: string;
  popularModels: string[];
  faqs: { q: string; a: string }[];
}

const DATA: Record<string, Record<string, CountryMakeData>> = {
  kenya: {
    toyota: {
      countryName: "Kenya",
      currency: "KES",
      authority: "KRA (Kenya Revenue Authority) and NTSA",
      cities: ["Nairobi", "Mombasa", "Nakuru", "Kisumu"],
      citySlugs: ["nairobi", "mombasa", "nakuru", "kisumu"],
      priceRange: "KES 350,000 to KES 15,000,000",
      popularModels: ["Probox", "Fielder", "Land Cruiser", "Hilux", "Prado", "Vitz", "Harrier", "Hiace"],
      guide: `Toyota is Kenya's dominant car brand, accounting for over 40% of vehicles on the road. The Kenyan market is served primarily by Japanese imports arriving through Mombasa port, with Kirinyaga Road in Nairobi acting as the country's main dealer strip.

The most popular Toyota models in Kenya reflect the market's practical needs. The Probox and Fielder are workhorses for small businesses and families, priced from KES 400,000 to KES 900,000 for 2010-2016 models. The Toyota Land Cruiser 70 and 100 Series command premium prices from KES 2,500,000 upwards due to their dominance on upcountry and rural roads. For urban families, the Toyota Harrier (KES 1,200,000 to KES 3,500,000) and Prado (KES 3,000,000 to KES 12,000,000) are aspirational choices.

Kenya's 8-year vehicle age rule for imports means most available stock is 2014 onwards. When buying, always check the NTSA portal to verify ownership and confirm the vehicle has a valid inspection certificate. KRA import duty varies by engine size and year, so factor this into your budget if buying a fresh import rather than a locally registered vehicle.

Toyota parts are available in every Kenyan town. Garages on Kirinyaga Road, Ngong Road, and Industrial Area in Nairobi handle everything from routine service to major repairs at competitive rates. This availability makes Toyota the lowest total-cost-of-ownership choice across Kenya.`,
      faqs: [
        { q: "What is the Toyota Probox price in Kenya?", a: "Toyota Probox prices in Kenya range from KES 400,000 for older 2008-2010 models to KES 900,000 for clean 2015-2016 models. Most are sourced from Japan via Mombasa port. The 1,300cc and 1,500cc engines are both available." },
        { q: "What is the cheapest Toyota car in Kenya?", a: "The Toyota Vitz starts from KES 350,000 for 2007-2010 models, making it the most affordable Toyota commonly available in Kenya. The 1,000cc engine gives excellent fuel economy for Nairobi city driving." },
        { q: "How much is Toyota Land Cruiser in Kenya?", a: "Toyota Land Cruiser prices in Kenya range from KES 2,500,000 for older 80 Series or 100 Series models to KES 15,000,000 for late-model 200 Series. The 70 Series pickup starts from around KES 4,000,000." },
        { q: "Is Toyota better than Subaru in Kenya?", a: "Both are popular. Toyota wins on parts availability and low running costs, especially upcountry. Subaru wins on all-weather traction and driving experience in the highlands. For mixed urban and rural use, Toyota is typically the lower-cost choice long-term." },
      ],
    },
    nissan: {
      countryName: "Kenya",
      currency: "KES",
      authority: "KRA and NTSA",
      cities: ["Nairobi", "Mombasa", "Nakuru", "Kisumu"],
      citySlugs: ["nairobi", "mombasa", "nakuru", "kisumu"],
      priceRange: "KES 300,000 to KES 8,000,000",
      popularModels: ["X-Trail", "Note", "Tiida", "Navara", "Hardbody", "Patrol"],
      guide: `Nissan is Kenya's second most popular imported brand after Toyota. The wide range of models available covers everything from budget hatchbacks to heavy-duty pickups, making Nissan a strong choice across all buyer segments.

The Nissan Note is Kenya's most popular affordable Nissan, priced from KES 350,000 to KES 700,000 for 2012-2017 models. Its compact size suits Nairobi's congested roads and the 1,200cc engine delivers low fuel bills. The Nissan X-Trail is the family SUV of choice, priced KES 900,000 to KES 2,500,000 for 2005-2015 models, offering genuine off-road capability and good load space.

For commercial and agricultural buyers, the Nissan Navara (KES 1,500,000 to KES 5,000,000) and older Nissan Hardbody (from KES 500,000) are proven workhorses. The Patrol remains the status off-roader in northern and arid counties.

NTSA compliance is the same for Nissan as for any other imported brand: verify chassis number, check logbook ownership, and confirm import duty has been paid on fresh imports. Nissan parts are widely available in Nairobi and Mombasa, with Coast Auto Spares and similar dealers stocking most common parts.`,
      faqs: [
        { q: "What is the Nissan X-Trail price in Kenya?", a: "Nissan X-Trail prices in Kenya range from KES 900,000 for 2005-2008 models to KES 2,500,000 for 2013-2015 T32 models. The T30 and T31 generations are the most common on the Kenyan market." },
        { q: "Is Nissan Note a good car in Kenya?", a: "Yes. The Nissan Note is popular in Kenya for its fuel efficiency (around 18-20km/L), low purchase price from KES 350,000, and low running costs. The 1,200cc engine is well-suited to Nairobi city driving." },
        { q: "Which Nissan holds its value best in Kenya?", a: "The Nissan Navara and X-Trail hold value best in Kenya. The Navara is always in demand for commercial use. The Patrol holds exceptional value in northern Kenya where it is the vehicle of choice for NGOs and government agencies." },
      ],
    },
    subaru: {
      countryName: "Kenya",
      currency: "KES",
      authority: "KRA and NTSA",
      cities: ["Nairobi", "Nakuru", "Kisumu", "Mombasa"],
      citySlugs: ["nairobi", "nakuru", "kisumu", "mombasa"],
      priceRange: "KES 600,000 to KES 5,000,000",
      popularModels: ["Forester", "Impreza", "Legacy", "Outback", "XV"],
      guide: `Kenya has a stronger Subaru following than any other East African country. The Subaru Forester and Impreza are iconic on Kenyan roads, particularly in the highlands around Nairobi, Nakuru, and the Rift Valley, where the symmetrical all-wheel drive system is valued for wet-season performance.

The Subaru Forester is the most popular model, priced from KES 700,000 for 2005-2008 SG series to KES 3,500,000 for 2018-2020 SK series. The older Impreza (wagon or sedan) starts from KES 600,000 and is popular among young professional buyers. The Legacy and Outback command premium prices due to their larger engines and stronger all-terrain capability.

Subaru ownership in Kenya comes with higher fuel costs compared to Toyota, as most models run 1,800cc to 2,500cc engines with relatively lower fuel economy. However, the resale market is strong, particularly for clean, well-maintained Foresters. Subaru-specialist garages are well-established in Nairobi's Industrial Area, Westlands, and along Ngong Road.

When buying a Subaru in Kenya, insist on checking for head gasket history on pre-2010 models, confirm timing belt service has been done, and verify NTSA registration status. Subaru parts take slightly longer to source than Toyota but are available through importers on Kirinyaga Road.`,
      faqs: [
        { q: "What is the Subaru Forester price in Kenya?", a: "Subaru Forester prices in Kenya range from KES 700,000 for 2005-2008 SG series models to KES 3,500,000 for newer 2018-2020 models. The SF and SG generations are the most affordable and widely available." },
        { q: "Why is Subaru popular in Kenya?", a: "Subaru's symmetrical all-wheel drive is prized on Kenya's highland roads, which get slippery during rainy seasons. The Forester and Impreza also offer more driving engagement than equivalent Toyota models, appealing to younger professionals in Nairobi." },
        { q: "Is Subaru expensive to maintain in Kenya?", a: "Subaru parts cost more than Toyota equivalents and some require ordering from Japan. Fuel costs are higher due to larger engines. However, specialist Subaru garages in Nairobi are experienced and repair costs are manageable for routine servicing." },
      ],
    },
    honda: {
      countryName: "Kenya",
      currency: "KES",
      authority: "KRA and NTSA",
      cities: ["Nairobi", "Mombasa", "Nakuru"],
      citySlugs: ["nairobi", "mombasa", "nakuru"],
      priceRange: "KES 400,000 to KES 5,000,000",
      popularModels: ["Fit", "Vezel", "CR-V", "Civic", "Accord"],
      guide: `Honda has a loyal following in Kenya, particularly for the Fit (also known as Jazz) and the Vezel HR-V crossover. Both models offer outstanding fuel economy and reliable city performance, making them popular in Nairobi's stop-start traffic.

The Honda Fit is Kenya's favourite Honda, priced from KES 400,000 for 2007-2010 GE generation models. The hybrid version (priced from KES 550,000) is increasingly popular as fuel costs rise. The Honda Vezel arrived in Kenya from around 2014 and sells from KES 1,200,000 to KES 2,500,000, appealing to buyers wanting a crossover with car-like fuel economy. The CR-V competes with the Toyota RAV4 and Nissan X-Trail from KES 1,500,000 upwards.

Honda models come to Kenya primarily as Japanese imports through Mombasa. NTSA registration and KRA duty apply as standard. Parts availability is generally good in Nairobi, though slightly less widespread than Toyota. Mechanics with Honda experience are available on Kirinyaga Road and in Industrial Area.`,
      faqs: [
        { q: "What is the Honda Fit price in Kenya?", a: "Honda Fit prices in Kenya range from KES 400,000 for 2007-2010 models to KES 900,000 for 2015-2017 models. The Fit Hybrid starts from around KES 550,000 for older 2010-2012 models and offers around 22km/L in city driving." },
        { q: "Is Honda Vezel good for Kenyan roads?", a: "Yes. The Honda Vezel's ground clearance is adequate for Nairobi roads and most Kenyan highways. It is not recommended for rough upcountry use but handles city roads and tarmac highways well. Fuel economy is excellent at 16-20km/L." },
      ],
    },
    mitsubishi: {
      countryName: "Kenya",
      currency: "KES",
      authority: "KRA and NTSA",
      cities: ["Nairobi", "Mombasa", "Nakuru"],
      citySlugs: ["nairobi", "mombasa", "nakuru"],
      priceRange: "KES 500,000 to KES 9,000,000",
      popularModels: ["Pajero", "L200", "Outlander", "Galant"],
      guide: `Mitsubishi has a strong niche in the Kenyan market, anchored by the Pajero and L200 pickup. Both models are valued for heavy-duty reliability in conditions where lighter vehicles struggle.

The Mitsubishi Pajero is priced from KES 800,000 for older gen2 and gen3 models to KES 9,000,000 for late-model Gen4 variants with low mileage. NGOs, tour operators, and family buyers who need genuine off-road capability alongside Nairobi comfort choose the Pajero as their primary vehicle. The L200 Triton pickup (KES 1,500,000 to KES 5,000,000) serves the commercial and agricultural market alongside the Toyota Hilux.

The Mitsubishi Outlander is a more affordable family SUV option at KES 1,000,000 to KES 2,500,000. Parts availability for Mitsubishi is generally good in Nairobi, with specialist importers stocking Pajero and L200 components. When buying a Pajero in Kenya, check the transfer case and differentials carefully, as these are expensive to repair if worn.`,
      faqs: [
        { q: "What is the Mitsubishi Pajero price in Kenya?", a: "Mitsubishi Pajero prices in Kenya start from KES 800,000 for 1999-2006 Gen2/Gen3 models and reach KES 9,000,000 for late 2015-2019 Gen4 models in top condition. The 3.2-litre diesel Gen4 is the most sought-after version." },
        { q: "Is Mitsubishi L200 better than Toyota Hilux in Kenya?", a: "Both are excellent. The Hilux has a larger dealer network and wider parts availability. The L200 Triton is priced slightly lower for comparable years and condition. For remote use far from Nairobi, the Hilux is the safer choice due to part sourcing." },
      ],
    },
    isuzu: {
      countryName: "Kenya",
      currency: "KES",
      authority: "KRA and NTSA",
      cities: ["Nairobi", "Mombasa", "Nakuru"],
      citySlugs: ["nairobi", "mombasa", "nakuru"],
      priceRange: "KES 1,500,000 to KES 12,000,000",
      popularModels: ["D-Max", "NPR", "MU-7"],
      guide: `Isuzu is Kenya's leading commercial vehicle brand. Isuzu East Africa has operated a local assembly plant in Nairobi since the 1970s, which means the brand has established service infrastructure across the entire country.

The Isuzu D-Max double cab is the pick of the range for buyers who need a pickup that can handle Kenya's varied terrain while still being comfortable for everyday use. Prices range from KES 1,500,000 for older 2010-2014 models to KES 7,000,000 for recent 2020-2023 models. The D-Max competes directly with the Toyota Hilux and Mitsubishi L200.

For commercial fleet buyers, Isuzu NPR light trucks (from KES 3,000,000) are Kenya's go-to delivery and logistics vehicle. Isuzu East Africa's dealer network covers Nairobi, Mombasa, Nakuru, Kisumu, Eldoret, and most major towns, giving it the best after-sales coverage of any commercial brand in the country.`,
      faqs: [
        { q: "What is the Isuzu D-Max price in Kenya?", a: "Isuzu D-Max prices in Kenya range from KES 1,500,000 for 2010-2013 models to KES 7,000,000 for 2021-2023 models. Brand-new D-Max from Isuzu EA dealers starts from around KES 5,500,000." },
        { q: "Does Isuzu have a dealer in Kenya?", a: "Yes. Isuzu East Africa is based in Mombasa Road, Nairobi, with authorised dealers in Mombasa, Nakuru, Kisumu, Eldoret, Thika, Nyeri, and other major towns. They offer full warranty and service support." },
      ],
    },
  },

  tanzania: {
    toyota: {
      countryName: "Tanzania",
      currency: "TZS",
      authority: "TRA (Tanzania Revenue Authority) and SUMATRA",
      cities: ["Dar es Salaam", "Arusha", "Mwanza"],
      citySlugs: ["dar-es-salaam", "arusha", "mwanza"],
      priceRange: "TZS 8,000,000 to TZS 120,000,000",
      popularModels: ["Land Cruiser", "Hilux", "Vitz", "IST", "Prado", "Hiace"],
      guide: `Toyota is the undisputed market leader in Tanzania, accounting for more than half of all vehicles on Tanzanian roads. The brand's dominance reflects Toyota's proven performance on Tanzania's mix of tarmac highways and unpaved upcountry roads.

The Toyota Vitz and IST are the most accessible Toyotas in Tanzania, priced from TZS 8,000,000 to TZS 20,000,000 for 2005-2015 models. Both offer low fuel consumption and easy urban maneuverability in Dar es Salaam's congested Morogoro Road and Nyerere Road traffic. The Toyota Hilux (TZS 25,000,000 to TZS 80,000,000) dominates rural and commercial use, trusted by farmers, NGOs, and construction companies from Mwanza to Mtwara.

The Toyota Land Cruiser 70 and 76 Series are permanent fixtures on Tanzania's roads, priced from TZS 40,000,000 upwards. For buyers in Arusha near the safari circuit, a well-maintained Land Cruiser or Prado commands premium prices due to constant demand from tour operators.

Import duty in Tanzania is calculated by TRA on CIF (Cost, Insurance, Freight) value. Duty rates vary from 25% to 100%+ depending on engine size and vehicle age. Always verify duty payment is complete and SUMATRA registration is current before purchasing any vehicle in Tanzania.`,
      faqs: [
        { q: "What is the Toyota Vitz price in Tanzania?", a: "Toyota Vitz prices in Tanzania range from TZS 8,000,000 for older 2005-2008 models to TZS 18,000,000 for 2012-2015 models in clean condition. Prices vary by mileage, condition, and whether the car is locally registered or fresh import." },
        { q: "How much is a Toyota Land Cruiser in Tanzania?", a: "Toyota Land Cruiser prices in Tanzania start from TZS 40,000,000 for older 70 Series models and reach TZS 120,000,000 for recent 200 Series models with low mileage. The 76 Series wagon is particularly popular for rural and NGO use." },
        { q: "What documents do I need when buying a car in Tanzania?", a: "You need the original title deed (logbook), TIN (Tax Identification Number) for both buyer and seller, TRA import duty clearance certificate for imported vehicles, and SUMATRA registration. Have the chassis number verified against all documents before paying." },
      ],
    },
    nissan: {
      countryName: "Tanzania",
      currency: "TZS",
      authority: "TRA and SUMATRA",
      cities: ["Dar es Salaam", "Arusha", "Mwanza"],
      citySlugs: ["dar-es-salaam", "arusha", "mwanza"],
      priceRange: "TZS 7,000,000 to TZS 60,000,000",
      popularModels: ["X-Trail", "Note", "Tiida", "Navara", "Serena"],
      guide: `Nissan holds a strong second position in Tanzania's car market behind Toyota. The brand benefits from a loyal buyer base built on the reliability and parts availability that Japanese imports bring to the Tanzanian market.

The Nissan Note is the most affordable commonly available Nissan in Tanzania, priced from TZS 7,000,000 for 2007-2010 models. Its 1,200cc engine suits Dar es Salaam's city traffic well. The Nissan X-Trail (TZS 15,000,000 to TZS 45,000,000) is the family SUV choice, with the T31 generation particularly popular for its balance of off-road capability and running cost. The Nissan Serena minivan (TZS 12,000,000 to TZS 35,000,000) handles Tanzania's large family sizes.

For commercial use, the Nissan Navara competes with the Toyota Hilux from TZS 25,000,000 upwards. Parts sourcing in Dar es Salaam is straightforward along Morogoro Road and Kariakoo area. TRA documentation requirements are the same for Nissan as all other imports: verify CIF value, duty clearance, and SUMATRA registration before any purchase.`,
      faqs: [
        { q: "What is the Nissan X-Trail price in Tanzania?", a: "Nissan X-Trail prices in Tanzania range from TZS 15,000,000 for 2005-2008 T30 models to TZS 45,000,000 for 2012-2015 T31 models in clean condition. The T32 (2014 onwards) commands higher prices from TZS 35,000,000." },
        { q: "Is Nissan easy to repair in Tanzania?", a: "Yes. Nissan parts are widely available in Dar es Salaam's Kariakoo and Morogoro Road dealer areas, and in Arusha. Most Tanzanian mechanics are experienced with Nissan vehicles. Running costs are comparable to Toyota." },
      ],
    },
    mitsubishi: {
      countryName: "Tanzania",
      currency: "TZS",
      authority: "TRA and SUMATRA",
      cities: ["Dar es Salaam", "Arusha", "Mwanza"],
      citySlugs: ["dar-es-salaam", "arusha", "mwanza"],
      priceRange: "TZS 15,000,000 to TZS 80,000,000",
      popularModels: ["Pajero", "L200", "Outlander"],
      guide: `Mitsubishi is an established brand in Tanzania, popular with NGOs, tour operators in Arusha, and commercial buyers who need off-road performance at a lower price than Toyota Land Cruiser.

The Mitsubishi Pajero is priced from TZS 15,000,000 for older gen2 models to TZS 80,000,000 for clean late-model gen4 variants. In Arusha, near Kilimanjaro and the northern safari circuit, Pajero demand remains strong among operators needing a capable 4x4 at less than Land Cruiser cost. The Mitsubishi L200 (TZS 25,000,000 to TZS 70,000,000) competes with the Hilux for agricultural and commercial use.

TRA import duty on Mitsubishi follows the same rules as other vehicles. Verify chassis number and duty clearance certificate before purchase. Parts availability in Dar es Salaam is reasonable, with Kariakoo suppliers stocking common Pajero and L200 components.`,
      faqs: [
        { q: "Is Mitsubishi Pajero good for Tanzania roads?", a: "Yes. The Pajero handles Tanzania's mix of tarmac, gravel, and rough upcountry tracks well, especially the 3.2-litre diesel gen4 with full-time 4WD. For serious off-road use in remote areas, carry spare parts as Mitsubishi availability thins out far from Dar es Salaam." },
      ],
    },
  },

  uganda: {
    toyota: {
      countryName: "Uganda",
      currency: "UGX",
      authority: "URA (Uganda Revenue Authority)",
      cities: ["Kampala", "Entebbe", "Jinja"],
      citySlugs: ["kampala", "entebbe", "jinja"],
      priceRange: "UGX 8,000,000 to UGX 180,000,000",
      popularModels: ["Harrier", "Land Cruiser Prado", "Hiace", "Hilux", "Land Cruiser", "Corolla"],
      guide: `Toyota dominates Uganda's car market as completely as it does any other East African country. Kampala's main dealer areas on Jinja Road, Kireka, and Industrial Area are lined with Toyota stock, ranging from budget Corollas to top-spec Land Cruisers.

The Toyota Harrier is a Ugandan market favourite not seen as prominently elsewhere in East Africa. Priced from UGX 25,000,000 to UGX 80,000,000 for 2004-2013 models, the Harrier's combination of comfort and ground clearance suits Kampala's variable road conditions. The Toyota Land Cruiser Prado (UGX 55,000,000 to UGX 180,000,000) is the prestige 4x4 choice for business owners and families.

For commercial use, Toyota Hiace minibuses (UGX 20,000,000 to UGX 70,000,000) are the backbone of Uganda's public transport system. The Hilux double cab (UGX 35,000,000 to UGX 100,000,000) serves agriculture and construction.

Uganda has no age restriction on vehicle imports, unlike Kenya's 8-year rule. This means older Toyota Land Cruisers and Hilux models in good condition are legally importable, giving buyers more price range options. Always verify URA import records, confirm the chassis number, and arrange a mechanical inspection before finalising any purchase.`,
      faqs: [
        { q: "What is the Toyota Harrier price in Uganda?", a: "Toyota Harrier prices in Uganda range from UGX 25,000,000 for 2004-2007 ACU15 models to UGX 80,000,000 for 2013-2017 ZSU6 models. The ACU35 (2003-2013) in clean condition typically sells for UGX 30,000,000 to UGX 55,000,000." },
        { q: "How much is a Toyota Land Cruiser in Uganda?", a: "Toyota Land Cruiser prices in Uganda range from UGX 40,000,000 for older 80 Series or 100 Series to UGX 180,000,000 for late-model 200 Series. The 70 Series pickup starts from UGX 50,000,000." },
        { q: "Does Uganda have a vehicle age restriction on imports?", a: "No. Uganda does not enforce a strict vehicle age restriction for imports, unlike Kenya's 8-year rule. This allows buyers to import older vehicles that are still road-legal. However, URA calculates duty on vehicle value, so older vehicles attract lower duty than newer ones." },
      ],
    },
    nissan: {
      countryName: "Uganda",
      currency: "UGX",
      authority: "URA",
      cities: ["Kampala", "Entebbe", "Jinja"],
      citySlugs: ["kampala", "entebbe", "jinja"],
      priceRange: "UGX 12,000,000 to UGX 80,000,000",
      popularModels: ["X-Trail", "Note", "Patrol", "Navara"],
      guide: `Nissan is Uganda's second most popular brand, with a strong following for the X-Trail, Note, and Patrol. Kampala's car market on Jinja Road stocks a wide range of Nissan models imported from Japan and the UAE.

The Nissan X-Trail is particularly popular in Uganda for families who need genuine 4WD at a lower price than Land Cruiser Prado. Prices range from UGX 20,000,000 for 2005-2008 T30 models to UGX 55,000,000 for 2012-2015 T31 models. The T32 generation from 2014 commands UGX 45,000,000 to UGX 80,000,000. For budget buyers, the Nissan Note (UGX 12,000,000 to UGX 25,000,000) offers Nairobi-level fuel economy in Kampala's congested roads.

The Nissan Patrol is the serious off-roader for upcountry Uganda, north and west of Kampala where roads become extremely rough. URA import paperwork is the same for Nissan as all other vehicles: import declaration, chassis verification, and roadworthiness check.`,
      faqs: [
        { q: "What is the Nissan X-Trail price in Uganda?", a: "Nissan X-Trail prices in Uganda range from UGX 20,000,000 for 2005-2008 T30 models to UGX 55,000,000 for 2012-2015 T31 models. The newer T32 generation (2014 onwards) starts from UGX 45,000,000." },
        { q: "Which is better in Uganda, Toyota or Nissan?", a: "Toyota has better parts availability nationwide, especially outside Kampala. Nissan is a strong choice in Kampala where parts are readily available on Jinja Road. For upcountry use in remote areas, Toyota is the safer long-term option." },
      ],
    },
    mitsubishi: {
      countryName: "Uganda",
      currency: "UGX",
      authority: "URA",
      cities: ["Kampala", "Entebbe", "Jinja"],
      citySlugs: ["kampala", "entebbe", "jinja"],
      priceRange: "UGX 18,000,000 to UGX 120,000,000",
      popularModels: ["Pajero", "L200", "Outlander"],
      guide: `Mitsubishi is well-established in Uganda, driven by strong Pajero demand from NGOs operating in northern Uganda, western Uganda, and cross-border into South Sudan and DRC. The Pajero's proven reliability in extreme off-road conditions makes it the top alternative to Land Cruiser for organisations operating in Uganda's more remote regions.

Pajero prices in Uganda range from UGX 18,000,000 for older gen2 models to UGX 120,000,000 for late gen4 variants in excellent condition. The Mitsubishi L200 double cab competes with the Toyota Hilux from UGX 35,000,000. Parts availability in Kampala is good, with suppliers in Industrial Area and Kireka stocking common Pajero and L200 items.`,
      faqs: [
        { q: "What is the Mitsubishi Pajero price in Uganda?", a: "Mitsubishi Pajero prices in Uganda range from UGX 18,000,000 for 1999-2006 gen2/gen3 models to UGX 120,000,000 for clean 2014-2019 gen4 models with low mileage." },
      ],
    },
  },

  rwanda: {
    toyota: {
      countryName: "Rwanda",
      currency: "RWF",
      authority: "RRA (Rwanda Revenue Authority)",
      cities: ["Kigali"],
      citySlugs: ["kigali"],
      priceRange: "RWF 6,000,000 to RWF 80,000,000",
      popularModels: ["Land Cruiser Prado", "Corolla", "RAV4", "Hilux", "Harrier"],
      guide: `Rwanda's strict vehicle age restriction (maximum 10 years for most private passenger vehicles) shapes its Toyota market significantly. This means the available Toyota stock is generally 2014 and newer, giving Rwanda one of the youngest average vehicle fleets in East Africa.

The Toyota Corolla is Rwanda's most popular affordable Toyota, priced from RWF 6,000,000 for 2012-2015 models to RWF 18,000,000 for 2018-2021 models. The Toyota Prado (RWF 25,000,000 to RWF 80,000,000) is Kigali's prestige SUV, visible throughout the city's business district and diplomatic quarter. The Toyota RAV4 competes in the mid-SUV segment from RWF 15,000,000.

Rwanda's hilly terrain is a significant buying consideration. Kigali sits at over 1,500 metres elevation with steep roads throughout the city. Before buying any vehicle in Rwanda, test it on a steep hill at low speed to check clutch, engine, and transmission condition. Turbo diesel engines handle Kigali's hills better than smaller petrol engines.

RRA calculates duty on CIF value. Import procedures in Rwanda are well-organised compared to some neighbouring countries, making the buying process more transparent.`,
      faqs: [
        { q: "What is the Toyota Prado price in Rwanda?", a: "Toyota Land Cruiser Prado prices in Rwanda range from RWF 25,000,000 for 2013-2015 150 Series models to RWF 80,000,000 for 2018-2021 models in top condition. Rwanda's age restrictions mean most available Prados are 2013 onwards." },
        { q: "Can I import an old Toyota to Rwanda?", a: "No. Rwanda restricts most private passenger vehicle imports to 10 years old or less. Some categories have tighter restrictions. This is enforced at customs, so verify the vehicle's year before committing to any import." },
      ],
    },
    honda: {
      countryName: "Rwanda",
      currency: "RWF",
      authority: "RRA",
      cities: ["Kigali"],
      citySlugs: ["kigali"],
      priceRange: "RWF 7,000,000 to RWF 30,000,000",
      popularModels: ["Fit", "Vezel", "CR-V", "Civic"],
      guide: `Honda is a strong second-choice brand in Rwanda, benefiting from the country's age restrictions that favour newer, fuel-efficient vehicles. The Honda Fit and Vezel are particularly suited to Kigali's urban environment.

The Honda Fit is priced from RWF 7,000,000 for 2012-2015 models, offering excellent fuel economy in Kigali's hilly stop-start traffic. The Fit Hybrid is a natural choice for a city where fuel costs are significant. The Honda Vezel (RWF 12,000,000 to RWF 28,000,000) offers crossover ground clearance without the fuel costs of a larger SUV.

All Honda imports into Rwanda must meet the 10-year age limit. Newer models (2014 onwards) are well-suited to Rwanda's environmental standards and pass the technical inspection requirements easily. Honda parts are available in Kigali's Gisozi and Kimironko markets.`,
      faqs: [
        { q: "What is the Honda Fit price in Rwanda?", a: "Honda Fit prices in Rwanda range from RWF 7,000,000 for 2012-2015 models to RWF 20,000,000 for 2018-2021 models. The Fit Hybrid commands a premium of around RWF 2,000,000 over equivalent petrol models." },
      ],
    },
  },

  ethiopia: {
    toyota: {
      countryName: "Ethiopia",
      currency: "ETB",
      authority: "ERCA (Ethiopian Revenue and Customs Authority)",
      cities: ["Addis Ababa"],
      citySlugs: ["addis-ababa"],
      priceRange: "ETB 800,000 to ETB 8,000,000",
      popularModels: ["Land Cruiser", "Hilux", "Corolla", "Prado"],
      guide: `Toyota's dominance in Ethiopia is even more pronounced than in neighbouring East African countries. The Land Cruiser 70 Series is effectively the national vehicle for rural Ethiopia, trusted across the highlands, Rift Valley, and remote regions where roads are unpaved and parts availability far from cities.

Ethiopia historically had some of Africa's highest vehicle import duties, meaning car prices in ETB are significantly higher relative to regional peers. The Toyota Land Cruiser 70 starts from ETB 1,500,000 for older models and reaches ETB 8,000,000 for cleaner, more recent variants. The Corolla is the most accessible Toyota, priced from ETB 800,000. Prado prices begin from ETB 2,500,000.

ERCA handles customs clearance and duties. The process is detailed and requires a licensed broker for imported vehicles. Ethiopia's government has in recent years relaxed some import restrictions, bringing in more inventory. Addis Ababa's main car market is concentrated around Mexico Square (Meskel Square), Kazanchis, and the Bole area.

Always verify ERCA clearance documents, chassis number match, and mechanical condition before purchasing in Ethiopia. A pre-purchase inspection from a Addis Ababa mechanic experienced with your chosen model is strongly recommended.`,
      faqs: [
        { q: "What is the Toyota Land Cruiser price in Ethiopia?", a: "Toyota Land Cruiser prices in Ethiopia start from ETB 1,500,000 for older 70 Series models and reach ETB 8,000,000 for lower-mileage 200 Series variants. Prices in ETB change frequently given exchange rate fluctuations; always confirm current USD equivalent with the seller." },
        { q: "Are import duties high in Ethiopia?", a: "Yes. Ethiopia has historically applied high import duties plus VAT and excise on vehicles, which is why car prices are elevated compared to Kenya or Tanzania. Buyers should budget for full landed cost including all taxes when considering any imported vehicle." },
      ],
    },
    isuzu: {
      countryName: "Ethiopia",
      currency: "ETB",
      authority: "ERCA",
      cities: ["Addis Ababa"],
      citySlugs: ["addis-ababa"],
      priceRange: "ETB 1,500,000 to ETB 10,000,000",
      popularModels: ["D-Max", "NPR", "Trooper"],
      guide: `Isuzu is the dominant commercial vehicle brand in Ethiopia. Isuzu trucks are the backbone of Ethiopia's logistics and agricultural supply chain, moving goods across the country's mountainous terrain where reliability under load is non-negotiable.

The Isuzu D-Max pickup starts from ETB 2,500,000 for older 2010-2014 models, competing with the Toyota Hilux for commercial and farm use. Isuzu NPR light trucks (ETB 4,000,000 to ETB 10,000,000) are widely used for urban and inter-city cargo delivery in Addis Ababa and major regional towns. The older Isuzu Trooper 4x4 remains popular in rural Ethiopia for its robustness.

ERCA documentation applies to all commercial vehicle purchases. Isuzu parts are available in Addis Ababa's Mexico Square area and through specialist importers. For fleet buyers, Isuzu's proven reliability across Ethiopia's elevation and road conditions makes it the preferred commercial choice.`,
      faqs: [
        { q: "What is the Isuzu D-Max price in Ethiopia?", a: "Isuzu D-Max prices in Ethiopia range from ETB 2,500,000 for 2010-2014 models to ETB 8,000,000 for 2019-2022 models. Brand-new D-Max from authorised dealers starts from around ETB 7,000,000." },
      ],
    },
  },
};

export default function CountryMakeLandingPage() {
  const { country, make } = useParams<{ country: string; make: string }>();
  const countrySlug = country?.toLowerCase() || "";
  const makeSlug = make?.toLowerCase() || "";

  const makeName = MAKE_DISPLAY[makeSlug] || makeSlug.charAt(0).toUpperCase() + makeSlug.slice(1);
  const countryData = DATA[countrySlug]?.[makeSlug];

  const countryName = countryData?.countryName
    || countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1);

  const title = `${makeName} Cars for Sale in ${countryName} | Motokah`;
  const description = countryData
    ? `Buy a used ${makeName} in ${countryName}. Browse verified listings: ${countryData.popularModels.slice(0, 3).join(", ")}. Prices ${countryData.priceRange}.`
    : `Browse ${makeName} cars for sale in ${countryName} on Motokah.`;
  const canonicalUrl = `https://www.motokah.com/country/${countrySlug}/${makeSlug}`;

  const { listings, loading } = useSearchListings({ country: countryName, make: makeName }, "newest");
  const robotsContent = robotsContentForCount(listings.length);

  const breadcrumbs = [
    { name: "Home", url: "https://www.motokah.com/" },
    { name: `Cars in ${countryName}`, url: `https://www.motokah.com/country/${countrySlug}` },
    { name: `${makeName} in ${countryName}`, url: canonicalUrl },
  ];

  const relatedMakes = Object.keys(DATA[countrySlug] || {}).filter(m => m !== makeSlug);
  const allCountries = Object.keys(DATA).filter(c => c !== countrySlug && DATA[c]?.[makeSlug]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content={robotsContent} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        {jsonLdScript(breadcrumbJsonLd(breadcrumbs))}
        {countryData?.faqs && jsonLdScript(faqJsonLd(countryData.faqs))}
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

          <nav className="flex gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to={`/country/${countrySlug}`} className="hover:text-foreground">Cars in {countryName}</Link>
            <span>/</span>
            <span className="text-foreground">{makeName}</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              {makeName} Cars for Sale in {countryName}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{description}</p>
          </div>

          {/* Listings */}
          {loading ? (
            <div className="flex justify-center py-16">
              <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
              {listings.map(listing => (
                <VehicleCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-14 mb-12">
              <p className="text-muted-foreground mb-4">No {makeName} listings in {countryName} right now.</p>
              <Button asChild variant="outline">
                <Link to={`/country/${countrySlug}`}>Browse all cars in {countryName}</Link>
              </Button>
            </div>
          )}

          {/* Buying guide */}
          {countryData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">
                  {makeName} in {countryName}: Buying Guide
                </h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-3">
                  {countryData.guide.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="bg-card border rounded-xl p-5 h-fit">
                <h3 className="font-semibold mb-3">{makeName} in {countryName}</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Price range</dt>
                    <dd className="font-medium">{countryData.priceRange}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Popular models</dt>
                    <dd className="font-medium">{countryData.popularModels.join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Import authority</dt>
                    <dd className="font-medium">{countryData.authority}</dd>
                  </div>
                  {countryData.cities.length > 1 && (
                    <div>
                      <dt className="text-muted-foreground">Buy by city</dt>
                      <dd className="flex flex-wrap gap-1 mt-1">
                        {countryData.citySlugs.map((cs, i) => (
                          <Link key={cs} to={`/cars/${makeSlug}/in/${cs}`}
                            className="text-primary text-xs hover:underline">
                            {countryData.cities[i]}
                          </Link>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
                <Button asChild className="w-full mt-4">
                  <Link to={`/search?make=${encodeURIComponent(makeName)}&country=${encodeURIComponent(countryName)}`}>
                    View all listings
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* FAQ */}
          {countryData?.faqs && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-5">Frequently Asked Questions</h2>
              <div className="space-y-5">
                {countryData.faqs.map((faq, i) => (
                  <div key={i}>
                    <h3 className="font-semibold mb-1">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related makes in same country */}
          {relatedMakes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Other Makes in {countryName}</h2>
              <div className="flex flex-wrap gap-2">
                {relatedMakes.map(m => (
                  <Link key={m} to={`/country/${countrySlug}/${m}`}
                    className="px-3 py-1.5 rounded-full border text-sm hover:bg-accent transition-colors">
                    {MAKE_DISPLAY[m] || m} in {countryName}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Same make, other countries */}
          {allCountries.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">{makeName} in Other Countries</h2>
              <div className="flex flex-wrap gap-2">
                {allCountries.map(c => (
                  <Link key={c} to={`/country/${c}/${makeSlug}`}
                    className="px-3 py-1.5 rounded-full border text-sm hover:bg-accent transition-colors">
                    {makeName} in {DATA[c][makeSlug].countryName}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-card border rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Selling a {makeName} in {countryName}?</h2>
            <p className="text-muted-foreground text-sm mb-4">
              List free on Motokah. Reach thousands of buyers across {countryName} and East Africa.
            </p>
            <Button asChild><Link to="/sell">Post your car free</Link></Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
