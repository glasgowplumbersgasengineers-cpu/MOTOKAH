import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import BrowseSection from "@/components/BrowseSection";
import FeaturedListings from "@/components/FeaturedListings";
import LatestListingsGrid from "@/components/LatestListingsGrid";
import SellCTA from "@/components/SellCTA";
import PopularModelsSection from "@/components/PopularModelsSection";
import Footer from "@/components/Footer";
import { jsonLdScript, organizationJsonLd, websiteJsonLd } from "@/lib/structuredData";
import { Link } from "react-router-dom";
import { IconArrowRight } from "@tabler/icons-react";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Used Cars for Sale in Tanzania, Kenya & East Africa | Motokah</title>
        <meta name="description" content="Buy used cars in Tanzania, Kenya, Uganda and East Africa. Browse dealer listings for Toyota, Nissan, Subaru, Mazda and more by city, then call or WhatsApp sellers directly." />
        <meta property="og:title" content="Used Cars for Sale in East Africa | Motokah" />
        <meta property="og:description" content="East Africa's car marketplace for used cars in Dar es Salaam, Nairobi, Kampala and beyond. Browse by city and contact sellers directly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.motokah.com/" />
        <meta property="og:image" content="https://www.motokah.com/pwa-512x512.png" />
        <link rel="canonical" href="https://www.motokah.com/" />
        {jsonLdScript(websiteJsonLd())}
        {jsonLdScript(organizationJsonLd())}
      </Helmet>
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <HeroSearch />
      <BrowseSection />
      <section className="border-y border-border bg-card">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Vehicles across Africa</h2>
            <p className="text-xs text-muted-foreground">Explore listings beyond your selected country.</p>
          </div>
          <Link to="/search?country=All" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary">
            View All Africa <IconArrowRight size={16} />
          </Link>
        </div>
      </section>
      <FeaturedListings />
      <LatestListingsGrid />
      <PopularModelsSection />
      <SellCTA />
      <Footer />
    </div>
    </>
  );
};

export default Index;
