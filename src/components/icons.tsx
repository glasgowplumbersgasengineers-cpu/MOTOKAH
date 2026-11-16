// Single icon set for the whole app: Phosphor (open source, MIT). Every screen imports
// icons from here, so the look stays consistent. The export names match the old Tabler
// and Lucide names so pages did not need rewriting.
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import {
  Anchor as PhAnchor,
  Armchair as PhArmchair,
  ArrowClockwise as PhArrowClockwise,
  ArrowLeft as PhArrowLeft,
  ArrowRight as PhArrowRight,
  ArrowSquareOut as PhArrowSquareOut,
  Article as PhArticle,
  Bank as PhBank,
  Bell as PhBell,
  BellRinging as PhBellRinging,
  Bookmark as PhBookmark,
  BookmarkSimple as PhBookmarkSimple,
  Briefcase as PhBriefcase,
  Bus as PhBus,
  Calculator as PhCalculator,
  Calendar as PhCalendar,
  CalendarBlank as PhCalendarBlank,
  Camera as PhCamera,
  Car as PhCar,
  CaretDown as PhCaretDown,
  CaretLeft as PhCaretLeft,
  CaretRight as PhCaretRight,
  CaretUp as PhCaretUp,
  Certificate as PhCertificate,
  ChartBar as PhChartBar,
  ChatCircle as PhChatCircle,
  ChatText as PhChatText,
  Check as PhCheck,
  CheckCircle as PhCheckCircle,
  Checks as PhChecks,
  Circle as PhCircle,
  CircleNotch as PhCircleNotch,
  ClipboardText as PhClipboardText,
  Clock as PhClock,
  ClockClockwise as PhClockClockwise,
  Code as PhCode,
  Coin as PhCoin,
  Copy as PhCopy,
  Crown as PhCrown,
  CurrencyDollar as PhCurrencyDollar,
  DeviceMobile as PhDeviceMobile,
  Diamond as PhDiamond,
  Dot as PhDot,
  DotsSixVertical as PhDotsSixVertical,
  DotsThree as PhDotsThree,
  DotsThreeVertical as PhDotsThreeVertical,
  Download as PhDownload,
  Engine as PhEngine,
  Envelope as PhEnvelope,
  Eye as PhEye,
  EyeSlash as PhEyeSlash,
  FacebookLogo as PhFacebookLogo,
  FileCode as PhFileCode,
  FileImage as PhFileImage,
  FilePdf as PhFilePdf,
  FileText as PhFileText,
  Flag as PhFlag,
  Flame as PhFlame,
  Funnel as PhFunnel,
  GasPump as PhGasPump,
  Gauge as PhGauge,
  GearSix as PhGearSix,
  Globe as PhGlobe,
  GlobeHemisphereEast as PhGlobeHemisphereEast,
  GridFour as PhGridFour,
  HandGrabbing as PhHandGrabbing,
  Heart as PhHeart,
  House as PhHouse,
  Image as PhImage,
  Images as PhImages,
  Info as PhInfo,
  InstagramLogo as PhInstagramLogo,
  Lightning as PhLightning,
  Link as PhLink,
  List as PhList,
  ListChecks as PhListChecks,
  ListNumbers as PhListNumbers,
  Lock as PhLock,
  MagnifyingGlass as PhMagnifyingGlass,
  MagnifyingGlassPlus as PhMagnifyingGlassPlus,
  MapPin as PhMapPin,
  Megaphone as PhMegaphone,
  Money as PhMoney,
  Moon as PhMoon,
  Motorcycle as PhMotorcycle,
  Newspaper as PhNewspaper,
  PaintBrush as PhPaintBrush,
  PaperPlaneTilt as PhPaperPlaneTilt,
  Pause as PhPause,
  PencilSimple as PhPencilSimple,
  Phone as PhPhone,
  PhoneCall as PhPhoneCall,
  Play as PhPlay,
  Plus as PhPlus,
  Printer as PhPrinter,
  Prohibit as PhProhibit,
  Pulse as PhPulse,
  QrCode as PhQrCode,
  Question as PhQuestion,
  Quotes as PhQuotes,
  Robot as PhRobot,
  Rocket as PhRocket,
  Sailboat as PhSailboat,
  Scales as PhScales,
  SealCheck as PhSealCheck,
  Share as PhShare,
  Shield as PhShield,
  ShieldCheck as PhShieldCheck,
  SidebarSimple as PhSidebarSimple,
  SortDescending as PhSortDescending,
  SquaresFour as PhSquaresFour,
  Star as PhStar,
  Storefront as PhStorefront,
  Sun as PhSun,
  Target as PhTarget,
  TestTube as PhTestTube,
  TextB as PhTextB,
  TextHOne as PhTextHOne,
  TextHTwo as PhTextHTwo,
  TextItalic as PhTextItalic,
  Translate as PhTranslate,
  Trash as PhTrash,
  TrendDown as PhTrendDown,
  TrendUp as PhTrendUp,
  Trophy as PhTrophy,
  Truck as PhTruck,
  Upload as PhUpload,
  User as PhUser,
  UserCheck as PhUserCheck,
  UserMinus as PhUserMinus,
  Users as PhUsers,
  Video as PhVideo,
  Warning as PhWarning,
  WarningCircle as PhWarningCircle,
  WhatsappLogo as PhWhatsappLogo,
  X as PhX,
  XLogo as PhXLogo,
  type Icon as PhosphorIcon,
  type IconWeight,
} from "@phosphor-icons/react";

type Props = Omit<ComponentPropsWithoutRef<PhosphorIcon>, "weight" | "stroke" | "strokeWidth"> & {
  weight?: IconWeight;
  /** Tabler / Lucide stroke props: ignored, Phosphor weights replace them. */
  stroke?: number | string;
  strokeWidth?: number | string;
};

// Large icons get the two-tone style; small UI icons (chevrons, close, checks) stay crisp.
function make(Ph: PhosphorIcon, fixed?: IconWeight, ui = false) {
  const Wrapped = forwardRef<SVGSVGElement, Props>(({ size = 24, weight, stroke: _s, strokeWidth: _w, fill, className, ...rest }, ref) => {
    const filled = (fill && fill !== "none") || /(^|\s)fill-(?!none)/.test(className ?? "");
    const auto: IconWeight = filled ? "fill" : ui || Number(size) < 18 ? "bold" : "duotone";
    return <Ph ref={ref} size={size} weight={weight ?? fixed ?? auto} className={className} {...rest} />;
  });
  Wrapped.displayName = Ph.displayName;
  return Wrapped;
}

export const ArrowLeft = make(PhArrowLeft, undefined, true);
export const ArrowRight = make(PhArrowRight, undefined, true);
export const Check = make(PhCheck, undefined, true);
export const ChevronDown = make(PhCaretDown, undefined, true);
export const ChevronLeft = make(PhCaretLeft, undefined, true);
export const ChevronRight = make(PhCaretRight, undefined, true);
export const ChevronUp = make(PhCaretUp, undefined, true);
export const Circle = make(PhCircle, undefined, true);
export const Dot = make(PhDot, undefined, true);
export const Download = make(PhDownload, undefined, true);
export const Eye = make(PhEye, undefined, true);
export const EyeOff = make(PhEyeSlash, undefined, true);
export const FileCode = make(PhFileCode, undefined, true);
export const FileImage = make(PhFileImage, undefined, true);
export const Globe = make(PhGlobe, undefined, true);
export const GripVertical = make(PhDotsSixVertical, undefined, true);
export const IconActivity = make(PhPulse);
export const IconAlertCircle = make(PhWarningCircle);
export const IconAlertTriangle = make(PhWarning);
export const IconAnchor = make(PhAnchor);
export const IconArmchair = make(PhArmchair);
export const IconArrowLeft = make(PhArrowLeft);
export const IconArrowRight = make(PhArrowRight);
export const IconArticle = make(PhArticle);
export const IconBan = make(PhProhibit);
export const IconBell = make(PhBell);
export const IconBellRinging = make(PhBellRinging);
export const IconBold = make(PhTextB);
export const IconBolt = make(PhLightning);
export const IconBookmark = make(PhBookmark);
export const IconBookmarkFilled = make(PhBookmarkSimple, "fill");
export const IconBrandFacebook = make(PhFacebookLogo);
export const IconBrandInstagram = make(PhInstagramLogo);
export const IconBrandTwitter = make(PhXLogo);
export const IconBrandWhatsapp = make(PhWhatsappLogo);
export const IconBriefcase = make(PhBriefcase);
export const IconBuildingBank = make(PhBank);
export const IconBuildingStore = make(PhStorefront);
export const IconBus = make(PhBus);
export const IconCalculator = make(PhCalculator);
export const IconCalendar = make(PhCalendar);
export const IconCalendarEvent = make(PhCalendarBlank);
export const IconCamera = make(PhCamera);
export const IconCar = make(PhCar);
export const IconCash = make(PhMoney);
export const IconCertificate = make(PhCertificate);
export const IconChartBar = make(PhChartBar);
export const IconCheck = make(PhCheck);
export const IconChecklist = make(PhListChecks);
export const IconChecks = make(PhChecks);
export const IconChevronDown = make(PhCaretDown);
export const IconChevronLeft = make(PhCaretLeft);
export const IconChevronRight = make(PhCaretRight);
export const IconChevronUp = make(PhCaretUp);
export const IconCircleCheck = make(PhCheckCircle);
export const IconClipboardCheck = make(PhClipboardText);
export const IconClock = make(PhClock);
export const IconClockHour4 = make(PhClock);
export const IconClockPlus = make(PhClockClockwise);
export const IconCode = make(PhCode);
export const IconCoin = make(PhCoin);
export const IconCopy = make(PhCopy);
export const IconCrown = make(PhCrown);
export const IconCurrencyDollar = make(PhCurrencyDollar);
export const IconDeviceMobile = make(PhDeviceMobile);
export const IconDiamond = make(PhDiamond);
export const IconDotsVertical = make(PhDotsThreeVertical);
export const IconDownload = make(PhDownload);
export const IconEdit = make(PhPencilSimple);
export const IconEngine = make(PhEngine);
export const IconExternalLink = make(PhArrowSquareOut);
export const IconEye = make(PhEye);
export const IconEyeOff = make(PhEyeSlash);
export const IconFileCheck = make(PhSealCheck);
export const IconFileText = make(PhFileText);
export const IconFileTypePdf = make(PhFilePdf);
export const IconFilter = make(PhFunnel);
export const IconFlag = make(PhFlag);
export const IconFlame = make(PhFlame);
export const IconGasStation = make(PhGasPump);
export const IconGauge = make(PhGauge);
export const IconGlobe = make(PhGlobe);
export const IconH1 = make(PhTextHOne);
export const IconH2 = make(PhTextHTwo);
export const IconHandGrab = make(PhHandGrabbing);
export const IconHeart = make(PhHeart);
export const IconHeartFilled = make(PhHeart, "fill");
export const IconHelpCircle = make(PhQuestion);
export const IconHome = make(PhHouse);
export const IconInfoCircle = make(PhInfo);
export const IconItalic = make(PhTextItalic);
export const IconLanguage = make(PhTranslate);
export const IconLayoutDashboard = make(PhSquaresFour);
export const IconLayoutGrid = make(PhGridFour);
export const IconLink = make(PhLink);
export const IconList = make(PhList);
export const IconListCheck = make(PhListChecks);
export const IconListNumbers = make(PhListNumbers);
export const IconLoader = make(PhCircleNotch, "bold");
export const IconLoader2 = make(PhCircleNotch, "bold");
export const IconLock = make(PhLock);
export const IconMail = make(PhEnvelope);
export const IconManualGearbox = make(PhGearSix);
export const IconMapPin = make(PhMapPin);
export const IconMenu2 = make(PhList, "bold");
export const IconMessage = make(PhChatText);
export const IconMessageCircle = make(PhChatCircle);
export const IconMoon = make(PhMoon);
export const IconMotorbike = make(PhMotorcycle);
export const IconNews = make(PhNewspaper);
export const IconPaint = make(PhPaintBrush);
export const IconPhone = make(PhPhone);
export const IconPhoneCall = make(PhPhoneCall);
export const IconPhoto = make(PhImage);
export const IconPlayerPause = make(PhPause);
export const IconPlayerPlay = make(PhPlay);
export const IconPlus = make(PhPlus);
export const IconPrinter = make(PhPrinter);
export const IconQrcode = make(PhQrCode);
export const IconQuote = make(PhQuotes);
export const IconRefresh = make(PhArrowClockwise);
export const IconRobot = make(PhRobot);
export const IconRocket = make(PhRocket);
export const IconRotateClockwise = make(PhArrowClockwise);
export const IconSailboat = make(PhSailboat);
export const IconScale = make(PhScales);
export const IconSearch = make(PhMagnifyingGlass);
export const IconSend = make(PhPaperPlaneTilt);
export const IconShare = make(PhShare);
export const IconShield = make(PhShield);
export const IconShieldCheck = make(PhShieldCheck);
export const IconShieldLock = make(PhShieldCheck);
export const IconSortDescending = make(PhSortDescending);
export const IconSpeakerphone = make(PhMegaphone);
export const IconStar = make(PhStar);
export const IconStarFilled = make(PhStar, "fill");
export const IconSun = make(PhSun);
export const IconTarget = make(PhTarget);
export const IconTargetArrow = make(PhTarget);
export const IconTestPipe = make(PhTestTube);
export const IconTrash = make(PhTrash);
export const IconTrendingDown = make(PhTrendDown);
export const IconTrendingUp = make(PhTrendUp);
export const IconTrophy = make(PhTrophy);
export const IconTruck = make(PhTruck);
export const IconUpload = make(PhUpload);
export const IconUser = make(PhUser);
export const IconUserCheck = make(PhUserCheck);
export const IconUserOff = make(PhUserMinus);
export const IconUsers = make(PhUsers);
export const IconVideo = make(PhVideo);
export const IconWorld = make(PhGlobeHemisphereEast);
export const IconX = make(PhX);
export const IconZoomIn = make(PhMagnifyingGlassPlus);
export const Images = make(PhImages, undefined, true);
export const Info = make(PhInfo, undefined, true);
export const Loader2 = make(PhCircleNotch, "bold", true);
export const Mail = make(PhEnvelope, undefined, true);
export const MapPin = make(PhMapPin, undefined, true);
export const MoreHorizontal = make(PhDotsThree, undefined, true);
export const PanelLeft = make(PhSidebarSimple, undefined, true);
export const Phone = make(PhPhone, undefined, true);
export const Search = make(PhMagnifyingGlass, undefined, true);
export const User = make(PhUser, undefined, true);
export const X = make(PhX, undefined, true);
