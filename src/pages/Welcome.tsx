import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconMapPin, IconGlobe, IconChevronRight, IconLoader2, IconCheck, IconHelpCircle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useLocationDetection, type Country } from "@/hooks/useLocationDetection";
import { type LangCode, LANGUAGES } from "@/contexts/LanguageContext";
import HelpGuide from "@/components/HelpGuide";

const countries: { code: Country; name: string; flag: string }[] = [
  { code: "Tanzania", name: "Tanzania", flag: "🇹🇿" },
  { code: "Kenya", name: "Kenya", flag: "🇰🇪" },
  { code: "Uganda", name: "Uganda", flag: "🇺🇬" },
  { code: "Rwanda", name: "Rwanda", flag: "🇷🇼" },
  { code: "Burundi", name: "Burundi", flag: "🇧🇮" },
  { code: "Ethiopia", name: "Ethiopia", flag: "🇪🇹" },
  { code: "Nigeria", name: "Nigeria", flag: "🇳🇬" },
];

const translations: Record<LangCode, {
  welcome: string;
  subtitle: string;
  detecting: string;
  selectCountry: string;
  selectCity: string;
  selectLanguage: string;
  detected: string;
  continue: string;
  change: string;
  step: string;
  of: string;
  location: string;
  language: string;
  howToUse: string;
  howToUseTitle: string;
  howToUseDesc: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  gotIt: string;
}> = {
  en: {
    welcome: "Welcome to Motokah",
    subtitle: "Africa's Trusted Vehicle Marketplace",
    detecting: "Detecting your location...",
    selectCountry: "Select your country",
    selectCity: "Select your city",
    selectLanguage: "Select language",
    detected: "Detected",
    continue: "Continue",
    change: "Change",
    step: "Step",
    of: "of",
    location: "Location",
    language: "Language",
    howToUse: "How to Use",
    howToUseTitle: "How to Use Motokah",
    howToUseDesc: "Follow these simple steps to get started:",
    step1Title: "Set Your Location",
    step1Desc: "Select your country and city to see listings near you",
    step2Title: "Choose Language",
    step2Desc: "Pick your preferred language for the app interface",
    step3Title: "Browse & Search",
    step3Desc: "Explore vehicle listings, filter by make, model, price & more",
    step4Title: "Connect & Buy",
    step4Desc: "Message sellers directly, save favorites, and compare listings",
    gotIt: "Got it!",
  },
  sw: {
    welcome: "Karibu Motokah",
    subtitle: "Soko la Magari la Kuaminika Afrika",
    detecting: "Inagundua eneo lako...",
    selectCountry: "Chagua nchi yako",
    selectCity: "Chagua mji wako",
    selectLanguage: "Chagua lugha",
    detected: "Imegunduliwa",
    continue: "Endelea",
    change: "Badilisha",
    step: "Hatua",
    of: "kati ya",
    location: "Mahali",
    language: "Lugha",
    howToUse: "Jinsi ya Kutumia",
    howToUseTitle: "Jinsi ya Kutumia Motokah",
    howToUseDesc: "Fuata hatua hizi rahisi kuanza:",
    step1Title: "Weka Mahali Pako",
    step1Desc: "Chagua nchi na mji wako kuona matangazo karibu nawe",
    step2Title: "Chagua Lugha",
    step2Desc: "Chagua lugha unayopendelea kwa ajili ya muundo wa programu",
    step3Title: "Vinjari na Tafuta",
    step3Desc: "Chunguza maelfu ya magari, chuja kwa chapa, mfano, bei na zaidi",
    step4Title: "Ungana na Nunua",
    step4Desc: "Wasiliana na wauzaji moja kwa moja, hifadhi vipendwa, na linganisha matangazo",
    gotIt: "Nimeelewa!",
  },
  fr: {
    welcome: "Bienvenue sur Motokah",
    subtitle: "Le Marché de Véhicules de Confiance en Afrique",
    detecting: "Détection de votre localisation...",
    selectCountry: "Sélectionnez votre pays",
    selectCity: "Sélectionnez votre ville",
    selectLanguage: "Sélectionnez la langue",
    detected: "Détecté",
    continue: "Continuer",
    change: "Changer",
    step: "Étape",
    of: "sur",
    location: "Emplacement",
    language: "Langue",
    howToUse: "Comment Utiliser",
    howToUseTitle: "Comment Utiliser Motokah",
    howToUseDesc: "Suivez ces étapes simples pour commencer:",
    step1Title: "Définir Votre Emplacement",
    step1Desc: "Sélectionnez votre pays et ville pour voir les annonces près de chez vous",
    step2Title: "Choisir la Langue",
    step2Desc: "Choisissez votre langue préférée pour l'interface de l'application",
    step3Title: "Parcourir et Rechercher",
    step3Desc: "Explorez des milliers de véhicules, filtrez par marque, modèle, prix et plus",
    step4Title: "Connectez-vous et Achetez",
    step4Desc: "Envoyez un message aux vendeurs, sauvegardez vos favoris et comparez les annonces",
    gotIt: "Compris!",
  },
  ar: {
    welcome: "مرحباً بك في موتوكاه",
    subtitle: "سوق السيارات الموثوق به في أفريقيا",
    detecting: "جاري تحديد موقعك...",
    selectCountry: "اختر بلدك",
    selectCity: "اختر مدينتك",
    selectLanguage: "اختر اللغة",
    detected: "تم التحديد",
    continue: "متابعة",
    change: "تغيير",
    step: "خطوة",
    of: "من",
    location: "الموقع",
    language: "اللغة",
    howToUse: "كيفية الاستخدام",
    howToUseTitle: "كيفية استخدام موتوكاه",
    howToUseDesc: "اتبع هذه الخطوات البسيطة للبدء:",
    step1Title: "تعيين موقعك",
    step1Desc: "اختر بلدك ومدينتك لرؤية الإعلانات القريبة منك",
    step2Title: "اختر اللغة",
    step2Desc: "اختر لغتك المفضلة لواجهة التطبيق",
    step3Title: "تصفح وابحث",
    step3Desc: "استكشف آلاف المركبات، وصنّف حسب الماركة والموديل والسعر والمزيد",
    step4Title: "تواصل واشتر",
    step4Desc: "راسل البائعين مباشرة، واحفظ المفضلة، وقارن بين الإعلانات",
    gotIt: "فهمت!",
  },
};

const stepNames: Record<LangCode, string[]> = {
  en: ["Location", "City", "Language"],
  sw: ["Mahali", "Mji", "Lugha"],
  fr: ["Emplacement", "Ville", "Langue"],
  ar: ["الموقع", "المدينة", "اللغة"],
};

const getStepIndex = (step: string): number => {
  if (step === "country") return 0;
  if (step === "city") return 1;
  if (step === "language") return 2;
  return -1;
};

const containerVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2, ease: "easeIn" } },
};

const staggerVariants = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 16, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function Welcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isChangingLocation = searchParams.get("change") === "location";
  const { location, loading: detecting, setManualLocation, countryCitiesMap } = useLocationDetection();
  
  const [step, setStep] = useState<"detecting" | "country" | "city" | "language" | "done">("country");
  const [selectedCountry, setSelectedCountry] = useState<Country>("Tanzania");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLang, setSelectedLang] = useState<LangCode>("en");
  const [manualSelectionStarted, setManualSelectionStarted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const t = translations[selectedLang];
  const cities = countryCitiesMap[selectedCountry] || [];
  const stepNamesList = stepNames[selectedLang];

  useEffect(() => {
    const completed = localStorage.getItem("motokah_welcome_completed");
    if (isChangingLocation) {
      const savedCountry = localStorage.getItem("motokah_country") as Country | null;
      const savedCity = localStorage.getItem("motokah_city");
      if (savedCountry) setSelectedCountry(savedCountry);
      if (savedCity) setSelectedCity(savedCity);
      setStep("country");
      return;
    }
    if (completed && !isChangingLocation) {
      navigate("/");
    }
  }, [navigate, isChangingLocation]);

  useEffect(() => {
    if (!isChangingLocation && location && detecting === false && !manualSelectionStarted) {
      setSelectedCountry(location.country);
      setSelectedCity(location.city);
    }
  }, [location, detecting, isChangingLocation, manualSelectionStarted]);

  useEffect(() => {
    if (cities.length > 0 && !selectedCity) {
      setSelectedCity(cities[0]);
    }
  }, [selectedCountry, cities, selectedCity]);

  const handleComplete = () => {
    const acceptedDetected =
      !isChangingLocation && !!location && location.country === selectedCountry && location.city === selectedCity;
    localStorage.setItem("motokah_location_source", acceptedDetected ? "auto" : "manual");
    setManualLocation(selectedCountry, selectedCity);
    localStorage.setItem("motokah_lang", selectedLang);
    localStorage.setItem("motokah_welcome_completed", "true");
    // Also save to LocationContext format
    localStorage.setItem("motokah_country", selectedCountry);
    localStorage.setItem("motokah_city", selectedCity);
    window.dispatchEvent(new Event("motokah-location-updated"));
    navigate("/");
  };

  const currentStepIndex = getStepIndex(step);
  const totalSteps = 3;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-background to-muted/30 overflow-y-auto overscroll-contain">
      <div className="min-h-full min-h-dvh flex flex-col">
        {/* Progress Bar + Help */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-md mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {currentStepIndex >= 0 && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {t.step} {currentStepIndex + 1} {t.of} {totalSteps}: {stepNamesList[currentStepIndex]}
                  </span>
                )}
                {step === "detecting" && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {t.detecting}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 rounded-full"
              >
                <IconHelpCircle size={14} />
                {t.howToUse}
              </button>
            </div>
            {currentStepIndex >= 0 && (
              <div className="flex gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      i < currentStepIndex
                        ? "bg-primary"
                        : i === currentStepIndex
                        ? "bg-primary/70"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 py-6 max-w-md mx-auto w-full">
          {/* Logo + Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20"
            >
              <span className="text-3xl font-black text-primary-foreground">M</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-3xl font-bold text-foreground mb-2"
            >
              {t.welcome}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-muted-foreground text-sm"
            >
              {t.subtitle}
            </motion.p>
          </motion.div>

          {/* Step Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {/* Step 0: Detecting */}
              {step === "detecting" && (
                <motion.div
                  key="detecting"
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex flex-col items-center gap-6 py-8"
                >
                  <div className="relative">
                    <IconLoader2 size={40} className="animate-spin text-primary" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-primary/10"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1">{t.detecting}</p>
                    <p className="text-xs text-muted-foreground/60">
                      Using GPS or network...
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep("country")}
                    className="text-xs gap-1"
                  >
                    <IconMapPin size={14} />
                    {t.selectCountry} {t.change}
                  </Button>
                </motion.div>
              )}

              {/* Step 1: Country Selection */}
              {step === "country" && (
                <motion.div
                  key="country"
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-4"
                >
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-semibold text-center"
                  >
                    {t.selectCountry}
                  </motion.h2>
                  <motion.div
                    variants={staggerVariants}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-2 gap-3 pb-4"
                  >
                    {countries.map((c) => (
                      <motion.button
                        key={c.code}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setManualSelectionStarted(true);
                          setSelectedCountry(c.code);
                          setSelectedCity(location?.country === c.code ? location.city : "");
                          setStep("city");
                        }}
                        className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          selectedCountry === c.code
                            ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <span className="text-2xl">{c.flag}</span>
                        <span className="font-medium text-sm">{c.name}</span>
                        {selectedCountry === c.code && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                          >
                            <IconCheck size={12} className="text-primary-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2: City Selection */}
              {step === "city" && (
                <motion.div
                  key="city"
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setStep("country")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      ← {t.change}
                    </button>
                    <span className="text-sm text-muted-foreground">
                      {countries.find(c => c.code === selectedCountry)?.flag} {selectedCountry}
                    </span>
                  </div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-semibold text-center"
                  >
                    {t.selectCity}
                  </motion.h2>
                  
                  <motion.div
                    variants={staggerVariants}
                    initial="initial"
                    animate="animate"
                    className="space-y-2 pb-4"
                  >
                    {cities.map((city) => (
                      <motion.button
                        key={city}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedCity(city);
                          setStep("language");
                        }}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          selectedCity === city
                            ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${
                          selectedCity === city ? "bg-primary/10" : "bg-muted"
                        }`}>
                          <IconMapPin size={18} className={
                            selectedCity === city ? "text-primary" : "text-muted-foreground"
                          } />
                        </div>
                        <span className="font-medium">{city}</span>
                        {selectedCity === city && (
                          <IconCheck size={18} className="ml-auto text-primary" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Step 3: Language Selection */}
              {step === "language" && (
                <motion.div
                  key="language"
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-4 pb-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setStep("city")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      ← {t.change}
                    </button>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/10"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <IconGlobe size={16} className="text-primary" />
                      <span className="font-medium text-foreground">
                        {countries.find(c => c.code === selectedCountry)?.flag} {selectedCity}, {selectedCountry}
                      </span>
                    </div>
                  </motion.div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg font-semibold text-center"
                  >
                    {t.selectLanguage}
                  </motion.h2>

                  <motion.div
                    variants={staggerVariants}
                    initial="initial"
                    animate="animate"
                    className="space-y-2"
                  >
                    {LANGUAGES.map((l) => (
                      <motion.button
                        key={l.code}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedLang(l.code)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          selectedLang === l.code
                            ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <span className="text-2xl">{l.flag}</span>
                        <div className="text-left flex-1">
                          <div className="font-medium">{l.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {l.code === "en" && "English"}
                            {l.code === "sw" && "Kiswahili"}
                            {l.code === "fr" && "Français"}
                            {l.code === "ar" && "العربية"}
                          </div>
                        </div>
                        {selectedLang === l.code && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                          >
                            <IconCheck size={14} className="text-primary-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-background via-background to-transparent"
                    style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
                  >
                    <Button
                      onClick={handleComplete}
                      className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/20"
                    >
                      {t.continue}
                      <IconChevronRight size={20} className="ml-2" />
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      {t.welcome} — {t.subtitle}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* How to Use Guide */}
        <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} lang={selectedLang} />
      </div>
    </div>
  );
}
