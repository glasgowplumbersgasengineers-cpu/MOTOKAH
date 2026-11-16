import { Link } from "react-router-dom";
import { IconCamera, IconFileText, IconUpload, IconMessageCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: IconCamera, label: "Upload Photos", num: 1 },
  { icon: IconFileText, label: "Add Details", num: 2 },
  { icon: IconUpload, label: "Publish Listing", num: 3 },
  { icon: IconMessageCircle, label: "Get Buyers", num: 4 },
];

export default function SellCTA() {
  return (
    <section className="container mx-auto py-10">
      <div className="bg-card border border-border rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Sell Your Car in <span className="text-primary">Simple Steps</span></h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {steps.map(s => (
              <div key={s.num} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon size={20} stroke={2.5} className="text-primary" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Step {s.num}</span>
                  <p className="text-sm font-semibold">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold" asChild>
            <Link to="/sell">Start Selling Now</Link>
          </Button>
        </div>
        <div className="flex-1 text-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4">
              <span className="text-2xl font-extrabold text-primary">3</span>
              <p className="text-xs text-muted-foreground">Avg. Days to Sell</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <span className="text-2xl font-extrabold text-primary">95%</span>
              <p className="text-xs text-muted-foreground">Seller Satisfaction</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <span className="text-2xl font-extrabold text-primary">2M+</span>
              <p className="text-xs text-muted-foreground">Active Buyers</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <span className="text-2xl font-extrabold text-primary">Free</span>
              <p className="text-xs text-muted-foreground">To List Your Car</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
