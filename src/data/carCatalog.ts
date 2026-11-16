// Every make and model a seller in East Africa is likely to type, with its usual body type.
// Used by the Sell form ("car name" autocomplete) and the Home search suggestions.
// Detailed specs and features for the most common models live in vehiclePresets.ts.

export type CatalogBody = "SUV" | "Sedan" | "Hatchback" | "Pickup" | "Van" | "Wagon" | "Coupe" | "Truck";

// "Model:Body" pairs keep the list compact. S=SUV, D=Sedan, H=Hatchback, P=Pickup, V=Van, W=Wagon, C=Coupe, T=Truck.
const RAW: Record<string, string> = {
  Toyota:
    "Alphard:V,Allex:H,Allion:D,Aqua:H,Auris:H,Avanza:V,Avensis:D,Axio:D,Belta:D,Brevis:D,bB:H,C-HR:S,Caldina:W,Camry:D,Carina:D,Coaster:T,Corolla:D,Corolla Cross:S,Corona:D,Crown:D,Dyna:T,Esquire:V,Estima:V,FJ Cruiser:S,Fielder:W,Fortuner:S,Funcargo:V,GR86:C,Harrier:S,Hiace:V,Highlander:S,Hilux:P,Hilux Surf:S,IST:H,Isis:V,Kluger:S,Land Cruiser:S,Land Cruiser 70 Series:S,Land Cruiser Prado:S,Land Cruiser V8:S,Land Cruiser 300:S,Mark II:D,Mark X:D,Noah:V,Opa:W,Passo:H,Platz:D,Porte:H,Premio:D,Prius:H,Probox:W,Ractis:H,Raize:S,RAV4:S,Rumion:W,Rush:S,Sequoia:S,Sienta:V,Spade:H,Spacio:W,Succeed:W,Supra:C,Tacoma:P,Tank:H,Townace:V,Tundra:P,Vanguard:S,Vellfire:V,Verossa:D,Vista:D,Vitz:H,Voxy:V,Will:H,Wish:V,Yaris:H,Yaris Cross:S,Zelas:C",
  Nissan:
    "AD Van:W,Almera:D,Altima:D,Bluebird:D,Bluebird Sylphy:D,Caravan:V,Cefiro:D,Civilian:T,Cube:H,Dayz:H,Dualis:S,Elgrand:V,Fuga:D,GT-R:C,Hardbody:P,Juke:S,Kicks:S,Lafesta:V,Latio:D,Leaf:H,March:H,Murano:S,Navara:P,Note:H,NV200:V,NV350:V,Pathfinder:S,Patrol:S,Primera:D,Qashqai:S,Serena:V,Skyline:D,Sunny:D,Sylphy:D,Teana:D,Terrano:S,Tiida:H,Vanette:V,Wingroad:W,X-Trail:S,Xterra:S,UD Truck:T",
  Honda:
    "Accord:D,Airwave:W,City:D,Civic:D,CR-V:S,CR-Z:C,Crossroad:S,Elysion:V,Fit:H,Fit Shuttle:W,Freed:V,Grace:D,HR-V:S,Insight:H,Jazz:H,Legend:D,N-Box:H,N-WGN:H,Odyssey:V,Pilot:S,Shuttle:W,Stepwgn:V,Stream:V,Vezel:S,ZR-V:S",
  Mazda:
    "Atenza:D,Axela:H,Biante:V,Bongo:V,BT-50:P,CX-3:S,CX-30:S,CX-5:S,CX-60:S,CX-7:S,CX-8:S,CX-9:S,Demio:H,Familia:W,Mazda2:H,Mazda3:H,Mazda6:D,MPV:V,MX-5:C,Premacy:V,Tribute:S,Verisa:H",
  Subaru:
    "BRZ:C,Exiga:W,Forester:S,Impreza:H,Legacy:W,Levorg:W,Outback:W,Stella:H,Trezia:H,WRX:D,XV:S,Crosstrek:S",
  Mitsubishi:
    "ASX:S,Canter:T,Colt:H,Delica:V,Eclipse Cross:S,Fuso Fighter:T,Galant:D,Grandis:V,L200:P,Lancer:D,Mirage:H,Outlander:S,Pajero:S,Pajero iO:S,Pajero Mini:S,Pajero Sport:S,RVR:S,Rosa:T,Triton:P",
  Suzuki:
    "Alto:H,Baleno:H,Carry:T,Celerio:H,Ciaz:D,Dzire:D,Ertiga:V,Escudo:S,Every:V,Grand Vitara:S,Hustler:H,Ignis:H,Jimny:S,Solio:H,Spacia:H,Swift:H,Vitara:S,Wagon R:H,XL7:S",
  Isuzu:
    "D-Max:P,Elf:T,Forward:T,Giga:T,MU-X:S,NPR:T,NQR:T,FRR:T,FVZ:T,Trooper:S,Bighorn:S",
  Daihatsu:
    "Boon:H,Cast:H,Hijet:V,Mira:H,Move:H,Rocky:S,Sirion:H,Tanto:H,Terios:S,Thor:H,Wake:H",
  Lexus:
    "CT:H,ES:D,GS:D,GX:S,IS:D,LS:D,LX:S,NX:S,RC:C,RX:S,UX:S",
  "Land Rover":
    "Defender:S,Discovery:S,Discovery Sport:S,Freelander:S,Range Rover:S,Range Rover Evoque:S,Range Rover Sport:S,Range Rover Velar:S,Range Rover Vogue:S",
  "Mercedes-Benz":
    "A-Class:H,Actros:T,Axor:T,B-Class:H,C-Class:D,CLA:D,CLS:D,E-Class:D,G-Class:S,GLA:S,GLB:S,GLC:S,GLE:S,GLK:S,GLS:S,ML-Class:S,S-Class:D,Sprinter:V,V-Class:V,Vito:V",
  BMW:
    "1 Series:H,2 Series:C,3 Series:D,4 Series:C,5 Series:D,7 Series:D,X1:S,X2:S,X3:S,X4:S,X5:S,X6:S,X7:S,Z4:C,i3:H",
  Audi:
    "A1:H,A3:H,A4:D,A5:C,A6:D,A8:D,Q2:S,Q3:S,Q5:S,Q7:S,Q8:S,TT:C",
  Volkswagen:
    "Amarok:P,Caddy:V,Golf:H,Jetta:D,Passat:D,Polo:H,Sharan:V,T-Roc:S,Tiguan:S,Touareg:S,Touran:V,Transporter:V",
  Ford:
    "EcoSport:S,Edge:S,Escape:S,Everest:S,Explorer:S,F-150:P,Fiesta:H,Focus:H,Kuga:S,Mustang:C,Ranger:P,Transit:V",
  Hyundai:
    "Accent:D,Creta:S,Elantra:D,H-1:V,i10:H,i20:H,i30:H,Ioniq:H,Kona:S,Santa Fe:S,Sonata:D,Starex:V,Tucson:S,Venue:S",
  Kia:
    "Carnival:V,Cerato:D,Picanto:H,Rio:H,Seltos:S,Sorento:S,Soul:H,Sportage:S,Stinger:D,K2700:T",
  Jeep: "Cherokee:S,Compass:S,Grand Cherokee:S,Renegade:S,Wrangler:S",
  Peugeot: "2008:S,206:H,208:H,3008:S,301:D,307:H,308:H,406:D,407:D,5008:S,508:D,Partner:V",
  Renault: "Duster:S,Kwid:H,Logan:D,Sandero:H,Koleos:S",
  Volvo: "S60:D,S90:D,V40:H,XC40:S,XC60:S,XC90:S,FH:T,FMX:T",
  Porsche: "911:C,Cayenne:S,Macan:S,Panamera:D",
  Chevrolet: "Captiva:S,Cruze:D,Spark:H,Trailblazer:S",
  Infiniti: "FX:S,Q50:D,QX56:S,QX60:S,QX80:S",
  "Great Wall": "Haval H2:S,Haval H6:S,Poer:P,Steed:P,Wingle:P",
  Haval: "H2:S,H6:S,Jolion:S",
  Chery: "Tiggo 2:S,Tiggo 4:S,Tiggo 7:S,Tiggo 8:S",
  JAC: "J4:D,S3:S,T6:P,T8:P",
  Foton: "Aumark:T,Tunland:P,View:V",
  Sinotruk: "Howo:T",
  Shacman: "X3000:T",
  FAW: "J6:T,Tiger V:T",
  Tata: "Prima:T,Super Ace:T,Xenon:P",
  Scania: "G-Series:T,P-Series:T,R-Series:T",
  MAN: "TGA:T,TGS:T,TGX:T",
  Hino: "300 Series:T,500 Series:T,700 Series:T,Dutro:T,Ranger:T",
  Tesla: "Model 3:D,Model S:D,Model X:S,Model Y:S",
  BYD: "Atto 3:S,Dolphin:H,Seal:D",
  Mini: "Cooper:H,Countryman:S",
  Jaguar: "E-Pace:S,F-Pace:S,XE:D,XF:D,XJ:D",
};

const BODY: Record<string, CatalogBody> = { S: "SUV", D: "Sedan", H: "Hatchback", P: "Pickup", V: "Van", W: "Wagon", C: "Coupe", T: "Truck" };

export interface CatalogModel {
  make: string;
  model: string;
  bodyType: CatalogBody;
}

export const carCatalog: CatalogModel[] = Object.entries(RAW).flatMap(([make, list]) =>
  list.split(",").map((entry) => {
    const [model, code] = entry.split(":");
    return { make, model: model.trim(), bodyType: BODY[code.trim()] };
  }),
);

export const catalogMakes = Object.keys(RAW);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

// Matches "harrier", "toyota harr", "landcruiser", "cx5", "prado" etc.
export function searchCarCatalog(query: string, limit = 8): CatalogModel[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const qNorm = norm(query);
  const scored = carCatalog
    .map((c) => {
      const full = `${c.make} ${c.model}`.toLowerCase();
      const fullNorm = norm(full);
      const modelNorm = norm(c.model);
      const hit = words.every((w) => full.includes(w)) || fullNorm.includes(qNorm) || modelNorm.includes(qNorm);
      if (!hit) return null;
      const score = modelNorm.startsWith(qNorm) ? 0 : fullNorm.startsWith(qNorm) ? 1 : modelNorm.includes(qNorm) ? 2 : 3;
      return { c, score };
    })
    .filter((x): x is { c: CatalogModel; score: number } => x !== null)
    .sort((a, b) => a.score - b.score || a.c.model.length - b.c.model.length);
  return scored.slice(0, limit).map((x) => x.c);
}
