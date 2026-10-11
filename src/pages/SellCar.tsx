import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/contexts/LocationContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { IconX, IconCheck, IconCamera, IconChevronRight, IconBrandWhatsapp, IconPhone, IconVideo } from "@tabler/icons-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { africanCities, carMakes, cityToCountry, currencies } from "@/data/mockData";

const carBrands = carMakes;
const countryCurrencyMap: Record<string, string> = {
  Tanzania: "TZS",
  Kenya: "KES",
  Uganda: "UGX",
  Rwanda: "RWF",
  Burundi: "BIF",
  Ethiopia: "ETB",
  Nigeria: "NGN",
};
const bodyTypes = [
  { label: "Sedan / Saloon",        value: "Sedan" },
  { label: "SUV / 4x4 / Jeep",     value: "SUV" },
  { label: "Small Car / Hatchback", value: "Hatchback" },
  { label: "Double Cab / Pickup",   value: "Pickup" },
  { label: "Van",                   value: "Van" },
  { label: "Minibus / Daladala",    value: "Minibus" },
  { label: "Bus",                   value: "Bus" },
  { label: "Truck / Lorry",         value: "Truck" },
  { label: "Coupe",                 value: "Coupe" },
  { label: "Wagon / Estate",        value: "Wagon" },
  { label: "Convertible",           value: "Convertible" },
  { label: "Motorcycle / Boda Boda",value: "Motorcycle" },
  { label: "Scooter",                value: "Scooter" },
  { label: "Dirt Bike",              value: "Dirt Bike" },
  { label: "Sport Bike",             value: "Sport Bike" },
  { label: "Boat / Marine",           value: "Boat" },
  { label: "Tuk-tuk / Bajaji",        value: "Tuk-tuk" },
  { label: "Tipper",                  value: "Tipper" },
];
const transmissions = ["Automatic", "Manual", "CVT"];
const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];
const conditions = ["Used", "New", "Certified Pre-owned"];
const colors = ["White", "Black", "Silver", "Grey", "Red", "Blue", "Green", "Brown", "Gold", "Orange", "Yellow", "Maroon", "Other"];
const assemblies = ["Local", "Imported (Japan)", "Imported (UK)", "Imported (UAE)", "Imported (Other)"];

interface FormData {
  make: string; model: string; year: string; bodyType: string;
  transmission: string; fuelType: string; color: string; mileage: string;
  condition: string; title: string; description: string; assembly: string;
  price: string; currency: string; city: string; registeredIn: string;
  allowWhatsapp: boolean;
}

const defaultForm: FormData = {
  make: "", model: "", year: new Date().getFullYear().toString(), bodyType: "",
  transmission: "", fuelType: "", color: "", mileage: "", condition: "Used",
  title: "", description: "", assembly: "",
  price: "", currency: "TZS", city: "", registeredIn: "", allowWhatsapp: true,
};

type SheetKey = "make" | "bodyType" | "transmission" | "fuelType" | "color" | "condition" | "city" | "registeredIn" | "assembly" | null;

export default function SellCar() {
  usePageTitle("Sell Your Car");
  const { country, city } = useLocation();
  const [plan, setPlan] = useState<"self" | "agent" | null>("self");
  const [showMore, setShowMore] = useState(false);
  const [form, setForm] = useState<FormData>(() => {
    const saved = localStorage.getItem("sellCarDraft");
    return saved ? JSON.parse(saved) : {
      ...defaultForm,
      currency: countryCurrencyMap[country] || defaultForm.currency,
      city: city || "",
      registeredIn: city || "",
    };
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sheet, setSheet] = useState<SheetKey>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const availableCities = useMemo(() => {
    if (country === "All") return africanCities;
    const countryCities = africanCities.filter((c) => cityToCountry[c] === country);
    return countryCities.length > 0 ? countryCities : africanCities;
  }, [country]);
  const sellerPhone = profile?.phone || (user?.user_metadata?.phone as string | undefined) || "";

  useEffect(() => {
    const saved = localStorage.getItem("sellCarDraft");
    if (saved) return;

    setForm((current) => ({
      ...current,
      currency: countryCurrencyMap[country] || current.currency,
      city: current.city || city || "",
      registeredIn: current.registeredIn || city || "",
    }));
  }, [country, city]);

  const update = (key: keyof FormData, val: string | boolean) => {
    const next = { ...form, [key]: val };
    setForm(next);
    localStorage.setItem("sellCarDraft", JSON.stringify(next));
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_SIZE_MB = 5;
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024).slice(0, 10 - images.length);
    if (valid.length < selected.length) toast({ title: "File too large", description: "Each image must be under 5MB.", variant: "destructive" });
    setImages((prev) => [...prev, ...valid]);
    valid.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((p) => [...p, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) {
      toast({ title: "Video too large", description: "Video must be under 30MB.", variant: "destructive" });
      return;
    }
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!form.make || !form.model) { toast({ title: "Required", description: "Please fill in Make and Model.", variant: "destructive" }); return; }
    if (!form.bodyType) { toast({ title: "Required", description: "Please select a Body Type.", variant: "destructive" }); return; }
    if (!form.price) { toast({ title: "Required", description: "Please enter a price.", variant: "destructive" }); return; }
    if (!sellerPhone) {
      toast({ title: "Phone number required", description: "Add your phone number in your profile before posting so buyers can contact you.", variant: "destructive" });
      return;
    }
    if (user.id.startsWith("demo-")) {
      toast({ title: "Demo account", description: "Demo accounts can preview the form, but cannot submit live listings.", variant: "destructive" });
      return;
    }

    const isVerified = user.email_confirmed_at || user.confirmed_at;
    if (!isVerified) {
      toast({ title: "Email not verified", description: "Please verify your email before listing.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const title = form.title || `${form.year} ${form.make} ${form.model}`;
      const { data: listing, error } = await supabase.from("listings").insert({
        seller_id: user.id, title, make: form.make, model: form.model,
        year: parseInt(form.year), price: parseFloat(form.price), currency: form.currency,
        mileage: form.mileage ? parseInt(form.mileage) : null,
        transmission: form.transmission || null, fuel_type: form.fuelType || null,
        body_type: form.bodyType || null, color: form.color || null,
        condition: form.condition, description: form.description || null,
        city: form.city || null, status: "pending" as const,
      }).select().single();

      if (error) throw error;

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const path = `${user.id}/${listing.id}/${i}-${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("listing-images").upload(path, file);
        if (uploadErr) { console.error("Image upload failed:", uploadErr.message); continue; }
        const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(path);
        await supabase.from("listing_images").insert({ listing_id: listing.id, image_url: urlData.publicUrl, display_order: i });
      }

      if (video) {
        const safeName = video.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const videoPath = `${user.id}/${listing.id}/video-${Date.now()}-${safeName}`;
        const { error: videoError } = await supabase.storage.from("listing-images").upload(videoPath, video, { contentType: video.type, upsert: false });
        if (videoError) throw new Error(`Video upload failed: ${videoError.message}`);
        const { data: videoUrl } = supabase.storage.from("listing-images").getPublicUrl(videoPath);
        const { error: updateError } = await supabase.from("listings").update({ video_url: videoUrl.publicUrl }).eq("id", listing.id);
        if (updateError) throw updateError;
      }

      localStorage.removeItem("sellCarDraft");
      toast({ title: "Listing submitted!", description: "Your listing is pending review and will go live once approved." });
      navigate("/profile");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast({ title: "Submission failed", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // Plan selection screen
  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto max-w-lg px-4 py-10">
          <h1 className="text-2xl font-extrabold text-foreground mb-1">How do you want to sell your car?</h1>
          <p className="text-sm text-muted-foreground mb-8">Choose the option that works best for you</p>

          {/* Sell Myself */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-bold text-foreground text-lg mb-3">Sell it Myself!</h2>
                <ul className="space-y-2 text-sm text-muted-foreground mb-5">
                  {["Post an Ad in 2 minutes", "Reach serious buyers", "Connect Directly with Buyers"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                        <IconCheck size={12} className="text-success" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => setPlan("self")}>Post your ad</Button>
              </div>
              <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <IconCamera size={36} className="text-primary" />
              </div>
            </div>
          </div>

          {/* Sell It For Me */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-bold text-foreground text-lg">Sell It For Me</h2>
                  <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Learn more</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-2">
                  {["Sell your car without hassle", "Free Inspection & Featured Ad", "Maximize offer with sales agent"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                        <IconCheck size={12} className="text-success" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-muted-foreground mb-4">*Available in select cities</p>
                <Button variant="outline" className="w-full" onClick={() => setPlan("agent")}>Help me sell my car!</Button>
              </div>
              <div className="w-20 h-20 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <IconBrandWhatsapp size={36} className="text-accent" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Agent / concierge plan
  if (plan === "agent") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto max-w-md px-4 py-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <IconBrandWhatsapp size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Sell It For Me</h1>
          <p className="text-muted-foreground text-sm mb-8">Contact our team — we'll handle photos, listing, and negotiation for you.</p>
          <div className="space-y-3">
            <a href="https://wa.me/255712000000?text=Hi, I'd like help selling my car through Motokah" target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white gap-2">
                <IconBrandWhatsapp size={18} /> Chat on WhatsApp
              </Button>
            </a>
            <a href="tel:+255712000000">
              <Button variant="outline" className="w-full gap-2">
                <IconPhone size={18} /> Call Us
              </Button>
            </a>
          </div>
          <button className="mt-8 text-sm text-muted-foreground hover:text-foreground" onClick={() => setPlan("self")}>← Back</button>
        </main>
        <Footer />
      </div>
    );
  }

  // Sheet / bottom drawer for option selection
  const sheetOptions: Record<string, { label: string; value: string }[]> = {
    make: carBrands.map(b => ({ label: b, value: b })),
    bodyType: bodyTypes,
    transmission: transmissions.map(t => ({ label: t, value: t })),
    fuelType: fuelTypes.map(f => ({ label: f, value: f })),
    color: colors.map(c => ({ label: c, value: c })),
    condition: conditions.map(c => ({ label: c, value: c })),
    city: availableCities.map(c => ({ label: c, value: c })),
    registeredIn: availableCities.map(c => ({ label: c, value: c })),
    assembly: assemblies.map(a => ({ label: a, value: a })),
  };

  const sheetLabels: Record<string, string> = {
    make: "Select Make", bodyType: "Select Body Type", transmission: "Select Transmission",
    fuelType: "Select Fuel Type", color: "Select Color", condition: "Select Condition",
    city: "Select City", registeredIn: "Registered In", assembly: "Select Assembly",
  };

  const displayName = (user?.user_metadata?.display_name as string | undefined) || user?.email?.split("@")[0] || "";
  const displayPhone = sellerPhone;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto max-w-lg px-0 sm:px-4 py-0 sm:py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 sm:hidden border-b border-border bg-background sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground">← Back</button>
          <h1 className="text-base font-bold text-foreground">Sell your car</h1>
          <button
            className="text-sm font-semibold text-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "..." : "Done"}
          </button>
        </div>

        <div className="hidden sm:flex items-center justify-between px-1 pb-4">
          <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground">← Back</button>
          <h1 className="text-xl font-bold text-foreground">Sell your car</h1>
          <button onClick={() => setPlan("agent")} className="text-sm font-medium text-primary hover:underline">Sell it for me</button>
        </div>

        {/* Photos */}
        <div className="bg-card border-b border-border mb-0">
          <label className="flex flex-col items-center justify-center w-full py-10 cursor-pointer hover:bg-muted/30 transition-colors">
            {previews.length === 0 ? (
              <>
                <div className="relative mb-2">
                  <IconCamera size={52} className="text-muted-foreground/40" strokeWidth={1.5} />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-bold leading-none">+</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground font-medium">Add Photos</span>
              </>
            ) : (
              <div className="flex gap-2 flex-wrap justify-center px-4">
                {previews.map((p, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); removeImage(i); }}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                    >
                      <IconX size={10} className="text-white" />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 text-[8px] bg-primary text-primary-foreground px-1 rounded">Cover</span>}
                  </div>
                ))}
                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <span className="text-2xl text-muted-foreground">+</span>
                  <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
                </label>
              </div>
            )}
            <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
          </label>
        </div>

        <div className="border-b border-border bg-card px-4 py-4">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Vehicle video</p>
              <p className="text-xs text-muted-foreground">Optional, up to 30MB</p>
            </div>
            {video && <button type="button" onClick={() => { setVideo(null); if (videoPreview) URL.revokeObjectURL(videoPreview); setVideoPreview(""); }} className="text-xs font-semibold text-destructive">Remove</button>}
          </div>
          {videoPreview ? (
            <video src={videoPreview} controls preload="metadata" className="aspect-video w-full rounded-lg bg-black object-contain" />
          ) : (
            <label className="flex h-20 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary">
              <IconVideo size={22} /> Add video
              <input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={handleVideo} className="hidden" />
            </label>
          )}
        </div>

        {/* CAR DETAILS */}
        <div className="mt-3">
          <p className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase px-4 mb-1">Car Details</p>
          <div className="bg-card border-y border-border">

            {/* City */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30" onClick={() => setSheet("city")}>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className={`text-sm mt-0.5 ${form.city ? "text-foreground" : "text-muted-foreground"}`}>{form.city || "Select City"}</p>
              </div>
              <IconChevronRight size={16} className="text-muted-foreground" />
            </div>

            {/* Make */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30" onClick={() => setSheet("make")}>
              <div>
                <p className="text-xs text-muted-foreground">Make</p>
                <p className={`text-sm mt-0.5 ${form.make ? "text-foreground" : "text-muted-foreground"}`}>{form.make || "Select Make"}</p>
              </div>
              <IconChevronRight size={16} className="text-muted-foreground" />
            </div>

            {/* Model */}
            <div className="flex flex-col px-4 py-3 border-b border-border">
              <p className="text-xs text-muted-foreground mb-1">Model</p>
              <input
                type="text"
                value={form.model}
                onChange={(e) => update("model", e.target.value)}
                placeholder="e.g. Corolla, Civic"
                className="text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Year */}
            <div className="flex flex-col px-4 py-3 border-b border-border">
              <p className="text-xs text-muted-foreground mb-1">Year</p>
              <input
                type="number"
                value={form.year}
                onChange={(e) => update("year", e.target.value)}
                placeholder="e.g. 2019"
                min="1990"
                max={new Date().getFullYear() + 1}
                className="text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col px-4 py-3 border-b border-border">
              <p className="text-xs text-muted-foreground mb-1">Price</p>
              <div className="flex items-center gap-2">
                <select
                  value={form.currency}
                  onChange={(e) => update("currency", e.target.value)}
                  className="text-sm bg-transparent text-muted-foreground focus:outline-none border-none p-0"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>{currency.code}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="Enter your asking price"
                  className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Registered In */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30" onClick={() => setSheet("registeredIn")}>
              <div>
                <p className="text-xs text-muted-foreground">Registered In</p>
                <p className={`text-sm mt-0.5 ${form.registeredIn ? "text-foreground" : "text-muted-foreground"}`}>{form.registeredIn || "Select City"}</p>
              </div>
              <IconChevronRight size={16} className="text-muted-foreground" />
            </div>

            {/* Mileage */}
            <div className="flex flex-col px-4 py-3 border-b border-border">
              <p className="text-xs text-muted-foreground mb-1">KMs Driven</p>
              <input
                type="number"
                value={form.mileage}
                onChange={(e) => update("mileage", e.target.value)}
                placeholder="Enter KMs Driven"
                className="text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Body Color */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30" onClick={() => setSheet("color")}>
              <div>
                <p className="text-xs text-muted-foreground">Body Color</p>
                <p className={`text-sm mt-0.5 ${form.color ? "text-foreground" : "text-muted-foreground"}`}>{form.color || "Select Body Color"}</p>
              </div>
              <IconChevronRight size={16} className="text-muted-foreground" />
            </div>

            {/* Body Type */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30" onClick={() => setSheet("bodyType")}>
              <div>
                <p className="text-xs text-muted-foreground">Body Type <span className="text-destructive">*</span></p>
                <p className={`text-sm mt-0.5 ${form.bodyType ? "text-foreground" : "text-muted-foreground"}`}>
                  {form.bodyType ? (bodyTypes.find(b => b.value === form.bodyType)?.label ?? form.bodyType) : "Select Body Type"}
                </p>
              </div>
              <IconChevronRight size={16} className="text-muted-foreground" />
            </div>

            {/* More details toggle */}
            <button
              type="button"
              onClick={() => setShowMore((s) => !s)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-border text-sm font-medium text-primary hover:bg-muted/30"
            >
              {showMore ? "Hide extra details" : "Add more details (optional)"}
              <IconChevronRight size={16} className={`text-primary transition-transform ${showMore ? "rotate-90" : ""}`} />
            </button>

            {showMore && (<>
            {/* Transmission */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30" onClick={() => setSheet("transmission")}>
              <div>
                <p className="text-xs text-muted-foreground">Transmission</p>
                <p className={`text-sm mt-0.5 ${form.transmission ? "text-foreground" : "text-muted-foreground"}`}>{form.transmission || "Select Transmission"}</p>
              </div>
              <IconChevronRight size={16} className="text-muted-foreground" />
            </div>

            {/* Fuel Type */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30" onClick={() => setSheet("fuelType")}>
              <div>
                <p className="text-xs text-muted-foreground">Fuel Type</p>
                <p className={`text-sm mt-0.5 ${form.fuelType ? "text-foreground" : "text-muted-foreground"}`}>{form.fuelType || "Select Fuel Type"}</p>
              </div>
              <IconChevronRight size={16} className="text-muted-foreground" />
            </div>

            {/* Condition */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30" onClick={() => setSheet("condition")}>
              <div>
                <p className="text-xs text-muted-foreground">Condition</p>
                <p className={`text-sm mt-0.5 ${form.condition ? "text-foreground" : "text-muted-foreground"}`}>{form.condition || "Select Condition"}</p>
              </div>
              <IconChevronRight size={16} className="text-muted-foreground" />
            </div>

            {/* Assembly */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30" onClick={() => setSheet("assembly")}>
              <div>
                <p className="text-xs text-muted-foreground">Assembly</p>
                <p className={`text-sm mt-0.5 ${form.assembly ? "text-foreground" : "text-muted-foreground"}`}>{form.assembly || "Select Assembly"}</p>
              </div>
              <IconChevronRight size={16} className="text-muted-foreground" />
            </div>
            </>)}

            {/* Description */}
            <div className="flex flex-col px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="e.g. Alloy Rims, First Owner, Full Service History..."
                rows={3}
                className="text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
              />
              <div className="flex gap-2 flex-wrap mt-2">
                {["Alloy Rims", "First Owner", "Full Service History", "Auction Sheet Available", "New Tyres", "Low Mileage", "Sunroof", "Leather Seats", "Accident Free"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      if (form.description.toLowerCase().includes(s.toLowerCase())) return;
                      update("description", form.description ? `${form.description.replace(/\s*$/, "")}, ${s}` : s);
                    }}
                    className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT INFORMATION */}
        <div className="mt-5">
          <p className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase px-4 mb-1">Contact Information</p>
          <div className="bg-card border-y border-border">

            {/* Name */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <Input
                  value={displayName}
                  readOnly
                  placeholder="Your name"
                  className="border-none shadow-none p-0 h-auto text-sm bg-transparent focus-visible:ring-0"
                />
              </div>
              {displayName && <IconCheck size={16} className="text-success shrink-0" />}
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Mobile Number</p>
                <p className={`text-sm mt-0.5 ${displayPhone ? "text-foreground" : "text-destructive"}`}>
                  {displayPhone || "Add phone in profile"}
                </p>
              </div>
              {displayPhone ? <IconCheck size={16} className="text-success shrink-0" /> : (
                <button onClick={() => navigate("/profile")} className="text-xs font-semibold text-primary">Update</button>
              )}
            </div>

            {/* WhatsApp toggle */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                  <IconBrandWhatsapp size={18} className="text-[#25D366]" />
                </div>
                <span className="text-sm text-foreground">Allow WhatsApp Contact</span>
              </div>
              <button
                onClick={() => update("allowWhatsapp", !form.allowWhatsapp)}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.allowWhatsapp ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.allowWhatsapp ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Submit button (desktop) */}
        <div className="px-4 py-6 hidden sm:block">
          <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 text-base font-semibold">
            {submitting ? "Submitting..." : "Done"}
          </Button>
        </div>

        {/* Submit button (mobile) */}
        <div className="px-4 py-6 sm:hidden">
          <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 text-base font-semibold">
            {submitting ? "Submitting..." : "Done"}
          </Button>
        </div>
      </main>

      {/* Option Sheet (bottom drawer on mobile, modal on desktop) */}
      {sheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setSheet(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-card w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl max-h-[70vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-foreground">{sheetLabels[sheet]}</h3>
              <button onClick={() => setSheet(null)}>
                <IconX size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {(sheetOptions[sheet] || []).map((opt) => (
                <button
                  key={opt.value}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-muted/50 border-b border-border last:border-b-0"
                  onClick={() => { update(sheet as keyof FormData, opt.value); setSheet(null); }}
                >
                  {opt.label}
                  {form[sheet as keyof FormData] === opt.value && <IconCheck size={16} className="text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
