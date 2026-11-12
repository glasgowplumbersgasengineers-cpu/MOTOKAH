import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { IconShieldCheck, IconAlertTriangle, IconMapPin, IconUsers, IconFileCheck, IconPhoneCall, IconCash, IconDeviceMobile } from "@tabler/icons-react";

const buyerTips = [
  { icon: IconMapPin, title: "Meet in Public Places", desc: "Always meet the seller in a well-lit, busy public area. Police stations and bank parking lots are ideal." },
  { icon: IconUsers, title: "Bring Someone Along", desc: "Never go alone to view a car. Take a friend or family member with you for safety." },
  { icon: IconFileCheck, title: "Verify Documents", desc: "Check the car's registration, insurance, and ownership documents. Make sure the seller's ID matches the documents." },
  { icon: IconCash, title: "Don't Pay Upfront", desc: "Never send money before physically seeing and inspecting the car. Be wary of sellers asking for deposits via mobile money." },
  { icon: IconPhoneCall, title: "Use In-App Messaging", desc: "Communicate through Motokah's messaging system so there's a record of all conversations." },
  { icon: IconDeviceMobile, title: "Check Vehicle History", desc: "If possible, have a trusted mechanic inspect the car before completing the purchase." },
];

const sellerTips = [
  { icon: IconMapPin, title: "Choose Safe Meeting Spots", desc: "Meet potential buyers in public places during daylight hours." },
  { icon: IconShieldCheck, title: "Verify Buyer's Identity", desc: "Ask for identification before test drives. Note down the buyer's details." },
  { icon: IconCash, title: "Confirm Payments", desc: "Wait for full payment confirmation before handing over keys and documents. Use bank transfers for large amounts." },
  { icon: IconAlertTriangle, title: "Beware of Overpayment Scams", desc: "If someone offers to pay more than your asking price, it's likely a scam." },
];

const redFlags = [
  "Seller/buyer refuses to meet in person",
  "Price is significantly below market value",
  "Pressure to complete the deal urgently",
  "Requests for advance payment or deposits",
  "Seller can't provide original documents",
  "VIN doesn't match registration papers",
  "Seller avoids answering direct questions",
  "Offers from outside your country or region",
];

export default function Safety() {
  usePageTitle("Safety Tips");

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <IconShieldCheck size={28} className="text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Safety Tips</h1>
          <p className="text-muted-foreground">Your safety is our top priority. Follow these guidelines for safe transactions.</p>
        </div>

        {/* Buyer Tips */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6">For Buyers</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyerTips.map((tip, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <div className="w-10 h-10 mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <tip.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{tip.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Seller Tips */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6">For Sellers</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {sellerTips.map((tip, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <div className="w-10 h-10 mb-3 rounded-full bg-accent/10 flex items-center justify-center">
                  <tip.icon size={20} className="text-accent" />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{tip.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <IconAlertTriangle size={20} className="text-destructive" />
            <h2 className="text-lg font-bold text-foreground">Red Flags to Watch For</h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2">
            {redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-destructive mt-0.5">•</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>

        {/* Report Section */}
        <div className="mt-8 text-center bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-foreground mb-2">See Something Suspicious?</h3>
          <p className="text-sm text-muted-foreground mb-3">Report suspicious listings or users using the flag icon on any listing page, or contact us directly.</p>
          <p className="text-sm text-primary font-semibold">info@motokah.com</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
