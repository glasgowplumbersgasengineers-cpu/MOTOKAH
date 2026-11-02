import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { jsonLdScript, breadcrumbJsonLd, faqJsonLd } from "@/lib/structuredData";

const faqs = [
  {
    q: "Can I buy a car in Tanzania from the UK?",
    a: "Yes. Browse verified dealer listings on Motokah, agree a price, and pay the seller directly. Many dealers accept bank transfers from overseas buyers. The car stays with the seller until your family member in Tanzania is ready to collect.",
  },
  {
    q: "How do I buy a car for family in Kenya from abroad?",
    a: "Choose a listing on Motokah, contact the dealer by WhatsApp or phone, and agree terms. Your family member in Kenya can inspect the car locally before you send payment. Most dealers are in Nairobi and can arrange delivery within Kenya.",
  },
  {
    q: "Is it safe to buy a car online in East Africa?",
    a: "Motokah only shows listings from verified dealers and private sellers with real phone numbers. Always have a trusted person inspect the car before payment. Avoid sellers who refuse an in-person inspection or request payment before viewing.",
  },
  {
    q: "What is the best car to buy for family in East Africa?",
    a: "Toyota Probox and Toyota Fielder are popular practical choices for Kenya and Tanzania. For rougher roads or upcountry use, a Toyota Land Cruiser or Hilux is better. For city use, the Toyota Vitz, Honda Fit, and Nissan Note offer low running costs.",
  },
  {
    q: "How much does a used car cost in Tanzania or Kenya?",
    a: "Entry-level used cars in Tanzania start from around TZS 8M (USD 3,000). In Kenya, prices start from KES 350,000 (USD 2,500). Toyota Land Cruisers range from USD 8,000 to USD 40,000 depending on age and condition.",
  },
];

export default function DiasporaLandingPage() {
  const title = "Buy a Car for Family in East Africa | Motokah";
  const description = "Buying a car for family in Tanzania, Kenya or Uganda from the UK, USA or UAE? Browse verified dealer listings on Motokah. Contact sellers directly, no middleman.";
  const canonicalUrl = "https://www.motokah.com/buy-car-for-family-in-east-africa";

  const breadcrumbs = [
    { name: "Home", url: "https://www.motokah.com/" },
    { name: "Buy a Car for Family in East Africa", url: canonicalUrl },
  ];

  const popularChoices = [
    { label: "Toyota Probox Kenya", to: "/cars/toyota/probox", price: "KES 400K–900K", note: "Most reliable workhorse in Kenya" },
    { label: "Toyota Hilux Tanzania", to: "/cars/toyota/hilux", price: "TZS 25M–80M", note: "Handles upcountry roads, massive resale value" },
    { label: "Toyota Land Cruiser", to: "/cars/toyota/land-cruiser", price: "KES 2M–15M", note: "Lasts 20+ years, parts everywhere" },
    { label: "Nissan X-Trail Uganda", to: "/cars/nissan/x-trail", price: "UGX 25M–60M", note: "Family SUV, reliable in Kampala traffic" },
    { label: "Honda Fit Kenya", to: "/cars/honda/fit", price: "KES 400K–800K", note: "Fuel-efficient city car, low running costs" },
    { label: "Toyota Prado", to: "/cars/toyota/prado", price: "KES 3M–12M", note: "Prestige family 4x4, handles everything" },
  ];

  const countries = [
    { name: "Tanzania", slug: "tanzania", cities: ["Dar es Salaam", "Arusha", "Mwanza"] },
    { name: "Kenya", slug: "kenya", cities: ["Nairobi", "Mombasa", "Nakuru"] },
    { name: "Uganda", slug: "uganda", cities: ["Kampala", "Entebbe", "Jinja"] },
    { name: "Rwanda", slug: "rwanda", cities: ["Kigali"] },
    { name: "Ethiopia", slug: "ethiopia", cities: ["Addis Ababa"] },
  ];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        {jsonLdScript(breadcrumbJsonLd(breadcrumbs))}
        {jsonLdScript(faqJsonLd(faqs))}
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-card border-b">
          <div className="max-w-4xl mx-auto px-4 py-14 sm:px-6">
            <nav className="flex gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <span className="text-foreground">Buy a car for family in East Africa</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Buy a Car for Family in East Africa
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              Browse thousands of verified car listings in Tanzania, Kenya, Uganda and more. Contact dealers directly from the UK, USA, UAE or anywhere in the world. No agency fees.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/country/tanzania">Cars in Tanzania</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/country/kenya">Cars in Kenya</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/country/uganda">Cars in Uganda</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6">

          {/* How it works */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">How to buy a car remotely</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: "1", heading: "Browse listings", body: "Search by country, city, make and model. Every listing has photos, specs, price and the seller's real phone number." },
                { step: "2", heading: "Contact the dealer", body: "Call or WhatsApp the seller directly. Ask for more photos, a video inspection, or arrange for a trusted person to view it locally." },
                { step: "3", heading: "Pay and collect", body: "Agree payment terms with the seller. Your family member collects the car locally, or the dealer arranges delivery within the country." },
              ].map(item => (
                <div key={item.step} className="bg-card border rounded-xl p-5">
                  <div className="text-3xl font-bold text-primary mb-2">{item.step}</div>
                  <h3 className="font-semibold mb-1">{item.heading}</h3>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Popular choices */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-2">Popular cars to send home</h2>
            <p className="text-muted-foreground mb-6 text-sm">Reliable, easy to maintain, parts available everywhere in East Africa.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularChoices.map(car => (
                <Link
                  key={car.label}
                  to={car.to}
                  className="bg-card border rounded-xl p-4 hover:border-primary transition-colors"
                >
                  <div className="font-semibold mb-1">{car.label}</div>
                  <div className="text-sm text-primary font-medium mb-1">{car.price}</div>
                  <div className="text-sm text-muted-foreground">{car.note}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Browse by country */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Browse by country</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {countries.map(c => (
                <div key={c.slug} className="bg-card border rounded-xl p-5">
                  <h3 className="font-semibold mb-2">
                    <Link to={`/country/${c.slug}`} className="hover:text-primary">Cars in {c.name}</Link>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {c.cities.map(city => (
                      <Link
                        key={city}
                        to={`/city/${city.toLowerCase().replace(/ /g, "-")}`}
                        className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Tips for overseas buyers</h2>
            <div className="space-y-4 text-muted-foreground">
              <p><strong className="text-foreground">Get a local inspection.</strong> Ask a trusted friend, family member, or a local mechanic to physically inspect the car before you send any money. A mechanic inspection in Nairobi or Dar es Salaam typically costs USD 20–50.</p>
              <p><strong className="text-foreground">Stick to Toyota for East Africa.</strong> Toyota parts are available in every town across East Africa. Other brands can leave your family stranded in areas with no specialist garages. Land Cruiser, Hilux, Probox, and Fielder are all strong choices.</p>
              <p><strong className="text-foreground">Verify documents before paying.</strong> Check that the seller has the original logbook (Kenya), blue book (Tanzania), or registration certificate (Uganda). The chassis number on the document must match the car.</p>
              <p><strong className="text-foreground">Use WhatsApp for communication.</strong> Most East African dealers respond fastest on WhatsApp. Every Motokah listing shows the seller's direct number so you can contact them immediately.</p>
              <p><strong className="text-foreground">Budget for taxes and insurance.</strong> If buying a newly imported vehicle, factor in import duty, VAT, and excise. Your family member will need third-party insurance from day one of driving.</p>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Frequently asked questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-card border rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Ready to find the right car?</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Browse thousands of verified listings in Tanzania, Kenya, Uganda and beyond.
            </p>
            <Button asChild size="lg">
              <Link to="/search">Browse all cars</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
