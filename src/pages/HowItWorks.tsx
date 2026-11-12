import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { IconSearch, IconMessageCircle, IconHandGrab, IconCar, IconCamera, IconChecklist, IconCurrencyDollar, IconRocket } from "@tabler/icons-react";

// Remotion + the animated composition are heavy — lazy-loaded so they never
// ship in the main bundle for pages that aren't this one.
const HowItWorksPlayer = lazy(() => import("@/components/HowItWorksPlayer"));

const buyerSteps = [
  { icon: IconSearch, title: "Search & Browse", desc: "Use filters to find the perfect car by make, model, price, location, and more." },
  { icon: IconChecklist, title: "Compare & Shortlist", desc: "Save your favorites to the wishlist and compare specs side by side." },
  { icon: IconMessageCircle, title: "Contact the Seller", desc: "Send a message directly through the app to schedule a viewing or ask questions." },
  { icon: IconHandGrab, title: "Meet & Deal", desc: "Meet the seller in person, inspect the car, negotiate, and complete the purchase." },
];

const sellerSteps = [
  { icon: IconCamera, title: "Photograph Your Car", desc: "Take clear, well-lit photos from multiple angles — inside and outside." },
  { icon: IconCar, title: "Create Your Listing", desc: "Click 'Post Ad', fill in details like make, model, year, mileage, and set your price." },
  { icon: IconRocket, title: "Get Approved & Go Live", desc: "Our team reviews your listing and publishes it within 24 hours." },
  { icon: IconCurrencyDollar, title: "Receive Offers", desc: "Interested buyers will contact you through the app. Respond promptly to close deals faster." },
];

export default function HowItWorks() {
  usePageTitle("How It Works");

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2 text-center">How It Works</h1>
        <p className="text-muted-foreground text-center mb-8">Whether you're buying or selling, Motokah makes it simple.</p>

        {/* Animated walkthrough */}
        <div className="mb-16">
          <Suspense fallback={<div className="aspect-video w-full rounded-2xl bg-muted animate-pulse" />}>
            <HowItWorksPlayer />
          </Suspense>
        </div>

        {/* Buyers */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-8 text-center">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">For Buyers</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyerSteps.map((step, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center mt-2">
                  <step.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sellers */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-8 text-center">
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold">For Sellers</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sellerSteps.map((step, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center mt-2">
                  <step.icon size={24} className="text-accent" />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
