import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@/components/icons";

export default function PromoBanner() {
  return (
    <section className="container mx-auto py-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-blue p-8 md:p-12">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary-foreground mb-2">Sell Your Vehicle in 5 Minutes!</h2>
            <p className="text-primary-foreground/80 text-sm md:text-base">Reach millions of buyers across Africa. Safe, secure, and easy.</p>
          </div>
          <Button size="lg" className="bg-background text-foreground hover:bg-surface-3 font-bold gap-2 shrink-0" asChild>
            <Link to="/sell">Post Your Ad Now <IconArrowRight size={18} stroke={2.5} /></Link>
          </Button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-background/10" />
        <div className="absolute -right-5 top-0 w-24 h-24 rounded-full bg-background/5" />
      </div>
    </section>
  );
}
