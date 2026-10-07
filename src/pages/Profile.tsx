import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { IconUser, IconEdit, IconTrash, IconEye, IconCheck, IconCamera, IconShieldLock, IconQrcode, IconBookmark, IconAlertTriangle, IconRefresh, IconLayoutDashboard, IconCar, IconHeart, IconMessageCircle, IconChevronRight, IconBuildingStore, IconHelpCircle } from "@tabler/icons-react";
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
      .select("id, title, make, model, year, price, currency, status, created_at, views")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setListings(data as ListingRow[]);
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
        <div className="flex flex-wrap border-b border-border mb-6 gap-0">
          <button onClick={() => setTab("dashboard")} className={`px-4 pb-3 text-sm font-semibold flex items-center gap-1 ${tab === "dashboard" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
            <IconLayoutDashboard size={14} /> Dashboard
          </button>
          <button onClick={() => setTab("listings")} className={`px-4 pb-3 text-sm font-semibold ${tab === "listings" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
            My Listings ({listings.length})
          </button>
          <button onClick={() => setTab("saved")} className={`px-4 pb-3 text-sm font-semibold flex items-center gap-1 ${tab === "saved" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
            <IconHeart size={14} /> Saved Cars {wishlistListings.length > 0 && `(${wishlistListings.length})`}
          </button>
          <button onClick={() => setTab("reviews")} className={`px-4 pb-3 text-sm font-semibold ${tab === "reviews" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
            Reviews
          </button>
          <button onClick={() => setTab("settings")} className={`px-4 pb-3 text-sm font-semibold ${tab === "settings" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
            Settings
          </button>
          <button onClick={() => setTab("security")} className={`px-4 pb-3 text-sm font-semibold ${tab === "security" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
            <span className="flex items-center gap-1"><IconShieldLock size={14} /> Security</span>
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <IconCar size={22} className="mx-auto text-primary mb-1" />
                <p className="text-2xl font-extrabold text-foreground">{listings.filter(l => l.status === "approved").length}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Active Listings</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <IconHeart size={22} className="mx-auto text-destructive mb-1" />
                <p className="text-2xl font-extrabold text-foreground">{wishlistIds.size}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Wishlisted</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <IconMessageCircle size={22} className="mx-auto text-accent mb-1" />
                <p className="text-2xl font-extrabold text-foreground">—</p>
                <p className="text-xs text-muted-foreground mt-0.5">Messages</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button onClick={() => navigate("/sell")} className="gap-2 justify-start h-12">
                <IconCar size={18} /> Post New Ad
              </Button>
              <Button variant="outline" onClick={() => navigate("/search")} className="gap-2 justify-start h-12">
                <IconLayoutDashboard size={18} /> Browse Cars
              </Button>
              <Button variant="outline" onClick={() => navigate("/wishlist")} className="gap-2 justify-start h-12">
                <IconHeart size={18} /> My Wishlist
              </Button>
            </div>

            {/* Recent listings */}
            {listings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-sm">Recent Listings</h3>
                  <button onClick={() => setTab("listings")} className="text-xs text-primary hover:underline">View all</button>
                </div>
                <div className="space-y-2">
                  {listings.slice(0, 3).map(l => (
                    <div key={l.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link to={`/listing/${l.id}`} className="text-sm font-medium text-foreground hover:text-primary truncate block">{l.title}</Link>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          l.status === "approved" ? "bg-success/20 text-success" :
                          l.status === "pending" ? "bg-accent/20 text-accent" :
                          l.status === "sold" ? "bg-muted text-muted-foreground" :
                          "bg-destructive/20 text-destructive"
                        }`}>{l.status}</span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-0.5">
                        <IconEye size={12} /> {l.views}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {listings.length === 0 && (
              <div className="text-center py-8 bg-card border border-border rounded-xl">
                <IconCar size={36} className="mx-auto text-muted-foreground mb-3 opacity-40" />
                <p className="font-semibold text-foreground mb-1">Ready to sell your car?</p>
                <p className="text-sm text-muted-foreground mb-4">Post your first listing in minutes</p>
                <Button onClick={() => navigate("/sell")}>Post Your First Ad</Button>
              </div>
            )}
          </div>
        )}

        {tab === "listings" && (
          <div className="space-y-3">
            {listings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">You haven't posted any listings yet.</p>
                <Link to="/sell"><Button>Post Your First Ad</Button></Link>
              </div>
            ) : (
              listings.map((l) => {
                const daysLeft = null;
                const isExpiringSoon = false;
                const isExpired = false;
                return (
                  <div key={l.id} className={`bg-card border rounded-lg p-4 flex items-center justify-between ${isExpired ? "border-destructive/50" : isExpiringSoon ? "border-accent/50" : "border-border"}`}>
                    <div>
                      <Link to={`/listing/${l.id}`} className="font-semibold text-foreground hover:text-primary text-sm">{l.title}</Link>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${statusColors[l.status] || ""}`}>{l.status}</span>
                        <span>{l.currency} {l.price.toLocaleString()}</span>
                        <span className="flex items-center gap-0.5"><IconEye size={12} /> {l.views}</span>
                        {isExpired && (
                          <span className="flex items-center gap-0.5 text-destructive font-semibold">
                            <IconAlertTriangle size={12} /> Expired
                          </span>
                        )}
                        {isExpiringSoon && (
                          <span className="flex items-center gap-0.5 text-accent font-semibold">
                            <IconAlertTriangle size={12} /> Expires in {daysLeft}d
                          </span>
                        )}
                        {!isExpired && !isExpiringSoon && daysLeft !== null && (
                          <span className="text-muted-foreground/70">Expires in {daysLeft}d</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {(isExpired || isExpiringSoon) && (
                        <Button variant="ghost" size="icon" onClick={() => renewListing(l.id)} title="Renew for 60 days">
                          <IconRefresh size={16} className="text-primary" />
                        </Button>
                      )}
                      {l.status !== "sold" && (
                        <Button variant="ghost" size="icon" onClick={() => markSold(l.id)} title="Mark as sold">
                          <IconCheck size={16} className="text-success" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => deleteListing(l.id)} title="Delete">
                        <IconTrash size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === "saved" && (
          <div className="space-y-3">
            {wishlistListings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <IconHeart size={36} className="mx-auto mb-3 opacity-30" />
                <p className="mb-2">No saved cars yet.</p>
                <p className="text-xs">Tap the heart icon on any listing to save it here.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/search")}>Browse Cars</Button>
              </div>
            ) : (
              wishlistListings.map((l) => (
                <Link key={l.id} to={`/listing/${l.id}`}>
                  <div className="bg-card border border-border rounded-lg p-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                    <img src={l.image} alt={l.title} className="w-16 h-16 rounded-lg object-cover shrink-0 bg-muted" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{l.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{l.year} · {l.currency} {l.price.toLocaleString()}</p>
                      {l.location && <p className="text-xs text-muted-foreground">{l.location}</p>}
                    </div>
                    <IconChevronRight size={16} className="text-muted-foreground shrink-0" />
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {tab === "reviews" && user && (
          <ReviewsSection
            sellerId={user.id}
            sellerName={profile?.display_name || "you"}
          />
        )}

        {tab === "settings" && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Profile Settings</h2>
              {!editing && <Button variant="outline" size="sm" onClick={() => setEditing(true)}><IconEdit size={14} className="mr-1" /> Edit</Button>}
            </div>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Display Name</label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+255..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">City</label>
                  <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveProfile}>Save</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
               <div className="space-y-2 text-sm">
                 <p><span className="font-semibold text-foreground">Email:</span> <span className="text-muted-foreground">{user?.email}</span></p>
                 <p><span className="font-semibold text-foreground">Name:</span> <span className="text-muted-foreground">{profile?.display_name || "—"}</span></p>
                 <p><span className="font-semibold text-foreground">Phone:</span> <span className="text-muted-foreground">{profile?.phone || "—"}</span></p>
                 <p><span className="font-semibold text-foreground">City:</span> <span className="text-muted-foreground">{profile?.city || "—"}</span></p>
               </div>
              )}
              
              {/* Help & Support */}
              <div className="border-t border-border pt-4 mt-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Help & Support</h3>
                <button
                  onClick={() => setShowHelp(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-muted/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconHelpCircle size={20} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">How to Use Motokah</div>
                    <div className="text-xs text-muted-foreground">Learn how to search, post, and use all features</div>
                  </div>
                  <IconChevronRight size={18} className="ml-auto text-muted-foreground" />
                </button>
              </div>

               <div className="border-t border-border pt-4 mt-4">
                 <h3 className="text-sm font-semibold text-destructive mb-1">Delete account</h3>
                 <p className="text-xs text-muted-foreground mb-3">
                   Permanently delete your profile, listings, messages, saved items, and account access.
                 </p>
                 <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <Button variant="destructive" disabled={deletingAccount} className="scroll-mb-28">
                       <IconTrash size={16} className="mr-2" /> Delete my account
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

        {tab === "security" && <MfaSection />}
      </div>
      <Footer />
      <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} lang={lang} />
    </div>
  );
}
