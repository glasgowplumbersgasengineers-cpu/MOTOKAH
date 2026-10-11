import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  ApplicationStrip,
  ColorSwatches,
  DownloadCentre,
  DownloadLink,
  FileHealthSummary,
  LogoSpecimens,
  SectionHeader,
  SectionNav,
  UsageRules,
  VoiceGuide,
} from "@/components/brand-centre/BrandCentreComponents";
import { brandCentreVersion, kitDownloads } from "@/data/brandCentreAssets";
import { Helmet } from "react-helmet-async";

export default function BrandCentre() {
  return (
    <>
      <Helmet>
        <title>Motokah Brand Centre | Logo, Stationery & Dealer Assets</title>
        <meta
          name="description"
          content="Download Motokah logos, brand guidelines, stationery, dealer verification assets, uniforms, event templates and social media files."
        />
      </Helmet>
      <Header />
      <main className="bg-[#f8fbfd] text-[#102A43]">
        <section id="intro" className="relative overflow-hidden bg-[#102A43] text-white">
          <div className="absolute inset-0 opacity-[.12] [background-image:linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[.82fr_1.18fr] lg:px-8">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.34em] text-[#9dcdea]">Motokah brand centre / {brandCentreVersion}</p>
              <h1 className="mt-7 max-w-3xl text-[clamp(3.4rem,7vw,7rem)] font-black leading-[0.86] tracking-tight">
                One identity for every road.
              </h1>
              <p className="mt-7 max-w-xl text-lg font-semibold leading-8 text-[#c7dbe9]">
                The official Motokah system for staff, dealers, printers, partners and press: logo files, stationery,
                verification material, showroom assets, social templates and complete download packs.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <DownloadLink href={kitDownloads[0].href} variant="light">Download complete brand kit</DownloadLink>
                <a href="#library" className="inline-flex h-10 items-center border border-white/20 px-4 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
                  Browse library
                </a>
              </div>
              <div className="mt-10">
                <FileHealthSummary />
              </div>
            </div>
            <div className="border border-white/15 bg-white/[.08] p-4 shadow-2xl">
              <div className="grid gap-4">
                <div className="grid aspect-[16/9] place-items-center bg-[#6BA7D4] p-10">
                  <img src="/brand-centre/svg/logo-primary-horizontal.svg" alt="Motokah primary logo lockup" className="w-full object-contain" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-white p-5"><img src="/brand-centre/png/business-card-front.png" alt="Motokah business card" /></div>
                  <div className="bg-[#6BA7D4] p-5"><img src="/brand-centre/png/navy-polo-front.png" alt="Motokah navy polo" /></div>
                  <div className="bg-white p-5"><img src="/brand-centre/png/verified-dealer-badge.png" alt="Motokah verified dealer badge" /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionNav />

        <section className="px-5 py-16 lg:px-8">
          <SectionHeader
            id="logos"
            kicker="01 / Logo system"
            title="Clean logo masters, variants and usage rules."
            copy="The car-outline M mark and Motokah wordmark are rebuilt as production-ready vector artwork with PNG exports for quick use."
          />
          <LogoSpecimens />
          <div className="mt-8">
            <UsageRules />
          </div>
        </section>

        <section className="bg-white px-5 py-16 lg:px-8">
          <SectionHeader
            id="colour"
            kicker="02 / Colour & accessibility"
            title="Blue, navy, white and verified green."
            copy="The palette stays disciplined so Motokah feels trusted, clean and recognisable across print, mobile, dealer signage and social posts."
          />
          <ColorSwatches />
        </section>

        <section className="px-5 py-16 lg:px-8">
          <SectionHeader
            id="type-voice"
            kicker="03 / Typography & voice"
            title="Short, useful, confident."
            copy="Motokah should sound direct and practical: help buyers compare, help sellers move stock, and make verification feel reassuring."
          />
          <VoiceGuide />
        </section>

        <section className="bg-white px-5 py-16 lg:px-8">
          <SectionHeader
            id="office"
            kicker="04 / Office stationery"
            title="Documents that make the company feel official."
            copy="Letterhead, continuation sheet, cards, envelope, compliment slip, invoice header, presentation cover, report cover and internal memo."
          />
          <ApplicationStrip category="Print" title="Office and print templates" />
        </section>

        <section className="px-5 py-16 lg:px-8">
          <SectionHeader
            id="dealer"
            kicker="05 / Dealer & verification"
            title="Everything needed to onboard and verify a showroom."
            copy="Dealer tags, verified badges, window signs, vehicle tags, inspection certificates, sold cards, price sheets, welcome cards and partner plaques."
          />
          <ApplicationStrip category="Dealer" title="Dealer verification kit" />
        </section>

        <section className="bg-[#102A43] px-5 py-16 text-white lg:px-8">
          <SectionHeader
            id="physical"
            kicker="06 / Uniforms & physical"
            title="Staff wear and real-world touchpoints."
            copy="Shirts, lanyards, caps, totes, key tags, decals, clipboards and document folders. Mockups are placement guides, not manufacturer proofs."
            dark
          />
          <div className="[&_h3]:text-white">
            <ApplicationStrip category="Uniform" title="Uniform applications" />
            <div className="mt-10">
              <ApplicationStrip category="Merch" title="Merchandise and field material" />
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 lg:px-8">
          <SectionHeader
            id="event"
            kicker="07 / Outdoor & event"
            title="Local activation assets for Tanzania and East Africa."
            copy="Pull-up banners, backdrops, directional signs, counter cards, launch posters, billboard ratios and registration desk graphics."
          />
          <ApplicationStrip category="Event" title="Event and showroom assets" />
        </section>

        <section className="px-5 py-16 lg:px-8">
          <SectionHeader
            id="digital"
            kicker="08 / Digital & social"
            title="Templates for daily publishing and partner announcements."
            copy="Instagram, Facebook, LinkedIn, WhatsApp, listing frames, dealer announcements, newsletters, web banners and mobile splash screens."
          />
          <ApplicationStrip category="Social" title="Social templates" />
          <div className="mt-10">
            <ApplicationStrip category="Digital" title="Digital templates" />
          </div>
        </section>

        <section className="bg-white px-5 py-16 lg:px-8">
          <SectionHeader
            id="library"
            kicker="09 / Download centre"
            title="Search, filter and download real files."
            copy="Every visible action points to a generated SVG, PNG, PDF or ZIP file. No dead buttons, no placeholder downloads."
          />
          <DownloadCentre />
        </section>
      </main>
      <Footer />
    </>
  );
}
