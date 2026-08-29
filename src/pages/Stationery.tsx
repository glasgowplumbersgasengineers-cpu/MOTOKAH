import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  IconArrowDown,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconDownload,
  IconMail,
  IconMapPin,
  IconPrinter,
  IconShirt,
  IconSparkles,
} from "@tabler/icons-react";
import { Helmet } from "react-helmet-async";

const brandAssets = [
  { name: "Full-color logo", file: "/brand/motokah-logo-full-color.svg", use: "White paper, proposals, letterheads" },
  { name: "Reverse logo", file: "/brand/motokah-logo-reverse.svg", use: "Dark shirts, banners, night-mode artwork" },
  { name: "App / favicon icon", file: "/brand/motokah-icon.svg", use: "App icon, stickers, social avatar" },
  { name: "Wordmark", file: "/brand/motokah-wordmark.svg", use: "Headers, invoices, email signatures" },
  { name: "Verified badge", file: "/brand/motokah-verified-badge.svg", use: "Dealer material, showroom posters" },
];

const colors = [
  { label: "Motokah Blue", hex: "#0066CC", role: "Primary trust color" },
  { label: "Action Orange", hex: "#F28C28", role: "CTA, highlight, price tag" },
  { label: "Deep Navy", hex: "#0B1726", role: "Premium backgrounds" },
  { label: "Road Slate", hex: "#52677A", role: "Body text, secondary UI" },
  { label: "Soft Surface", hex: "#F4F8FC", role: "Paper tint, backgrounds" },
  { label: "Verified Green", hex: "#13A55B", role: "Trust badges" },
];

const launchPosts = [
  {
    pillar: "Buyer Trust",
    title: "Find cars in Dar es Salaam without guessing",
    caption:
      "Browse launch-quality cars, compare prices, and contact verified sellers directly on Motokah. Start with Tanzania, then East Africa.",
  },
  {
    pillar: "Dealer",
    title: "Dealers: claim your Motokah page",
    caption:
      "Your Instagram stock deserves a searchable showroom. Claim your Motokah dealer page and let buyers call or WhatsApp from every listing.",
  },
  {
    pillar: "Safety",
    title: "Before you pay, inspect",
    caption:
      "Always check logbook, chassis number, import documents and seller identity. Motokah makes discovery easy; inspection keeps the deal clean.",
  },
  {
    pillar: "Local SEO",
    title: "Used cars in Tanzania",
    caption:
      "Toyota Harrier, Hilux, Prado, Mark X, Crown and more. Browse Tanzania vehicle listings on Motokah and speak to sellers directly.",
  },
];

const printItems = [
  "Business cards for dealer visits",
  "A4 letterhead for D&B, bank and partner letters",
  "DL envelope front",
  "Dealer claim flyer",
  "Verified dealer window sticker",
  "Staff polo / T-shirt front and back",
  "Pull-up banner for showroom visits",
  "WhatsApp launch poster",
];

function AssetDownload({ file, label }: { file: string; label: string }) {
  return (
    <a href={file} download className="inline-flex">
      <Button size="sm" className="gap-2">
        <IconDownload size={16} />
        {label}
      </Button>
    </a>
  );
}

function SectionTitle({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground md:text-5xl">{title}</h2>
      {body ? <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">{body}</p> : null}
    </div>
  );
}

function LogoPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
        <img src="/brand/motokah-logo-full-color.svg" alt="Motokah full-color logo" className="h-auto w-full" />
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border border-border bg-[#0B1726] p-6">
          <img src="/brand/motokah-logo-reverse.svg" alt="Motokah reverse logo" className="h-auto w-full" />
        </div>
        <div className="rounded-lg border border-border bg-white p-6">
          <img src="/brand/motokah-icon.svg" alt="Motokah icon" className="mx-auto h-32 w-32" />
        </div>
      </div>
    </div>
  );
}

function BusinessCard() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="aspect-[1.75/1] rounded-lg bg-[#0B1726] p-6 text-white shadow-xl">
        <div className="flex h-full flex-col justify-between">
          <img src="/brand/motokah-logo-reverse.svg" alt="" className="w-56" />
          <div>
            <p className="text-xl font-black">Waleed Malik</p>
            <p className="text-sm font-semibold text-[#C9D8E8]">Launch & Growth</p>
            <div className="mt-4 grid gap-1 text-xs text-[#C9D8E8]">
              <span>info@motokah.com</span>
              <span>www.motokah.com</span>
              <span>Dar es Salaam, Tanzania</span>
            </div>
          </div>
        </div>
      </div>
      <div className="aspect-[1.75/1] rounded-lg border border-[#D7E5F4] bg-white p-6 shadow-xl">
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <img src="/brand/motokah-icon.svg" alt="" className="h-16 w-16" />
            <span className="rounded-full bg-[#13A55B]/10 px-3 py-1 text-xs font-black text-[#0C7B43]">Verified dealer network</span>
          </div>
          <div>
            <p className="text-2xl font-black text-[#102A43]">Find Your Perfect Ride</p>
            <p className="mt-2 max-w-sm text-sm font-medium text-[#52677A]">
              Trusted vehicle discovery for Tanzania and East Africa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Letterhead() {
  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-border bg-white p-8 text-[#102A43] shadow-xl">
      <div className="flex items-start justify-between border-b-4 border-[#0066CC] pb-6">
        <img src="/brand/motokah-wordmark.svg" alt="" className="w-56" />
        <div className="text-right text-xs font-semibold text-[#52677A]">
          <p>MOTOKAH AFRICA LIMITED</p>
          <p>Plot No. 18, Mbagala Industrial Area</p>
          <p>Dar es Salaam, Tanzania</p>
          <p>info@motokah.com</p>
        </div>
      </div>
      <div className="py-10">
        <p className="text-sm text-[#52677A]">29 August 2026</p>
        <h3 className="mt-8 text-2xl font-black">Official Company Letter</h3>
        <p className="mt-5 leading-7 text-[#52677A]">
          Motokah Africa Limited operates a digital vehicle marketplace built for buyers, sellers and dealers across
          East Africa. This letterhead should be used for bank, D&B, Apple Developer, Google Play, partner and dealer
          communication.
        </p>
      </div>
      <div className="border-t border-[#D7E5F4] pt-5 text-xs font-semibold text-[#52677A]">
        motokah.com | Find Your Perfect Ride
      </div>
    </div>
  );
}

function ShirtMockup() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {["Navy staff polo", "White dealer visit tee", "Blue event tee"].map((label, index) => (
        <div key={label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div
            className={`relative mx-auto h-72 max-w-56 rounded-t-[44px] ${
              index === 0 ? "bg-[#0B1726]" : index === 1 ? "bg-white" : "bg-[#0066CC]"
            } shadow-xl`}
          >
            <div className="absolute left-1/2 top-0 h-16 w-24 -translate-x-1/2 rounded-b-full bg-background/80" />
            <div className="absolute left-4 top-20 h-32 w-7 -skew-y-12 rounded-full bg-black/10" />
            <div className="absolute right-4 top-20 h-32 w-7 skew-y-12 rounded-full bg-black/10" />
            <img
              src={index === 1 ? "/brand/motokah-logo-full-color.svg" : "/brand/motokah-logo-reverse.svg"}
              alt=""
              className="absolute left-1/2 top-28 w-36 -translate-x-1/2"
            />
            <p
              className={`absolute bottom-8 left-0 right-0 text-center text-xs font-black uppercase tracking-[0.18em] ${
                index === 1 ? "text-[#52677A]" : "text-white/80"
              }`}
            >
              Dealer Team
            </p>
          </div>
          <h3 className="mt-5 text-lg font-black">{label}</h3>
          <p className="mt-2 text-sm text-muted-foreground">Embroidery on chest, screen print on back, no tiny tagline below 28mm width.</p>
        </div>
      ))}
    </div>
  );
}

function SocialPost({ post, index }: { post: (typeof launchPosts)[number]; index: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className={`aspect-square p-6 ${index % 2 ? "bg-[#0B1726] text-white" : "bg-[#F4F8FC] text-[#102A43]"}`}>
        <div className="flex items-center justify-between">
          <img
            src={index % 2 ? "/brand/motokah-logo-reverse.svg" : "/brand/motokah-logo-full-color.svg"}
            alt=""
            className="w-40"
          />
          <span className="rounded-full bg-[#F28C28] px-3 py-1 text-xs font-black text-white">{post.pillar}</span>
        </div>
        <div className="mt-16">
          <p className="text-4xl font-black leading-tight">{post.title}</p>
          <div className="mt-8 h-2 w-36 rounded-full bg-[#F28C28]" />
        </div>
        <p className={`mt-10 max-w-sm text-sm font-semibold ${index % 2 ? "text-white/70" : "text-[#52677A]"}`}>
          motokah.com
        </p>
      </div>
      <div className="p-5">
        <p className="text-sm leading-6 text-muted-foreground">{post.caption}</p>
      </div>
    </div>
  );
}

export default function Stationery() {
  return (
    <>
      <Helmet>
        <title>Motokah Brand & Stationery Kit | Print Assets</title>
        <meta
          name="description"
          content="Motokah logo files, stationery previews, shirts, social post templates and printer handoff notes for Motokah Africa Limited."
        />
      </Helmet>
      <Header />
      <main className="bg-background pb-16">
        <section className="relative overflow-hidden bg-[#0B1726] text-white">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="container relative mx-auto grid min-h-[76vh] items-center gap-10 py-16 md:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#C9D8E8]">
                <IconSparkles size={16} /> Motokah launch kit
              </p>
              <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Stationery, merch, dealer collateral and social templates.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#C9D8E8]">
                A practical brand system for printing, dealer visits, launch posting and official company communication.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#downloads">
                  <Button className="gap-2 bg-white text-[#0B1726] hover:bg-white/90">
                    <IconArrowDown size={18} /> Download assets
                  </Button>
                </a>
                <a href="#printer">
                  <Button variant="outline" className="gap-2 border-white/30 bg-white/5 text-white hover:bg-white/10">
                    <IconPrinter size={18} /> Printer brief
                  </Button>
                </a>
              </div>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/8 p-4 shadow-2xl backdrop-blur">
              <LogoPanel />
            </div>
          </div>
        </section>

        <section id="downloads" className="container mx-auto py-16">
          <SectionTitle
            eyebrow="01 / logo files"
            title="Ready-to-send brand assets"
            body="Use SVG for printing and PNG export. Keep the logo clear, never stretch it, and use reverse artwork on navy or photo backgrounds."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {brandAssets.map((asset) => (
              <div key={asset.file} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="flex h-28 items-center justify-center rounded-md bg-white p-3">
                  <img src={asset.file} alt={asset.name} className="max-h-full max-w-full" />
                </div>
                <h3 className="mt-4 font-black">{asset.name}</h3>
                <p className="mt-2 min-h-10 text-sm text-muted-foreground">{asset.use}</p>
                <div className="mt-4">
                  <AssetDownload file={asset.file} label="Download SVG" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-2 py-16">
          <div className="container mx-auto">
            <SectionTitle eyebrow="02 / color system" title="Simple, premium and easy to print" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colors.map((color) => (
                <div key={color.hex} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
                  <div className="h-20 w-20 rounded-md border border-black/10" style={{ backgroundColor: color.hex }} />
                  <div>
                    <p className="font-black">{color.label}</p>
                    <p className="font-mono text-sm text-muted-foreground">{color.hex}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{color.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto py-16">
          <SectionTitle
            eyebrow="03 / stationery"
            title="Business cards and official letterhead"
            body="These are the core pieces for D&B, Apple/Google developer account verification, dealer visits and partner communication."
          />
          <div className="mt-8 grid gap-10">
            <BusinessCard />
            <Letterhead />
          </div>
        </section>

        <section className="bg-[#0B1726] py-16 text-white">
          <div className="container mx-auto">
            <div className="[&_h2]:text-white [&_p:first-child]:text-[#C9D8E8]">
              <SectionTitle eyebrow="04 / shirts" title="Staff merch that looks like a real mobility brand" />
            </div>
            <div className="mt-8">
              <ShirtMockup />
            </div>
          </div>
        </section>

        <section className="container mx-auto py-16">
          <SectionTitle
            eyebrow="05 / dealer collateral"
            title="Print pieces for showroom visits"
            body="Give this section to the printer as the list of required deliverables. The same visual system works across flyers, banners, stickers and dealer cards."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="text-2xl font-black">Print checklist</h3>
              <div className="mt-5 grid gap-3">
                {printItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-md bg-surface-2 p-3 text-sm font-bold">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F28C28]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-white p-6 text-[#102A43] shadow-sm">
                <img src="/brand/motokah-verified-badge.svg" alt="" className="w-full" />
                <h3 className="mt-6 text-2xl font-black">Window Sticker</h3>
                <p className="mt-2 text-sm font-semibold text-[#52677A]">Size: 120mm x 45mm. Material: waterproof vinyl.</p>
              </div>
              <div className="rounded-lg border border-border bg-[#0066CC] p-6 text-white shadow-sm">
                <IconBrandWhatsapp size={36} />
                <h3 className="mt-12 text-3xl font-black leading-tight">Claim your dealer page.</h3>
                <p className="mt-4 text-sm font-semibold text-white/80">
                  Your cars are already online. Let buyers call or WhatsApp you from Motokah.
                </p>
                <p className="mt-8 text-sm font-black">motokah.com/dealers</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-2 py-16">
          <div className="container mx-auto">
            <SectionTitle
              eyebrow="06 / social launch"
              title="Instagram-ready post directions"
              body="Use these as daily launch posts. Keep it buyer/dealer focused; avoid random news, accidents, politics or thin content."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {launchPosts.map((post, index) => (
                <SocialPost key={post.title} post={post} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="printer" className="container mx-auto py-16">
          <SectionTitle
            eyebrow="07 / handoff"
            title="Brief for printing guy"
            body="Send this page link with the SVG files. Tell the printer to keep colors exact and ask for proof images before final production."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <IconPrinter className="text-primary" size={32} />
              <h3 className="mt-5 text-xl font-black">Print setup</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Use SVG/vector artwork. Export print PDFs at 300 DPI. Keep 3mm bleed and 5mm safe margin on all printed pieces.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <IconShirt className="text-primary" size={32} />
              <h3 className="mt-5 text-xl font-black">Merch setup</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Use embroidery for polo chest logos. Use screen print for large back logos. Navy shirt + reverse logo is the premium default.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <IconBrandInstagram className="text-primary" size={32} />
              <h3 className="mt-5 text-xl font-black">Social setup</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Keep posts square or 4:5. Use the full logo at top, strong vehicle/dealer headline, orange CTA bar and motokah.com footer.
              </p>
            </div>
          </div>
          <div className="mt-8 rounded-lg border border-primary/25 bg-primary/5 p-6">
            <h3 className="text-xl font-black">Copy block for official material</h3>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <p className="flex items-center gap-2"><IconMail size={18} /> info@motokah.com</p>
              <p className="flex items-center gap-2"><IconMapPin size={18} /> Dar es Salaam, Tanzania</p>
              <p className="flex items-center gap-2"><IconBrandWhatsapp size={18} /> WhatsApp-first seller contact</p>
              <p className="flex items-center gap-2"><IconSparkles size={18} /> Find Your Perfect Ride</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
