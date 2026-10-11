export type BrandAssetCategory = "Logo" | "Print" | "Dealer" | "Uniform" | "Merch" | "Event" | "Social" | "Digital";

export type BrandAsset = {
  id: string;
  category: BrandAssetCategory;
  formats: string;
  dimensions: string;
  useCase: string;
  svgUrl: string;
  pngUrl: string;
  pdfUrl: string | null;
};

export const brandCentreVersion = "2026-08-29";

export const brandAssets = [
  {
    "id": "logo-primary-horizontal",
    "category": "Logo",
    "formats": "SVG + PNG",
    "dimensions": "1600 x 520",
    "useCase": "Primary Motokah horizontal lockup",
    "svgUrl": "/brand-centre/svg/logo-primary-horizontal.svg",
    "pngUrl": "/brand-centre/png/logo-primary-horizontal.png",
    "pdfUrl": null
  },
  {
    "id": "logo-stacked",
    "category": "Logo",
    "formats": "SVG + PNG",
    "dimensions": "1000 x 1000",
    "useCase": "Stacked lockup for square layouts",
    "svgUrl": "/brand-centre/svg/logo-stacked.svg",
    "pngUrl": "/brand-centre/png/logo-stacked.png",
    "pdfUrl": null
  },
  {
    "id": "logo-symbol",
    "category": "Logo",
    "formats": "SVG + PNG",
    "dimensions": "1040 x 600",
    "useCase": "Car-M symbol only",
    "svgUrl": "/brand-centre/svg/logo-symbol.svg",
    "pngUrl": "/brand-centre/png/logo-symbol.png",
    "pdfUrl": null
  },
  {
    "id": "logo-wordmark-block",
    "category": "Logo",
    "formats": "SVG + PNG",
    "dimensions": "1600 x 560",
    "useCase": "Compact block wordmark",
    "svgUrl": "/brand-centre/svg/logo-wordmark-block.svg",
    "pngUrl": "/brand-centre/png/logo-wordmark-block.png",
    "pdfUrl": null
  },
  {
    "id": "logo-reversed",
    "category": "Logo",
    "formats": "SVG + PNG",
    "dimensions": "1600 x 520",
    "useCase": "White lockup on deep navy",
    "svgUrl": "/brand-centre/svg/logo-reversed.svg",
    "pngUrl": "/brand-centre/png/logo-reversed.png",
    "pdfUrl": null
  },
  {
    "id": "logo-monochrome",
    "category": "Logo",
    "formats": "SVG + PNG",
    "dimensions": "1600 x 520",
    "useCase": "One-colour ink mark",
    "svgUrl": "/brand-centre/svg/logo-monochrome.svg",
    "pngUrl": "/brand-centre/png/logo-monochrome.png",
    "pdfUrl": null
  },
  {
    "id": "logo-verified-green",
    "category": "Logo",
    "formats": "SVG + PNG",
    "dimensions": "1600 x 520",
    "useCase": "Verification-led green lockup",
    "svgUrl": "/brand-centre/svg/logo-verified-green.svg",
    "pngUrl": "/brand-centre/png/logo-verified-green.png",
    "pdfUrl": null
  },
  {
    "id": "app-icon",
    "category": "Digital",
    "formats": "SVG + PNG",
    "dimensions": "1024 x 1024",
    "useCase": "Mobile app icon master",
    "svgUrl": "/brand-centre/svg/app-icon.svg",
    "pngUrl": "/brand-centre/png/app-icon.png",
    "pdfUrl": null
  },
  {
    "id": "a4-letterhead",
    "category": "Print",
    "formats": "SVG + PDF + PNG",
    "dimensions": "210 x 297 mm",
    "useCase": "Official company letterhead",
    "svgUrl": "/brand-centre/svg/a4-letterhead.svg",
    "pngUrl": "/brand-centre/png/a4-letterhead.png",
    "pdfUrl": "/brand-centre/pdf/a4-letterhead.pdf"
  },
  {
    "id": "a4-continuation-sheet",
    "category": "Print",
    "formats": "SVG + PDF + PNG",
    "dimensions": "210 x 297 mm",
    "useCase": "Continuation sheet",
    "svgUrl": "/brand-centre/svg/a4-continuation-sheet.svg",
    "pngUrl": "/brand-centre/png/a4-continuation-sheet.png",
    "pdfUrl": "/brand-centre/pdf/a4-continuation-sheet.pdf"
  },
  {
    "id": "business-card-front",
    "category": "Print",
    "formats": "SVG + PDF + PNG",
    "dimensions": "90 x 54 mm",
    "useCase": "Business card front",
    "svgUrl": "/brand-centre/svg/business-card-front.svg",
    "pngUrl": "/brand-centre/png/business-card-front.png",
    "pdfUrl": "/brand-centre/pdf/business-card-front.pdf"
  },
  {
    "id": "business-card-back",
    "category": "Print",
    "formats": "SVG + PDF + PNG",
    "dimensions": "90 x 54 mm",
    "useCase": "Business card back",
    "svgUrl": "/brand-centre/svg/business-card-back.svg",
    "pngUrl": "/brand-centre/png/business-card-back.png",
    "pdfUrl": "/brand-centre/pdf/business-card-back.pdf"
  },
  {
    "id": "dl-envelope",
    "category": "Print",
    "formats": "SVG + PDF + PNG",
    "dimensions": "220 x 110 mm",
    "useCase": "DL envelope",
    "svgUrl": "/brand-centre/svg/dl-envelope.svg",
    "pngUrl": "/brand-centre/png/dl-envelope.png",
    "pdfUrl": "/brand-centre/pdf/dl-envelope.pdf"
  },
  {
    "id": "compliment-slip",
    "category": "Print",
    "formats": "SVG + PDF + PNG",
    "dimensions": "210 x 99 mm",
    "useCase": "Compliment slip",
    "svgUrl": "/brand-centre/svg/compliment-slip.svg",
    "pngUrl": "/brand-centre/png/compliment-slip.png",
    "pdfUrl": "/brand-centre/pdf/compliment-slip.pdf"
  },
  {
    "id": "email-signature",
    "category": "Print",
    "formats": "SVG + PNG",
    "dimensions": "600 x 220 px",
    "useCase": "Email signature block",
    "svgUrl": "/brand-centre/svg/email-signature.svg",
    "pngUrl": "/brand-centre/png/email-signature.png",
    "pdfUrl": null
  },
  {
    "id": "invoice-header",
    "category": "Print",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A4 header",
    "useCase": "Invoice and quotation header",
    "svgUrl": "/brand-centre/svg/invoice-header.svg",
    "pngUrl": "/brand-centre/png/invoice-header.png",
    "pdfUrl": "/brand-centre/pdf/invoice-header.pdf"
  },
  {
    "id": "presentation-cover",
    "category": "Print",
    "formats": "SVG + PDF + PNG",
    "dimensions": "16:9",
    "useCase": "Presentation cover",
    "svgUrl": "/brand-centre/svg/presentation-cover.svg",
    "pngUrl": "/brand-centre/png/presentation-cover.png",
    "pdfUrl": "/brand-centre/pdf/presentation-cover.pdf"
  },
  {
    "id": "report-cover",
    "category": "Print",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A4",
    "useCase": "Report cover",
    "svgUrl": "/brand-centre/svg/report-cover.svg",
    "pngUrl": "/brand-centre/png/report-cover.png",
    "pdfUrl": "/brand-centre/pdf/report-cover.pdf"
  },
  {
    "id": "internal-memo",
    "category": "Print",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A4",
    "useCase": "Internal memo",
    "svgUrl": "/brand-centre/svg/internal-memo.svg",
    "pngUrl": "/brand-centre/png/internal-memo.png",
    "pdfUrl": "/brand-centre/pdf/internal-memo.pdf"
  },
  {
    "id": "dealer-id-tag",
    "category": "Dealer",
    "formats": "SVG + PDF + PNG",
    "dimensions": "90 x 130 mm",
    "useCase": "Dealer lanyard ID tag",
    "svgUrl": "/brand-centre/svg/dealer-id-tag.svg",
    "pngUrl": "/brand-centre/png/dealer-id-tag.png",
    "pdfUrl": "/brand-centre/pdf/dealer-id-tag.pdf"
  },
  {
    "id": "verified-dealer-badge",
    "category": "Dealer",
    "formats": "SVG + PNG",
    "dimensions": "900 x 900 px",
    "useCase": "Verified dealer badge",
    "svgUrl": "/brand-centre/svg/verified-dealer-badge.svg",
    "pngUrl": "/brand-centre/png/verified-dealer-badge.png",
    "pdfUrl": null
  },
  {
    "id": "showroom-window-sign",
    "category": "Dealer",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A3 landscape",
    "useCase": "Showroom window sign",
    "svgUrl": "/brand-centre/svg/showroom-window-sign.svg",
    "pngUrl": "/brand-centre/png/showroom-window-sign.png",
    "pdfUrl": "/brand-centre/pdf/showroom-window-sign.pdf"
  },
  {
    "id": "vehicle-windscreen-tag",
    "category": "Dealer",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A5 landscape",
    "useCase": "Vehicle windscreen tag",
    "svgUrl": "/brand-centre/svg/vehicle-windscreen-tag.svg",
    "pngUrl": "/brand-centre/png/vehicle-windscreen-tag.png",
    "pdfUrl": "/brand-centre/pdf/vehicle-windscreen-tag.pdf"
  },
  {
    "id": "inspection-certificate",
    "category": "Dealer",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A4",
    "useCase": "Inspection certificate",
    "svgUrl": "/brand-centre/svg/inspection-certificate.svg",
    "pngUrl": "/brand-centre/png/inspection-certificate.png",
    "pdfUrl": "/brand-centre/pdf/inspection-certificate.pdf"
  },
  {
    "id": "sold-card",
    "category": "Dealer",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A5",
    "useCase": "Sold / reserved card",
    "svgUrl": "/brand-centre/svg/sold-card.svg",
    "pngUrl": "/brand-centre/png/sold-card.png",
    "pdfUrl": "/brand-centre/pdf/sold-card.pdf"
  },
  {
    "id": "price-spec-sheet",
    "category": "Dealer",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A4",
    "useCase": "Vehicle price and spec sheet",
    "svgUrl": "/brand-centre/svg/price-spec-sheet.svg",
    "pngUrl": "/brand-centre/png/price-spec-sheet.png",
    "pdfUrl": "/brand-centre/pdf/price-spec-sheet.pdf"
  },
  {
    "id": "dealer-welcome-card",
    "category": "Dealer",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A5",
    "useCase": "Dealer welcome card",
    "svgUrl": "/brand-centre/svg/dealer-welcome-card.svg",
    "pngUrl": "/brand-centre/png/dealer-welcome-card.png",
    "pdfUrl": "/brand-centre/pdf/dealer-welcome-card.pdf"
  },
  {
    "id": "partner-plaque",
    "category": "Dealer",
    "formats": "SVG + PDF + PNG",
    "dimensions": "300 x 180 mm",
    "useCase": "Partner plaque",
    "svgUrl": "/brand-centre/svg/partner-plaque.svg",
    "pngUrl": "/brand-centre/png/partner-plaque.png",
    "pdfUrl": "/brand-centre/pdf/partner-plaque.pdf"
  },
  {
    "id": "navy-polo-front",
    "category": "Uniform",
    "formats": "SVG + PNG",
    "dimensions": "Front placement",
    "useCase": "Navy polo front",
    "svgUrl": "/brand-centre/svg/navy-polo-front.svg",
    "pngUrl": "/brand-centre/png/navy-polo-front.png",
    "pdfUrl": null
  },
  {
    "id": "navy-polo-back",
    "category": "Uniform",
    "formats": "SVG + PNG",
    "dimensions": "Back placement",
    "useCase": "Navy polo back",
    "svgUrl": "/brand-centre/svg/navy-polo-back.svg",
    "pngUrl": "/brand-centre/png/navy-polo-back.png",
    "pdfUrl": null
  },
  {
    "id": "white-shirt-front",
    "category": "Uniform",
    "formats": "SVG + PNG",
    "dimensions": "Front placement",
    "useCase": "White field shirt front",
    "svgUrl": "/brand-centre/svg/white-shirt-front.svg",
    "pngUrl": "/brand-centre/png/white-shirt-front.png",
    "pdfUrl": null
  },
  {
    "id": "staff-lanyard",
    "category": "Uniform",
    "formats": "SVG + PNG",
    "dimensions": "Lanyard",
    "useCase": "Staff lanyard",
    "svgUrl": "/brand-centre/svg/staff-lanyard.svg",
    "pngUrl": "/brand-centre/png/staff-lanyard.png",
    "pdfUrl": null
  },
  {
    "id": "cap",
    "category": "Uniform",
    "formats": "SVG + PNG",
    "dimensions": "Embroidery",
    "useCase": "Staff cap",
    "svgUrl": "/brand-centre/svg/cap.svg",
    "pngUrl": "/brand-centre/png/cap.png",
    "pdfUrl": null
  },
  {
    "id": "tote",
    "category": "Merch",
    "formats": "SVG + PNG",
    "dimensions": "Screen print",
    "useCase": "Tote bag",
    "svgUrl": "/brand-centre/svg/tote.svg",
    "pngUrl": "/brand-centre/png/tote.png",
    "pdfUrl": null
  },
  {
    "id": "key-tag",
    "category": "Merch",
    "formats": "SVG + PNG",
    "dimensions": "Key tag",
    "useCase": "Dealer key tag",
    "svgUrl": "/brand-centre/svg/key-tag.svg",
    "pngUrl": "/brand-centre/png/key-tag.png",
    "pdfUrl": null
  },
  {
    "id": "vehicle-decal",
    "category": "Merch",
    "formats": "SVG + PNG",
    "dimensions": "Vinyl decal",
    "useCase": "Vehicle decal",
    "svgUrl": "/brand-centre/svg/vehicle-decal.svg",
    "pngUrl": "/brand-centre/png/vehicle-decal.png",
    "pdfUrl": null
  },
  {
    "id": "inspection-clipboard",
    "category": "Merch",
    "formats": "SVG + PNG",
    "dimensions": "Clipboard",
    "useCase": "Inspection clipboard",
    "svgUrl": "/brand-centre/svg/inspection-clipboard.svg",
    "pngUrl": "/brand-centre/png/inspection-clipboard.png",
    "pdfUrl": null
  },
  {
    "id": "document-folder",
    "category": "Merch",
    "formats": "SVG + PNG",
    "dimensions": "A4 folder",
    "useCase": "Document folder",
    "svgUrl": "/brand-centre/svg/document-folder.svg",
    "pngUrl": "/brand-centre/png/document-folder.png",
    "pdfUrl": null
  },
  {
    "id": "pull-up-banner",
    "category": "Event",
    "formats": "SVG + PDF + PNG",
    "dimensions": "850 x 2000 mm",
    "useCase": "Pull-up banner",
    "svgUrl": "/brand-centre/svg/pull-up-banner.svg",
    "pngUrl": "/brand-centre/png/pull-up-banner.png",
    "pdfUrl": "/brand-centre/pdf/pull-up-banner.pdf"
  },
  {
    "id": "popup-backdrop",
    "category": "Event",
    "formats": "SVG + PDF + PNG",
    "dimensions": "3 x 2 m",
    "useCase": "Event backdrop",
    "svgUrl": "/brand-centre/svg/popup-backdrop.svg",
    "pngUrl": "/brand-centre/png/popup-backdrop.png",
    "pdfUrl": "/brand-centre/pdf/popup-backdrop.pdf"
  },
  {
    "id": "directional-sign",
    "category": "Event",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A2",
    "useCase": "Directional sign",
    "svgUrl": "/brand-centre/svg/directional-sign.svg",
    "pngUrl": "/brand-centre/png/directional-sign.png",
    "pdfUrl": "/brand-centre/pdf/directional-sign.pdf"
  },
  {
    "id": "showroom-counter-card",
    "category": "Event",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A5",
    "useCase": "Showroom counter card",
    "svgUrl": "/brand-centre/svg/showroom-counter-card.svg",
    "pngUrl": "/brand-centre/png/showroom-counter-card.png",
    "pdfUrl": "/brand-centre/pdf/showroom-counter-card.pdf"
  },
  {
    "id": "launch-poster",
    "category": "Event",
    "formats": "SVG + PDF + PNG",
    "dimensions": "A3",
    "useCase": "Launch poster",
    "svgUrl": "/brand-centre/svg/launch-poster.svg",
    "pngUrl": "/brand-centre/png/launch-poster.png",
    "pdfUrl": "/brand-centre/pdf/launch-poster.pdf"
  },
  {
    "id": "billboard-ratio",
    "category": "Event",
    "formats": "SVG + PNG",
    "dimensions": "3:1 ratio",
    "useCase": "Roadside billboard ratio",
    "svgUrl": "/brand-centre/svg/billboard-ratio.svg",
    "pngUrl": "/brand-centre/png/billboard-ratio.png",
    "pdfUrl": null
  },
  {
    "id": "registration-desk",
    "category": "Event",
    "formats": "SVG + PNG",
    "dimensions": "Desk fascia",
    "useCase": "Registration desk",
    "svgUrl": "/brand-centre/svg/registration-desk.svg",
    "pngUrl": "/brand-centre/png/registration-desk.png",
    "pdfUrl": null
  },
  {
    "id": "instagram-post",
    "category": "Social",
    "formats": "SVG + PNG",
    "dimensions": "1080 x 1350 px",
    "useCase": "Instagram post template",
    "svgUrl": "/brand-centre/svg/instagram-post.svg",
    "pngUrl": "/brand-centre/png/instagram-post.png",
    "pdfUrl": null
  },
  {
    "id": "instagram-story",
    "category": "Social",
    "formats": "SVG + PNG",
    "dimensions": "1080 x 1920 px",
    "useCase": "Instagram story template",
    "svgUrl": "/brand-centre/svg/instagram-story.svg",
    "pngUrl": "/brand-centre/png/instagram-story.png",
    "pdfUrl": null
  },
  {
    "id": "facebook-cover",
    "category": "Social",
    "formats": "SVG + PNG",
    "dimensions": "1640 x 924 px",
    "useCase": "Facebook cover",
    "svgUrl": "/brand-centre/svg/facebook-cover.svg",
    "pngUrl": "/brand-centre/png/facebook-cover.png",
    "pdfUrl": null
  },
  {
    "id": "facebook-post",
    "category": "Social",
    "formats": "SVG + PNG",
    "dimensions": "1200 x 630 px",
    "useCase": "Facebook post",
    "svgUrl": "/brand-centre/svg/facebook-post.svg",
    "pngUrl": "/brand-centre/png/facebook-post.png",
    "pdfUrl": null
  },
  {
    "id": "linkedin-banner",
    "category": "Social",
    "formats": "SVG + PNG",
    "dimensions": "1584 x 396 px",
    "useCase": "LinkedIn banner",
    "svgUrl": "/brand-centre/svg/linkedin-banner.svg",
    "pngUrl": "/brand-centre/png/linkedin-banner.png",
    "pdfUrl": null
  },
  {
    "id": "whatsapp-status-card",
    "category": "Social",
    "formats": "SVG + PNG",
    "dimensions": "1080 x 1920 px",
    "useCase": "WhatsApp status card",
    "svgUrl": "/brand-centre/svg/whatsapp-status-card.svg",
    "pngUrl": "/brand-centre/png/whatsapp-status-card.png",
    "pdfUrl": null
  },
  {
    "id": "listing-photo-frame",
    "category": "Digital",
    "formats": "SVG + PNG",
    "dimensions": "1200 x 900 px",
    "useCase": "Listing photo frame",
    "svgUrl": "/brand-centre/svg/listing-photo-frame.svg",
    "pngUrl": "/brand-centre/png/listing-photo-frame.png",
    "pdfUrl": null
  },
  {
    "id": "dealer-announcement",
    "category": "Social",
    "formats": "SVG + PNG",
    "dimensions": "1080 x 1350 px",
    "useCase": "Dealer announcement",
    "svgUrl": "/brand-centre/svg/dealer-announcement.svg",
    "pngUrl": "/brand-centre/png/dealer-announcement.png",
    "pdfUrl": null
  },
  {
    "id": "verification-announcement",
    "category": "Social",
    "formats": "SVG + PNG",
    "dimensions": "1080 x 1350 px",
    "useCase": "Verification announcement",
    "svgUrl": "/brand-centre/svg/verification-announcement.svg",
    "pngUrl": "/brand-centre/png/verification-announcement.png",
    "pdfUrl": null
  },
  {
    "id": "newsletter-header",
    "category": "Digital",
    "formats": "SVG + PNG",
    "dimensions": "1200 x 420 px",
    "useCase": "Newsletter header",
    "svgUrl": "/brand-centre/svg/newsletter-header.svg",
    "pngUrl": "/brand-centre/png/newsletter-header.png",
    "pdfUrl": null
  },
  {
    "id": "web-banner",
    "category": "Digital",
    "formats": "SVG + PNG",
    "dimensions": "1920 x 640 px",
    "useCase": "Web banner",
    "svgUrl": "/brand-centre/svg/web-banner.svg",
    "pngUrl": "/brand-centre/png/web-banner.png",
    "pdfUrl": null
  },
  {
    "id": "mobile-splash",
    "category": "Digital",
    "formats": "SVG + PNG",
    "dimensions": "1170 x 2532 px",
    "useCase": "Mobile splash screen",
    "svgUrl": "/brand-centre/svg/mobile-splash.svg",
    "pngUrl": "/brand-centre/png/mobile-splash.png",
    "pdfUrl": null
  }
] satisfies BrandAsset[];

export const brandCategories = Array.from(new Set(brandAssets.map((asset) => asset.category)));

export const kitDownloads = [
  { label: "Complete kit", href: "/brand-centre/zip/motokah-complete-brand-kit-2026-08-29.zip" },
  { label: "Logo kit", href: "/brand-centre/zip/motokah-logo-kit.zip" },
  { label: "Office print kit", href: "/brand-centre/zip/motokah-office-print-kit.zip" },
  { label: "Dealer kit", href: "/brand-centre/zip/motokah-dealer-verification-kit.zip" },
  { label: "Uniform kit", href: "/brand-centre/zip/motokah-uniform-merch-kit.zip" },
  { label: "Event kit", href: "/brand-centre/zip/motokah-event-showroom-kit.zip" },
  { label: "Social kit", href: "/brand-centre/zip/motokah-social-digital-kit.zip" },
] as const;

export const brandCentreSections = [
  ["intro", "Introduction"],
  ["logos", "Logo"],
  ["colour", "Colour"],
  ["type-voice", "Type & Voice"],
  ["office", "Office"],
  ["dealer", "Dealer"],
  ["physical", "Physical"],
  ["event", "Event"],
  ["digital", "Digital"],
  ["library", "Downloads"],
] as const;

export const brandColours = [
  { name: "Motokah Blue", hex: "#3493C9", rgb: "52, 147, 201", hsl: "201 59% 50%", cmyk: "74 27 0 21", use: "Primary identity, links, active controls" },
  { name: "Wall Blue", hex: "#6BA7D4", rgb: "107, 167, 212", hsl: "206 55% 63%", cmyk: "50 21 0 17", use: "Large brand fields and presentation surfaces" },
  { name: "Deep Navy", hex: "#102A43", rgb: "16, 42, 67", hsl: "209 61% 16%", cmyk: "76 37 0 74", use: "Headlines, premium backgrounds, uniforms" },
  { name: "Verified Green", hex: "#13A55B", rgb: "19, 165, 91", hsl: "150 79% 36%", cmyk: "88 0 45 35", use: "Verification, approval, trust markers" },
  { name: "Paper White", hex: "#FFFFFF", rgb: "255, 255, 255", hsl: "0 0% 100%", cmyk: "0 0 0 0", use: "Stationery, cards, clean reading areas" },
  { name: "Ink", hex: "#16293A", rgb: "22, 41, 58", hsl: "208 45% 16%", cmyk: "62 29 0 77", use: "Body copy and monochrome output" },
  { name: "Neutral Mist", hex: "#EEF5FB", rgb: "238, 245, 251", hsl: "208 62% 96%", cmyk: "5 2 0 2", use: "Quiet panels, asset library backgrounds" },
];
