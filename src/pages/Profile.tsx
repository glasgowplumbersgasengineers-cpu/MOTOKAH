import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  IconUser,
  IconEdit,
  IconTrash,
  IconEye,
  IconCheck,
  IconCamera,
  IconShieldLock,
  IconQrcode,
  IconBookmark,
  IconAlertTriangle,
  IconRefresh,
  IconLayoutDashboard,
  IconCar,
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconChevronRight,
  IconBuildingStore,
  IconHelpCircle,
  IconLock,
  IconPlus,
  IconExternalLink,
  IconSearch,
  IconStarFilled,
  IconMapPin,
} from "@tabler/icons-react";
import ReviewsSection from "@/components/ReviewsSection";
import { Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useLanguage } from "@/contexts/LanguageContext";
import HelpGuide from "@/components/HelpGuide";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// date-fns kept for future use
import { mockListings } from "@/data/mockData";

type ProfileData = {
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  seller_type: string;
  verified_at: string | null;
  city: string | null;
};

type ListingRow = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  status: string;
  created_at: string;
  views: number;
  image?: string;
  images?: string[];
  image_url?: string;
  mileage?: number;
  city?: string;
  location?: string;
};

type SavedSearch = {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  created_at: string;
};

function MfaSection() {
  const { toast } = useToast();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [qrUri, setQrUri] = useState("");
  const [factorId, setFactorId] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.mfa.listFactors().then(({ data }) => {
      const totp = data?.totp?.find(f => f.status === "verified");
      setMfaEnabled(!!totp);
      setLoading(false);
    });
  }, []);

  const startEnroll = async () => {
    setEnrolling(true);
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setEnrolling(false);
      return;
    }
    setQrUri(data.totp.uri);
    setFactorId(data.id);
  };

  const verifyEnroll = async () => {
    setLoading(true);
    const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({ factorId });
    if (cErr) { toast({ title: "Error", description: cErr.message, variant: "destructive" }); setLoading(false); return; }
    const { error: vErr } = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.id, code: verifyCode });
    if (vErr) { toast({ title: "Invalid code", description: vErr.message, variant: "destructive" }); setLoading(false); return; }
    setMfaEnabled(true);
    setEnrolling(false);
    setQrUri("");
    setVerifyCode("");
    setLoading(false);
    toast({ title: "2FA enabled!" });
  };

  const unenroll = async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    const totp = data?.totp?.find(f => f.status === "verified");
    if (!totp) return;
    const { error } = await supabase.auth.mfa.unenroll({ factorId: totp.id });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setMfaEnabled(false);
    toast({ title: "2FA disabled" });
  };

  if (loading) return <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <IconShieldLock size={20} className="text-primary" />
        <h2 className="text-lg font-bold text-foreground">Two-Factor Authentication</h2>
      </div>
      <p className="text-sm text-muted-foreground">Add an extra layer of security using a TOTP authenticator app (Google Authenticator, Authy, etc.).</p>

      {mfaEnabled ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-success text-sm font-semibold">
            <IconCheck size={16} /> 2FA is enabled
          </div>
          <Button variant="destructive" size="sm" onClick={unenroll}>Disable 2FA</Button>
        </div>
      ) : enrolling ? (
        <div className="space-y-4">
          <p className="text-sm text-foreground font-medium">Scan this QR code with your authenticator app:</p>
          {qrUri && (
            <div className="flex justify-center p-4 bg-background rounded-lg border border-border">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUri)}`} alt="TOTP QR Code" className="w-48 h-48" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Enter the 6-digit code from your app</label>
            <div className="flex gap-2">
              <Input value={verifyCode} onChange={e => setVerifyCode(e.target.value)} placeholder="123456" maxLength={6} className="w-32" />
              <Button onClick={verifyEnroll} disabled={verifyCode.length !== 6}>Verify & Enable</Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setEnrolling(false); setQrUri(""); }}>Cancel</Button>
        </div>
      ) : (
        <Button onClick={startEnroll} className="gap-2"><IconQrcode size={16} /> Enable 2FA</Button>
      )}
    </div>
  );
}

function ChangePasswordSection() {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({
        title: "Password updated! 🔒",
        description: "Your account password has been changed successfully.",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password";
      toast({ title: "Error updating password", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <IconLock size={20} className="text-primary" />
        <h3 className="text-base font-bold text-foreground">Change Password</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Enter your new password below to secure your Motokah account.
      </p>
      <form onSubmit={handleUpdatePassword} className="space-y-3 max-w-sm">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            New Password
          </label>
          <Input
            type="password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="h-10 bg-background"
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Confirm New Password
          </label>
          <Input
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-10 bg-background"
            required
            minLength={6}
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full font-semibold">
          {loading ? "Updating password..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}

export default function Profile() {
  const { user, signOut, deleteAccount, isDealer } = useAuth();
  const { wishlistIds } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [tab, setTab] = useState<"dashboard" | "listings" | "reviews" | "settings" | "security" | "saved">("dashboard");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [wishlistListings, setWishlistListings] = useState<Array<{ id: string; title: string; price: number; currency: string; year: number; image: string; location?: string }>>([]);
  const [editing, setEditing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  usePageTitle("My Profile");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCity, setEditCity] = useState("");

  useEffect(() => {
    if (!user) return;
    if (user.id.startsWith("demo-")) {
      setProfile({
        display_name: user.user_metadata?.display_name || user.email || "Demo User",
        phone: "+255 700 000 000",
        avatar_url: null,
        seller_type: "private",
        verified_at: "2026-01-01T00:00:00Z",
        city: "Dar es Salaam",
      });
      setEditName(user.user_metadata?.display_name || user.email || "Demo User");
      setEditPhone("+255 700 000 000");
      setEditCity("Dar es Salaam");
      setListings(mockListings.slice(0, 5).map(l => ({
        id: l.id, title: l.title, make: l.make, model: l.model,
        year: l.year, price: l.price, currency: l.currency,
        status: "approved", created_at: new Date().toISOString(), views: l.views,
        image: l.image,
        mileage: l.mileage,
        location: l.location,
      })));
      return;
    }
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setProfile(data as ProfileData);
        setEditName(data.display_name || "");
        setEditPhone(data.phone || "");
        setEditCity(data.city || "");
      }
    });
    supabase.from("listings")
      .select("id, title, make, model, year, price, currency, status, created_at, views, images, image_url, mileage, city")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setListings(data.map((row: any) => ({
            ...row,
            image: row.image_url || (Array.isArray(row.images) && row.images.length > 0 ? row.images[0] : undefined),
            location: row.city || undefined,
          })));
        }
      });
    // saved_searches table not yet created - skip for now
  }, [user]);

  useEffect(() => {
    if (wishlistIds.size === 0) { setWishlistListings([]); return; }
    // Find mock listings first
    const ids = Array.from(wishlistIds);
    const fromMock = mockListings
      .filter((l) => ids.includes(l.id))
      .map((l) => ({ id: l.id, title: l.title, price: l.price, currency: l.currency, year: l.year, image: l.image, location: l.location }));
    const mockIds = new Set(fromMock.map((l) => l.id));
    const remainingIds = ids.filter((id) => !mockIds.has(id));

    if (remainingIds.length === 0) { setWishlistListings(fromMock); return; }

    // Fetch remaining from Supabase
    supabase.from("listings").select("id, title, price, currency, year, city").in("id", remainingIds).then(({ data }) => {
      const fromDb = (data || []).map((l: { id: string; title: string; price: number; currency: string; year: number; city: string | null }) => ({
        id: l.id, title: l.title, price: l.price, currency: l.currency, year: l.year,
        image: "/placeholder.svg", location: l.city || undefined,
      }));
      setWishlistListings([...fromMock, ...fromDb]);
    });
  }, [wishlistIds]);

  const saveProfile = async () => {
    if (!user) return;
    if (user.id.startsWith("demo-")) {
      setProfile((p) => p ? { ...p, display_name: editName, phone: editPhone, city: editCity } : p);
      setEditing(false);
      toast({ title: "Demo profile updated locally" });
      return;
    }
    const { error } = await supabase.from("profiles").update({
      display_name: editName,
      phone: editPhone,
      city: editCity,
    }).eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProfile((p) => p ? { ...p, display_name: editName, phone: editPhone, city: editCity } : p);
      setEditing(false);
      toast({ title: "Profile updated!" });
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    const { error } = await deleteAccount();
    setDeletingAccount(false);
    if (error) {
      toast({ title: "Account deletion failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Account deleted", description: "Your Motokah account and associated data have been deleted." });
    navigate("/", { replace: true });
  };

  const deleteListing = async (id: string) => {
    await supabase.from("listings").delete().eq("id", id);
    setListings((prev) => prev.filter((l) => l.id !== id));
    toast({ title: "Listing deleted" });
  };

  const renewListing = async (id: string) => {
    toast({ title: "Listing renewal coming soon!" });
  };

  const deleteSavedSearch = async (id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
    toast({ title: "Search removed" });
  };

  const filtersToQuery = (filters: Record<string, unknown>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach(val => params.append(k, String(val)));
      else if (v) params.set(k, String(v));
    });
    return params.toString();
  };

  const markSold = async (id: string) => {
    await supabase.from("listings").update({ status: "sold" as const }).eq("id", id);
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: "sold" } : l));
    toast({ title: "Marked as sold" });
  };

  const statusColors: Record<string, string> = {
    approved: "bg-success/20 text-success",
    pending: "bg-accent/20 text-accent",
    sold: "bg-muted text-muted-foreground",
    rejected: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-8 pb-28 md:pb-8 max-w-3xl">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 flex items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <IconUser size={28} className="text-primary" />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90">
              <IconCamera size={12} />
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !user) return;
                const path = `${user.id}/avatar-${Date.now()}.${file.name.split(".").pop()}`;
                const { error: upErr } = await supabase.storage.from("listing-images").upload(path, file);
                if (upErr) { toast({ title: "Upload failed", variant: "destructive" }); return; }
                const { data: urlData } = supabase.storage.from("listing-images").getPublicUrl(path);
                await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
                setProfile(p => p ? { ...p, avatar_url: urlData.publicUrl } : p);
                toast({ title: "Avatar updated!" });
              }} />
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{profile?.display_name || user?.email}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${profile?.seller_type === "dealer" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {profile?.seller_type === "dealer" ? "Dealer" : "Private Seller"}
              </span>
              {profile?.verified_at && <span className="text-success text-xs">✓ Verified</span>}
              {profile?.city && <span>• {profile.city}</span>}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => signOut()}>Sign Out</Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-border mb-6 flex-nowrap">
          <button
            onClick={() => setTab("dashboard")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              tab === "dashboard"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <IconLayoutDashboard size={15} /> Dashboard
          </button>
          <button
            onClick={() => setTab("listings")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              tab === "listings"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <IconCar size={15} /> My Listings ({listings.length})
          </button>
          <button
            onClick={() => setTab("saved")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              tab === "saved"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <IconHeart size={15} /> Saved ({wishlistListings.length})
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              tab === "reviews"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <IconStarFilled size={15} className="text-amber-400" /> Reviews
          </button>
          <button
            onClick={() => setTab("settings")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              tab === "settings"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <IconUser size={15} /> Settings
          </button>
          <button
            onClick={() => setTab("security")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              tab === "security"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <IconShieldLock size={15} /> Security
          </button>
        </div>

        {tab === "dashboard" && (
          <div className="space-y-5">
            {/* Dealer redirect banner */}
            {isDealer && (
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <IconBuildingStore size={22} className="text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">You have a Dealer account</p>
                    <p className="text-xs text-muted-foreground">Access your full dealer portal with inventory and analytics</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => navigate("/dealer-dashboard")} className="shrink-0 gap-1">
                  Dealer Dashboard <IconChevronRight size={14} />
                </Button>
              </div>
            )}

            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-background border border-border rounded-xl p-5">
              <h2 className="text-lg font-bold text-foreground mb-0.5">
                Welcome back, {profile?.display_name?.split(" ")[0] || "there"} 👋
              </h2>
              <p className="text-sm text-muted-foreground">Here's a summary of your Motokah activity</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTab("listings")}
                className="bg-card border border-border hover:border-primary/50 rounded-2xl p-4 text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                  <IconCar size={20} />
                </div>
                <p className="text-2xl font-black text-foreground">{listings.length}</p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">My Listings</p>
              </button>

              <button
                type="button"
                onClick={() => setTab("saved")}
                className="bg-card border border-border hover:border-primary/50 rounded-2xl p-4 text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                  <IconHeart size={20} />
                </div>
                <p className="text-2xl font-black text-foreground">{wishlistIds.size}</p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Saved Cars</p>
              </button>

              <button
                type="button"
                onClick={() => navigate("/messages")}
                className="bg-card border border-border hover:border-primary/50 rounded-2xl p-4 text-center transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                  <IconMessageCircle size={20} />
                </div>
                <p className="text-2xl font-black text-foreground">0</p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Messages</p>
              </button>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button onClick={() => navigate("/sell")} className="gap-2 justify-start h-12 font-bold shadow-xs">
                <IconPlus size={18} /> Post a Vehicle
              </Button>
              <Button variant="outline" onClick={() => setTab("saved")} className="gap-2 justify-start h-12 font-semibold">
                <IconHeart size={18} className="text-destructive" /> My Saved Cars ({wishlistIds.size})
              </Button>
              <Button variant="outline" onClick={() => setTab("settings")} className="gap-2 justify-start h-12 font-semibold">
                <IconLock size={18} className="text-primary" /> Password & Settings
              </Button>
            </div>

            {/* Recent listings */}
            {listings.length > 0 ? (
              <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground text-sm">Recent Vehicle Listings</h3>
                  <button onClick={() => setTab("listings")} className="text-xs text-primary font-semibold hover:underline">
                    View all ({listings.length})
                  </button>
                </div>
                <div className="space-y-2.5">
                  {listings.slice(0, 3).map((l) => (
                    <div key={l.id} className="bg-muted/30 border border-border/80 rounded-xl p-3 flex items-center gap-3 hover:border-primary/40 transition-colors">
                      <Link to={`/listing/${l.id}`} className="shrink-0">
                        <img
                          src={l.image || "/placeholder.svg"}
                          alt={l.title}
                          className="w-14 h-14 rounded-lg object-cover bg-muted border border-border/60"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link to={`/listing/${l.id}`} className="text-sm font-bold text-foreground hover:text-primary truncate block">
                          {l.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                            l.status === "approved" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                            l.status === "pending" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                            l.status === "sold" ? "bg-muted text-muted-foreground" :
                            "bg-destructive/15 text-destructive"
                          }`}>{l.status}</span>
                          <span className="font-extrabold text-foreground">{l.currency} {Number(l.price).toLocaleString()}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-full">
                        <IconEye size={13} /> {l.views || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-card border border-border rounded-2xl p-6 shadow-xs">
                <IconCar size={36} className="mx-auto text-primary/40 mb-3" />
                <p className="font-bold text-foreground mb-1">Ready to sell your vehicle?</p>
                <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
                  Post your listing in under 2 minutes and connect with buyers directly.
                </p>
                <Button onClick={() => navigate("/sell")} className="gap-2 font-bold shadow-sm">
                  <IconPlus size={16} /> Post Your First Listing
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB: MY LISTINGS */}
        {tab === "listings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">My Vehicle Listings</h2>
                <p className="text-xs text-muted-foreground">Manage, view, and track your active vehicle posts</p>
              </div>
              <Button onClick={() => navigate("/sell")} className="gap-1.5 shadow-sm font-bold text-xs sm:text-sm">
                <IconPlus size={16} /> Post New Ad
              </Button>
            </div>

            {listings.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-xs">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <IconCar size={28} />
                </div>
                <h3 className="font-bold text-base text-foreground mb-1">You haven't posted any vehicles yet</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-5">
                  Reach thousands of serious buyers across Tanzania, Kenya, and East Africa with a free listing.
                </p>
                <Button onClick={() => navigate("/sell")} className="gap-2 font-bold shadow-md">
                  <IconPlus size={18} /> Post Your Vehicle in 2 Minutes
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((l) => (
                  <div key={l.id} className="bg-card border border-border rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3.5 sm:gap-4 shadow-xs hover:border-primary/40 transition-all">
                    <div className="relative shrink-0 w-full sm:w-36 h-36 sm:h-28 rounded-xl overflow-hidden bg-muted border border-border">
                      <Link to={`/listing/${l.id}`}>
                        <img
                          src={l.image || "/placeholder.svg"}
                          alt={l.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                        />
                      </Link>
                      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase tracking-wider shadow-xs backdrop-blur-md ${
                        l.status === "approved" ? "bg-emerald-500/90 text-white" :
                        l.status === "pending" ? "bg-amber-500/90 text-white" :
                        l.status === "sold" ? "bg-zinc-700/90 text-white" :
                        "bg-destructive/90 text-white"
                      }`}>
                        {l.status}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/listing/${l.id}`} className="font-extrabold text-foreground hover:text-primary text-base leading-tight truncate">
                            {l.title}
                          </Link>
                          <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-full">
                            <IconEye size={13} /> {l.views || 0} views
                          </span>
                        </div>

                        <p className="text-base font-black text-primary mt-1">
                          {l.currency} {Number(l.price).toLocaleString()}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                          {l.year && <span className="bg-muted px-2 py-0.5 rounded-md font-semibold">{l.year}</span>}
                          {l.mileage ? <span className="bg-muted px-2 py-0.5 rounded-md font-semibold">{l.mileage.toLocaleString()} km</span> : null}
                          {l.location && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <IconMapPin size={12} /> {l.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-3 mt-3 border-t border-border">
                        <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs font-bold rounded-lg">
                          <Link to={`/listing/${l.id}`}>
                            <IconExternalLink size={14} /> View Ad
                          </Link>
                        </Button>
                        {l.status !== "sold" && (
                          <Button variant="outline" size="sm" onClick={() => markSold(l.id)} className="gap-1.5 text-xs font-bold rounded-lg text-emerald-600 hover:text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/10">
                            <IconCheck size={14} /> Mark as Sold
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => deleteListing(l.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 ml-auto rounded-lg" title="Delete listing">
                          <IconTrash size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: SAVED CARS / FAVORITES */}
        {tab === "saved" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Saved Vehicles ({wishlistListings.length})</h2>
                <p className="text-xs text-muted-foreground">Cars you have favorited across the marketplace</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/search")} className="text-xs font-semibold">
                Browse Marketplace
              </Button>
            </div>

            {wishlistListings.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-xs">
                <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
                  <IconHeart size={28} />
                </div>
                <h3 className="font-bold text-base text-foreground mb-1">No saved cars yet</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-5">
                  Tap the heart icon on any vehicle while browsing to save it to your personal favorites here.
                </p>
                <Button onClick={() => navigate("/search")} className="gap-2 font-bold shadow-sm">
                  <IconSearch size={16} /> Explore Vehicles
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {wishlistListings.map((l) => (
                  <div key={l.id} className="bg-card border border-border rounded-xl p-3 flex gap-3 hover:shadow-md transition-shadow relative group">
                    <Link to={`/listing/${l.id}`} className="shrink-0">
                      <img src={l.image} alt={l.title} className="w-24 h-24 rounded-lg object-cover bg-muted" />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <Link to={`/listing/${l.id}`} className="font-bold text-sm text-foreground hover:text-primary truncate block">
                          {l.title}
                        </Link>
                        <p className="text-xs font-extrabold text-primary mt-0.5">
                          {l.currency} {Number(l.price).toLocaleString()}
                        </p>
                        {l.location && (
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1 truncate">
                            <IconMapPin size={12} className="shrink-0" /> {l.location}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Link to={`/listing/${l.id}`} className="text-xs font-bold text-primary hover:underline">
                          View Car &rarr;
                        </Link>
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.preventDefault();
                            await supabase.from("wishlist").delete().eq("user_id", user?.id).eq("listing_id", l.id);
                            setWishlistListings(prev => prev.filter(x => x.id !== l.id));
                            toast({ title: "Removed from favorites" });
                          }}
                          className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                          title="Remove from saved"
                        >
                          <IconHeartFilled size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: REVIEWS */}
        {tab === "reviews" && user && (
          <ReviewsSection
            sellerId={user.id}
            sellerName={profile?.display_name || "you"}
          />
        )}

        {/* TAB: SETTINGS & PASSWORD */}
        {tab === "settings" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-foreground">Personal Information</h2>
                  <p className="text-xs text-muted-foreground">Update your seller profile details</p>
                </div>
                {!editing && (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="font-semibold text-xs">
                    <IconEdit size={14} className="mr-1.5" /> Edit Profile
                  </Button>
                )}
              </div>
              {editing ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Display Name</label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-10 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Mobile / WhatsApp</label>
                    <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+255..." className="h-10 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">City</label>
                    <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} className="h-10 bg-background" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={saveProfile} className="font-semibold">Save Changes</Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm">
                  <div className="p-3 rounded-xl bg-muted/30 border border-border">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase">Email Address</p>
                    <p className="font-medium text-foreground mt-0.5 truncate">{user?.email}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase">Full Name</p>
                    <p className="font-medium text-foreground mt-0.5">{profile?.display_name || "—"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase">Phone Number</p>
                    <p className="font-medium text-foreground mt-0.5">{profile?.phone || "—"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase">Location / City</p>
                    <p className="font-medium text-foreground mt-0.5">{profile?.city || "—"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password Component */}
            <ChangePasswordSection />

            {/* Help & Support */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-foreground mb-3">Help & Support</h3>
              <button
                onClick={() => navigate("/how-it-works")}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <IconHelpCircle size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">How Motokah Works</div>
                  <div className="text-xs text-muted-foreground">Complete buyer and seller guide with FAQs</div>
                </div>
                <IconChevronRight size={18} className="ml-auto text-muted-foreground" />
              </button>
            </div>

            {/* Delete Account */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-destructive mb-1">Delete Account</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Permanently delete your profile, listings, messages, saved vehicles, and account access.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={deletingAccount} className="font-semibold">
                    <IconTrash size={16} className="mr-1.5" /> Delete My Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your Motokah account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes your account and associated marketplace data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deletingAccount ? "Deleting..." : "Permanently delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

        {/* TAB: SECURITY & 2FA */}
        {tab === "security" && (
          <div className="space-y-6">
            <ChangePasswordSection />
            <MfaSection />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
