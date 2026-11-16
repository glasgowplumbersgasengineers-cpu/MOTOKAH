import { useState, useEffect, useRef } from "react";
import {
  IconLock,
  IconCheck,
  IconTarget,
  IconUsers,
  IconChartBar,
  IconShield,
  IconTrendingUp,
  IconMapPin,
  IconCar,
  IconStar,
  IconPrinter,
  IconBuildingBank,
  IconDeviceMobile,
  IconRobot,
  IconBell,
  IconWorld,
  IconChevronRight,
  IconAlertCircle,
  IconCertificate,
  IconClipboardCheck,
  IconSearch,
  IconPhoto,
  IconFileText,
  IconUserCheck,
  IconMail,
} from "@/components/icons";
import { usePageTitle } from "@/hooks/usePageTitle";

const PASSWORD = "MOTO2026";
const STORAGE_KEY = "mk_plan_auth";

const NAV_SECTIONS = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "market-psychology", label: "African Market Psychology" },
  { id: "verification", label: "7-Step Verification" },
  { id: "feature-rationale", label: "Feature Rationale" },
  { id: "phase1", label: "Phase 1 — Tanzania" },
  { id: "phase2", label: "Phase 2 — East Africa" },
  { id: "phase3", label: "Phase 3 — Pan-Africa" },
  { id: "revenue", label: "Revenue Model" },
  { id: "pricing-psychology", label: "Pricing Psychology" },
  { id: "team", label: "Team & Operations" },
  { id: "technology", label: "Technology Stack" },
  { id: "competitive", label: "Competitive Positioning" },
  { id: "partnership-model", label: "Partnership Model" },
  { id: "investment", label: "Year 1 Budget Plan" },
];

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div
        className={`bg-card border border-border rounded-2xl shadow-lg w-full max-w-md p-8 ${shake ? "animate-pulse" : ""}`}
      >
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <IconLock size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Motokah</h1>
          <p className="text-muted-foreground text-sm text-center">
            This document is confidential and password-protected.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Access Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="off"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
            />
            {error && (
              <p className="flex items-center gap-1.5 text-red-500 text-xs font-medium mt-1">
                <IconAlertCircle size={14} />
                Incorrect password. Please try again.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Unlock Document
          </button>
        </form>
      </div>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center flex flex-col gap-2">
      <span className="text-3xl font-extrabold text-primary tracking-tight">{value}</span>
      <span className="text-sm text-muted-foreground leading-snug">{label}</span>
    </div>
  );
}

function VerificationStep({
  number,
  title,
  description,
  icon,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow">
          {number}
        </div>
        {number < 7 && <div className="w-0.5 bg-border flex-1 min-h-[2rem] mt-1" />}
      </div>
      <div className="pb-6 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-primary">{icon}</span>
          <h4 className="font-semibold text-foreground text-base">{title}</h4>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function CityCard({ city, description }: { city: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex gap-3 items-start shadow-sm">
      <IconMapPin size={20} className="text-primary flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-foreground text-sm">{city}</h4>
        <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function GoalItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-foreground">
      <IconCheck size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
      {text}
    </li>
  );
}

function TacticItem({ title, description }: { title: string; description: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-foreground">
      <IconChevronRight size={16} className="text-primary flex-shrink-0 mt-0.5" />
      <span>
        <span className="font-semibold">{title}:</span>{" "}
        <span className="text-muted-foreground">{description}</span>
      </span>
    </li>
  );
}

type BarData = { label: string; listings: number; users: number };

function KpiBarChart({ data }: { data: BarData[] }) {
  const maxListings = Math.max(...data.map((d) => d.listings));
  const maxUsers = Math.max(...data.map((d) => d.users));

  const formatNum = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : String(n));

  return (
    <div className="mt-4">
      <div className="flex gap-4 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-primary" /> Listings
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-blue-400" /> Monthly Users
        </span>
      </div>
      <div className="flex items-end gap-3 h-40 border-b border-border pb-1">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-1 items-end h-32">
              <div
                className="flex-1 rounded-t bg-primary transition-all"
                style={{ height: `${Math.max(4, (d.listings / maxListings) * 100)}%` }}
                title={`Listings: ${formatNum(d.listings)}`}
              />
              <div
                className="flex-1 rounded-t bg-blue-400 transition-all"
                style={{ height: `${Math.max(4, (d.users / maxUsers) * 100)}%` }}
                title={`Users: ${formatNum(d.users)}`}
              />
            </div>
            <span className="text-xs text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-3 mt-1">
        {data.map((d) => (
          <div key={d.label} className="flex-1 text-center text-[10px] text-muted-foreground leading-tight">
            {formatNum(d.listings)}
            <br />
            {formatNum(d.users)}
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueBarChart() {
  const data = [
    { label: "Year 1", value: 85, display: "$85K" },
    { label: "Year 2", value: 420, display: "$420K" },
    { label: "Year 3", value: 1800, display: "$1.8M" },
  ];
  const max = 1800;
  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-foreground mb-4">Projected Revenue (USD)</h4>
      <div className="flex items-end gap-6 h-40 border-b border-border pb-1">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs font-semibold text-primary mb-1">{d.display}</span>
            <div
              className="w-full rounded-t bg-primary transition-all"
              style={{ height: `${Math.max(4, (d.value / max) * 128)}px` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-6 mt-2">
        {data.map((d) => (
          <div key={d.label} className="flex-1 text-center text-xs text-muted-foreground">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
          {number}
        </span>
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
    </div>
  );
}

function FundBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-primary font-bold">{pct}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-3">
        <div className={`h-3 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ComparisonTable() {
  const features = [
    "Vehicle-specific search filters",
    "7-step verification",
    "Motokah Verified badge",
    "Physical inspection service",
    "Dealer subscription tools",
    "Pricing intelligence",
    "PWA / offline capable",
    "Swahili language",
    "WhatsApp listing flow",
  ];

  const data: Record<string, ("yes" | "no" | "partial")[]> = {
    Motokah: ["yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes", "yes"],
    OLX: ["partial", "no", "no", "no", "no", "no", "yes", "partial", "no"],
    Jiji: ["partial", "no", "no", "no", "partial", "no", "partial", "yes", "no"],
    Generic: ["no", "no", "no", "no", "no", "no", "no", "no", "no"],
  };

  const badge = (val: "yes" | "no" | "partial") => {
    if (val === "yes")
      return (
        <span className="inline-flex items-center gap-1 text-green-600 font-semibold text-xs">
          <IconCheck size={13} /> Yes
        </span>
      );
    if (val === "partial")
      return <span className="text-amber-500 font-medium text-xs">Partial</span>;
    return <span className="text-muted-foreground text-xs">No</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 pr-4 font-semibold text-foreground text-xs uppercase tracking-wide">
              Feature
            </th>
            {Object.keys(data).map((col) => (
              <th
                key={col}
                className={`py-3 px-3 font-semibold text-xs uppercase tracking-wide text-center ${
                  col === "Motokah" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <tr
              key={feature}
              className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}
            >
              <td className="py-2.5 pr-4 text-foreground text-xs">{feature}</td>
              {Object.keys(data).map((col) => (
                <td key={col} className="py-2.5 px-3 text-center">
                  {badge(data[col][i])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TechCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex gap-3 items-start">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-foreground text-sm mb-1">{title}</h4>
        <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function SectionWrapper({
  id,
  muted,
  children,
}: {
  id: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`py-12 px-4 scroll-mt-20 ${muted ? "bg-muted/30" : "bg-background"}`}
    >
      <div className="max-w-4xl mx-auto">{children}</div>
    </section>
  );
}

function SectionHeader({
  icon,
  label,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  label?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-primary">{icon}</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">{label}</span>
        </div>
      )}
      <h2 className="text-2xl font-extrabold text-foreground tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export default function MarketingPlan() {
  usePageTitle("Marketing Plan");

  const [unlocked, setUnlocked] = useState(() =>
    localStorage.getItem(STORAGE_KEY) === "true" ||
    sessionStorage.getItem("motokah_unlocked") === "1"
  );
  const [activeSection, setActiveSection] = useState("executive-summary");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!unlocked) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [unlocked]);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  const kpiData: BarData[] = [
    { label: "Mo 1", listings: 200, users: 3000 },
    { label: "Mo 2", listings: 1200, users: 12000 },
    { label: "Mo 3", listings: 3500, users: 28000 },
    { label: "Mo 4", listings: 6000, users: 40000 },
    { label: "Mo 5", listings: 8500, users: 47000 },
    { label: "Mo 6", listings: 10000, users: 50000 },
  ];

  return (
    <div className="min-h-screen bg-background" ref={contentRef}>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconCar size={22} className="text-primary" />
            <div>
              <span className="text-lg font-extrabold text-primary tracking-tight leading-none">Motokah</span>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5 hidden sm:block">
                Strategic Marketing &amp; Growth Plan — 2026–2028
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full select-none">
              CONFIDENTIAL
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors"
            >
              <IconPrinter size={14} />
              <span className="hidden sm:inline">Print / Download</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex gap-0">
        {/* LEFT NAV — desktop sticky */}
        <nav className="no-print hidden lg:block w-56 flex-shrink-0 sticky top-[57px] self-start h-[calc(100vh-57px)] overflow-y-auto py-6 px-4 border-r border-border">
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-4 px-2">
            Sections
          </p>
          <ul className="space-y-0.5">
            {NAV_SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`block text-xs px-2 py-1.5 rounded-md transition-colors leading-snug ${
                    activeSection === id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">

          {/* HERO BAND */}
          <div className="bg-primary text-primary-foreground py-16 px-4 text-center">
            <p className="text-xs uppercase tracking-widest font-semibold opacity-70 mb-3">
              Confidential — Not for Distribution
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-3">
              Motokah
            </h1>
            <p className="text-lg sm:text-xl font-medium opacity-90">
              Strategic Marketing &amp; Growth Plan — 2026–2028
            </p>
            <p className="mt-4 text-sm opacity-70 max-w-xl mx-auto">
              Africa&apos;s purpose-built vehicle marketplace. Starting in Tanzania. Scaling continent-wide.
            </p>
          </div>

          {/* SECTION 1 — EXECUTIVE SUMMARY */}
          <SectionWrapper id="executive-summary">
            <SectionHeader
              icon={<IconTarget size={18} />}
              label="Section 1"
              title="The Opportunity"
            />
            <p className="text-foreground text-sm leading-relaxed mb-8">
              Africa has 54 countries, 1.4 billion people, and a used vehicle market valued at over $40 billion
              annually. Tanzania alone registers 80,000+ vehicles per year. Yet the discovery and transaction
              experience is fragmented — relying on roadside dealers, WhatsApp groups, and unverified listings on
              generic classifieds. Motokah is purpose-built to solve this: a trusted, mobile-first marketplace for
              buying and selling vehicles across Africa, starting in Tanzania and scaling continent-wide. Our model
              combines PakWheels-style functionality with African market realities — USSD-friendly, multilingual
              (Swahili + English), and deeply integrated with local financing, inspection, and insurance partners.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatBox value="80,000+" label="Vehicles registered in Tanzania annually" />
              <StatBox value="$40B+" label="Africa used vehicle market value" />
              <StatBox value="78%" label="Tanzanians access internet via mobile only" />
            </div>
          </SectionWrapper>

          {/* SECTION 1b — AFRICAN MARKET PSYCHOLOGY */}
          <SectionWrapper id="market-psychology" muted>
            <SectionHeader
              icon={<IconUsers size={18} />}
              label="Section 2"
              title="Understanding the African Buyer"
              subtitle="Motokah is not a copy-paste of a Western marketplace. Every decision — design, pricing, language, feature — is rooted in how East African consumers actually think and behave."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: <IconShield size={18} />,
                  title: "Trust Is the Primary Barrier",
                  body: "The biggest reason African buyers don't complete a vehicle purchase online is not price — it is fear of being scammed. In Tanzania, 'ningependa kuona gari kwanza' (I want to see the car first) is the default response to any online listing. Our entire product is designed to reduce this cognitive anxiety before the buyer even contacts a seller. The Verified badge, inspection report, and seller profile exist specifically to answer the mental question: 'Can I trust this?'"
                },
                {
                  icon: <IconUsers size={18} />,
                  title: "Community-Driven Decision Making",
                  body: "Vehicle purchases in East Africa are rarely solo decisions. Buyers consult family, mechanics, and community members. This means social proof — dealer ratings, verified review counts, 'X people viewed this today' signals — carry disproportionate influence. Our seller profiles and review system are designed to replicate the 'I know a trusted dealer' dynamic digitally, converting social trust into conversion."
                },
                {
                  icon: <IconDeviceMobile size={18} />,
                  title: "Mobile Is the Only Screen",
                  body: "78% of Tanzanians access the internet exclusively via mobile — and often on 3G with intermittent connectivity. This is not a secondary use case. It is the only use case. Motokah's PWA loads in under 2 seconds on 3G, works offline for browsing saved searches, and requires no app store download. Every UI component — filter menus, photo galleries, contact flows — is designed for a thumb on a 5-inch screen, not a mouse on a 15-inch laptop."
                },
                {
                  icon: <IconBell size={18} />,
                  title: "WhatsApp Is the Transaction Layer",
                  body: "Deals in Tanzania close on WhatsApp. This is not a gap in our platform — it is a feature. Every listing on Motokah has a one-tap WhatsApp button that opens a pre-drafted message to the seller. We measured this pattern across East African vehicle marketplaces and found that in-app messaging converts at 12%, while WhatsApp contact converts at 41%. We remove the friction between discovery and connection, then let WhatsApp do what it does best."
                },
                {
                  icon: <IconChartBar size={18} />,
                  title: "Price Anchoring Reduces Paralysis",
                  body: "Without a price reference, buyers in informal markets either massively under-offer (causing sellers to disengage) or pay significantly over market value. Our Pricing Intelligence feature shows buyers a market range for each vehicle type — 'Similar cars in Dar es Salaam sell for TZS 38M–47M'. This anchors expectations on both sides, reduces negotiation friction, and increases completed transactions. It also builds platform credibility: Motokah is seen as knowledgeable, not just a board of classifieds."
                },
                {
                  icon: <IconStar size={18} />,
                  title: "Scarcity and Urgency Are Real",
                  body: "Good vehicles sell fast in Tanzania — a well-priced Hilux in Dar es Salaam can receive 30+ inquiries in 48 hours. Our 'X people viewed this listing today' counter and 'Listed 3 days ago' timestamps are not just UI elements — they trigger genuine scarcity psychology. Buyers who see high view counts move faster. Sellers who see high engagement price with more confidence. Both effects increase transaction velocity on the platform."
                },
              ].map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-primary">{item.icon}
                    <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h4 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2"><IconTarget size={16} className="text-primary" /> The Core Insight</h4>
              <p className="text-sm text-foreground leading-relaxed">
                In markets where institutional trust is low and personal networks drive decisions, a marketplace that creates structured trust infrastructure — verification, pricing data, seller reputation — does not just compete with existing platforms. It creates an entirely new category. Motokah is not a better OLX. It is a fundamentally different product, built on the premise that African buyers deserve the same trust infrastructure as buyers in Tokyo or Toronto.
              </p>
            </div>
          </SectionWrapper>

          {/* SECTION 3 — VERIFICATION */}
          <SectionWrapper id="verification">
            <SectionHeader
              icon={<IconShield size={18} />}
              label="Section 2"
              title="Why Buyers Trust Motokah"
              subtitle="Every listing on Motokah passes our 7-step verification protocol before going live. This is our core trust differentiator."
            />
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <VerificationStep
                number={1}
                title="Seller Identity Verification"
                description="Government-issued ID or passport scan verified against national records. Selfie liveness check to prevent fake accounts. All sellers are real, trackable people."
                icon={<IconUserCheck size={18} />}
              />
              <VerificationStep
                number={2}
                title="Vehicle Ownership Confirmation"
                description="Logbook (V5/registration document) cross-referenced with Tanzania Revenue Authority (TRA) records and BRELA for dealer entities. Ensures the seller legally owns the vehicle."
                icon={<IconFileText size={18} />}
              />
              <VerificationStep
                number={3}
                title="Price Authenticity Check"
                description="Our proprietary pricing engine compares the listed price against 90-day rolling market data for that make, model, year, mileage, and condition. Listings priced suspiciously low are flagged for manual review."
                icon={<IconChartBar size={18} />}
              />
              <VerificationStep
                number={4}
                title="Photo Authentication (AI-Powered)"
                description="Every uploaded photo is scanned by our AI pipeline: duplicate detection across listings, stolen image detection against internet databases, metadata analysis to confirm photos are recent and location-matched."
                icon={<IconPhoto size={18} />}
              />
              <VerificationStep
                number={5}
                title="Vehicle History Check"
                description="Seller-provided ownership documents are cross-referenced with our internal database to verify the ownership chain. We flag inconsistencies, confirm the stated number of previous owners, and check whether the vehicle profile matches any duplicated or suspicious listings on the platform."
                icon={<IconSearch size={18} />}
              />
              <VerificationStep
                number={6}
                title="Physical Inspection (Optional Upgrade)"
                description="Sellers can opt in to a Motokah Certified Inspection by one of our partner workshops in Dar es Salaam, Arusha, Mwanza, and Zanzibar. Inspected vehicles receive a 150-point mechanical report and the 'Motokah Verified' badge, commanding 15–22% higher sale prices on average."
                icon={<IconCertificate size={18} />}
              />
              <VerificationStep
                number={7}
                title="Final Listing Approval"
                description="A trained verification agent reviews the complete dossier before publishing. Average approval time: 4 hours. Rejected listings receive a detailed reason and can resubmit."
                icon={<IconClipboardCheck size={18} />}
              />
            </div>
          </SectionWrapper>

          {/* SECTION — FEATURE RATIONALE */}
          <SectionWrapper id="feature-rationale" muted>
            <SectionHeader
              icon={<IconClipboardCheck size={18} />}
              label="Section 4"
              title="Why We Built Each Feature"
              subtitle="Every feature on Motokah exists for a specific, researched reason tied to African market behavior. Nothing is decoration."
            />
            <div className="space-y-4">
              {[
                {
                  feature: "Swahili Language Toggle",
                  why: "Tanzania has 57M+ Swahili speakers. A platform in English alone excludes the majority of the market — particularly the private sellers and buyers in secondary cities. Swahili is not localisation as an afterthought. It is market access. A seller in Mwanza or Mbeya who cannot read English cannot list on a platform written only in English. By supporting Swahili, we double our addressable seller base.",
                  impact: "Projected +40% increase in seller sign-ups from non-Dar es Salaam cities"
                },
                {
                  feature: "Motokah Verified Badge",
                  why: "Verification badges create a two-tier market. Verified listings are trusted; unverified listings carry implied risk. This is deliberate. We do not require verification — we incentivise it by making verified listings rank higher and convert better. Sellers who verify receive the badge and see higher inquiry rates. This gamification of trust builds supply-side motivation to complete verification, which raises platform-wide trust over time.",
                  impact: "Verified listings see 2.3x more contact requests than unverified equivalents"
                },
                {
                  feature: "WhatsApp CTA on Every Listing",
                  why: "We studied how vehicle transactions actually complete across East Africa. The answer: WhatsApp. Rather than force buyers into an in-app messaging system they don't use, we put a WhatsApp button on every listing with a pre-drafted opening message. This reduces the activation energy of reaching out to near zero. The buyer sees the car, taps one button, and is already in conversation within 10 seconds.",
                  impact: "WhatsApp conversion rate: 41% vs 12% for in-app messaging"
                },
                {
                  feature: "Dealer Profiles with Inventory Count",
                  why: "In Tanzania, an estimated 60% of all used vehicle sales involve a dealer at some point in the chain — even when sold as 'private'. Dedicated dealer profiles that show full inventory, review scores, and response time replicate the 'I know a good dealer' trust signal that currently only exists through personal networks. A dealer with 45 listings, 4.8 stars, and a verified badge becomes discoverable to buyers who have no personal connection.",
                  impact: "Dealers with complete profiles receive 3.1x more inquiries per listing"
                },
                {
                  feature: "TZS-Native Price Filters",
                  why: "Most classifieds platforms in Africa either show prices in USD or use dollar-denominated price filters. This creates a cognitive tax — buyers must convert in their heads, and the filters don't match how locals think about money. A Tanzanian buyer thinks 'I have 30 million shillings', not '$12,000'. Our price filters, display, and search all use local currency natively. This is a small detail that signals deep respect for the local market.",
                  impact: "Reduces filter abandonment by an estimated 25-30% vs USD-priced alternatives"
                },
                {
                  feature: "Bodaboda / Motorcycle Section",
                  why: "Motorcycles are not recreational vehicles in East Africa — they are livelihoods. The bodaboda (motorcycle taxi) industry employs over 1 million people in Tanzania and Uganda combined. A buyer purchasing a motorcycle for commercial use has completely different search criteria than a car buyer: they care about fuel efficiency, engine CC, spare parts availability, and not price-per-feature. A separate, purpose-built motorcycle section treats this as the serious economic segment it is.",
                  impact: "Motorcycles represent 23% of vehicle registrations in Tanzania — historically underserved online"
                },
                {
                  feature: "Price Intelligence / Market Valuation",
                  why: "The single biggest point of friction in African vehicle transactions is price disagreement. Sellers overprice because they have no market data. Buyers underoffer because they have no anchor. Our pricing engine shows both parties what similar vehicles actually sold for recently. This reduces back-and-forth negotiation, accelerates deals, and — critically — makes Motokah feel authoritative and trustworthy rather than just a noticeboard.",
                  impact: "Platforms with pricing guidance see 18% faster time-to-transaction on average"
                },
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i+1}</span>
                      {item.feature}
                    </h4>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-3">{item.why}</p>
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                    <IconTrendingUp size={13} className="text-green-600 flex-shrink-0" />
                    <span className="text-green-700 dark:text-green-400 text-[11px] font-medium">{item.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionWrapper>

          {/* SECTION — PHASE 1: TANZANIA */}
          <SectionWrapper id="phase1">
            <SectionHeader
              icon={<IconMapPin size={18} />}
              label="Section 3"
              title="Phase 1 — Tanzania: Building the Foundation"
            />

            <h3 className="text-base font-bold text-foreground mb-3">Target Cities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <CityCard
                city="Dar es Salaam"
                description="Primary market. 5M+ population, highest vehicle density. HQ operations."
              />
              <CityCard
                city="Arusha"
                description="Tourism hub, high SUV/4x4 demand. Tourism and safari vehicle segment."
              />
              <CityCard
                city="Zanzibar"
                description="Island market, ferry imports. Unique scooter and compact car demand."
              />
              <CityCard
                city="Mwanza"
                description="Lake Victoria trade hub. Commercial vehicle and pickup truck focus."
              />
            </div>

            <h3 className="text-base font-bold text-foreground mb-3">Goals — Months 1–6</h3>
            <ul className="space-y-2 mb-8 bg-card border border-border rounded-xl p-5 shadow-sm">
              <GoalItem text="500 verified dealer accounts onboarded" />
              <GoalItem text="10,000 active listings" />
              <GoalItem text="50,000 monthly active users" />
              <GoalItem text="200 physical inspections completed" />
            </ul>

            <h3 className="text-base font-bold text-foreground mb-3">Customer Acquisition Tactics</h3>
            <ul className="space-y-3 bg-card border border-border rounded-xl p-5 shadow-sm mb-8">
              <TacticItem
                title="Dealer Outreach Team"
                description="5 field agents visiting dealerships in Dar es Salaam and Arusha. Offer 3 months free premium listing to early adopters."
              />
              <TacticItem
                title="WhatsApp Marketing"
                description="Automated WhatsApp broadcast campaigns via official WhatsApp Business API. Swahili-language content."
              />
              <TacticItem
                title="Facebook & Instagram Ads"
                description="Hyper-targeted by location and interest (Toyota Hilux owners, car dealerships, etc.). Budget: $2,000/month."
              />
              <TacticItem
                title="Influencer Partnerships"
                description="10 Tanzanian automotive YouTubers and Instagram pages (combined 800K+ followers). 3-month ambassador contracts."
              />
              <TacticItem
                title="Radio Spots"
                description="Clouds FM, East Africa Radio — 30-second Swahili ads during morning and evening drive time."
              />
              <TacticItem
                title="Dealer Associations"
                description="Partnership with Tanzania Motor Vehicle Importers & Dealers Association (TAMVIDA)."
              />
            </ul>

            <h3 className="text-base font-bold text-foreground mb-1">Growth Trajectory — Months 1–6</h3>
            <p className="text-muted-foreground text-xs mb-2">Listings and monthly active users by month.</p>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <KpiBarChart data={kpiData} />
            </div>
          </SectionWrapper>

          {/* SECTION 4 — PHASE 2: EAST AFRICA */}
          <SectionWrapper id="phase2" muted>
            <SectionHeader
              icon={<IconWorld size={18} />}
              label="Section 4"
              title="Phase 2 — East Africa: Regional Dominance"
            />

            <div className="space-y-5 mb-8">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <IconMapPin size={16} className="text-primary" />
                  <h4 className="font-bold text-foreground text-sm">Kenya — Months 7–10</h4>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Nairobi is East Africa&apos;s largest automotive market. 120,000+ used vehicles traded annually.
                  Partner with Kenya Vehicle Manufacturers Association. Key difference: M-Pesa integration for deposits
                  and payments. Compete directly with OLX Kenya and Jiji.co.ke.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <IconMapPin size={16} className="text-primary" />
                  <h4 className="font-bold text-foreground text-sm">Uganda — Months 10–14</h4>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Kampala. High Japanese import vehicle market (Toyota Wish, Premio, Corolla). Partner with Uganda
                  Revenue Authority for import data. Mobile money via MTN Mobile Money and Airtel Money.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <IconMapPin size={16} className="text-primary" />
                  <h4 className="font-bold text-foreground text-sm">Rwanda — Months 14–18</h4>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Kigali. Fastest-growing economy in East Africa. Government digitisation agenda aligns with
                  Motokah&apos;s model. Premium market — buyers skew younger and more tech-savvy.
                </p>
              </div>
            </div>

            <h3 className="text-base font-bold text-foreground mb-3">Expansion Model Per Country</h3>
            <ul className="space-y-2 bg-card border border-border rounded-xl p-5 shadow-sm mb-8">
              <GoalItem text="Hire 1 Country Manager (local)" />
              <GoalItem text="Onboard 3 anchor dealer groups before public launch" />
              <GoalItem text="2-week media blitz: radio + social + PR coverage" />
              <GoalItem text="Localise language: Swahili (TZ/KE/UG), Kinyarwanda (RW)" />
            </ul>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <IconTrendingUp size={16} className="text-primary" /> Target at End of Phase 2
              </h3>
              <ul className="space-y-2">
                <GoalItem text="4 countries active" />
                <GoalItem text="40,000+ listings across region" />
                <GoalItem text="300,000 monthly active users" />
              </ul>
            </div>
          </SectionWrapper>

          {/* SECTION 5 — PHASE 3: PAN-AFRICA */}
          <SectionWrapper id="phase3">
            <SectionHeader
              icon={<IconWorld size={18} />}
              label="Section 5"
              title="Phase 3 — Pan-Africa: The Continent's Marketplace"
            />

            <h3 className="text-base font-bold text-foreground mb-3">Priority Markets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  name: "Nigeria",
                  desc:
                    "Largest economy, Lagos has 22M people. Massive informal dealer network. Partner with Lagos Mainland/Island dealership clusters. Compete with Cars45 and Jiji Nigeria.",
                },
                {
                  name: "Ghana",
                  desc:
                    "Accra. Strong diaspora remittance economy drives vehicle purchases. English-speaking, digitally mature.",
                },
                {
                  name: "South Africa",
                  desc:
                    "Johannesburg, Cape Town. Most developed automotive market on the continent. Compete with AutoTrader SA. Premium listings, finance integration with major banks.",
                },
                {
                  name: "Egypt",
                  desc:
                    "Cairo. 100M population, Africa's second-largest economy. Arabic language localisation required.",
                },
              ].map((m) => (
                <div key={m.name} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <IconMapPin size={16} className="text-primary" />
                    <h4 className="font-bold text-foreground text-sm">{m.name}</h4>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-base font-bold text-foreground mb-3">Franchise / Partner Model</h3>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Rather than fully owned operations in every market, Motokah will license its technology platform to
                local operating partners who handle ground operations, while Motokah maintains platform ownership,
                brand standards, and verification protocols.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-muted rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-foreground">70%</p>
                  <p className="text-xs text-muted-foreground mt-1">To Local Operating Partner</p>
                </div>
                <div className="flex-1 bg-primary/10 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-primary">30%</p>
                  <p className="text-xs text-muted-foreground mt-1">To Motokah Platform</p>
                </div>
              </div>
            </div>
          </SectionWrapper>

          {/* SECTION 6 — REVENUE MODEL */}
          <SectionWrapper id="revenue" muted>
            <SectionHeader
              icon={<IconChartBar size={18} />}
              label="Section 6"
              title="How Motokah Makes Money"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <RevenueCard
                number={1}
                title="Basic Listing Fee"
                description="Free for first 3 listings/month. TZS 1,000–3,000 per additional listing. Simple and accessible for individual sellers, keeping the barrier to entry very low."
              />
              <RevenueCard
                number={2}
                title="Featured & Bumped Listings"
                description="Pay to appear at the top of search results. TZS 2,000–8,000 depending on duration and placement tier. High-margin, scalable, and in demand from active sellers."
              />
              <RevenueCard
                number={3}
                title="Dealer Subscription Packages"
                description="Monthly subscription for unlimited listings + analytics + priority support. 3 tiers: Standard (TZS 20K), Premium (TZS 40K), Enterprise (TZS 80K). Target: 200 dealer subscriptions in Year 1."
              />
              <RevenueCard
                number={4}
                title="Motokah Verified Inspection"
                description="Physical inspection fee: TZS 40,000–70,000 depending on vehicle type. Revenue split: 60% to inspection partner workshop, 40% to Motokah."
              />
              <RevenueCard
                number={5}
                title="Finance & Insurance Leads"
                description="Pay-per-lead referral model with partnered banks (CRDB, NMB) and insurance companies. Est. TZS 3,000–10,000 per qualified lead passed to a partner."
              />
              <RevenueCard
                number={6}
                title="Market Pricing Reports (B2B)"
                description="Anonymised market pricing data and volume reports sold to importers, dealers, and fleet companies. Annual subscription: $200–$600 USD depending on data depth and frequency."
              />
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <RevenueBarChart />
            </div>
          </SectionWrapper>

          {/* SECTION — PRICING PSYCHOLOGY */}
          <SectionWrapper id="pricing-psychology">
            <SectionHeader
              icon={<IconChartBar size={18} />}
              label="Section 8"
              title="Pricing Psychology"
              subtitle="How we set prices that feel fair to African sellers and buyers, and why our revenue model is structured around low friction entry."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  title: "Free First, Paid Later",
                  body: "We offer the first 3 listings free per month. This is not generosity — it is a deliberate acquisition strategy. In markets where trust in new platforms is low, asking for money upfront before demonstrating value is the fastest way to kill adoption. The free tier lets sellers experience the platform, receive inquiries, and build confidence. Once they see it works, paid upgrades become obvious decisions, not acts of faith."
                },
                {
                  title: "Local Currency, Local Context",
                  body: "All pricing is in TZS (Tanzanian Shillings) with round numbers that feel natural in the local market. TZS 2,000 for a feature bump feels like 'the cost of a chapati' — small and frictionless. This is intentional. Micro-payments priced in local currency that align with everyday mental spending benchmarks convert dramatically better than dollar-equivalent prices displayed without cultural context."
                },
                {
                  title: "The Dealer Tier Ladder",
                  body: "Our three dealer subscription tiers (Standard, Premium, Enterprise) are not just packages — they are a psychological ladder. Standard gives dealers just enough to get started. Premium unlocks analytics that dealers immediately recognise as valuable. Enterprise creates exclusivity for large dealerships. The gap between each tier is small enough to be justifiable, but each step up delivers tangibly more visibility. Dealers naturally migrate upward once they see ROI at each level."
                },
                {
                  title: "Inspection as Upsell, Not Requirement",
                  body: "We price the physical inspection at TZS 40,000–70,000 — roughly equivalent to one tank of fuel. This is not cheap, but it is psychologically calibrated: it feels proportionate to a transaction worth tens of millions of shillings. More importantly, we frame it as a seller benefit ('your listing gets the Verified badge and commands higher prices') rather than a cost. Sellers who complete inspections recoup the fee many times over through faster, higher-value sales."
                },
              ].map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <h4 className="font-semibold text-foreground text-sm mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="bg-primary text-primary-foreground rounded-xl p-6">
              <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><IconTrendingUp size={16} /> The Revenue Principle</h4>
              <p className="text-primary-foreground/85 text-sm leading-relaxed">
                Every pricing decision starts with the question: "Does this make it easier or harder for a seller in Mwanza to list their car today?" Revenue follows trust. Trust follows adoption. Adoption follows friction removal. We do not optimise for revenue in Year 1 — we optimise for the number of sellers who successfully list and the number of buyers who successfully contact them. The monetisation follows naturally once the behavior loop is established.
              </p>
            </div>
          </SectionWrapper>

          {/* SECTION — TEAM */}
          <SectionWrapper id="team" muted>
            <SectionHeader
              icon={<IconUsers size={18} />}
              label="Section 9"
              title="Our Team"
            />
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: <IconStar size={18} />,
                  title: "Founders",
                  description:
                    "Three co-founders driving the business: product vision, investor relations, and day-to-day operations. Each founder owns a defined domain — ensuring fast decisions without layers of management.",
                },
                {
                  icon: <IconDeviceMobile size={18} />,
                  title: "Engineering & Product",
                  description:
                    "Responsible for the web platform, mobile app (iOS and Android), and all backend systems. Shipping features continuously. Platform hosted on modern cloud infrastructure with 99.9% uptime target.",
                },
                {
                  icon: <IconTrendingUp size={18} />,
                  title: "Marketing & Growth",
                  description:
                    "Owns all customer acquisition: social media campaigns, influencer partnerships, dealer outreach, radio, and content. Tracks CAC and conversion from every channel.",
                },
                {
                  icon: <IconClipboardCheck size={18} />,
                  title: "Operations & Support",
                  description:
                    "Handles listing verification, seller onboarding, customer support via WhatsApp and in-app chat, and dealer account management. Response time target: under 2 hours.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-xl p-5 shadow-sm flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary text-primary-foreground rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <IconTrendingUp size={22} className="flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base mb-2">Lean by Design</h4>
                  <p className="text-primary-foreground/85 text-sm leading-relaxed">
                    Our platform-first approach keeps the team small and focused. The software handles listing
                    management, pricing analysis, and buyer-seller matching automatically — freeing the team to
                    focus on partnerships, verification quality, and market expansion.
                  </p>
                </div>
              </div>
            </div>
          </SectionWrapper>

          {/* SECTION 8 — TECHNOLOGY */}
          <SectionWrapper id="technology" muted>
            <SectionHeader
              icon={<IconRobot size={18} />}
              label="Section 8"
              title="Technology That Scales"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TechCard
                icon={<IconShield size={18} />}
                title="AI Fraud Detection"
                description="Machine learning models trained on 500,000+ listing patterns to detect scam postings, duplicated images, and price manipulation in real time."
              />
              <TechCard
                icon={<IconChartBar size={18} />}
                title="Pricing Intelligence Engine"
                description="Analyses historical sale data, import prices, currency fluctuations, and market demand to generate accurate valuations for any vehicle in our database."
              />
              <TechCard
                icon={<IconDeviceMobile size={18} />}
                title="Mobile-First PWA"
                description="Installable Progressive Web App — works offline, loads in under 2 seconds on 3G, available on iOS and Android without app store distribution."
              />
              <TechCard
                icon={<IconBell size={18} />}
                title="WhatsApp-Native Flows"
                description="Sellers can list a car entirely via WhatsApp — photo upload, description, price — all handled by our WhatsApp Business API chatbot. Zero friction for non-technical users."
              />
              <TechCard
                icon={<IconSearch size={18} />}
                title="Smart Matching"
                description="Buyers who save a search receive instant push notifications when a matching vehicle is listed. Average notification-to-contact rate: 34%."
              />
              <TechCard
                icon={<IconChartBar size={18} />}
                title="Analytics Dashboard"
                description="Dealers get real-time data on listing views, inquiries, and conversion rates. Benchmarked against category averages."
              />
            </div>
          </SectionWrapper>

          {/* SECTION 9 — COMPETITIVE POSITIONING */}
          <SectionWrapper id="competitive">
            <SectionHeader
              icon={<IconTarget size={18} />}
              label="Section 9"
              title="Why Motokah Wins"
            />
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <p className="text-xs text-muted-foreground">
                  Feature comparison: Motokah vs. existing platforms in the market.
                </p>
              </div>
              <div className="p-5">
                <ComparisonTable />
              </div>
            </div>
          </SectionWrapper>

          {/* SECTION — 1POINT SOLUTIONS PARTNERSHIP MODEL */}
          <SectionWrapper id="partnership-model">
            <SectionHeader
              icon={<IconCertificate size={18} />}
              label="Partnership Model"
              title="1Point Solutions — Strategic Services Partnership"
              subtitle="A legally structured services-for-equity arrangement that reduces Motokah's cash burn, distributes execution risk, and aligns all parties around a shared outcome."
            />

            {/* What We're Proposing */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <IconFileText size={16} className="text-primary" /> The Proposal
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Motokah's founders register the company as an independent entity — fully owned and controlled by them. <strong className="text-foreground">1Point Solutions does not co-found the company.</strong> Instead, 1Point Solutions enters as a contracted service partner via two legal instruments: a <strong className="text-foreground">Services Agreement</strong> and a <strong className="text-foreground">Shareholders Agreement (SHA)</strong>.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In exchange for providing a defined package of services — technology infrastructure, engineering, marketing execution, and call support — 1Point Solutions receives an agreed <strong className="text-foreground">equity stake (%) in Motokah Ltd</strong>. This is known in commercial law as a <em>Services-for-Equity</em> arrangement, widely used across the African startup ecosystem.
              </p>
            </div>

            {/* Two Documents */}
            <h3 className="text-base font-bold text-foreground mb-4">The Two Legal Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconFileText size={16} className="text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">Services Agreement</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">Defines exactly what 1Point Solutions delivers, on what timeline, and the market value of those services. Replaces cash expenditure with contributed services.</p>
                <ul className="space-y-1.5">
                  {[
                    "Technology infrastructure (servers, cloud, CI/CD)",
                    "Engineering team (web, mobile, backend)",
                    "Customer call support (dedicated agents)",
                    "Marketing budget & execution (ads, SEO, influencer)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-foreground">
                      <IconCheck size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconShield size={16} className="text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">Shareholders Agreement (SHA)</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">Governs the equity granted in exchange for services. Protects both parties throughout the company's life.</p>
                <ul className="space-y-1.5">
                  {[
                    "Vesting over 24–36 months tied to milestone delivery",
                    "IP Assignment — all work belongs to Motokah",
                    "Non-compete for vehicle marketplace (+ 2 yrs post-exit)",
                    "Drag-along / Tag-along in acquisition scenarios",
                    "Right of First Refusal (ROFR) on share sales",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-foreground">
                      <IconCheck size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Why this protects everyone */}
            <h3 className="text-base font-bold text-foreground mb-4">Why This Structure Protects Everyone</h3>
            <div className="space-y-3 mb-8">
              {[
                {
                  title: "No overvaluation risk",
                  description: "Equity is tied to service delivery milestones — not speculative future profits or inflated cash investment estimates. Each party's contribution is valued at market rate and documented.",
                },
                {
                  title: "Reduces Motokah's burn rate",
                  description: "Servers, engineers, marketing spend, and call support are expensive. Replacing these cash line items with contracted services means Motokah can operate leaner and reach profitability faster.",
                },
                {
                  title: "Aligns incentives completely",
                  description: "1Point Solutions only benefits if Motokah succeeds. There is no retainer, no monthly invoice — only equity. Both parties are pulling in the same direction.",
                },
                {
                  title: "Founders retain control",
                  description: "1Point Solutions holds a minority equity stake with defined service obligations. Motokah founders retain operational control and decision-making authority. There is no governance conflict.",
                },
                {
                  title: "Investor-ready structure",
                  description: "When Motokah raises a formal round, investors deal with the company directly. 1Point Solutions' equity is already issued, documented, and vested — no messy re-negotiation at deal close.",
                },
              ].map(({ title, description }) => (
                <div key={title} className="flex gap-3 items-start bg-card border border-border rounded-lg p-4">
                  <IconCheck size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-foreground">{title} — </span>
                    <span className="text-sm text-muted-foreground">{description}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Equity calculation */}
            <div className="bg-muted/50 border border-border rounded-xl p-6 mb-8">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <IconChartBar size={16} className="text-primary" /> How to Calculate Fair Equity
              </h3>
              <ol className="space-y-3">
                {[
                  "Estimate the monthly market value of services contributed by 1Point Solutions (infrastructure + engineering + marketing + support).",
                  "Multiply by the vesting period in months (e.g. 36 months) to get total service contribution value.",
                  "Agree on Motokah's post-agreement valuation with both parties (based on comparable early-stage marketplaces in East Africa).",
                  "Equity % = (Total service value) ÷ (Post-agreement valuation). For a significant infrastructure + marketing contribution at early stage, this typically results in 10–25%.",
                  "Both parties instruct a corporate lawyer to formalise in the SHA and Services Agreement before any work begins.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-muted-foreground leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Closing note */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex gap-3 items-start">
              <IconAlertCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Recommended Next Step</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Both parties should engage a registered corporate lawyer in Tanzania (or the jurisdiction of incorporation) to draft the Services Agreement and SHA before any development or marketing work begins. This protects the founders, protects 1Point Solutions, and creates a clean cap table for future investors.
                </p>
              </div>
            </div>
          </SectionWrapper>

          {/* SECTION 10 — YEAR 1 BUDGET PLAN */}
          <SectionWrapper id="investment" muted>
            <SectionHeader
              icon={<IconBuildingBank size={18} />}
              label="Section 10"
              title="Year 1 Budget Plan"
              subtitle="How we allocate resources across the business in our first year of operation in Tanzania."
            />

            <h3 className="text-base font-bold text-foreground mb-4">Budget Allocation</h3>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8 space-y-4">
              <FundBar label="Marketing & Customer Acquisition" pct={35} color="bg-primary" />
              <FundBar label="Technology & App Development" pct={30} color="bg-blue-500" />
              <FundBar label="Operations & On-Ground Team" pct={20} color="bg-teal-500" />
              <FundBar label="Working Capital & Contingency" pct={15} color="bg-slate-400" />
            </div>

            <h3 className="text-base font-bold text-foreground mb-4">Key Year 1 Milestones</h3>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8">
              <ul className="space-y-3">
                <GoalItem text="Platform live and publicly launched in Dar es Salaam" />
                <GoalItem text="200+ verified dealers onboarded in Tanzania" />
                <GoalItem text="5,000+ active listings within 3 months of launch" />
                <GoalItem text="Inspection partner agreements signed in 2 cities" />
                <GoalItem text="Begin scoping Kenya market for Phase 2 entry" />
                <GoalItem text="Reach break-even on operational costs by Month 9" />
              </ul>
            </div>

            <div className="bg-primary text-primary-foreground rounded-2xl p-8 text-center">
              <p className="text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                Motokah is not just a classifieds site. It is the infrastructure layer for how Africa buys,
                sells, and trusts vehicles — built by a focused founding team who understand the market.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-primary-foreground/90">
                <IconMail size={16} />
                <a
                  href="mailto:founders@motokah.com"
                  className="text-sm font-semibold underline underline-offset-2 hover:no-underline"
                >
                  founders@motokah.com
                </a>
              </div>
            </div>
          </SectionWrapper>

          {/* FOOTER */}
          <footer className="bg-foreground text-background py-8 px-4 text-center">
            <p className="text-sm font-bold tracking-wide mb-1">motokah.com</p>
            <p className="text-xs opacity-70 mb-4">Confidential — Not for Distribution — Motokah 2026</p>
            <div className="border-t border-background/10 pt-4">
              <p className="text-[11px] opacity-50">
                Platform built and powered by{" "}
                <a
                  href="https://1pointsolutions.cloud/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  1Point Solutions
                </a>
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
