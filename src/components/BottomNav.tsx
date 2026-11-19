import { useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconHome, IconSpeakerphone, IconPlus, IconMessage, IconMenu2 } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";

const tabs = [
  { label: "Home",    icon: IconHome,         href: "/" },
  { label: "My Ads",  icon: IconSpeakerphone, href: "/profile" },
  { label: "Sell",    icon: IconPlus,         href: "/sell",    center: true },
  { label: "Chat",    icon: IconMessage,      href: "/messages" },
  { label: "More",    icon: IconMenu2,        href: "/how-it-works" },
];

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  const hidden = ["/marketing-plan", "/dealer-leads", "/welcome", "/sell", "/auth"].includes(location.pathname);

  // The bar is fixed over the page, so publish its real height (safe area included) and let
  // index.css reserve that space at the bottom of every page. Pages no longer need their own
  // pb-20, and nothing can end up hidden behind the bar.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const nav = navRef.current;
    if (hidden || !nav) {
      delete document.body.dataset.bottomNav;
      return;
    }
    const update = () => root.style.setProperty("--bottom-nav-h", `${Math.ceil(nav.getBoundingClientRect().height)}px`);
    update();
    document.body.dataset.bottomNav = "true";
    const observer = new ResizeObserver(update);
    observer.observe(nav);
    return () => {
      observer.disconnect();
      delete document.body.dataset.bottomNav;
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <nav
      ref={navRef}
      className="bottom-nav fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-end justify-around px-2 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.href;
          const href = (tab.href === "/profile" || tab.href === "/messages") && !user
            ? "/auth"
            : tab.href;

          if (tab.center) {
            return (
              <Link
                key={tab.label}
                to={user ? tab.href : "/auth"}
                className="flex flex-col items-center gap-0.5 -mt-4"
              >
                <span className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                  <Icon size={26} stroke={2.5} className="text-primary-foreground" />
                </span>
                <span className="text-[10px] font-medium text-muted-foreground pb-1">{tab.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.label}
              to={href}
              className={`flex flex-col items-center gap-0.5 pb-1 min-w-[48px] transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={22} stroke={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
