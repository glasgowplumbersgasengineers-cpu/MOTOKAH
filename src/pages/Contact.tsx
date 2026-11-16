import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import { IconMail, IconMapPin, IconClock } from "@/components/icons";

export default function Contact() {
  usePageTitle("Contact Us");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subject: form.subject.trim(),
      message: form.message.trim(),
    });
    if (error) {
      toast({ title: "Error", description: "Could not send your message. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }
    setLoading(false);
  };

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Contact Us</h1>
        <p className="text-muted-foreground text-center mb-10">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-5">
              <div className="flex items-start gap-3">
                <IconMapPin size={20} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Office Address</p>
                  <p className="text-sm text-muted-foreground">Dar es Salaam, Tanzania<br />Msasani Peninsula</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IconMail size={20} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Email</p>
                  <p className="text-sm text-muted-foreground">info@motokah.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IconClock size={20} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Business Hours</p>
                  <p className="text-sm text-muted-foreground">Mon–Fri: 8:00 AM – 6:00 PM<br />Sat: 9:00 AM – 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Name *</label>
                  <Input value={form.name} onChange={e => update("name", e.target.value)} required maxLength={100} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                  <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} required maxLength={255} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                  <Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+255..." maxLength={20} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Subject *</label>
                  <Input value={form.subject} onChange={e => update("subject", e.target.value)} required maxLength={200} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Message *</label>
                <Textarea value={form.message} onChange={e => update("message", e.target.value)} required rows={5} maxLength={2000} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
