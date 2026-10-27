import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";
import { IconBuildingStore, IconCheck, IconLoader } from "@tabler/icons-react";
import { Link, Navigate } from "react-router-dom";
import { getAdminNotificationEmails, sendEmail } from "@/lib/sendEmail";
import { trackEvent } from "@/lib/analytics";

export default function BecomeDealer() {
  usePageTitle("Become a Dealer — Motokah");
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    registration_number: "",
    city: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    dealer_type: "dealer",
    description: "",
    website: "",
  });
  const dealerTypes = [
    { value: "dealer", label: "Car Dealer / Lot" },
    { value: "importer", label: "Importer (Japan/UK/UAE)" },
    { value: "individual", label: "Private Seller (High Volume)" },
    { value: "franchise", label: "Franchise / Authorized Dealer" },
  ];

  if (!user) return <Navigate to="/auth" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name || !form.city || !form.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("dealer_applications").insert({
      user_id: user.id,
      business_name: form.business_name,
      registration_number: form.registration_number || null,
      city: form.city,
      phone: form.phone,
    } as any);
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit application. Please try again.");
    } else {
      trackEvent("dealer_application_submitted", { userId: user.id });
      const businessName = form.business_name.replace(/[&<>"']/g, "");
      const city = form.city.replace(/[&<>"']/g, "");
      const results = await Promise.all(getAdminNotificationEmails().map((email) => sendEmail({
        toEmail: email,
        subject: `New Motokah dealer application: ${form.business_name}`,
        html: `<p>A dealer application needs review.</p><p><strong>${businessName}</strong> in ${city}</p><p><a href="https://www.motokah.com/admin/dealers">Review dealer applications</a></p>`,
      })));
      if (!results.some(Boolean)) console.warn("Dealer application saved, but the admin email was not accepted");
      setSubmitted(true);
      toast.success("Application submitted! We'll review it shortly.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <IconCheck size={32} className="text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for applying to become a dealer on Motokah. Our team will review your application and get back to you within 2-3 business days.
            </p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
          <div className="container mx-auto text-center">
            <IconBuildingStore size={48} className="mx-auto text-primary mb-4" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Become a Dealer</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join Motokah as a verified dealer and gain access to premium features, increased visibility, and a dedicated dealer profile.
            </p>
          </div>
        </section>

        <section className="container mx-auto py-10 max-w-lg">
          {/* Benefits */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-4">Dealer Benefits</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><IconCheck size={18} className="text-success shrink-0 mt-0.5" /> Dedicated dealer profile page</li>
              <li className="flex items-start gap-2"><IconCheck size={18} className="text-success shrink-0 mt-0.5" /> Verified dealer badge on all listings</li>
              <li className="flex items-start gap-2"><IconCheck size={18} className="text-success shrink-0 mt-0.5" /> Appear in the dealer directory</li>
              <li className="flex items-start gap-2"><IconCheck size={18} className="text-success shrink-0 mt-0.5" /> Priority support and listing management</li>
              <li className="flex items-start gap-2"><IconCheck size={18} className="text-success shrink-0 mt-0.5" /> Collect and display customer reviews</li>
            </ul>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="dealer_type">Dealer Type *</Label>
              <select
                id="dealer_type"
                value={form.dealer_type}
                onChange={e => setForm(f => ({ ...f, dealer_type: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
              >
                {dealerTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="business_name">Business Name *</Label>
              <Input id="business_name" value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} placeholder="e.g. AutoWorld Tanzania" required />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input id="city" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Dar es Salaam" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+255 xxx xxx xxx" required />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input id="whatsapp" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="+255 xxx xxx xxx (if different)" />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram Handle</Label>
              <Input id="instagram" value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@yourhandle (optional)" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://yourwebsite.com (optional)" />
            </div>
            <div>
              <Label htmlFor="registration_number">Business Registration Number</Label>
              <Input id="registration_number" value={form.registration_number} onChange={e => setForm(f => ({ ...f, registration_number: e.target.value }))} placeholder="Optional" />
            </div>
            <div>
              <Label htmlFor="description">About Your Business</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Tell us about your dealership, specialties, and how long you've been in business..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <><IconLoader size={16} className="animate-spin mr-2" /> Submitting...</> : "Submit Application"}
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
