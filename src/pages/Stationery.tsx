import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import {
  IconBrandInstagram,
  IconBuildingStore,
  IconCheck,
  IconDownload,
  IconFileText,
  IconIdBadge2,
  IconPrinter,
  IconQrcode,
  IconShieldCheck,
  IconShirt,
} from "@tabler/icons-react";

type Asset = {
  title: string;
  file: string;
  format: string;
  kit: "Office" | "Uniform" | "Dealer" | "Marketing";
  icon: typeof IconFileText;
};

const logos = [
  ["Main logo lockup", "/brand/motokah-logo-horizontal.svg", "Primary lockup for signs, print and official documents."],
  ["Car-M symbol", "/brand/motokah-symbol-blue.svg", "Icon, embroidery, stickers, app mark and dealer badge."],
  ["Blue block wordmark", "/brand/motokah-wordmark-block.svg", "Simple fast-print mark for labels and basic applications."],
  ["Showroom wall lockup", "/brand/motokah-logo-white-blueprint.svg", "Large-format wall, poster and launch backdrop artwork."],
] as const;

const assets: Asset[] = [
  { title: "A4 Letterhead", file: "/brand/motokah-letterhead-a4.svg", format: "210 x 297 mm", kit: "Office", icon: IconFileText },
  { title: "Business Card Front", file: "/brand/motokah-business-card-front.svg", format: "90 x 54 mm", kit: "Office", icon: IconIdBadge2 },
  { title: "Business Card Back", file: "/brand/motokah-business-card-back.svg", format: "90 x 54 mm", kit: "Office", icon: IconIdBadge2 },
  { title: "DL Envelope", file: "/brand/motokah-envelope-dl.svg", format: "220 x 110 mm", kit: "Office", icon: IconFileText },
  { title: "Navy Staff Shirt", file: "/brand/motokah-shirt-navy.svg", format: "Embroidery", kit: "Uniform", icon: IconShirt },
  { title: "White Field Shirt", file: "/brand/motokah-shirt-white.svg", format: "Embroidery", kit: "Uniform", icon: IconShirt },
  { title: "Dealer ID Tag", file: "/brand/motokah-dealer-tag.svg", format: "Lanyard card", kit: "Dealer", icon: IconIdBadge2 },
  { title: "Verified Dealer Sticker", file: "/brand/motokah-verified-badge.svg", format: "Vinyl sticker", kit: "Dealer", icon: IconShieldCheck },
  { title: "Vehicle Window Tag", file: "/brand/motokah-vehicle-window-tag.svg", format: "A5 landscape", kit: "Dealer", icon: IconQrcode },
  { title: "Dealer Poster", file: "/brand/motokah-dealer-poster.svg", format: "A4 / A3", kit: "Marketing", icon: IconBuildingStore },
  { title: "Pull-up Banner", file: "/brand/motokah-pullup-banner.svg", format: "850 x 2000 mm", kit: "Marketing", icon: IconPrinter },
  { title: "Instagram Template", file: "/brand/motokah-social-template.svg", format: "1080 x 1350 px", kit: "Marketing", icon: IconBrandInstagram },
];

const rules = [
  "Use the SVG files as vector master artwork. Do not redraw, crop or stretch the Motokah mark.",
  "Export printer PDFs at 300 DPI. Add 3 mm bleed and keep live text at least 5 mm away from cut edges.",
  "Use Motokah Blue #3493C9, Wall Blue #6BA7D4, Deep Navy #102A43 and Verified Green #13A55B only.",
  "Business cards should be matte laminated 350 gsm. Letterheads should be clean 100 to 120 gsm bond paper.",
  "For shirts, embroider the car-M mark on the chest and use the wordmark only when the print area is wide enough.",
  "Send one photo proof before bulk print, especially for blue accuracy and QR readability.",
];

function DownloadButton({ file, children = "Download SVG" }: { file: string; children?: string }) {
  return (
    <a href={file} download>
      <Button className="h-10 rounded-none bg-[#102A43] px-4 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-[#1b456b]">
        <IconDownload size={15} className="mr-2" />
        {children}
      </Button>
    </a>
  );
}

function SectionHeading({ code, title, copy }: { code: string; title: string; copy: string }) {
  return (
    <div className="mx-auto mb-8 grid max-w-6xl gap-4 border-b border-[#d0e0ed] pb-6 lg:grid-cols-[180px_1fr]">
      <p className="font-mono text-xs font-black uppercase tracking-[0.32em] text-[#3493C9]">{code}</p>
      <div>
        <h2 className="max-w-3xl text-[clamp(2.4rem,5vw,4.8rem)] font-black leading-[0.9] tracking-tight text-[#102A43]">{title}</h2>
        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#5f7488]">{copy}</p>
      </div>
    </div>
  );
}

function LogoShelf() {
  return (
    <section className="px-5 py-16 lg:px-8">
      <SectionHeading
        code="01 / logo"
        title="One logo system. No random versions."
        copy="These are the official Motokah logo masters. The spacing is corrected so the car-M symbol sits cleanly beside the wordmark and inside square applications."
      />
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
        {logos.map(([title, file, note]) => (
          <article key={file} className="border border-[#d0e0ed] bg-white p-4 shadow-[0_20px_60px_rgba(16,42,67,.08)]">
            <a
              href={file}
              target="_blank"
              rel="noreferrer"
              className={`grid aspect-[16/8] place-items-center p-8 ${file.includes("symbol-blue") || file.includes("wordmark") ? "bg-white" : "bg-[#6BA7D4]"}`}
            >
              <img src={file} alt={title} className="max-h-[76%] w-full object-contain" />
            </a>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-[#102A43]">{title}</h3>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#5f7488]">{note}</p>
              </div>
              <DownloadButton file={file}>SVG</DownloadButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function KitShowcase({
  code,
  title,
  copy,
  children,
  dark = false,
}: {
  code: string;
  title: string;
  copy: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={`${dark ? "bg-[#102A43] text-white" : "bg-[#f8fbfd] text-[#102A43]"} px-5 py-16 lg:px-8`}>
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className={`font-mono text-xs font-black uppercase tracking-[0.32em] ${dark ? "text-[#9dcdea]" : "text-[#3493C9]"}`}>{code}</p>
          <h2 className={`mt-5 text-[clamp(2.35rem,4.6vw,4.4rem)] font-black leading-[0.9] tracking-tight ${dark ? "text-white" : "text-[#102A43]"}`}>{title}</h2>
          <p className={`mt-5 max-w-md text-base font-semibold leading-7 ${dark ? "text-[#c7dbe9]" : "text-[#5f7488]"}`}>{copy}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function DownloadTable() {
  return (
    <section id="downloads" className="bg-white px-5 py-16 lg:px-8">
      <SectionHeading
        code="06 / files"
        title="Clean download counter for the printer."
        copy="The showcase above is for checking the look. This list is for sending the exact SVG file to whoever is printing, embroidering or cutting vinyl."
      />
      <div className="mx-auto max-w-6xl overflow-hidden border border-[#d0e0ed] bg-white shadow-[0_20px_60px_rgba(16,42,67,.08)]">
        {assets.map((asset, index) => {
          const Icon = asset.icon;
          return (
            <div key={asset.file} className="grid items-center gap-4 border-b border-[#e2edf5] p-4 last:border-b-0 md:grid-cols-[56px_1fr_180px_170px]">
              <span className="grid h-12 w-12 place-items-center bg-[#edf6fc] text-[#1677ad]">
                <Icon size={21} />
              </span>
              <div>
                <p className="text-lg font-black text-[#102A43]">{String(index + 1).padStart(2, "0")} / {asset.title}</p>
                <p className="text-sm font-bold text-[#6b8194]">{asset.kit} kit</p>
              </div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#6b8194]">{asset.format}</p>
              <DownloadButton file={asset.file}>SVG</DownloadButton>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function Stationery() {
  return (
    <>
      <Helmet>
        <title>Motokah Private Stationery Room</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="description" content="Private Motokah stationery, uniform and dealer print room." />
      </Helmet>

      <main className="min-h-screen bg-[#f8fbfd] text-[#102A43]">
        <section className="relative overflow-hidden bg-[#102A43] text-white">
          <div className="absolute inset-0 opacity-[.12] [background-image:linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="relative mx-auto grid min-h-[720px] max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-[.78fr_1.22fr] lg:px-8">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.34em] text-[#9dcdea]">Private Motokah print room</p>
              <h1 className="mt-7 text-[clamp(3.2rem,7vw,6.4rem)] font-black leading-[0.86] tracking-tight">Stationery that looks real.</h1>
              <p className="mt-7 max-w-lg text-lg font-semibold leading-8 text-[#c7dbe9]">
                Office papers, cards, shirts, dealer tags, stickers, window cards, posters, banners and social assets,
                arranged as a proper printer handoff.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#downloads">
                  <Button className="h-12 rounded-none bg-white px-5 font-black text-[#102A43] hover:bg-[#edf6fc]">Open downloads</Button>
                </a>
                <DownloadButton file="/brand/motokah-logo-horizontal.svg">Main logo</DownloadButton>
              </div>
            </div>

            <div className="border border-white/15 bg-white/[.08] p-4 shadow-2xl">
              <div className="grid gap-4">
                <div className="grid aspect-[16/10] place-items-center bg-[#6BA7D4] p-10">
                  <img src="/brand/motokah-logo-white-blueprint.svg" alt="Motokah wall logo" className="w-full object-contain" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-white p-5">
                    <img src="/brand/motokah-business-card-front.svg" alt="Motokah business card" className="w-full object-contain" />
                  </div>
                  <div className="bg-[#6BA7D4] p-5">
                    <img src="/brand/motokah-shirt-white.svg" alt="Motokah white shirt" className="w-full object-contain" />
                  </div>
                  <div className="bg-white p-5">
                    <img src="/brand/motokah-verified-badge.svg" alt="Motokah verified badge" className="w-full object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <LogoShelf />

        <KitShowcase
          code="02 / office"
          title="Letterhead, cards and envelope."
          copy="This is the paperwork kit for D-U-N-S, banks, Apple/Google developer accounts, dealer contracts and showroom meetings."
        >
          <div className="relative min-h-[560px] overflow-hidden border border-[#d0e0ed] bg-[#eef5fb] p-8 shadow-[0_24px_70px_rgba(16,42,67,.1)]">
            <img src="/brand/motokah-letterhead-a4.svg" alt="Motokah letterhead" className="absolute left-[8%] top-8 h-[500px] w-auto shadow-2xl" />
            <img src="/brand/motokah-envelope-dl.svg" alt="Motokah envelope" className="absolute bottom-10 right-[6%] w-[58%] shadow-xl" />
            <img src="/brand/motokah-business-card-front.svg" alt="Motokah business card front" className="absolute right-[10%] top-20 w-[44%] shadow-2xl" />
            <img src="/brand/motokah-business-card-back.svg" alt="Motokah business card back" className="absolute right-[18%] top-52 w-[40%] shadow-2xl" />
          </div>
        </KitShowcase>

        <KitShowcase
          code="03 / field"
          title="Staff shirts and dealer presence."
          copy="The field kit should make Motokah feel official when you walk into a showroom: shirt, badge, dealer sticker and vehicle card."
          dark
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid place-items-center border border-white/15 bg-white/[.08] p-8">
              <img src="/brand/motokah-shirt-navy.svg" alt="Motokah navy staff shirt" className="max-h-[430px] w-full object-contain" />
            </div>
            <div className="grid gap-5">
              <div className="grid place-items-center border border-white/15 bg-white p-6">
                <img src="/brand/motokah-dealer-tag.svg" alt="Motokah dealer tag" className="max-h-64 w-full object-contain" />
              </div>
              <div className="grid place-items-center border border-white/15 bg-[#6BA7D4] p-6">
                <img src="/brand/motokah-vehicle-window-tag.svg" alt="Motokah vehicle window tag" className="max-h-56 w-full object-contain" />
              </div>
            </div>
          </div>
        </KitShowcase>

        <KitShowcase
          code="04 / marketing"
          title="Showroom poster, banner and social post."
          copy="These are the pieces dealers and buyers actually see: counter poster, pull-up banner and Instagram template."
        >
          <div className="grid gap-5 md:grid-cols-[.8fr_1.2fr]">
            <div className="grid place-items-center border border-[#d0e0ed] bg-[#6BA7D4] p-8 shadow-xl">
              <img src="/brand/motokah-pullup-banner.svg" alt="Motokah pull-up banner" className="max-h-[560px] w-full object-contain" />
            </div>
            <div className="grid gap-5">
              <div className="grid place-items-center border border-[#d0e0ed] bg-[#102A43] p-7 shadow-xl">
                <img src="/brand/motokah-dealer-poster.svg" alt="Motokah dealer poster" className="max-h-72 w-full object-contain" />
              </div>
              <div className="grid place-items-center border border-[#d0e0ed] bg-white p-7 shadow-xl">
                <img src="/brand/motokah-social-template.svg" alt="Motokah Instagram template" className="max-h-72 w-full object-contain" />
              </div>
            </div>
          </div>
        </KitShowcase>

        <section className="bg-[#102A43] px-5 py-16 text-white lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.32em] text-[#9dcdea]">05 / printer brief</p>
              <h2 className="mt-5 text-[clamp(2.35rem,4.6vw,4.4rem)] font-black leading-[0.9] tracking-tight">Send these rules with the files.</h2>
            </div>
            <div className="grid gap-3">
              {rules.map((rule) => (
                <div key={rule} className="flex gap-4 border border-white/15 bg-white/[.07] p-4">
                  <span className="grid h-6 w-6 shrink-0 place-items-center bg-[#13A55B] text-[#102A43]">
                    <IconCheck size={15} />
                  </span>
                  <p className="text-sm font-bold leading-6 text-white">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <DownloadTable />
      </main>
    </>
  );
}
