import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { IconMapPin, IconBriefcase, IconExternalLink } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const openings = [
  { title: "Full-Stack Developer", type: "Full-time", location: "Dar es Salaam / Remote", desc: "Build and ship features for East Africa's car marketplace. React, TypeScript, Supabase stack." },
  { title: "Product Designer (UI/UX)", type: "Full-time", location: "Dar es Salaam", desc: "Design delightful experiences for car buyers and sellers. Figma, prototyping, user research." },
  { title: "Marketing Manager", type: "Full-time", location: "Dar es Salaam", desc: "Drive growth through digital marketing, social media, and partnerships across East Africa." },
  { title: "Customer Support Lead", type: "Full-time", location: "Dar es Salaam", desc: "Lead our support team to ensure every buyer and seller has a great experience on Motokah." },
];

const perks = [
  "Competitive salary & benefits",
  "Flexible working hours",
  "Remote-friendly culture",
  "Health insurance",
  "Learning & development budget",
  "Team retreats & events",
];

export default function Careers() {
  usePageTitle("Careers");

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      {/* Hero */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground mb-3">Join the Motokah Team</h1>
          <p className="text-muted-foreground">Help us build the future of automotive commerce in Africa. We're looking for passionate people who want to make a difference.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Perks */}
        <div className="bg-card border border-border rounded-xl p-6 mb-10">
          <h2 className="text-lg font-bold text-foreground mb-4">Why Work With Us</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-success">✓</span> {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Openings */}
        <h2 className="text-lg font-bold text-foreground mb-4">Open Positions</h2>
        <div className="space-y-4">
          {openings.map((job, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-bold text-foreground">{job.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><IconBriefcase size={12} /> {job.type}</span>
                    <span className="flex items-center gap-1"><IconMapPin size={12} /> {job.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{job.desc}</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 gap-1" onClick={() => window.location.href = `mailto:careers@motokah.com?subject=Application: ${job.title}`}>
                  Apply <IconExternalLink size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* General Application */}
        <div className="mt-10 text-center bg-muted/50 rounded-xl p-6">
          <h3 className="font-bold text-foreground mb-2">Don't see your role?</h3>
          <p className="text-sm text-muted-foreground mb-3">We're always looking for talented people. Send us your CV and tell us how you'd like to contribute.</p>
          <p className="text-sm text-primary font-semibold">careers@motokah.com</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
