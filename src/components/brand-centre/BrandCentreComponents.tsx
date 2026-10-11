import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  brandAssets,
  brandCategories,
  brandCentreSections,
  brandColours,
  kitDownloads,
  type BrandAssetCategory,
} from "@/data/brandCentreAssets";
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconFileTypePdf,
  IconPhoto,
  IconSearch,
} from "@tabler/icons-react";

export function DownloadLink({ href, children, variant = "dark" }: { href: string; children: string; variant?: "dark" | "light" }) {
  return (
    <a href={href} download={href.split("/").pop()}>
      <Button
        className={`h-10 rounded-none px-4 text-xs font-black uppercase tracking-[0.14em] ${
          variant === "dark" ? "bg-[#102A43] text-white hover:bg-[#1b456b]" : "bg-white text-[#102A43] hover:bg-[#eaf4fb]"
        }`}
      >
        <IconDownload size={15} className="mr-2" />
        {children}
      </Button>
    </a>
  );
}

export function SectionNav() {
  return (
    <nav className="sticky top-0 z-30 border-y border-[#d5e4ef] bg-white/90 px-4 py-3 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
        {brandCentreSections.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="whitespace-nowrap border border-[#d5e4ef] bg-[#f7fbfe] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#102A43] transition hover:border-[#3493C9] hover:text-[#0072bc] focus:outline-none focus:ring-2 focus:ring-[#3493C9]"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function SectionHeader({ id, kicker, title, copy, dark = false }: { id: string; kicker: string; title: string; copy: string; dark?: boolean }) {
  return (
    <div id={id} className={`mx-auto mb-8 grid max-w-7xl scroll-mt-24 gap-5 border-b pb-6 lg:grid-cols-[220px_1fr] ${dark ? "border-white/15" : "border-[#d5e4ef]"}`}>
      <p className={`font-mono text-xs font-black uppercase tracking-[0.32em] ${dark ? "text-[#9dcdea]" : "text-[#3493C9]"}`}>{kicker}</p>
      <div>
        <h2 className={`max-w-4xl text-[clamp(2.4rem,5vw,5rem)] font-black leading-[0.9] tracking-tight ${dark ? "text-white" : "text-[#102A43]"}`}>{title}</h2>
        <p className={`mt-4 max-w-3xl text-base font-semibold leading-7 ${dark ? "text-[#c7dbe9]" : "text-[#5f7488]"}`}>{copy}</p>
      </div>
    </div>
  );
}

export function LogoSpecimens() {
  const items = brandAssets.filter((asset) => asset.category === "Logo" || asset.id === "app-icon");
  return (
    <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((asset) => (
        <article key={asset.id} className="border border-[#d5e4ef] bg-white p-4 shadow-[0_18px_60px_rgba(16,42,67,.08)]">
          <a href={asset.svgUrl} target="_blank" rel="noreferrer" className="grid aspect-[16/11] place-items-center bg-[#eef5fb] p-6">
            <img src={asset.svgUrl} alt={asset.useCase} className="max-h-[78%] w-full object-contain" />
          </a>
          <div className="mt-4">
            <h3 className="text-xl font-black text-[#102A43]">{asset.useCase}</h3>
            <p className="mt-1 text-sm font-bold text-[#6b8194]">{asset.dimensions}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <DownloadLink href={asset.svgUrl}>SVG</DownloadLink>
              <DownloadLink href={asset.pngUrl}>PNG</DownloadLink>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ColorSwatches() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
      {brandColours.map((color) => (
        <article key={color.hex} className="border border-[#d5e4ef] bg-white p-4 shadow-[0_18px_60px_rgba(16,42,67,.06)]">
          <button
            type="button"
            onClick={() => copy(color.hex)}
            className="group h-32 w-full text-left focus:outline-none focus:ring-2 focus:ring-[#3493C9]"
            style={{ backgroundColor: color.hex }}
            aria-label={`Copy ${color.name} hex value`}
          >
            <span className="m-3 inline-flex bg-white/95 px-2 py-1 text-xs font-black text-[#102A43] opacity-0 transition group-hover:opacity-100">
              {copied === color.hex ? "Copied" : "Copy"}
            </span>
          </button>
          <h3 className="mt-4 text-xl font-black text-[#102A43]">{color.name}</h3>
          <dl className="mt-3 grid gap-1 text-sm font-semibold text-[#5f7488]">
            <div className="flex justify-between gap-3"><dt>HEX</dt><dd>{color.hex}</dd></div>
            <div className="flex justify-between gap-3"><dt>RGB</dt><dd>{color.rgb}</dd></div>
            <div className="flex justify-between gap-3"><dt>HSL</dt><dd>{color.hsl}</dd></div>
            <div className="flex justify-between gap-3"><dt>CMYK</dt><dd>{color.cmyk}</dd></div>
          </dl>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#5f7488]">{color.use}</p>
          <button
            type="button"
            onClick={() => copy(color.hex)}
            className="mt-4 inline-flex items-center text-xs font-black uppercase tracking-[0.14em] text-[#0072bc] focus:outline-none focus:ring-2 focus:ring-[#3493C9]"
          >
            <IconCopy size={14} className="mr-2" />
            {copied === color.hex ? "Copied" : "Copy hex"}
          </button>
        </article>
      ))}
    </div>
  );
}

export function ApplicationStrip({ category, title }: { category: BrandAssetCategory; title: string }) {
  const items = brandAssets.filter((asset) => asset.category === category).slice(0, 8);
  return (
    <div className="mx-auto max-w-7xl">
      <h3 className="mb-4 text-2xl font-black text-[#102A43]">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((asset) => (
          <article key={asset.id} className="border border-[#d5e4ef] bg-white p-3 shadow-[0_16px_50px_rgba(16,42,67,.06)]">
            <a href={asset.svgUrl} target="_blank" rel="noreferrer" className="grid aspect-[4/3] place-items-center bg-[#eef5fb] p-4">
              <img src={asset.pngUrl} alt={asset.useCase} className="max-h-full w-full object-contain" />
            </a>
            <h4 className="mt-3 text-base font-black text-[#102A43]">{asset.useCase}</h4>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#6b8194]">{asset.dimensions}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function VoiceGuide() {
  const rows = [
    ["Buyer", "Compare cars, contact verified sellers, and move with confidence.", "Linganisha magari, wasiliana na wauzaji waliothibitishwa."],
    ["Dealer", "Claim your showroom page and turn stock into searchable listings.", "Chukua ukurasa wa showroom yako na onyesha magari yako kwa urahisi."],
    ["Safety", "Meet in person, verify documents, and avoid urgent pressure.", "Kutananeni ana kwa ana, hakiki nyaraka, epuka presha ya haraka."],
    ["Verification", "Verified means Motokah has reviewed the dealer identity.", "Verified inamaanisha Motokah imehakiki utambulisho wa dealer."],
  ];
  return (
    <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[.75fr_1.25fr]">
      <div className="border border-[#d5e4ef] bg-[#102A43] p-8 text-white">
        <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-[#9dcdea]">Typography</p>
        <p className="mt-8 text-7xl font-black leading-none">Aa 123</p>
        <p className="mt-5 text-lg font-semibold leading-8 text-[#c7dbe9]">
          Use heavy, confident headlines for launch material. Keep body copy short, direct, and useful. Prices should be bold and easy to scan.
        </p>
      </div>
      <div className="grid gap-3">
        {rows.map(([label, en, sw]) => (
          <article key={label} className="border border-[#d5e4ef] bg-white p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#3493C9]">{label}</p>
            <p className="mt-3 text-xl font-black text-[#102A43]">{en}</p>
            <p className="mt-2 text-base font-semibold text-[#5f7488]">{sw}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function DownloadCentre() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | BrandAssetCategory>("All");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return brandAssets.filter((asset) => {
      const categoryOk = category === "All" || asset.category === category;
      const text = `${asset.id} ${asset.category} ${asset.useCase} ${asset.formats} ${asset.dimensions}`.toLowerCase();
      return categoryOk && (!normalized || text.includes(normalized));
    });
  }, [category, query]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto]">
        <label className="flex h-12 items-center border border-[#d5e4ef] bg-white px-4 focus-within:ring-2 focus-within:ring-[#3493C9]">
          <IconSearch size={18} className="mr-3 text-[#6b8194]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search logos, dealer tags, social templates..."
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto">
          {["All", ...brandCategories].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item as "All" | BrandAssetCategory)}
              className={`h-12 whitespace-nowrap border px-4 text-xs font-black uppercase tracking-[0.14em] focus:outline-none focus:ring-2 focus:ring-[#3493C9] ${
                category === item ? "border-[#102A43] bg-[#102A43] text-white" : "border-[#d5e4ef] bg-white text-[#102A43]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {kitDownloads.map((kit) => (
          <DownloadLink key={kit.href} href={kit.href}>{kit.label}</DownloadLink>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((asset) => (
          <article key={asset.id} className="border border-[#d5e4ef] bg-white p-4 shadow-[0_16px_50px_rgba(16,42,67,.06)]">
            <a href={asset.svgUrl} target="_blank" rel="noreferrer" className="grid aspect-[16/10] place-items-center bg-[#eef5fb] p-4">
              <img src={asset.pngUrl} alt={asset.useCase} className="max-h-full w-full object-contain" />
            </a>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#3493C9]">{asset.category}</p>
            <h3 className="mt-2 text-xl font-black text-[#102A43]">{asset.useCase}</h3>
            <p className="mt-1 text-sm font-semibold text-[#5f7488]">{asset.dimensions} / {asset.formats}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <DownloadLink href={asset.svgUrl}>SVG</DownloadLink>
              <DownloadLink href={asset.pngUrl}>PNG</DownloadLink>
              {asset.pdfUrl ? <DownloadLink href={asset.pdfUrl}>PDF</DownloadLink> : null}
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="border border-[#d5e4ef] bg-white p-8 text-center text-sm font-bold text-[#5f7488]">No brand files match that search.</div>
      ) : null}
    </div>
  );
}

export function UsageRules() {
  return (
    <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
      <article className="border border-[#d5e4ef] bg-white p-8">
        <h3 className="text-3xl font-black text-[#102A43]">Correct use</h3>
        <div className="mt-5 grid gap-3">
          {["Use approved SVG or PNG exports", "Keep clear space around the car-M mark", "Use blue, navy, white and verified green", "Check contrast for readable type"].map((item) => (
            <p key={item} className="flex gap-3 bg-[#eef5fb] p-3 text-sm font-black text-[#102A43]"><IconCheck size={18} className="text-[#13A55B]" />{item}</p>
          ))}
        </div>
      </article>
      <article className="border border-[#f0c8c8] bg-[#fff7f7] p-8">
        <h3 className="text-3xl font-black text-[#102A43]">Do not</h3>
        <div className="mt-5 grid gap-3">
          {["Do not stretch the logo", "Do not recolor it randomly", "Do not place it on busy photos", "Do not add cheap shadows or outlines"].map((item) => (
            <p key={item} className="bg-white p-3 text-sm font-black text-[#9c2727]">{item}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

export function FileHealthSummary() {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {[
        ["57", "SVG masters"],
        ["57", "PNG exports"],
        ["24", "PDF files"],
        ["7", "ZIP packs"],
      ].map(([value, label]) => (
        <div key={label} className="border border-white/15 bg-white/[.08] p-5">
          <p className="text-4xl font-black text-white">{value}</p>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-[#9dcdea]">{label}</p>
        </div>
      ))}
    </div>
  );
}
