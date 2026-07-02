import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const columns = [
  { title: "For Buyers", links: [
    { label: "Browse Cars", to: "/search" },
    { label: "Browse Bikes", to: "/search?vehicleType=bike" },
    { label: "Advanced Search", to: "/search" },
    { label: "Compare Vehicles", to: "/compare" },
    { label: "How It Works", to: "/how-it-works" },
    { label: "Duty Calculator", to: "/duty-calculator" },
    { label: "Car Showrooms", to: "/dealers" },
  ]},
  { title: "For Sellers", links: [
    { label: "Post Your Ad", to: "/sell" },
    { label: "Seller Dashboard", to: "/profile" },
    { label: "Become a Dealer", to: "/become-dealer" },
    { label: "Dealer Directory", to: "/dealers" },
    { label: "Safety Tips", to: "/safety" },
  ]},
  { title: "Company", links: [
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
    { label: "Blog & News", to: "/blog" },
    { label: "Careers", to: "/careers" },
    { label: "FAQ / Help", to: "/faq" },
  ]},
  { title: "Legal & Support", links: [
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Safety Tips", to: "/safety" },
  ]},
];

const countries = [
  { label: "Tanzania", to: "/city/dar-es-salaam" },
  { label: "Kenya", to: "/city/nairobi" },
  { label: "Uganda", to: "/city/kampala" },
  { label: "Rwanda", to: "/city/kigali" },
  { label: "Ethiopia", to: "/city/addis-ababa" },
  { label: "Burundi", to: "/search?city=Bujumbura" },
  { label: "South Sudan", to: "/search?city=Juba" },
  { label: "Somalia", to: "/search?city=Mogadishu" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim() });
    if (error) {
      if (error.code === "23505") toast.info("You're already subscribed!");
      else toast.error("Something went wrong. Try again.");
    } else {
      toast.success("Subscribed! We'll keep you posted.");
    }
    setEmail("");
  };

  return (
    <footer className="bg-surface-2 border-t border-border pt-12 pb-6 safe-bottom">
      <div className="container mx-auto px-4">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {/* Brand + newsletter */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <span className="text-xl font-extrabold text-primary">Motokah</span>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Find Your Perfect Ride</p>
            <p className="text-xs text-muted-foreground mb-2 font-medium">Subscribe to newsletter</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-xs">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email"
                className="h-9 rounded-md border border-input bg-surface-3 px-3 text-sm flex-1 min-w-0 text-foreground focus:ring-1 focus:ring-primary outline-none"
              />
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm h-9 px-4 shrink-0">
                Subscribe
              </Button>
            </form>
          </div>

          {/* Nav columns */}
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm text-foreground mb-3">{col.title}</h4>
              <ul className="space-y-1.5">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Countries row */}
        <div className="border-t border-border pt-6 mb-6">
          <h4 className="font-semibold text-sm text-foreground mb-3 text-center">Browse by Country</h4>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {countries.map(c => (
              <Link
                key={c.label}
                to={c.to}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Motokah. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://1pointsolutions.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              1Point Solutions
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
