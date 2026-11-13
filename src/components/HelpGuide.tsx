import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  IconSearch, IconFilter, IconHeart, IconScale, IconShare, IconFlag,
  IconBrandWhatsapp, IconPhone, IconMessageCircle,
  IconUpload, IconCar, IconCheck, IconArrowRight,
  IconUser, IconShieldLock, IconQrcode, IconLayoutDashboard,
  IconBookmark, IconHelpCircle, IconX, IconChevronDown, IconChevronUp,
  IconFlame, IconEye, IconMapPin, IconGauge, IconCalendar,
  IconManualGearbox, IconBuildingStore, IconStarFilled, IconSun, IconMoon,
  IconMenu2, IconHome, IconSpeakerphone, IconPlus, IconMail, IconLock,
  IconSend, IconRefresh, IconTrash, IconCamera, IconAlertTriangle,
  IconShieldCheck, IconCopy, IconBrandFacebook, IconBrandTwitter,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { type LangCode } from "@/contexts/LanguageContext";

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LangCode;
}

const translations: Record<LangCode, {
  title: string;
  subtitle: string;
  sections: Array<{
    icon: React.ElementType;
    title: string;
    description: string;
    features: string[];
    color: string;
    bgColor: string;
  }>;
  gotIt: string;
  swipeToExplore: string;
}> = {
  en: {
    title: "How to Use Motokah",
    subtitle: "Your complete guide to buying and selling vehicles in Africa",
    sections: [
      {
        icon: IconSearch,
        title: "Search & Discover",
        description: "Find your perfect vehicle with powerful search tools",
        features: [
          "Switch between Cars, Commercial, and Bikes tabs",
          "Use keyword search or advanced filters",
          "Filter by make, model, price, year, mileage, location",
          "Sort by newest, price, or most viewed",
          "Save searches for quick access later",
        ],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        icon: IconFilter,
        title: "Advanced Filters",
        description: "Narrow down results with detailed filtering options",
        features: [
          "Multi-select body types and fuel types",
          "Set price range with min/max values",
          "Filter by transmission (Manual/Automatic/CVT)",
          "Check duty status (Paid/Not Paid)",
          "Filter by condition: New, Used, or Foreign Used",
        ],
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
      {
        icon: IconHeart,
        title: "Save & Compare",
        description: "Keep track of your favorite listings",
        features: [
          "Click the heart icon to save to wishlist",
          "Compare up to 4 vehicles side-by-side",
          "See 'Best' highlights for price, year, mileage",
          "Access saved items from your Profile",
          "Share listings via WhatsApp, Facebook, or copy link",
        ],
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      },
      {
        icon: IconBrandWhatsapp,
        title: "Contact Sellers",
        description: "Connect with sellers in 3 easy ways",
        features: [
          "WhatsApp: Pre-filled message with listing details",
          "Call: Direct phone call to seller",
          "Message: In-app chat with read receipts",
          "View dealer profiles and ratings",
          "Report suspicious listings for safety",
        ],
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        icon: IconUpload,
        title: "Post Your Ad",
        description: "Sell your vehicle in 5 simple steps",
        features: [
          "Step 1: Basic Info (Make, Model, Year, Body Type)",
          "Step 2: Details (Transmission, Fuel, Color, Mileage)",
          "Step 3: Photos (Up to 10 images, 5MB each)",
          "Step 4: Price & Location (Title, Description, Price)",
          "Step 5: Review & Submit (Goes live after approval)",
        ],
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
      },
      {
        icon: IconMessageCircle,
        title: "Messages & Chat",
        description: "Communicate safely within the app",
        features: [
          "Real-time chat with sellers and buyers",
          "Conversation list with search",
          "Unread message badges",
          "Read receipts (single/double checkmarks)",
          "500 character limit per message",
        ],
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
      },
      {
        icon: IconUser,
        title: "Your Account",
        description: "Manage your profile and listings",
        features: [
          "Dashboard: View stats and quick actions",
          "My Listings: Manage, renew, mark as sold",
          "Saved Searches: Re-run saved filter combinations",
          "Settings: Update profile, phone, city, avatar",
          "Security: Enable 2FA with QR code setup",
        ],
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
      },
    ],
    gotIt: "Got it!",
    swipeToExplore: "Scroll to explore",
  },
  sw: {
    title: "Jinsi ya Kutumia Motokah",
    subtitle: "Mwongozo wako wa kamili kununua na kuuza magari Afrika",
    sections: [
      {
        icon: IconSearch,
        title: "Tafuta & Gundua",
        description: "Pata gari lako kamili kwa zana za utaftaji zenye nguvu",
        features: [
          "Badilisha kati ya Magari, Biashara, na Pikipiki",
          "Tumia utaftaji wa maneno au vichujio vya kina",
          "Chuja kwa chapa, mfano, bei, mwaka, maili, eneo",
          "Panga kwa mpya, bei, au zilizotazamwa zaidi",
          "Hifadhi utaftaji kwa upataji wa haraka baadaye",
        ],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        icon: IconFilter,
        title: "Vichujio vya Kina",
        description: "Punguza matokeo kwa chaguzi za kuchuja",
        features: [
          "Chagua aina nyingi za magari na mafuta",
          "Weka kipimo cha bei cha chini/juu",
          "Chuja kwa gia (Manual/Automatic/CVT)",
          "Angalia hali ya ushuru (Umelipwa/Haujalipwa)",
          "Chuja kwa hali: Mpya, Iliyotumika, au Imported",
        ],
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
      {
        icon: IconHeart,
        title: "Hifadhi & Linganisha",
        description: "Weka rekodi ya matangazo uliopenda",
        features: [
          "Bonyeza moyo kuweka katika orodha ya matakwa",
          "Linganisha magari hadi 4 kwa pamoja",
          "Ona 'Bora' kwa bei, mwaka, maili",
          "Fikia vilivyohifadhiwa kutoka kwa Wasifu wako",
          "Shiriki matangazo kupitia WhatsApp au Facebook",
        ],
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      },
      {
        icon: IconBrandWhatsapp,
        title: "Wasiliana na Wauzaji",
        description: "Ungana na wauzaji kwa njia 3 rahisi",
        features: [
          "WhatsApp: Ujumbe ulijazwa mapema na maelezo",
          "Piga: Simu ya moja kwa moja kwa muuzaji",
          "Ujumbe: Mazungumzo ndani ya programu",
          "Tazama wasifu wa wauzaji na ukadiriaji",
          "Ripoti matangazo ya shaka kwa usalama",
        ],
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        icon: IconUpload,
        title: "Tangaza Gari Lako",
        description: "Uza gari lako kwa hatua 5 rahisi",
        features: [
          "Hatua 1: Habari za Msingi (Chapa, Mfano, Mwaka)",
          "Hatua 2: Maelezo (Gia, Mafuta, Rangi, Maili)",
          "Hatua 3: Picha (Hadi 10, MB 5 kila moja)",
          "Hatua 4: Bei & Eneo (Kichwa, Maelezo, Bei)",
          "Hatua 5: Pitia & Wasilisha (Inaenda baada ya kuidhinishwa)",
        ],
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
      },
      {
        icon: IconMessageCircle,
        title: "Ujumbe & Mazungumzo",
        description: "Wasiliana kwa usalama ndani ya programu",
        features: [
          "Mazungumzo ya muda halisi na wauzaji wanunuzi",
          "Orodha ya mazungumzo na utaftaji",
          "Alama za ujumbe usiosomwa",
          "Risiti za kusoma (alama moja/mbili)",
          "Kikomo cha herufi 500 kwa ujumbe",
        ],
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
      },
      {
        icon: IconUser,
        title: "Akaunti Yako",
        description: "Simamia wasifu na matangazo yako",
        features: [
          "Dashibodi: Tazama takwimu na vitendo vya haraka",
          "Matangazo Yangu: Simamia, upya, weka kama uliouza",
          "Utafutaji Ulihifadhi: Endesha upya michujo iliyohifadhiwa",
          "Mipangilio: Sasisha wasifu, simu, mji, picha",
          "Usalama: Wezesha 2FA na usanidi wa QR",
        ],
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
      },
    ],
    gotIt: "Nimeelewa!",
    swipeToExplore: "Sogeza kuchunguza",
  },
  fr: {
    title: "Comment Utiliser Motokah",
    subtitle: "Votre guide complet pour acheter et vendre des véhicules en Afrique",
    sections: [
      {
        icon: IconSearch,
        title: "Rechercher & Découvrir",
        description: "Trouvez votre véhicule idéal avec des outils de recherche puissants",
        features: [
          "Basculer entre les onglets Voitures, Commercial, Motos",
          "Utiliser la recherche par mot-clé ou les filtres avancés",
          "Filtrer par marque, modèle, prix, année, kilométrage, lieu",
          "Trier par plus récent, prix, ou plus consulté",
          "Enregistrer les recherches pour un accès rapide",
        ],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        icon: IconFilter,
        title: "Filtres Avancés",
        description: "Affinez les résultats avec des options de filtrage détaillées",
        features: [
          "Sélection multiple de types de carrosserie et carburants",
          "Définir une fourchette de prix min/max",
          "Filtrer par transmission (Manuelle/Automatique/CVT)",
          "Vérifier le statut des droits (Payé/Non Payé)",
          "Filtrer par état: Neuf, Occasion, ou Importé",
        ],
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
      {
        icon: IconHeart,
        title: "Enregistrer & Comparer",
        description: "Gardez une trace de vos annonces favorites",
        features: [
          "Cliquez sur le cœur pour enregistrer dans les favoris",
          "Comparez jusqu'à 4 véhicules côte à côte",
          "Voir les surlignages 'Meilleur' pour prix, année, kilométrage",
          "Accéder aux éléments enregistrés depuis votre Profil",
          "Partager des annonces via WhatsApp, Facebook, ou copier le lien",
        ],
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      },
      {
        icon: IconBrandWhatsapp,
        title: "Contacter les Vendeurs",
        description: "Connectez-vous avec les vendeurs en 3 façons faciles",
        features: [
          "WhatsApp: Message pré-rempli avec les détails de l'annonce",
          "Appel: Appel téléphonique direct au vendeur",
          "Message: Chat intégré avec accusés de lecture",
          "Voir les profils et évaluations des vendeurs",
          "Signaler les annonces suspectes pour la sécurité",
        ],
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        icon: IconUpload,
        title: "Publier Votre Annonce",
        description: "Vendez votre véhicule en 5 étapes simples",
        features: [
          "Étape 1: Infos de Base (Marque, Modèle, Année, Type)",
          "Étape 2: Détails (Transmission, Carburant, Couleur, Km)",
          "Étape 3: Photos (Jusqu'à 10 images, 5Mo chacune)",
          "Étape 4: Prix & Lieu (Titre, Description, Prix)",
          "Étape 5: Vérifier & Soumettre (En ligne après approbation)",
        ],
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
      },
      {
        icon: IconMessageCircle,
        title: "Messages & Chat",
        description: "Communiquez en toute sécurité dans l'application",
        features: [
          "Chat en temps réel avec vendeurs et acheteurs",
          "Liste de conversations avec recherche",
          "Badges de messages non lus",
          "Accusés de lecture (simple/double check)",
          "Limite de 500 caractères par message",
        ],
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
      },
      {
        icon: IconUser,
        title: "Votre Compte",
        description: "Gérez votre profil et vos annonces",
        features: [
          "Tableau de bord: Voir les statistiques et actions rapides",
          "Mes Annonces: Gérer, renouveler, marquer comme vendu",
          "Recherches Sauvegardées: Relancer les filtres enregistrés",
          "Paramètres: Mettre à jour profil, téléphone, ville, avatar",
          "Sécurité: Activer 2FA avec configuration QR",
        ],
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
      },
    ],
    gotIt: "Compris!",
    swipeToExplore: "Défiler pour explorer",
  },
  ar: {
    title: "كيفية استخدام موتوكاه",
    subtitle: "دليلك الشامل لشراء وبيع المركبات في أفريقيا",
    sections: [
      {
        icon: IconSearch,
        title: "البحث والاستكشاف",
        description: "اعثر على مركبتك المثالية بأدوات بحث قوية",
        features: [
          "التبديل بين علامات التبويب: سيارات وتجارية ودراجات",
          "استخدم البحث بالكلمة المفتاحية أو الفلاتر المتقدمة",
          "تصفية حسب الماركة والموديل والسعر والسنة والموقع",
          "الترتيب حسب الأحدث أو السعر أو الأكثر مشاهدة",
          "حفظ عمليات البحث للوصول السريع لاحقاً",
        ],
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        icon: IconFilter,
        title: "فلاتر متقدمة",
        description: "تضييق النتائج بخيارات تصفية مفصلة",
        features: [
          "اختيار متعدد لأنواع الهيكل والوقود",
          "تحديد نطاق السعر بقيم دنيا وعليا",
          "تصفية حسب ناقل الحركة (يدوي/أوتوماتيك/CVT)",
          "التحقق من حالة الرسوم (مدفوع/غير مدفوع)",
          "تصفية حسب الحالة: جديد، مستعمل، أو مستورد",
        ],
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
      {
        icon: IconHeart,
        title: "حفظ ومقارنة",
        description: "تتبع إعلاناتك المفضلة",
        features: [
          "انقر على القلب لحفظ في المفضلة",
          "قارن حتى 4 مركبات جنباً إلى جنب",
          "شاهد تمييز 'الأفضل' للسعر والسنة والكيلومتراج",
          "الوصول إلى العناصر المحفوظة من ملفك الشخصي",
          "مشاركة الإعلانات عبر واتساب أو فيسبوك",
        ],
        color: "text-red-500",
        bgColor: "bg-red-500/10",
      },
      {
        icon: IconBrandWhatsapp,
        title: "التواصل مع البائعين",
        description: "تواصل مع البائعين بـ 3 طرق سهلة",
        features: [
          "واتساب: رسالة مسبقة التعبئة بتفاصيل الإعلان",
          "اتصال: مكالمة هاتفية مباشرة للبائع",
          "رسالة: دردشة داخل التطبيق مع إيصالات القراءة",
          "عرض ملفات البائعين والتقييمات",
          "الإبلاغ عن الإعلانات المشبوهة للأمان",
        ],
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        icon: IconUpload,
        title: "نشر إعلانك",
        description: "بيع مركبتك في 5 خطوات بسيطة",
        features: [
          "الخطوة 1: المعلومات الأساسية (الماركة، الموديل، السنة)",
          "الخطوة 2: التفاصيل (ناقل الحركة، الوقود، اللون، الكيلومتراج)",
          "الخطوة 3: الصور (حتى 10 صور، 5 ميجا لكل صورة)",
          "الخطوة 4: السعر والموقع (العنوان، الوصف، السعر)",
          "الخطوة 5: مراجعة وإرسال (ينشر بعد الموافقة)",
        ],
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
      },
      {
        icon: IconMessageCircle,
        title: "الرسائل والدردشة",
        description: "تواصل بأمان داخل التطبيق",
        features: [
          "دردشة فورية مع البائعين والمشترين",
          "قائمة المحادثات مع البحث",
          "شارات الرسائل غير المقروءة",
          "إيصالات القراءة (علامة واحدة/اثنتان)",
          "حد 500 حرف لكل رسالة",
        ],
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
      },
      {
        icon: IconUser,
        title: "حسابك",
        description: "إدارة ملفك الشخصي وإعلاناتك",
        features: [
          "لوحة التحكم: عرض الإحصائيات والإجراءات السريعة",
          "إعلاناتي: إدارة وتجديد ووضع علامة كمباع",
          "عمليات البحث المحفوظة: إعادة تشغيل الفلاتر المحفوظة",
          "الإعدادات: تحديث الملف الشخصي والهاتف والمدينة",
          "الأمان: تفعيل المصادقة الثنائية مع إعداد QR",
        ],
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
      },
    ],
    gotIt: "فهمت!",
    swipeToExplore: "مرر للاستكشاف",
  },
};

// Animated diagram components
function SearchDiagram() {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      {/* Search bar mockup */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl"
      >
        <IconSearch size={18} className="text-muted-foreground" />
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="h-full bg-primary/50 rounded-full"
          />
        </div>
        <div className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-md">Search</div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {["Cars", "Commercial", "Bikes"].map((tab, i) => (
          <motion.div
            key={tab}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            viewport={{ once: true }}
            className={`flex-1 py-2 text-center text-xs font-medium rounded-lg border ${
              i === 0 ? "bg-primary/10 border-primary text-primary" : "bg-card border-border text-muted-foreground"
            }`}
          >
            {tab}
          </motion.div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {["Toyota", "Under 50M", "Automatic", "Dar es Salaam"].map((chip, i) => (
          <motion.div
            key={chip}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
            viewport={{ once: true }}
            className="flex items-center gap-1 px-2 py-1 bg-primary/10 border border-primary/20 text-primary text-xs rounded-full"
          >
            {chip}
            <IconX size={12} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FilterDiagram() {
  const [openSection, setOpenSection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setOpenSection((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const sections = [
    { label: "Vehicle Type", items: ["Sedan", "SUV", "Pickup"] },
    { label: "Price Range", items: ["Min: 10M", "Max: 50M"] },
    { label: "Transmission", items: ["Manual", "Automatic"] },
    { label: "Condition", items: ["New", "Used", "Foreign Used"] },
  ];

  return (
    <div className="w-full max-w-xs mx-auto bg-card border border-border rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <IconFilter size={16} className="text-primary" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      {sections.map((section, i) => (
        <motion.div
          key={section.label}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          viewport={{ once: true }}
          className="border border-border rounded-lg overflow-hidden"
        >
          <div className={`flex items-center justify-between px-3 py-2 ${
            openSection === i ? "bg-primary/5" : "bg-muted/30"
          }`}>
            <span className="text-xs font-medium">{section.label}</span>
            <motion.div animate={{ rotate: openSection === i ? 180 : 0 }}>
              <IconChevronDown size={14} />
            </motion.div>
          </div>

          <AnimatePresence>
            {openSection === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-3 pb-2 space-y-1"
              >
                {section.items.map((item, j) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: j * 0.1 }}
                    className="flex items-center gap-2 py-1"
                  >
                    <div className={`w-4 h-4 rounded border ${
                      j === 0 ? "bg-primary border-primary" : "border-border"
                    }`}>
                      {j === 0 && <IconCheck size={12} className="text-primary-foreground" />}
                    </div>
                    <span className="text-xs">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function WishlistDiagram() {
  const cars = [
    { name: "Toyota Harrier", price: "85M", year: "2021", saved: true },
    { name: "Nissan X-Trail", price: "55M", year: "2019", saved: true },
    { name: "Toyota RAV4", price: "72M", year: "2020", saved: false },
  ];

  return (
    <div className="w-full max-w-xs mx-auto space-y-2">
      {cars.map((car, i) => (
        <motion.div
          key={car.name}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 bg-card border border-border rounded-xl p-3"
        >
          <div className="w-12 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <IconCar size={20} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">{car.name}</div>
            <div className="text-[10px] text-muted-foreground">{car.year} · {car.price} TZS</div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
              viewport={{ once: true }}
              className={`w-7 h-7 rounded-full flex items-center justify-center ${car.saved ? "bg-red-500/10" : "bg-muted"}`}
            >
              <IconHeart size={14} className={car.saved ? "text-red-500 fill-red-500" : "text-muted-foreground"} />
            </motion.div>
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${i < 2 ? "border-primary bg-primary" : "border-border"}`}>
              {i < 2 && <IconCheck size={10} className="text-primary-foreground" />}
            </div>
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        viewport={{ once: true }}
        className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-3 py-2"
      >
        <span className="text-xs text-primary font-medium">Compare 2 selected</span>
        <div className="flex items-center gap-1 text-xs text-primary font-semibold">
          <IconScale size={14} />
          Compare
        </div>
      </motion.div>
    </div>
  );
}

function ContactDiagram() {
  return (
    <div className="w-full max-w-xs mx-auto space-y-3">
      {/* Seller card mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-border rounded-xl p-4 space-y-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <IconUser size={20} className="text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium">Safari Motors</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <IconStarFilled size={10} className="text-accent" />
              <span>4.9 (120 reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: IconBrandWhatsapp, label: "WhatsApp", color: "bg-green-500 text-white" },
            { icon: IconPhone, label: "Call", color: "bg-blue-500 text-white" },
            { icon: IconMessageCircle, label: "Message", color: "bg-primary text-primary-foreground" },
          ].map((btn, i) => (
            <motion.button
              key={btn.label}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg ${btn.color}`}
            >
              <btn.icon size={18} />
              <span className="text-[10px] font-medium">{btn.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function PostAdDiagram() {
  const steps = [
    { label: "Basic Info", icon: IconCar },
    { label: "Details", icon: IconGauge },
    { label: "Photos", icon: IconCamera },
    { label: "Price", icon: IconMapPin },
    { label: "Review", icon: IconCheck },
  ];

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex flex-col items-center ${
                i <= 2 ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                i <= 2 ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"
              }`}>
                {i < 2 ? (
                  <IconCheck size={16} />
                ) : i === 2 ? (
                  <step.icon size={16} />
                ) : (
                  <span className="text-xs">{i + 1}</span>
                )}
              </div>
              <span className="text-[10px] mt-1 whitespace-nowrap">{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                viewport={{ once: true }}
                className={`w-8 h-0.5 mx-1 origin-left ${
                  i < 2 ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form mockup */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-border rounded-xl p-4 space-y-3"
      >
        <div className="space-y-2">
          <label className="text-xs font-medium">Make</label>
          <div className="h-9 bg-muted rounded-md flex items-center px-3 text-xs">Toyota</div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium">Model</label>
          <div className="h-9 bg-muted rounded-md flex items-center px-3 text-xs">Hilux</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium">Year</label>
            <div className="h-9 bg-muted rounded-md flex items-center px-3 text-xs">2022</div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium">Price</label>
            <div className="h-9 bg-muted rounded-md flex items-center px-3 text-xs">125,000,000 TZS</div>
          </div>
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
          <IconUpload size={24} className="mx-auto text-muted-foreground mb-1" />
          <div className="text-xs text-muted-foreground">Upload photos</div>
        </div>
      </motion.div>
    </div>
  );
}

function ChatDiagram() {
  const messages = [
    { text: "Hi, is this still available?", sender: "me", time: "10:30" },
    { text: "Yes! When can you view it?", sender: "them", time: "10:32" },
    { text: "Tomorrow afternoon?", sender: "me", time: "10:35" },
  ];

  return (
    <div className="w-full max-w-xs mx-auto bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 px-3 py-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <IconUser size={16} />
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium">Safari Motors</div>
          <div className="text-[10px] text-green-500">Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="p-3 space-y-2 min-h-[120px]">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, x: msg.sender === "me" ? 20 : -20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: i * 0.3 }}
            viewport={{ once: true }}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${
              msg.sender === "me"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted rounded-bl-md"
            }`}>
              {msg.text}
              <div className={`text-[9px] mt-1 ${
                msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}>
                {msg.time} {msg.sender === "me" && <span>✓✓</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border p-2 flex gap-2">
        <div className="flex-1 h-8 bg-muted rounded-full px-3 text-xs flex items-center">
          Type a message...
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <IconSend size={14} className="text-primary-foreground" />
        </div>
      </div>
    </div>
  );
}

function AccountDiagram() {
  const tabs = [
    { icon: IconLayoutDashboard, label: "Dashboard", active: true },
    { icon: IconCar, label: "Listings", active: false },
    { icon: IconBookmark, label: "Searches", active: false },
    { icon: IconShieldLock, label: "Security", active: false },
  ];

  return (
    <div className="w-full max-w-xs mx-auto space-y-3">
      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {tabs.map((tab, i) => (
          <motion.div
            key={tab.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-md text-[10px] ${
              tab.active ? "bg-card text-primary font-medium shadow-sm" : "text-muted-foreground"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </motion.div>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: IconCar, label: "Active", value: "5" },
          { icon: IconHeart, label: "Wishlist", value: "12" },
          { icon: IconMessageCircle, label: "Messages", value: "3" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-lg p-2 text-center"
          >
            <stat.icon size={16} className="mx-auto text-primary mb-1" />
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary text-primary-foreground rounded-lg p-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <IconPlus size={18} />
          <span className="text-sm font-medium">Post New Ad</span>
        </div>
        <IconArrowRight size={18} />
      </motion.div>
    </div>
  );
}

const diagrams = [SearchDiagram, FilterDiagram, WishlistDiagram, ContactDiagram, PostAdDiagram, ChatDiagram, AccountDiagram];

export default function HelpGuide({ isOpen, onClose, lang }: HelpGuideProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const t = translations[lang];
  const isRTL = lang === "ar";

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    const sectionHeight = scrollRef.current.scrollHeight / t.sections.length;
    const newActive = Math.min(
      Math.floor(scrollTop / sectionHeight + 0.5),
      t.sections.length - 1
    );
    setActiveSection(newActive);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute inset-4 md:inset-10 lg:inset-20 bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <IconHelpCircle size={22} className="text-primary" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <h2 className="text-lg font-bold">{t.title}</h2>
                <p className="text-xs text-muted-foreground">{t.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <IconX size={16} />
            </button>
          </div>

          {/* Content */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto overscroll-contain"
          >
            <div className="max-w-2xl mx-auto px-6 py-8 space-y-12">
              {t.sections.map((section, index) => {
                const DiagramComponent = diagrams[index];
                return (
                  <motion.section
                    key={section.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Section header */}
                    <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className={`w-14 h-14 rounded-2xl ${section.bgColor} flex items-center justify-center shrink-0`}
                      >
                        <section.icon size={28} className={section.color} />
                      </motion.div>
                      <div className={isRTL ? "text-right" : ""}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-primary">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-xl font-bold">{section.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                    </div>

                    {/* Diagram */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="py-4"
                    >
                      <DiagramComponent />
                    </motion.div>

                    {/* Features list */}
                    <div className={`space-y-3 ${isRTL ? "text-right" : ""}`}>
                      {section.features.map((feature, fi) => (
                        <motion.div
                          key={fi}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * fi }}
                          className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <IconCheck size={12} className="text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Divider */}
                    {index < t.sections.length - 1 && (
                      <div className="h-px bg-border mt-8" />
                    )}
                  </motion.section>
                );
              })}

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-8 pb-4 text-center"
              >
                <Button onClick={onClose} className="h-12 px-8 font-semibold">
                  {t.gotIt}
                </Button>
                <p className="text-xs text-muted-foreground mt-4">{t.swipeToExplore}</p>
              </motion.div>
            </div>
          </div>

          {/* Section dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {t.sections.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  if (scrollRef.current) {
                    const sectionHeight = scrollRef.current.scrollHeight / t.sections.length;
                    scrollRef.current.scrollTo({
                      top: sectionHeight * i,
                      behavior: "smooth",
                    });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeSection ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
