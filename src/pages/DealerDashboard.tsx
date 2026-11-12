import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  IconBuildingStore, IconShieldCheck, IconCar, IconEye, IconClock,
  IconCheck, IconTrash, IconExternalLink, IconPlus, IconChartBar,
  IconStarFilled, IconMapPin, IconPhone, IconAlertCircle,
} from "@tabler/icons-react";
import { mockDealers } from "@/data/mockData";
import type { Listing } from "@/data/mockData";

type DealerListing = {
  id: string;
  title: string;
  price: number;
  currency: string;
  status: string;
  views: number;
  created_at: string;
  make: string;
  model: string;
  year: number;
};

const statusColors: Record<string, string> = {
  approved: "bg-success/20 text-success border-success/30",
  pending:  "bg-accent/20 text-accent border-accent/30",
  sold:     "bg-muted text-muted-foreground border-border",
  rejected: "bg-destructive/20 text-destructive border-destructive/30",
};

export default function DealerDashboard() {
  usePageTitle("Dealer Dashboard — Motokah");
  const { user, profile, isDealer } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<DealerListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Gate: non-dealers redirected to profile
  useEffect(() => {
    if (!isDealer && profile !== null) navigate("/profile", { replace: true });
  }, [isDealer, profile, navigate]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, price, currency, status, views, created_at, make, model, year")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      setListings(!error && data ? (data as DealerListing[]) : []);
      setLoading(false);
    })();
  }, [user, profile]);

  const mockDealer = mockDealers.find(d => d.display_name === profile?.display_name);

  const totalViews  = listings.reduce((s, l) => s + (l.views || 0), 0);
  const active      = listings.filter(l => l.status === "approved").length;
  const pending     = listings.filter(l => l.status === "pending").length;
  const sold        = listings.filter(l => l.status === "sold").length;
  const rating      = mockDealer?.rating ?? 4.5;

  // Chart data: top 5 listings by views
  const chartData = [...listings]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6)
    .map(l => ({ name: `${l.make} ${l.model}`.slice(0, 12), views: l.views || 0 }));

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Header section */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-background border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-2xl font-black text-primary">
                {(profile?.display_name || "D")[0]}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-extrabold text-foreground">{profile?.display_name || "My Dealership"}</h1>
                {profile?.verified_at && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                    <IconShieldCheck size={12} /> Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {profile?.city && <span className="flex items-center gap-1"><IconMapPin size={13} />{profile.city}</span>}
                {profile?.phone && <span className="flex items-center gap-1"><IconPhone size={13} />{profile.phone}</span>}
                <span className="flex items-center gap-1"><IconStarFilled size={13} className="text-accent" />{rating.toFixed(1)} rating</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5" asChild>
                <Link to={`/dealer/${user?.id}`}><IconExternalLink size={14} /> Public Profile</Link>
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => navigate("/sell")}>
                <IconPlus size={14} /> Post Ad
              </Button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Listings", value: listings.length, icon: IconCar, color: "text-primary" },
            { label: "Total Views",    value: totalViews.toLocaleString(), icon: IconEye, color: "text-accent" },
            { label: "Active",         value: active, icon: IconCheck, color: "text-success" },
            { label: "Pending",        value: pending, icon: IconClock, color: "text-orange-500" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4">
              <s.icon size={20} className={`${s.color} mb-2`} />
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Performance chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <IconChartBar size={18} className="text-primary" />
              <h2 className="font-bold text-foreground">Top Listings by Views</h2>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-bold text-foreground mb-4">Quick Links</h2>
            <div className="space-y-2">
              {!profile?.verified_at && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm">
                  <IconAlertCircle size={16} className="text-accent shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Get Verified</p>
                    <p className="text-xs text-muted-foreground">Build buyer trust</p>
                  </div>
                </div>
              )}
              <Button variant="outline" className="w-full justify-start gap-2 text-sm" onClick={() => navigate("/sell")}>
                <IconPlus size={15} /> Post New Listing
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-sm" asChild>
                <Link to={`/dealer/${user?.id}`}><IconBuildingStore size={15} /> View Public Profile</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-sm" onClick={() => navigate("/messages")}>
                <IconCar size={15} /> Customer Inquiries
              </Button>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sold this month</span>
                  <span className="font-bold text-foreground">{sold}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Avg. rating</span>
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <IconStarFilled size={12} className="text-accent" /> {rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-bold text-foreground">My Inventory</h2>
            <Button size="sm" onClick={() => navigate("/sell")} className="gap-1.5">
              <IconPlus size={14} /> Add Listing
            </Button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading inventory...</div>
          ) : listings.length === 0 ? (
            <div className="p-12 text-center">
              <IconCar size={40} className="mx-auto text-muted-foreground mb-3 opacity-40" />
              <p className="font-semibold text-foreground mb-1">No listings yet</p>
              <p className="text-sm text-muted-foreground mb-4">Start selling by posting your first vehicle</p>
              <Button onClick={() => navigate("/sell")}>Post First Listing</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Vehicle</th>
                    <th className="text-left px-3 py-3">Price</th>
                    <th className="text-left px-3 py-3">Status</th>
                    <th className="text-left px-3 py-3">Views</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(l => (
                    <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <Link to={`/listing/${l.id}`} className="font-medium text-foreground hover:text-primary line-clamp-1">
                          {l.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">{l.year} · {l.make}</p>
                      </td>
                      <td className="px-3 py-3 font-semibold text-foreground whitespace-nowrap">
                        {l.currency} {Number(l.price).toLocaleString()}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${statusColors[l.status] || statusColors.pending}`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        <span className="flex items-center gap-1"><IconEye size={13} /> {l.views || 0}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <Link to={`/listing/${l.id}`}><IconExternalLink size={14} /></Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={async () => {
                              await supabase.from("listings").delete().eq("id", l.id);
                              setListings(prev => prev.filter(x => x.id !== l.id));
                            }}
                          >
                            <IconTrash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
