import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";

const tabs = [
  { label: "Used Cars", href: "/search" },
  { label: "New Cars",  href: "/search?condition=New" },
  { label: "Bikes",     href: "/search?vehicleType=bike" },
  { label: "Boats",     href: "/search?vehicleType=boat" },
];

export default function StickySearchBar() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = () => {
    const base = tabs[activeTab].href;
    const sep = base.includes("?") ? "&" : "?";
    navigate(query.trim() ? `${base}${sep}q=${encodeURIComponent(query.trim())}` : base);
  };

  return (
    <div
      className={`lg:hidden fixed top-[58px] left-0 right-0 z-[45] bg-card border-b border-border shadow-sm transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="container mx-auto px-3 py-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Type tabs */}
        <div className="flex gap-1 shrink-0">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => { setActiveTab(i); navigate(tab.href); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search used cars..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleSearch}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shrink-0"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
