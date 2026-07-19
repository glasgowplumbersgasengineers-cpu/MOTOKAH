import { Link, useLocation } from "react-router-dom";
import { IconHome, IconSpeakerphone, IconPlus, IconMessage, IconMenu2 } from "@tabler/icons-react";
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

  if (["/marketing-plan", "/dealer-leads", "/welcome", "/sell"].includes(location.pathname)) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border"
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
