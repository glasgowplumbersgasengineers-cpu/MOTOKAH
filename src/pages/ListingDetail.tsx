import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import SpecsTable from "@/components/SpecsTable";
import SellerCard from "@/components/SellerCard";
import SimilarListings from "@/components/SimilarListings";
import { useListing } from "@/hooks/useListing";
import { IconHeart, IconShare, IconFlag, IconChevronRight, IconBrandWhatsapp, IconBrandFacebook, IconBrandTwitter, IconCopy, IconX, IconCalendar, IconGauge, IconManualGearbox, IconMapPin, IconPhone } from "@tabler/icons-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useSEO } from "@/hooks/useSEO";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePriceFormatter } from "@/lib/prices";
import { isStaticListingId } from "@/lib/listingQuality";

const reportReasons = ["Fake listing", "Wrong price", "Duplicate", "Inappropriate content", "Scam / Fraud", "Other"];

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { listing, images, loading } = useListing(id);
  const { wishlistIds, toggle } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const saved = id ? wishlistIds.has(id) : false;
  const [reportReason, setReportReason] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const priceFormatter = usePriceFormatter();

  const city = listing?.location?.split(",")[0] ?? "";
  const seoTitle = listing
    ? `${listing.year || ""} ${listing.make || ""} ${listing.model || ""} for Sale${city ? ` in ${city}` : ""} | Motokah`.trim()
    : "Car for Sale | Motokah";
  const seoDesc = listing
    ? `Buy this ${listing.year || ""} ${listing.make || ""} ${listing.model || ""} in ${listing.location}. Price: ${listing.currency} ${listing.price > 0 ? listing.price.toLocaleString() : "Contact for price"}. ${listing.mileage > 0 ? `${listing.mileage.toLocaleString()}km,` : ""} ${listing.transmission || ""}. Verified on Motokah.`.replace(/\s+/g, " ").trim()
    : undefined;
  usePageTitle(seoTitle);
  useSEO({
    title: listing ? `${listing.year || ""} ${listing.make || ""} ${listing.model || ""} for Sale${city ? ` in ${city}` : ""}`.trim() : undefined,
    description: seoDesc,
    image: images[0],
    type: "product",
  });

  // JSON-LD structured data for Google rich results
  useEffect(() => {
    if (!listing || !id) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Car",
      name: listing.title,
      description: `${listing.year} ${listing.make} ${listing.model} for sale in ${listing.location}. ${listing.condition}, ${listing.mileage > 0 ? listing.mileage.toLocaleString() + "km" : ""} ${listing.transmission || ""}`.trim(),
      image: images,
      offers: {
        "@type": "Offer",
        priceCurrency: listing.currency,
        price: listing.price > 0 ? listing.price : undefined,
        availability: "https://schema.org/InStock",
        url: window.location.href,
        seller: { "@type": "AutoDealer", name: listing.sellerName },
      },
      brand: { "@type": "Brand", name: listing.make },
      model: listing.model,
      vehicleModelDate: listing.year ? String(listing.year) : undefined,
      mileageFromOdometer: listing.mileage > 0 ? { "@type": "QuantitativeValue", value: listing.mileage, unitCode: "KMT" } : undefined,
      vehicleTransmission: listing.transmission,
      fuelType: listing.fuelType,
      itemCondition: listing.condition === "New" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    };

    let scriptEl = document.querySelector('script[data-listing-ld]') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.setAttribute("data-listing-ld", "true");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schema);

    return () => {
      document.querySelector('script[data-listing-ld]')?.remove();
    };
  }, [listing, images, id]);

  // Increment view count once per session
  useEffect(() => {
    if (!id) return;
    if (isStaticListingId(id)) return;
    const viewed = JSON.parse(sessionStorage.getItem("viewedListings") || "[]");
    if (viewed.includes(id)) return;
    supabase.rpc("increment_listing_views", { _listing_id: id }).then(() => {
      sessionStorage.setItem("viewedListings", JSON.stringify([...viewed, id]));
    }).catch(() => {});
  }, [id]);

  const handleSave = async () => {
    if (!user) { navigate("/auth"); return; }
    if (id) await toggle(id);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = listing ? `Check out ${listing.title} on Motokah` : "Check out this listing on Motokah";
  const sellerPhone = listing?.sellerPhone || "";

  const handleShare = (platform: string) => {
    const encoded = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    switch (platform) {
      case "whatsapp": window.open(`https://wa.me/?text=${encodedText}%20${encoded}`); break;
      case "facebook": window.open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`); break;
      case "twitter": window.open(`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedText}`); break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
        break;
    }
  };

  const handleWhatsApp = () => {
    if (!listing) return;
    const msg = encodeURIComponent(`Hi, I'm interested in your ${listing.title} listed on Motokah.`);
    window.open(sellerPhone ? `https://wa.me/${sellerPhone.replace(/\D/g, "")}?text=${msg}` : `https://wa.me/?text=${msg}`);
  };

  const handleCall = () => {
    if (sellerPhone) window.open(`tel:${sellerPhone}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-20 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded-xl" />
            <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <IconChevronRight size={14} />
          <span>{listing.bodyType || "Cars"}</span>
          <IconChevronRight size={14} />
          <span className="text-foreground font-medium truncate">{listing.title}</span>
        </nav>
      </div>

      <main className="container mx-auto px-4 pb-28 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={images} title={listing.title} />

            {/* Title + Actions */}
            <div className="rounded-xl border border-border bg-card p-4 md:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold leading-tight">{listing.title}</h1>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                  <IconMapPin size={15} stroke={2} />
                  <span className="truncate">{listing.location}</span>
                  <span>•</span>
                  <span>{listing.condition}</span>
                  <span>•</span>
                  <span>{listing.views.toLocaleString()} views</span>
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-primary mt-3">
                  {priceFormatter.format(listing.price, listing.currency)}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    saved ? "bg-destructive/10 border-destructive text-destructive" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <IconHeart size={16} stroke={2.5} className={saved ? "fill-current" : ""} />
                  {saved ? "Saved" : "Save"}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShareOpen(o => !o)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
                  >
                    <IconShare size={16} stroke={2.5} />
                    Share
                  </button>
                  {shareOpen && (
                    <div className="absolute right-0 top-10 z-50 bg-card border border-border rounded-xl shadow-xl p-3 w-52 space-y-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">Share listing</span>
                        <button onClick={() => setShareOpen(false)}><IconX size={14} className="text-muted-foreground" /></button>
                      </div>
                      {[
                        { label: "WhatsApp", platform: "whatsapp", cls: "bg-green-600 hover:bg-green-700 text-white" },
                        { label: "Facebook", platform: "facebook", cls: "bg-blue-600 hover:bg-blue-700 text-white" },
                        { label: "X / Twitter", platform: "twitter", cls: "bg-sky-500 hover:bg-sky-600 text-white" },
                        { label: "Copy link", platform: "copy", cls: "bg-muted hover:bg-muted/80 text-foreground" },
                      ].map(({ label, platform, cls }) => (
                        <button key={platform} onClick={() => { handleShare(platform); setShareOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${cls}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors text-muted-foreground">
                      <IconFlag size={16} stroke={2.5} />
                      Report
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Report Listing</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      {reportReasons.map(r => (
                        <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="radio" name="reason" value={r} checked={reportReason === r} onChange={() => setReportReason(r)} className="accent-primary" />
                          {r}
                        </label>
                      ))}
                      <Button className="w-full" disabled={!reportReason} onClick={async () => {
                        if (!user) { navigate("/auth"); return; }
                        await supabase.from("reports").insert({ reporter_id: user.id, listing_id: id!, reason: reportReason });
                        toast.success("Report submitted. Thank you.");
                        setReportOpen(false);
                        setReportReason("");
                      }}>Submit Report</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                {[
                  { icon: IconCalendar, label: "Year", value: listing.year || "N/A" },
                  { icon: IconGauge, label: "Mileage", value: listing.mileage > 0 ? `${listing.mileage.toLocaleString()} km` : "N/A" },
                  { icon: IconManualGearbox, label: "Gearbox", value: listing.transmission || "N/A" },
                  { icon: IconMapPin, label: "Location", value: listing.location?.split(",")[0] || "N/A" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-muted/40 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <item.icon size={14} stroke={2.2} className="text-primary" />
                      {item.label}
                    </div>
                    <div className="text-sm font-semibold mt-1 truncate">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Specs - PakWheels Style Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Description - Left */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-lg font-bold mb-3">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {listing.description ||
                    `${listing.year} ${listing.title} — ${listing.condition} · ${listing.transmission} · ${listing.fuelType || "Petrol"} · ${listing.mileage.toLocaleString()} km · ${listing.location}. Contact the seller for more details and to arrange a viewing.`}
                </p>
              </div>

              {/* Specs - Right */}
              <SpecsTable listing={listing} />
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SellerCard listing={listing} />
          </div>
        </div>

        {/* Similar Listings */}
        <div className="mt-12">
          <SimilarListings currentId={listing.id} make={listing.make} bodyType={listing.bodyType} />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 shadow-2xl backdrop-blur lg:hidden safe-bottom">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-muted-foreground">Asking price</p>
            <p className="truncate text-lg font-extrabold text-primary">{priceFormatter.format(listing.price, listing.currency)}</p>
          </div>
          <button onClick={handleCall} disabled={!sellerPhone} className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50">
            <IconPhone size={20} stroke={2.5} />
          </button>
          <button onClick={handleWhatsApp} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-bold text-white">
            <IconBrandWhatsapp size={20} stroke={2.2} />
            WhatsApp
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
