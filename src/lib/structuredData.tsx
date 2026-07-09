const SITE_URL = "https://www.motokah.com";
const LOGO_URL = `${SITE_URL}/pwa-512x512.png`;

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

export function jsonLdScript(data: JsonLdValue) {
  return (
    <script type="application/ld+json">
      {JSON.stringify(data).replace(/</g, "\\u003c")}
    </script>
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: "Motokah",
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    description:
      "Motokah is an East Africa vehicle marketplace for buying and selling used cars, dealer stock, SUVs, pickups, vans, bikes and boats.",
    sameAs: [
      "https://www.instagram.com/motokahafrica/",
      "https://www.google.com/maps/place/Motokah/",
    ],
    areaServed: [
      { "@type": "Country", name: "Tanzania" },
      { "@type": "Country", name: "Kenya" },
      { "@type": "Country", name: "Uganda" },
      { "@type": "Country", name: "Rwanda" },
      { "@type": "Country", name: "Ethiopia" },
      { "@type": "Country", name: "Nigeria" },
      { "@type": "Country", name: "Burundi" },
    ],
    knowsAbout: [
      "used cars in Tanzania",
      "used cars in Kenya",
      "Japanese import cars",
      "Toyota cars for sale",
      "car dealers in Dar es Salaam",
      "car dealers in Nairobi",
      "commercial vehicles in Tanzania",
      "boats for sale in Tanzania",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact`,
      areaServed: "Africa",
      availableLanguage: ["English", "Swahili"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Motokah",
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function collectionPageJsonLd({
  name,
  description,
  url,
  itemCount,
}: {
  name: string;
  description: string;
  url: string;
  itemCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: "Used cars and vehicles",
    ...(typeof itemCount === "number"
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: itemCount,
            itemListOrder: "https://schema.org/ItemListOrderDescending",
          },
        }
      : {}),
  };
}

export function faqJsonLd(faq: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
