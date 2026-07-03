import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IconHeart, IconEye, IconMapPin, IconGauge, IconCalendar, IconManualGearbox, IconStarFilled, IconFlame, IconSparkles, IconScale, IconBuildingStore, IconCar } from "@tabler/icons-react";
import { toast } from "sonner";
import { type Listing } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { usePriceFormatter } from "@/lib/prices";

function thumbUrl(src: string, width = 560): string {
  if (!src.includes("eiofmomywxcsezbyzjth.supabase.co/storage/v1/object/public/")) return src;
  const separator = src.includes("?") ? "&" : "?";
  return src.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/") + `${separator}width=${width}&height=${Math.round(width * 0.75)}&quality=62&resize=cover`;
}

export default function VehicleCard({ listing, priority }: { listing: Listing; priority?: boolean }) {
  const { user } = useAuth();
  const { wishlistIds, toggle } = useWishlist();
  const priceFormatter = usePriceFormatter();
  const navigate = useNavigate();
  const saved = wishlistIds.has(listing.id);
  const [isCompared, setIsCompared] = useState(() =>
    JSON.parse(localStorage.getItem("compareIds") || "[]").includes(listing.id)
  );
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [useOriginalSrc, setUseOriginalSrc] = useState(false);
  const primaryImage = listing.image || listing.images?.[0] || "";

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
    setUseOriginalSrc(false);
  }, [listing.id, primaryImage]);

  useEffect(() => {
    if (!primaryImage || imgLoaded || imgError) return;
    const timeout = window.setTimeout(() => setImgError(true), priority ? 7000 : 10000);
    return () => window.clearTimeout(timeout);
  }, [primaryImage, imgLoaded, imgError, priority]);

  // Sync isCompared when other cards update localStorage
  useEffect(() => {
    const sync = () => setIsCompared(JSON.parse(localStorage.getItem("compareIds") || "[]").includes(listing.id));
    window.addEventListener("storage", sync);
    window.addEventListener("compareUpdated", sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener("compareUpdated", sync); };
  }, [listing.id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate("/auth"); return; }
    toggle(listing.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const stored: string[] = JSON.parse(localStorage.getItem("compareIds") || "[]");
    if (stored.includes(listing.id)) {
      localStorage.setItem("compareIds", JSON.stringify(stored.filter(id => id !== listing.id)));
      setIsCompared(false);
      toast.success("Removed from comparison");
    } else {
      if (stored.length >= 4) { toast.error("You can compare up to 4 vehicles"); return; }
      localStorage.setItem("compareIds", JSON.stringify([...stored, listing.id]));
      setIsCompared(true);
      toast.success("Added to comparison", {
        action: { label: "Compare Now", onClick: () => window.location.href = "/compare" }
      });
    }
    window.dispatchEvent(new Event("compareUpdated"));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const badgeConfig: Record<string, { icon: any; label: string; className: string }> = {
    hot: { icon: IconFlame, label: "Hot Deal", className: "bg-destructive text-destructive-foreground" },
    featured: { icon: IconStarFilled, label: "Featured", className: "bg-accent text-accent-foreground" },
    new: { icon: IconSparkles, label: "New", className: "bg-success text-success-foreground" },
  };

  const conditionColors: Record<string, string> = {
    New: "border-success text-success",
    Used: "border-muted-foreground text-muted-foreground",
    "Foreign Used": "border-accent text-accent",
    "Certified Pre-owned": "border-primary text-primary",
  };

  const badge = listing.badge ? badgeConfig[listing.badge] : null;
  const showPlaceholder = !imgLoaded || imgError;

  return (
    <Link to={`/listing/${listing.id}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-300 block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* Skeleton placeholder */}
        {showPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconCar size={48} className="text-muted-foreground/30" stroke={1.5} />
          </div>
        )}
        {primaryImage && !imgError ? (
          <img
            src={useOriginalSrc ? primaryImage : thumbUrl(primaryImage, priority ? 720 : 560)}
            alt={listing.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onLoad={() => {
              setImgLoaded(true);
              setImgError(false);
            }}
            onError={() => {
              if (useOriginalSrc) {
                setImgError(true);
                return;
              }
              setUseOriginalSrc(true);
              setImgLoaded(false);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconCar size={48} className="text-muted-foreground/40" stroke={1.5} />
          </div>
        )}
        {badge && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${badge.className}`}>
            <badge.icon size={12} stroke={2.5} /> {badge.label}
          </span>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button
            onClick={handleSave}
            className="w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors"
          >
            <IconHeart size={16} stroke={2.5} className={saved ? "fill-primary text-primary" : "text-foreground"} />
          </button>
          <button
            onClick={handleCompare}
            className="w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors"
            title="Add to compare"
          >
            <IconScale size={16} stroke={2.5} className={isCompared ? "text-primary" : "text-foreground"} />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-foreground bg-background/60 backdrop-blur-sm px-2 py-1 rounded-full">
          <IconEye size={14} stroke={2.5} /> {listing.views.toLocaleString()}
        </div>
        {listing.discount && (
          <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground">
            -{listing.discount}%
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">{listing.title}</h3>

        <div className="flex items-baseline gap-2 mb-2">
          {listing.price > 0 ? (
            <span className="text-lg font-bold text-primary">{priceFormatter.format(listing.price, listing.currency)}</span>
          ) : (
            <span className="text-lg font-bold text-primary">Contact for price</span>
          )}
          {listing.originalPrice && listing.originalPrice > 0 && (
            <span className="text-xs text-muted-foreground line-through">{priceFormatter.format(listing.originalPrice, listing.currency)}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${conditionColors[listing.condition] || "border-border text-muted-foreground"}`}>
            {listing.condition}
          </span>
          {listing.bodyType && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
              {listing.bodyType}
            </span>
          )}
          {listing.fuelType && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
              {listing.fuelType}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1"><IconGauge size={14} stroke={2.5} />{listing.mileage > 0 ? `${listing.mileage.toLocaleString()} km` : listing.condition === "New" ? "0 km" : "N/A"}</span>
          <span className="flex items-center gap-1"><IconCalendar size={14} stroke={2.5} />{listing.year}</span>
          <span className="flex items-center gap-1"><IconManualGearbox size={14} stroke={2.5} />{listing.transmission || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          {listing.cc && (
            <span className="text-xs text-primary font-semibold">{listing.cc}cc</span>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            <IconMapPin size={13} stroke={2.5} /> {(listing.location || "").split(",")[0].replace(/,?\s*(TZ|KE|UG|RW|ET|NG)$/i, "").trim()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground truncate max-w-[60%] flex items-center gap-1">
            {listing.sellerType === "dealer" && <IconBuildingStore size={13} className="text-primary shrink-0" />}
            {listing.sellerName}
          </span>
          <span className="flex items-center gap-0.5 text-xs">
            <IconStarFilled size={14} className="text-accent" /> {listing.sellerRating}
          </span>
        </div>
      </div>
    </Link>
  );
}
