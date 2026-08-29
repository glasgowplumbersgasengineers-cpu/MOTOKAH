import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconMenu2, IconSun, IconMoon, IconUser, IconMapPin, IconChevronDown, IconHelpCircle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "@/contexts/LocationContext";
import NotificationBell from "@/components/NotificationBell";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import HelpGuide from "@/components/HelpGuide";

const navLinks = [
  { key: "nav.usedCars", href: "/search" },
  { key: "nav.newCars", href: "/search?condition=New" },
  { key: "nav.commercial", href: "/search?vehicleType=commercial" },
  { key: "nav.bikes", href: "/search?vehicleType=bike" },
  { key: "nav.boats", href: "/search?vehicleType=boat" },
  { key: "nav.dealers", href: "/dealers" },
  { key: "nav.dealerContacts", href: "/dealer-leads", label: "Dealer Contacts" },
  { key: "nav.compare", href: "/compare" },
  { key: "nav.blog", href: "/blog" },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { city, country } = useLocation();
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const locationLabel = city || (country !== "All" ? country : "");
  const changeLocationPath = "/welcome?change=location";

  return (
    <>
    <EmailVerificationBanner />
    <header className="sticky top-0 z-50 border-b-2 border-primary bg-card backdrop-blur-md safe-top">
      <div className="container mx-auto flex items-center justify-between py-3">
        {/* Logo */}
        <Link to="/" className="flex flex-col">
          <span className="text-2xl font-extrabold text-primary tracking-tight">Motokah</span>
          <span className="text-[10px] text-muted-foreground hidden sm:block">Find Your Perfect Ride</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.key} to={link.href} className="px-3 py-2 text-sm text-secondary-foreground hover:text-primary transition-colors rounded-md hover:bg-secondary">
              {"label" in link ? link.label : t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Location Indicator */}
          <button 
            onClick={() => navigate(changeLocationPath)}
            className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <IconMapPin size={14} />
            <span className="max-w-[100px] truncate">{locationLabel || "Set location"}</span>
            <IconChevronDown size={12} />
          </button>

          {/* Language Switcher — desktop only; mobile uses sheet menu */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            {theme === "dark" ? <IconSun size={18} stroke={2.5} /> : <IconMoon size={18} stroke={2.5} />}
          </button>

          {/* Notifications */}
          <NotificationBell />

          {user ? (
            <Button variant="outline" size="sm" onClick={() => navigate("/profile")} className="hidden sm:inline-flex border-border text-foreground hover:bg-secondary gap-1">
              <IconUser size={16} /> {t("nav.profile")}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="hidden sm:inline-flex border-border text-foreground hover:bg-secondary">
              {t("nav.signIn")}
            </Button>
          )}
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" onClick={() => navigate("/sell")}>
            {t("nav.postAd")}
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <IconMenu2 size={22} stroke={2.5} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface-2 border-border flex flex-col overflow-hidden" onOpenAutoFocus={e => e.preventDefault()}>
              <SheetTitle className="text-primary font-bold text-lg">Motokah</SheetTitle>
              <nav className="flex flex-col gap-1 mt-6 overflow-y-auto flex-1">
                {navLinks.map(link => (
                  <SheetClose asChild key={link.key}>
                    <Link to={link.href} className="px-3 py-3 text-sm text-secondary-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors">
                      {"label" in link ? link.label : t(link.key)}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link to={changeLocationPath} className="flex items-center gap-2 px-3 py-3 text-sm text-secondary-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors">
                    <IconMapPin size={18} stroke={2.5} />
                    Change Location{locationLabel ? ` (${locationLabel})` : ""}
                  </Link>
                </SheetClose>
                {user && (
                  <>
                    <SheetClose asChild>
                      <Link to="/profile" className="px-3 py-3 text-sm text-secondary-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors">{t("nav.profile")}</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/wishlist" className="px-3 py-3 text-sm text-secondary-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors">{t("nav.wishlist")}</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/messages" className="px-3 py-3 text-sm text-secondary-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors">{t("nav.messages")}</Link>
                    </SheetClose>
                  </>
                )}
                <hr className="border-border my-2" />
                {/* Language switcher in mobile menu */}
                <LanguageSwitcher mobile />
                <hr className="border-border my-2" />
                <SheetClose asChild>
                  <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-3 text-sm text-secondary-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors">
                    {theme === "dark" ? <IconSun size={18} stroke={2.5} /> : <IconMoon size={18} stroke={2.5} />}
                    {theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
                  </button>
                </SheetClose>
                <button 
                  onClick={() => setShowHelp(true)} 
                  className="flex items-center gap-2 px-3 py-3 text-sm text-secondary-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                >
                  <IconHelpCircle size={18} stroke={2.5} />
                  How to Use
                </button>
                {user ? null : (
                  <SheetClose asChild>
                    <Link to="/auth"><Button variant="outline" className="border-border text-foreground w-full">{t("nav.signIn")}</Button></Link>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Link to="/sell"><Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full">{t("nav.postAd")}</Button></Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} lang={lang} />
    </>
  );
}
