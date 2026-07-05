import { useState } from "react";
import { IconChevronLeft, IconChevronRight, IconZoomIn } from "@tabler/icons-react";
import { fullImageUrl, galleryImageUrl, normalizeImageUrl } from "@/lib/imageUrls";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const normalizedImages = (images || []).map(normalizeImageUrl);
  const activeImage = normalizedImages[activeIndex];

  if (!normalizedImages || normalizedImages.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No images available</span>
      </div>
    );
  }

  const navigate = (dir: "prev" | "next") => {
    setActiveIndex((i) =>
      dir === "prev" ? (i === 0 ? normalizedImages.length - 1 : i - 1) : (i === normalizedImages.length - 1 ? 0 : i + 1)
    );
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted group select-none">
        <img
          src={zoomed ? fullImageUrl(activeImage) : galleryImageUrl(activeImage)}
          alt={`${title} - Image ${activeIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 ${zoomed ? "scale-125 md:scale-150 cursor-zoom-out" : "cursor-zoom-in"}`}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onClick={() => setZoomed(!zoomed)}
          draggable={false}
        />
        <button
          onClick={() => navigate("prev")}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-background/95"
        >
          <IconChevronLeft size={20} stroke={2.5} />
        </button>
        <button
          onClick={() => navigate("next")}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-background/95"
        >
          <IconChevronRight size={20} stroke={2.5} />
        </button>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs bg-background/70 backdrop-blur-sm px-2 py-1 rounded-full">
          <IconZoomIn size={14} stroke={2} />
          {activeIndex + 1}/{normalizedImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {normalizedImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              i === activeIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-90"
            }`}
          >
            <img src={galleryImageUrl(img)} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  );
}
