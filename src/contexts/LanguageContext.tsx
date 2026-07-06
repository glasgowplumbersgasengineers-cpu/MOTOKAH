import { createContext, useContext, useState, useEffect } from "react";

export type LangCode = "en" | "sw" | "fr" | "ar";

export interface Language {
  code: LangCode;
  name: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English",   flag: "🇬🇧", dir: "ltr" },
  { code: "sw", name: "Kiswahili", flag: "🇹🇿", dir: "ltr" },
  { code: "fr", name: "Français",  flag: "🇫🇷", dir: "ltr" },
  { code: "ar", name: "العربية",   flag: "🇸🇦", dir: "rtl" },
];

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    // Nav
    "nav.usedCars": "Used Cars",
    "nav.newCars": "New Cars",
    "nav.commercial": "Commercial",
    "nav.bikes": "Bikes",
    "nav.boats": "Boats",
    "nav.dealers": "Dealers",
    "nav.compare": "Compare",
    "nav.blog": "Blog",
    "nav.profile": "My Profile",
    "nav.wishlist": "Wishlist",
    "nav.messages": "Messages",
    "nav.signIn": "Sign In",
    "nav.postAd": "Post Ad",
    "nav.lightMode": "Light Mode",
    "nav.darkMode": "Dark Mode",
    // Hero
    "hero.title": "Find Used Cars in",
    "hero.subtitle": "Tanzania",
    "hero.search": "Search used cars...",
    "hero.searchBtn": "Search",
    "hero.cars": "Cars",
    "hero.bikesTab": "Bikes",
    "hero.commercial": "Commercial",
    "hero.advanced": "Advanced Search",
    // Browse
    "browse.title": "Browse Used Cars",
    "browse.category": "Category",
    "browse.budget": "Budget",
    "browse.brand": "Brand",
    "browse.model": "Model",
    "browse.cities": "Cities",
    // Sections
    "section.featured": "Hot Deals & Featured",
    "section.latest": "Latest Listings",
    "section.viewAll": "View All",
    // Common
    "common.save": "Save",
    "common.share": "Share",
    "common.report": "Report",
    "common.whatsapp": "WhatsApp",
    "common.call": "Call Seller",
    "common.message": "Send Message",
    "common.askingPrice": "Asking Price",
  },
  sw: {
    // Nav
    "nav.usedCars": "Magari ya Kutumika",
    "nav.newCars": "Magari Mapya",
    "nav.commercial": "Biashara",
    "nav.bikes": "Pikipiki",
    "nav.boats": "Boti",
    "nav.dealers": "Wauza Magari",
    "nav.compare": "Linganisha",
    "nav.blog": "Blogu",
    "nav.profile": "Wasifu Wangu",
    "nav.wishlist": "Orodha ya Matakwa",
    "nav.messages": "Ujumbe",
    "nav.signIn": "Ingia",
    "nav.postAd": "Tangaza",
    "nav.lightMode": "Mwanga",
    "nav.darkMode": "Giza",
    // Hero
    "hero.title": "Pata Magari ya Kutumika",
    "hero.subtitle": "Tanzania",
    "hero.search": "Tafuta magari...",
    "hero.searchBtn": "Tafuta",
    "hero.cars": "Magari",
    "hero.bikesTab": "Pikipiki",
    "hero.commercial": "Biashara",
    "hero.advanced": "Utafutaji wa Kina",
    // Browse
    "browse.title": "Vinjari Magari",
    "browse.category": "Aina",
    "browse.budget": "Bajeti",
    "browse.brand": "Chapa",
    "browse.model": "Mfano",
    "browse.cities": "Miji",
    // Sections
    "section.featured": "Mauzo Maarufu",
    "section.latest": "Iliyoorodheshwa Hivi Karibuni",
    "section.viewAll": "Tazama Zote",
    // Common
    "common.save": "Hifadhi",
    "common.share": "Shiriki",
    "common.report": "Ripoti",
    "common.whatsapp": "WhatsApp",
    "common.call": "Piga Simu",
    "common.message": "Tuma Ujumbe",
    "common.askingPrice": "Bei Inayoulizwa",
  },
  fr: {
    // Nav
    "nav.usedCars": "Voitures d'Occasion",
    "nav.newCars": "Voitures Neuves",
    "nav.commercial": "Commercial",
    "nav.bikes": "Motos",
    "nav.boats": "Bateaux",
    "nav.dealers": "Concessionnaires",
    "nav.compare": "Comparer",
    "nav.blog": "Blog",
    "nav.profile": "Mon Profil",
    "nav.wishlist": "Favoris",
    "nav.messages": "Messages",
    "nav.signIn": "Connexion",
    "nav.postAd": "Publier",
    "nav.lightMode": "Mode Clair",
    "nav.darkMode": "Mode Sombre",
    // Hero
    "hero.title": "Trouvez votre Voiture en",
    "hero.subtitle": "Tanzanie",
    "hero.search": "Rechercher des voitures...",
    "hero.searchBtn": "Rechercher",
    "hero.cars": "Voitures",
    "hero.bikesTab": "Motos",
    "hero.commercial": "Commercial",
    "hero.advanced": "Recherche Avancée",
    // Browse
    "browse.title": "Parcourir les Voitures",
    "browse.category": "Catégorie",
    "browse.budget": "Budget",
    "browse.brand": "Marque",
    "browse.model": "Modèle",
    "browse.cities": "Villes",
    // Sections
    "section.featured": "Meilleures Offres",
    "section.latest": "Dernières Annonces",
    "section.viewAll": "Voir Tout",
    // Common
    "common.save": "Sauvegarder",
    "common.share": "Partager",
    "common.report": "Signaler",
    "common.whatsapp": "WhatsApp",
    "common.call": "Appeler",
    "common.message": "Envoyer un Message",
    "common.askingPrice": "Prix Demandé",
  },
  ar: {
    // Nav
    "nav.usedCars": "سيارات مستعملة",
    "nav.newCars": "سيارات جديدة",
    "nav.commercial": "تجاري",
    "nav.bikes": "دراجات نارية",
    "nav.boats": "قوارب",
    "nav.dealers": "الوكلاء",
    "nav.compare": "مقارنة",
    "nav.blog": "المدونة",
    "nav.profile": "ملفي",
    "nav.wishlist": "المفضلة",
    "nav.messages": "الرسائل",
    "nav.signIn": "تسجيل الدخول",
    "nav.postAd": "نشر إعلان",
    "nav.lightMode": "الوضع الفاتح",
    "nav.darkMode": "الوضع الداكن",
    // Hero
    "hero.title": "اعثر على سيارتك في",
    "hero.subtitle": "تنزانيا",
    "hero.search": "ابحث عن سيارات...",
    "hero.searchBtn": "بحث",
    "hero.cars": "سيارات",
    "hero.bikesTab": "دراجات",
    "hero.commercial": "تجاري",
    "hero.advanced": "بحث متقدم",
    // Browse
    "browse.title": "تصفح السيارات",
    "browse.category": "الفئة",
    "browse.budget": "الميزانية",
    "browse.brand": "الماركة",
    "browse.model": "الموديل",
    "browse.cities": "المدن",
    // Sections
    "section.featured": "أفضل الصفقات",
    "section.latest": "أحدث الإعلانات",
    "section.viewAll": "عرض الكل",
    // Common
    "common.save": "حفظ",
    "common.share": "مشاركة",
    "common.report": "إبلاغ",
    "common.whatsapp": "واتساب",
    "common.call": "اتصل بالبائع",
    "common.message": "إرسال رسالة",
    "common.askingPrice": "السعر المطلوب",
  },
};

interface LanguageContextType {
  lang: LangCode;
  language: Language;
  setLang: (code: LangCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  language: LANGUAGES[0],
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const stored = localStorage.getItem("motokah_lang") as LangCode | null;
    return stored && translations[stored] ? stored : "en";
  });

  const setLang = (code: LangCode) => {
    setLangState(code);
    localStorage.setItem("motokah_lang", code);
  };

  const language = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  // Apply RTL direction to document
  useEffect(() => {
    document.documentElement.dir = language.dir;
    document.documentElement.lang = lang;
  }, [lang, language.dir]);

  const t = (key: string): string =>
    translations[lang]?.[key] ?? translations["en"]?.[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, language, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
