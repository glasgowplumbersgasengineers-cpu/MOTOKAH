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
import {
  IconX,
  IconCheck,
  IconCamera,
  IconChevronRight,
  IconBrandWhatsapp,
  IconPhone,
  IconVideo,
  IconCar,
  IconSparkles,
  IconMapPin,
  IconCoin,
  IconShieldCheck,
  IconArrowLeft,
  IconInfoCircle,
} from "@tabler/icons-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { africanCities, carMakes, cityToCountry, currencies } from "@/data/mockData";
import { notifyAdminsOnNewListing } from "@/lib/sendEmail";
import { trackEvent } from "@/lib/analytics";

const topEastAfricaMakes = [
  "Toyota",
  "Nissan",
  "Subaru",
  "Honda",
  "Mercedes-Benz",
  "BMW",
  "Mitsubishi",
  "Land Rover",
  "Suzuki",
  "Ford",
  "Mazda",
  "Hyundai",
  "Volkswagen",
  "Kia",
];

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
  { label: "SUV / 4x4", value: "SUV" },
  { label: "Sedan / Saloon", value: "Sedan" },
  { label: "Hatchback", value: "Hatchback" },
  { label: "Pickup / Double Cab", value: "Pickup" },
  { label: "Van / Minivan", value: "Van" },
  { label: "Wagon", value: "Wagon" },
  { label: "Coupe", value: "Coupe" },
  { label: "Motorcycle", value: "Motorcycle" },
  { label: "Commercial / Truck", value: "Truck" },
];

const transmissions = ["Automatic", "Manual", "CVT"];
const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];
const conditions = ["Used", "Brand New", "Certified Pre-owned"];
const colors = ["White", "Black", "Silver", "Grey", "Blue", "Red", "Brown", "Green", "Gold", "Orange", "Other"];

const POPULAR_CAR_FEATURES = [
  "Air Conditioning",
  "Reverse Camera",
  "Push to Start",
  "Leather Seats",
  "Sunroof / Moonroof",
  "Alloy Wheels",
  "Navigation / GPS",
  "Bluetooth / Touchscreen",
  "4WD / All-Wheel Drive",
  "Airbags & ABS",
  "Power Windows & Mirrors",
  "Keyless Entry",
  "Cruise Control",
  "Parking Sensors",
  "Fog Lights",
  "Roof Rails",
  "Steering Controls",
  "Full Service History",
];

interface FormData {
  make: string;
  model: string;
  year: string;
  bodyType: string;
  transmission: string;
  fuelType: string;
  color: string;
  mileage: string;
  condition: string;
  title: string;
  description: string;
  assembly: string;
  price: string;
  currency: string;
  city: string;
  registeredIn: string;
  allowWhatsapp: boolean;
}

const defaultForm: FormData = {
  make: "",
  model: "",
  year: new Date().getFullYear().toString(),
  bodyType: "SUV",
  transmission: "Automatic",
  fuelType: "Petrol",
  color: "White",
  mileage: "",
  condition: "Used",
  title: "",
  description: "",
  assembly: "",
  price: "",
  currency: "TZS",
  city: "Dar es Salaam",
  registeredIn: "",
  allowWhatsapp: true,
};

type SheetKey = "make" | "bodyType" | "city" | "color" | null;

export default function SellCar() {
  usePageTitle("Sell Your Car — Motokah");
  const { country, city } = useLocation();
  const [form, setForm] = useState<FormData>(() => {
    const saved = localStorage.getItem("sellCarDraft");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      ...defaultForm,
      currency: countryCurrencyMap[country] || defaultForm.currency,
      city: city || "Dar es Salaam",
      registeredIn: city || "Dar es Salaam",
    };
  });

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(() => {
    const saved = localStorage.getItem("sellCarFeatures");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return ["Air Conditioning", "Alloy Wheels", "Power Windows & Mirrors"];
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sheet, setSheet] = useState<SheetKey>(null);
  const [searchMakeQuery, setSearchMakeQuery] = useState("");
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const sellerPhone = profile?.phone || (user?.user_metadata?.phone as string | undefined) || "";
  const [phoneInput, setPhoneInput] = useState(sellerPhone);

  useEffect(() => {
    if (sellerPhone && !phoneInput) {
      setPhoneInput(sellerPhone);
    }
  }, [sellerPhone]);

  const availableCities = useMemo(() => {
    if (country === "All") return africanCities;
    const countryCities = africanCities.filter((c) => cityToCountry[c] === country);
    return countryCities.length > 0 ? countryCities : africanCities;
  }, [country]);

  const filteredMakes = useMemo(() => {
    if (!searchMakeQuery.trim()) return carMakes;
    return carMakes.filter((m) => m.toLowerCase().includes(searchMakeQuery.toLowerCase()));
  }, [searchMakeQuery]);

  const update = (key: keyof FormData, val: string | boolean) => {
    const next = { ...form, [key]: val };
    setForm(next);
    localStorage.setItem("sellCarDraft", JSON.stringify(next));
  };

  const toggleFeature = (feat: string) => {
    const next = selectedFeatures.includes(feat)
      ? selectedFeatures.filter((f) => f !== feat)
      : [...selectedFeatures, feat];
    setSelectedFeatures(next);
    localStorage.setItem("sellCarFeatures", JSON.stringify(next));
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_SIZE_MB = 5;
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024).slice(0, 10 - images.length);
    if (valid.length < selected.length) {
      toast({ title: "File too large", description: "Each image must be under 5MB.", variant: "destructive" });
    }
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
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in or create an account to post your car." });
      navigate("/auth?returnTo=/sell");
      return;
    }
    if (!form.make || !form.model) {
      toast({ title: "Required", description: "Please enter the Vehicle Make and Model.", variant: "destructive" });
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast({ title: "Required", description: "Please enter a valid asking price.", variant: "destructive" });
      return;
    }

    const activePhone = phoneInput.trim() || sellerPhone;
    if (!activePhone) {
      toast({
        title: "Phone number required",
        description: "Please enter your mobile phone number so buyers can contact you via phone or WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    if (user.id.startsWith("demo-")) {
      toast({ title: "Demo account", description: "Demo accounts can preview the form, but cannot submit live listings.", variant: "destructive" });
      return;
    }

    // Auto-save phone to profile
    if (user && activePhone && (!profile?.phone || profile.phone !== activePhone)) {
      try {
        const { error: profileError } = await supabase.from("profiles").update({ phone: activePhone }).eq("user_id", user.id);
        if (profileError) console.warn("Auto-saving phone to profile:", profileError.message);
      } catch (e) {
        console.warn("Auto-saving phone to profile:", e);
      }
    }

    setSubmitting(true);
    try {
      const title = form.title || `${form.year} ${form.make} ${form.model}`;

      // Build rich description incorporating selected features
      let fullDescription = form.description.trim();
      if (selectedFeatures.length > 0) {
        const featuresText = `\n\nKey Features & Equipment:\n• ${selectedFeatures.join("\n• ")}`;
        if (!fullDescription.includes("Key Features")) {
          fullDescription = fullDescription ? `${fullDescription}${featuresText}` : featuresText.trim();
        }
      }

      const { data: listing, error } = await supabase.from("listings").insert({
        seller_id: user.id,
        title,
        make: form.make,
        model: form.model,
        year: parseInt(form.year) || new Date().getFullYear(),
        price: parseFloat(form.price),
        currency: form.currency,
        mileage: form.mileage ? parseInt(form.mileage) : null,
        transmission: form.transmission || null,
        fuel_type: form.fuelType || null,
        body_type: form.bodyType || null,
        color: form.color || null,
        condition: form.condition,
        description: fullDescription || null,
        city: form.city || null,
        status: "pending" as const,
      }).select().single();

      if (error) throw error;

      trackEvent("listing_posted", { userId: user.id, make: form.make, model: form.model, city: form.city });

      // Upload Images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const path = `${user.id}/${listing.id}/${i}-${file.name}`;
        const { error: uploadErr } = await supabase.storage.from("listing-images").upload(path, file);
        if (uploadErr) {
          console.error("Image upload failed:", uploadErr.message);
          continue;
        }
        const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(path);
        await supabase.from("listing_images").insert({
          listing_id: listing.id,
          image_url: urlData.publicUrl,
          display_order: i,
        });
      }

      // Upload Video if present
      if (video) {
        const safeName = video.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const videoPath = `${user.id}/${listing.id}/video-${Date.now()}-${safeName}`;
        const { error: videoError } = await supabase.storage.from("listing-images").upload(videoPath, video, {
          contentType: video.type,
          upsert: false,
        });
        if (!videoError) {
          const { data: videoUrl } = supabase.storage.from("listing-images").getPublicUrl(videoPath);
          await supabase.from("listings").update({ video_url: videoUrl.publicUrl }).eq("id", listing.id);
        }
      }

      // Notify platform administrators immediately via email
      notifyAdminsOnNewListing({
        listingId: listing.id,
        title,
        price: form.price,
        currency: form.currency,
        make: form.make,
        model: form.model,
        sellerName: user.user_metadata?.display_name || user.email || "Seller",
        sellerEmail: user.email,
        phone: form.phone,
        city: form.city,
      }).catch(e => console.warn("Admin notification dispatch failed:", e));

      localStorage.removeItem("sellCarDraft");
      localStorage.removeItem("sellCarFeatures");
      toast({
        title: "Listing submitted! 🎉",
        description: "Your vehicle is uploaded and ready for review. It will go live once verified.",
      });
      navigate("/profile");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast({ title: "Submission failed", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const formattedPrice = useMemo(() => {
    if (!form.price) return "";
    const num = Number(form.price);
    if (isNaN(num)) return form.price;
    return num.toLocaleString();
  }, [form.price]);

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto max-w-2xl px-4 py-6 md:py-10">
        {/* Top Header & Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors bg-card border border-border px-3 py-1.5 rounded-lg shadow-sm"
          >
            <IconArrowLeft size={16} /> Back
          </button>
          <div className="text-center flex-1 px-2">
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Post Your Vehicle</h1>
            <p className="text-xs text-muted-foreground">Reach thousands of active car buyers across East Africa</p>
          </div>
          <div className="w-16 flex justify-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
              Free Ad
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* CARD 1: PHOTOS & MEDIA */}
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h2 className="text-base font-bold text-foreground">Photos & Video</h2>
              </div>
              <span className="text-xs text-muted-foreground">{images.length}/10 photos</span>
            </div>

            {/* Photo Dropzone */}
            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-muted/10">
              {previews.length === 0 ? (
                <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <IconCamera size={28} stroke={1.8} />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">Upload Photos of Your Car</p>
                  <p className="text-xs text-muted-foreground max-w-xs mb-4">
                    High quality exterior, interior, and dashboard photos get 3x more buyer inquiries.
                  </p>
                  <span className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                    Choose Photos (Up to 10)
                  </span>
                  <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
                </label>
              ) : (
                <div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 mb-3">
                    {previews.map((p, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border bg-black/10 group">
                        <img src={p} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 hover:bg-destructive text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <IconX size={12} />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded shadow-sm">
                            Cover Photo
                          </span>
                        )}
                      </div>
                    ))}
                    {images.length < 10 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground">
                        <span className="text-2xl font-light mb-0.5">+</span>
                        <span className="text-[10px] font-semibold">Add More</span>
                        <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Video Upload Row */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <IconVideo size={16} className="text-primary" /> Vehicle Video Walkaround
                </p>
                <p className="text-[11px] text-muted-foreground">Optional short clip up to 30MB</p>
              </div>
              {video ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-success">Video added</span>
                  <button
                    type="button"
                    onClick={() => {
                      setVideo(null);
                      if (videoPreview) URL.revokeObjectURL(videoPreview);
                      setVideoPreview("");
                    }}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="px-3 py-1.5 rounded-lg border border-border hover:border-primary text-xs font-semibold text-foreground cursor-pointer transition-colors bg-background">
                  + Add Video
                  <input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={handleVideo} className="hidden" />
                </label>
              )}
            </div>
            {videoPreview && (
              <div className="mt-3">
                <video src={videoPreview} controls className="aspect-video w-full rounded-xl bg-black max-h-48 object-contain" />
              </div>
            )}
          </div>

          {/* CARD 2: VEHICLE DETAILS */}
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h2 className="text-base font-bold text-foreground">Vehicle Information</h2>
            </div>

            {/* Quick Popular Makes */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Make (Brand) <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {topEastAfricaMakes.slice(0, 8).map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => update("make", brand)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      form.make === brand
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSheet("make")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  More Makes...
                </button>
              </div>
              {form.make && (
                <p className="text-xs font-medium text-primary flex items-center gap-1 mt-1">
                  <IconCheck size={14} /> Selected: {form.make}
                </p>
              )}
            </div>

            {/* Model & Year Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Model <span className="text-destructive">*</span>
                </label>
                <Input
                  value={form.model}
                  onChange={(e) => update("model", e.target.value)}
                  placeholder="e.g. Harrier, Alphard, Prado"
                  className="h-11 bg-background"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Year of Manufacture <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={(e) => update("year", e.target.value)}
                  placeholder="e.g. 2019"
                  className="h-11 bg-background"
                  required
                />
              </div>
            </div>

            {/* Body Type Selector */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Body Type <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {bodyTypes.map((bt) => (
                  <button
                    key={bt.value}
                    type="button"
                    onClick={() => update("bodyType", bt.value)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
                      form.bodyType === bt.value
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <span>{bt.label}</span>
                    {form.bodyType === bt.value && <IconCheck size={14} className="text-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 3: PRICING & LOCATION */}
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h2 className="text-base font-bold text-foreground">Price & Location</h2>
            </div>

            {/* Price with Currency Picker */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Asking Price <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={form.currency}
                  onChange={(e) => update("currency", e.target.value)}
                  className="h-11 px-3 rounded-lg border border-input bg-background text-sm font-bold text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="e.g. 25000000"
                    className="h-11 bg-background text-base font-bold"
                    required
                  />
                </div>
              </div>
              {form.price && Number(form.price) > 0 && (
                <p className="text-xs font-semibold text-primary mt-1.5 flex items-center gap-1">
                  <IconCoin size={14} /> Formatted: {formattedPrice} {form.currency}
                </p>
              )}
            </div>

            {/* City / Location & Mileage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  City / Location <span className="text-destructive">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setSheet("city")}
                  className="w-full h-11 px-3 rounded-lg border border-input bg-background flex items-center justify-between text-sm text-foreground hover:border-primary transition-colors text-left"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <IconMapPin size={16} className="text-muted-foreground shrink-0" />
                    {form.city || "Select Location"}
                  </span>
                  <IconChevronRight size={16} className="text-muted-foreground shrink-0" />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Mileage (KM Driven)
                </label>
                <Input
                  type="number"
                  value={form.mileage}
                  onChange={(e) => update("mileage", e.target.value)}
                  placeholder="e.g. 65000"
                  className="h-11 bg-background"
                />
              </div>
            </div>
          </div>

          {/* CARD 4: SPECIFICATIONS & CONDITION */}
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h2 className="text-base font-bold text-foreground">Condition & Specs</h2>
            </div>

            {/* Condition Segmented Control */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Condition
              </label>
              <div className="grid grid-cols-3 gap-2">
                {conditions.map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => update("condition", cond)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      form.condition === cond
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background border-border text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission Segmented Control */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Transmission
              </label>
              <div className="grid grid-cols-3 gap-2">
                {transmissions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update("transmission", t)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      form.transmission === t
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background border-border text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type Segmented Control */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Fuel Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {fuelTypes.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => update("fuelType", f)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      form.fuelType === f
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background border-border text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Exterior Color */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Exterior Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => update("color", c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      form.color === c
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background border-border text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 5: KEY FEATURES & EQUIPMENT (THE HIGHLIGHTED USER REQUEST) */}
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  5
                </span>
                <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
                  Vehicle Features & Extras <IconSparkles size={16} className="text-amber-500" />
                </h2>
              </div>
              <span className="text-xs font-semibold text-primary">{selectedFeatures.length} selected</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Tap the features your car includes. These will be highlighted on your vehicle profile for buyers.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_CAR_FEATURES.map((feat) => {
                const isSelected = selectedFeatures.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-primary/15 border-primary text-primary shadow-xs"
                        : "bg-background border-border text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <span className="truncate pr-1">{feat}</span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                        isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border text-transparent"
                      }`}
                    >
                      <IconCheck size={10} stroke={3} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 6: DESCRIPTION */}
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                6
              </span>
              <h2 className="text-base font-bold text-foreground">Seller's Description</h2>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe vehicle condition, maintenance history, reason for selling, or any recent service work..."
              rows={4}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* CARD 7: CONTACT & WHATSAPP */}
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                7
              </span>
              <h2 className="text-base font-bold text-foreground">Contact & Inquiries</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Mobile / WhatsApp Number <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <IconPhone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. 0712 345 678 or +255 712 345 678"
                    className="h-11 pl-10 bg-background font-semibold"
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Buyers will call or chat with you directly on this number.
                </p>
              </div>

              {/* WhatsApp Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#25D366]/5 border border-[#25D366]/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                    <IconBrandWhatsapp size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Enable Direct WhatsApp Contact</p>
                    <p className="text-[11px] text-muted-foreground">Allows buyers to start a chat with one tap</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => update("allowWhatsapp", !form.allowWhatsapp)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${form.allowWhatsapp ? "bg-[#25D366]" : "bg-muted"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                      form.allowWhatsapp ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2 pb-12">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full h-14 text-base font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Uploading vehicle details...</span>
                </>
              ) : (
                <>
                  <IconCar size={20} />
                  <span>Post Listing Now</span>
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
              <IconShieldCheck size={14} className="text-success" />
              Verified Motokah Marketplace &bull; Listing is reviewed before going live
            </p>
          </div>
        </div>
      </main>

      {/* Modal / Bottom Drawer for Make / City Selection */}
      {sheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSheet(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
          <div
            className="relative bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-bold text-foreground text-base">
                {sheet === "make" ? "Select Vehicle Make" : "Select City / Location"}
              </h3>
              <button
                onClick={() => setSheet(null)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 text-foreground"
              >
                <IconX size={16} />
              </button>
            </div>

            {sheet === "make" && (
              <div className="p-3 border-b border-border bg-muted/20">
                <Input
                  value={searchMakeQuery}
                  onChange={(e) => setSearchMakeQuery(e.target.value)}
                  placeholder="Search brand (e.g. Toyota, Subaru...)"
                  className="h-10 bg-background"
                  autoFocus
                />
              </div>
            )}

            <div className="overflow-y-auto flex-1 p-2 divide-y divide-border/50">
              {sheet === "make" ? (
                filteredMakes.map((m) => (
                  <button
                    key={m}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-muted/50 rounded-lg transition-colors font-medium text-foreground"
                    onClick={() => {
                      update("make", m);
                      setSheet(null);
                      setSearchMakeQuery("");
                    }}
                  >
                    <span>{m}</span>
                    {form.make === m && <IconCheck size={16} className="text-primary font-bold" />}
                  </button>
                ))
              ) : (
                availableCities.map((c) => (
                  <button
                    key={c}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-muted/50 rounded-lg transition-colors font-medium text-foreground"
                    onClick={() => {
                      update("city", c);
                      setSheet(null);
                    }}
                  >
                    <span>{c}</span>
                    {form.city === c && <IconCheck size={16} className="text-primary font-bold" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
