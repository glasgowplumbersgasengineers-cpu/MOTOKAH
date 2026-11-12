import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { IconCar, IconUsers, IconShieldCheck, IconMapPin, IconTargetArrow, IconEye, IconHeart } from "@tabler/icons-react";

const stats = [
  { label: "Dealer Listings", value: "Fresh", icon: IconCar },
  { label: "Seller Contact", value: "Direct", icon: IconShieldCheck },
  { label: "Country Focus", value: "EA", icon: IconMapPin },
  { label: "City Browsing", value: "Local", icon: IconUsers },
];

const values = [
  { icon: IconTargetArrow, title: "Our Mission", text: "To create the most trusted and user-friendly car marketplace in East Africa." },
  { icon: IconEye, title: "Our Vision", text: "A world where buying and selling a car is as simple, safe, and transparent as online shopping." },
  { icon: IconHeart, title: "Our Values", text: "Trust, transparency, simplicity, and putting our users first in every decision we make." },
];


export default function About() {
  usePageTitle("About Us");

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      {/* Hero */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">About Motokah</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            East Africa's online car marketplace, connecting buyers and sellers across Kenya, Tanzania, Uganda, Ethiopia and beyond.
            Whether you're looking for a reliable used vehicle or want to reach serious buyers, Motokah makes it easy, fast, and transparent.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <s.icon size={24} className="text-primary" />
                </div>
                <p className="text-3xl font-extrabold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <v.icon size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our Story</h2>
          <div className="prose prose-sm text-muted-foreground space-y-4 mx-auto">
            <p>Motokah was born from a simple frustration: finding and selling cars across East Africa was too complicated, risky, and time-consuming. Listings scattered across social media, no way to verify sellers, zero transparency in pricing.</p>
            <p>We set out to build something better — a dedicated platform that brings dealers and buyers together, with real listings from real dealers you can actually contact. We started in Tanzania and have expanded to Kenya, Uganda, Ethiopia and beyond.</p>
            <p>Today, Motokah is focused on building a cleaner East African car marketplace with real listings from real sellers you can contact directly. And we're just getting started.</p>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Want to Join Us?</h2>
          <p className="text-muted-foreground mb-6">We're a small team building something big for East Africa's automotive market. If you're passionate about cars, tech, or marketplaces, we'd love to hear from you.</p>
          <a href="/careers" className="inline-block text-sm font-semibold text-primary underline underline-offset-4">View open positions</a>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Have Questions?</h2>
          <p className="text-primary-foreground/80 mb-4">We'd love to hear from you.</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span>📧 info@motokah.com</span>
            <span>📍 Dar es Salaam, Tanzania</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
