import { BI, ET, FR, GB, KE, NG, RW, SA, TZ, UG } from "country-flag-icons/react/3x2";

// Real flag artwork instead of emoji flags (which look different on every phone).
const FLAGS = { BI, ET, FR, GB, KE, NG, RW, SA, TZ, UG };

/** Accepts an emoji flag ("🇹🇿") or an ISO code ("TZ"). */
export default function Flag({ code, className = "h-4 w-6" }: { code: string; className?: string }) {
  const iso = /^[A-Za-z]{2}$/.test(code)
    ? code.toUpperCase()
    : [...code].map((c) => String.fromCharCode((c.codePointAt(0) ?? 0) - 0x1f1e6 + 65)).join("");
  const Svg = FLAGS[iso as keyof typeof FLAGS];
  if (!Svg) return null;
  return <Svg title="" className={`inline-block shrink-0 rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${className}`} />;
}
