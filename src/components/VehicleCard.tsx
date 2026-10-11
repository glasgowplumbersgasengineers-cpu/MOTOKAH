import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IconHeart, IconEye, IconMapPin, IconGauge, IconCalendar, IconManualGearbox, IconStarFilled, IconFlame, IconSparkles, IconScale, IconBuildingStore, IconCar, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { toast } from "sonner";
import { type Listing } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { usePriceFormatter } from "@/lib/prices";
import { cardImageUrl, fullImageUrl, normalizeImageUrl } from "@/lib/imageUrls";

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
  const [imageIndex, setImageIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const cardImages = useMemo(() => [...new Set([listing.image, ...(listing.images || [])].filter(Boolean).map(normalizeImageUrl))], [listing.image, listing.images]);
  const primaryImage = cardImages[imageIndex] || "";
  const displayImage = useOriginalSrc ? fullImageUrl(primaryImage) : cardImageUrl(primaryImage);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
    setUseOriginalSrc(false);
  }, [listing.id, primaryImage]);

  useEffect(() => setImageIndex(0), [listing.id]);

  const changeImage = (event: React.SyntheticEvent, direction: number) => {
    event.preventDefault();
    event.stopPropagation();
    setImageIndex((current) => (current + direction + cardImages.length) % cardImages.length);
  };

  const handleImageFailure = useCallback(() => {
    const originalImage = fullImageUrl(primaryImage);
    if (!useOriginalSrc && displayImage !== originalImage) {
      setUseOriginalSrc(true);
      setImgLoaded(false);
      return;
    }
    if (imageIndex < cardImages.length - 1) {
      setImageIndex((current) => current + 1);
      return;
    }
    setImgError(true);
  }, [cardImages.length, displayImage, imageIndex, primaryImage, useOriginalSrc]);

  useEffect(() => {
    if (!primaryImage || imgLoaded || imgError) return;
    const timeout = window.setTimeout(() => {
      handleImageFailure();
    }, priority ? 2000 : 3000);
    return () => window.clearTimeout(timeout);
  }, [primaryImage, imgLoaded, imgError, priority, useOriginalSrc, displayImage, imageIndex, cardImages.length, handleImageFailure]);

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
    <Link to={`/listing/${listing.id}`} className="group block w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02]">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted"
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null || cardImages.length < 2) return;
          const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
          if (Math.abs(delta) > 45) changeImage(event, delta < 0 ? 1 : -1);
          touchStart.current = null;
        }}>
        {/* Skeleton placeholder */}
        {showPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconCar size={48} className="text-muted-foreground/30" stroke={1.5} />
          </div>
        )}
        {primaryImage && !imgError ? (
          <img
            src={displayImage}
            alt={listing.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchpriority={priority ? "high" : "auto"}
            onLoad={() => {
              setImgLoaded(true);
              setImgError(false);
            }}
            onError={handleImageFailure}
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
        {cardImages.length > 1 && (
          <>
            <button aria-label="Previous photo" onClick={(event) => changeImage(event, -1)} className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/75 opacity-100 shadow-sm backdrop-blur sm:opacity-0 sm:group-hover:opacity-100">
              <IconChevronLeft size={18} />
            </button>
            <button aria-label="Next photo" onClick={(event) => changeImage(event, 1)} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/75 opacity-100 shadow-sm backdrop-blur sm:opacity-0 sm:group-hover:opacity-100">
              <IconChevronRight size={18} />
            </button>
            <span className="absolute bottom-2 right-2 rounded-full bg-background/75 px-2 py-1 text-[10px] font-semibold text-foreground backdrop-blur">{imageIndex + 1}/{cardImages.length}</span>
          </>
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
        <div className="min-w-0 p-3">
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

        <div className="grid min-w-0 grid-cols-3 gap-2 text-xs text-muted-foreground mb-2">
          <span className="flex min-w-0 items-center gap-1 truncate"><IconGauge size={14} stroke={2.5} className="shrink-0" />{listing.mileage > 0 ? `${listing.mileage.toLocaleString()} km` : listing.condition === "New" ? "0 km" : "N/A"}</span>
          <span className="flex min-w-0 items-center justify-center gap-1 truncate"><IconCalendar size={14} stroke={2.5} className="shrink-0" />{listing.year}</span>
          <span className="flex min-w-0 items-center justify-end gap-1 truncate"><IconManualGearbox size={14} stroke={2.5} className="shrink-0" />{listing.transmission || "N/A"}</span>
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
