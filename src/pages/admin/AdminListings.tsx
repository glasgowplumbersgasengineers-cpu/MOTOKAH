import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  IconCheck,
  IconX,
  IconEye,
  IconSearch,
  IconFilter,
  IconCar,
  IconTrash,
  IconExternalLink,
  IconPhone,
  IconBrandWhatsapp,
  IconLayoutGrid,
  IconList,
  IconSparkles,
  IconClock,
  IconVideo,
  IconMapPin,
  IconUser,
  IconAlertCircle,
  IconArrowLeft,
  IconRefresh,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createNotification } from "@/lib/notifications";
import { sendEmail, listingApprovedEmail, listingRejectedEmail } from "@/lib/sendEmail";
import { mockListings } from "@/data/mockData";

export interface AdminListingItem {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  status: "pending" | "approved" | "rejected" | "sold";
  city: string | null;
  created_at: string;
  views: number;
  seller_id: string;
  mileage?: number | null;
  transmission?: string | null;
  fuel_type?: string | null;
  condition?: string | null;
  description?: string | null;
  video_url?: string | null;
  image?: string;
  images?: string[];
  seller?: {
    display_name?: string | null;
    phone?: string | null;
    seller_type?: string | null;
    city?: string | null;
  };
}

const COMMON_REJECT_REASONS = [
  "Incomplete or blurry photos — please provide clear exterior & interior photos.",
  "Vehicle price seems unrealistic or inconsistent with the current market value.",
  "Missing contact details or phone number could not be verified.",
  "Duplicate listing of a vehicle already active on Motokah.",
  "Inappropriate or promotional description text.",
];

export default function AdminListings() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"pending" | "approved" | "rejected" | "sold" | "all">("pending");
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal states
  const [inspectListing, setInspectListing] = useState<AdminListingItem | null>(null);
  const [rejectingListing, setRejectingListing] = useState<AdminListingItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch listings
  const { data: rawListings = [], isLoading, refetch } = useQuery<AdminListingItem[]>({
    queryKey: ["admin-listings-detailed"],
    queryFn: async () => {
      // 1. Fetch from Supabase
      const { data, error } = await supabase
        .from("listings")
        .select(`
          id, title, make, model, year, price, currency, status, city, created_at, views, seller_id,
          mileage, transmission, fuel_type, condition, description, video_url
        `)
        .order("created_at", { ascending: false })
        .limit(300);

      let items: AdminListingItem[] = [];

      if (!error && data && data.length > 0) {
        // Fetch listing images
        const listingIds = data.map((x) => x.id);
        const { data: imgRows } = await supabase
          .from("listing_images")
          .select("listing_id, image_url, display_order")
          .in("listing_id", listingIds)
          .order("display_order", { ascending: true });

        const imgMap: Record<string, string[]> = {};
        (imgRows || []).forEach((img) => {
          if (!imgMap[img.listing_id]) imgMap[img.listing_id] = [];
          imgMap[img.listing_id].push(img.image_url);
        });

        // Fetch seller profiles
        const sellerIds = Array.from(new Set(data.map((x) => x.seller_id).filter(Boolean)));
        const { data: profileRows } = await supabase
          .from("profiles")
          .select("user_id, display_name, phone, seller_type, city")
          .in("user_id", sellerIds);

        const profileMap: Record<string, any> = {};
        (profileRows || []).forEach((p) => {
          profileMap[p.user_id] = p;
        });

        items = data.map((l: any) => ({
          ...l,
          image: imgMap[l.id]?.[0] || undefined,
          images: imgMap[l.id] || [],
          seller: profileMap[l.seller_id] || undefined,
        }));
      }

      // If database has very few or no listings (demo mode), supplement with mock listings
      if (items.length < 5) {
        const seededMocks: AdminListingItem[] = mockListings.slice(0, 15).map((m, idx) => {
          // distribute status for testing moderation
          const mockStatus: "pending" | "approved" | "rejected" | "sold" =
            idx < 4 ? "pending" : idx < 11 ? "approved" : idx < 13 ? "rejected" : "sold";
          return {
            id: m.id,
            title: m.title,
            make: m.make,
            model: m.model,
            year: m.year,
            price: m.price,
            currency: m.currency,
            status: mockStatus,
            city: m.location ? m.location.split(",")[0].trim() : "Dar es Salaam",
            created_at: new Date(Date.now() - idx * 3600000 * 8).toISOString(),
            views: m.views || 45,
            seller_id: `seller-${idx}`,
            mileage: m.mileage,
            transmission: m.transmission,
            fuel_type: m.fuel,
            condition: "Used",
            description: m.description,
            image: m.image,
            images: m.images || [m.image],
            seller: {
              display_name: m.dealer || `Verified Seller ${idx + 1}`,
              phone: m.phone || "+255 712 345 678",
              seller_type: m.dealer ? "dealer" : "private",
              city: m.location || "Dar es Salaam, TZ",
            },
          };
        });

        // Combine DB items with seeded mocks (avoid duplicate IDs)
        const dbIds = new Set(items.map((x) => x.id));
        const filteredMocks = seededMocks.filter((x) => !dbIds.has(x.id));
        items = [...items, ...filteredMocks];
      }

      return items;
    },
  });

  // Status update mutation
  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
      sellerId,
      title,
      customReason,
    }: {
      id: string;
      status: "approved" | "rejected" | "sold" | "pending";
      sellerId: string;
      title: string;
      customReason?: string;
    }) => {
      // If DB has the listing, update it
      await supabase.from("listings").update({ status }).eq("id", id);

      const approved = status === "approved";
      if (status === "approved" || status === "rejected") {
        if (sellerId && !sellerId.startsWith("seller-")) {
          await createNotification(
            sellerId,
            approved ? "listing_approved" : "listing_rejected",
            approved ? "Listing approved!" : "Listing rejected",
            approved
              ? `Your listing "${title}" has been approved and is now live on Motokah.`
              : `Your listing "${title}" was not approved. Reason: ${customReason || "Please review guidelines and resubmit."}`
          );
          await sendEmail({
            toUserId: sellerId,
            subject: approved ? `Your vehicle listing "${title}" is now LIVE! 🎉` : `Update on your listing "${title}"`,
            html: approved ? listingApprovedEmail(title) : listingRejectedEmail(title),
          });
        }
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-listings-detailed"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(
        vars.status === "approved"
          ? `Listing approved & published live! 🚀`
          : vars.status === "rejected"
          ? `Listing marked as rejected`
          : `Listing status updated to ${vars.status}`
      );
    },
    onError: (err: any) => {
      toast.error(`Failed to update status: ${err?.message || "Unknown error"}`);
    },
  });

  // Bulk status update
  const handleBulkUpdate = async (newStatus: "approved" | "rejected") => {
    if (selectedIds.size === 0) return;
    const targetIds = Array.from(selectedIds);
    try {
      await supabase.from("listings").update({ status: newStatus }).in("id", targetIds);
      toast.success(`${targetIds.length} listings marked as ${newStatus}!`);
      setSelectedIds(new Set());
      refetch();
    } catch {
      toast.error("Failed to update selected listings");
    }
  };

  // Delete listing
  const handleDelete = async (id: string) => {
    try {
      await supabase.from("listings").delete().eq("id", id);
      toast.success("Listing deleted permanently");
      setDeletingId(null);
      refetch();
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return rawListings.filter((item) => {
      // Tab filter
      if (tab !== "all" && item.status !== tab) return false;

      // City filter
      if (selectedCity !== "all" && item.city && !item.city.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchMake = item.make.toLowerCase().includes(q);
        const matchModel = item.model.toLowerCase().includes(q);
        const matchCity = item.city?.toLowerCase().includes(q);
        const matchSeller = item.seller?.display_name?.toLowerCase().includes(q);
        const matchPhone = item.seller?.phone?.includes(q);
        if (!matchTitle && !matchMake && !matchModel && !matchCity && !matchSeller && !matchPhone) {
          return false;
        }
      }

      return true;
    });
  }, [rawListings, tab, selectedCity, search]);

  // Tab counts
  const counts = useMemo(() => {
    const p = rawListings.filter((x) => x.status === "pending").length;
    const a = rawListings.filter((x) => x.status === "approved").length;
    const r = rawListings.filter((x) => x.status === "rejected").length;
    const s = rawListings.filter((x) => x.status === "sold").length;
    return { pending: p, approved: a, rejected: r, sold: s, all: rawListings.length };
  }, [rawListings]);

  // Cities list
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    rawListings.forEach((x) => {
      if (x.city) set.add(x.city.trim());
    });
    return Array.from(set).sort();
  }, [rawListings]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFiltered = () => {
    if (selectedIds.size === filteredListings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredListings.map((x) => x.id)));
    }
  };

  const statusBadge = (st: string) => {
    switch (st) {
      case "approved":
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold uppercase text-[10px]">Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold uppercase text-[10px] animate-pulse">Pending Review</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/15 text-destructive border-destructive/30 font-bold uppercase text-[10px]">Rejected</Badge>;
      case "sold":
        return <Badge className="bg-muted text-muted-foreground border-border font-bold uppercase text-[10px]">Sold</Badge>;
      default:
        return <Badge variant="outline">{st}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-foreground">Listing Moderation & Approval</h1>
            {counts.pending > 0 && (
              <span className="bg-amber-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-2xs">
                {counts.pending} Awaiting Review
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Review user-submitted vehicle ads, inspect photos and details, and approve or reject with direct seller feedback.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5 font-semibold text-xs">
            <IconRefresh size={14} /> Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => {
              // Quick create demo pending ad
              const randomNum = Math.floor(Math.random() * 900) + 100;
              const newMock: AdminListingItem = {
                id: `demo-pending-${Date.now()}`,
                title: `2018 Toyota Alphard Executive Lounge #${randomNum}`,
                make: "Toyota",
                model: "Alphard",
                year: 2018,
                price: 45000000,
                currency: "TZS",
                status: "pending",
                city: "Dar es Salaam",
                created_at: new Date().toISOString(),
                views: 0,
                seller_id: "demo-user",
                mileage: 38000,
                transmission: "Automatic",
                fuel_type: "Petrol",
                condition: "Used",
                description: "Executive luxury minivan with captain seats, dual sunroof, reverse camera, push start, mint condition.",
                image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800",
                images: [
                  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800",
                  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
                ],
                seller: {
                  display_name: "Hamza Motors",
                  phone: "+255 754 999 111",
                  seller_type: "dealer",
                  city: "Dar es Salaam, TZ",
                },
              };
              qc.setQueryData(["admin-listings-detailed"], (old: AdminListingItem[] = []) => [newMock, ...old]);
              toast.success("Test pending listing created! Ready for approval review.");
              setTab("pending");
            }}
            className="gap-1.5 font-bold text-xs bg-primary text-primary-foreground shadow-xs"
          >
            <IconSparkles size={14} /> Add Test Ad for Review
          </Button>
        </div>
      </div>

      {/* Tab Navigation & Filters */}
      <div className="space-y-4">
        {/* Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setTab("pending")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              tab === "pending"
                ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <IconClock size={16} /> Pending Review ({counts.pending})
          </button>
          <button
            onClick={() => setTab("approved")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              tab === "approved"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <IconCheck size={16} /> Live & Approved ({counts.approved})
          </button>
          <button
            onClick={() => setTab("rejected")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              tab === "rejected"
                ? "bg-destructive text-destructive-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <IconX size={16} /> Rejected ({counts.rejected})
          </button>
          <button
            onClick={() => setTab("sold")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              tab === "sold"
                ? "bg-zinc-700 text-white shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Sold ({counts.sold})
          </button>
          <button
            onClick={() => setTab("all")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
              tab === "all"
                ? "bg-foreground text-background shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            All Listings ({counts.all})
          </button>
        </div>

        {/* Search, Filter & View Controls */}
        <div className="bg-card border border-border rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="relative w-full md:w-80">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, seller, phone..."
              className="pl-9 h-9 text-xs bg-background"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {/* City dropdown */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-9 px-3 text-xs bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Locations</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* View switcher */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 transition-colors ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                title="Card View"
              >
                <IconLayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 transition-colors ${viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                title="Table View"
              >
                <IconList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-center justify-between gap-3 animate-in fade-in duration-150">
            <span className="text-xs font-bold text-primary">
              {selectedIds.size} listings selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => handleBulkUpdate("approved")} className="gap-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                <IconCheck size={14} /> Approve Selected
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkUpdate("rejected")} className="gap-1 text-xs font-bold">
                <IconX size={14} /> Reject Selected
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedIds(new Set())} className="text-xs">
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Loading vehicle listings for moderation...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
          <IconCar size={40} className="mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="font-bold text-base text-foreground mb-1">No listings found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
            {tab === "pending"
              ? "All caught up! There are currently no listings pending review."
              : `No listings match your filter criteria.`}
          </p>
          {tab !== "all" && (
            <Button variant="outline" size="sm" onClick={() => setTab("all")} className="text-xs font-semibold">
              View All Listings
            </Button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((l) => (
            <div
              key={l.id}
              className={`bg-card border rounded-2xl overflow-hidden shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between ${
                selectedIds.has(l.id) ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              <div>
                {/* Photo & Badge Banner */}
                <div className="relative aspect-[16/10] bg-muted overflow-hidden group">
                  <img
                    src={l.image || "/placeholder.svg"}
                    alt={l.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {statusBadge(l.status)}
                    {l.images && l.images.length > 1 && (
                      <span className="bg-black/60 text-white font-bold text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                        📷 {l.images.length} photos
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(l.id)}
                      onChange={() => toggleSelect(l.id)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                  </div>

                  {l.video_url && (
                    <span className="absolute bottom-2.5 left-2.5 bg-black/70 text-white font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
                      <IconVideo size={12} /> Video walkaround
                    </span>
                  )}
                </div>

                {/* Listing Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-foreground text-sm line-clamp-1 hover:text-primary transition-colors cursor-pointer" onClick={() => setInspectListing(l)}>
                      {l.title}
                    </h3>
                    <p className="text-base font-black text-primary mt-0.5">
                      {l.currency} {Number(l.price).toLocaleString()}
                    </p>
                  </div>

                  {/* Specs Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                    {l.year && <span className="bg-muted px-2 py-0.5 rounded-md font-semibold">{l.year}</span>}
                    {l.mileage ? <span className="bg-muted px-2 py-0.5 rounded-md font-semibold">{l.mileage.toLocaleString()} km</span> : null}
                    {l.transmission && <span className="bg-muted px-2 py-0.5 rounded-md font-semibold">{l.transmission}</span>}
                    {l.city && (
                      <span className="bg-muted px-2 py-0.5 rounded-md font-semibold flex items-center gap-0.5">
                        <IconMapPin size={11} /> {l.city}
                      </span>
                    )}
                  </div>

                  {/* Seller Info Card */}
                  <div className="bg-muted/40 border border-border/80 rounded-xl p-2.5 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1">
                        <IconUser size={13} className="text-primary" /> {l.seller?.display_name || "Motokah Seller"}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground bg-background px-1.5 py-0.2 rounded border border-border">
                        {l.seller?.seller_type || "Private"}
                      </span>
                    </div>
                    {l.seller?.phone && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-muted-foreground font-mono text-[11px]">{l.seller.phone}</span>
                        <a
                          href={`https://wa.me/${l.seller.phone.replace(/[^0-9]/g, "")}?text=Hi,%20regarding%20your%20Motokah%20listing:%20${encodeURIComponent(l.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                        >
                          <IconBrandWhatsapp size={13} /> WhatsApp
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span>Posted {format(new Date(l.created_at), "MMM d, yyyy")}</span>
                    <span className="flex items-center gap-1"><IconEye size={12} /> {l.views} views</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="p-4 pt-0 border-t border-border mt-2 pt-3 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInspectListing(l)}
                  className="flex-1 font-semibold text-xs h-8"
                >
                  <IconEye size={14} className="mr-1" /> Inspect
                </Button>

                {l.status !== "approved" && (
                  <Button
                    size="sm"
                    onClick={() =>
                      updateStatus.mutate({
                        id: l.id,
                        status: "approved",
                        sellerId: l.seller_id,
                        title: l.title,
                      })
                    }
                    className="flex-1 font-bold text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  >
                    <IconCheck size={14} className="mr-1" /> Approve
                  </Button>
                )}

                {l.status !== "rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRejectingListing(l);
                      setRejectReason(COMMON_REJECT_REASONS[0]);
                    }}
                    className="flex-1 font-bold text-xs h-8 text-destructive hover:bg-destructive/10 border-destructive/30"
                  >
                    <IconX size={14} className="mr-1" /> Reject
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingId(l.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 h-8"
                  title="Delete Listing"
                >
                  <IconTrash size={15} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredListings.length && filteredListings.length > 0}
                    onChange={selectAllFiltered}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                </TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((l) => (
                <TableRow key={l.id} className="hover:bg-muted/30">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(l.id)}
                      onChange={() => toggleSelect(l.id)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={l.image || "/placeholder.svg"}
                        alt={l.title}
                        className="w-12 h-10 rounded-lg object-cover bg-muted shrink-0 border border-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      <div className="min-w-0 max-w-[220px]">
                        <p className="font-bold text-foreground text-xs truncate hover:text-primary cursor-pointer" onClick={() => setInspectListing(l)}>
                          {l.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {l.year} &bull; {l.transmission || "Automatic"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-foreground text-xs">
                      {l.currency} {Number(l.price).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-xs text-foreground">{l.seller?.display_name || "—"}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{l.seller?.phone || "—"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.city || "—"}</TableCell>
                  <TableCell>{statusBadge(l.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(new Date(l.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => setInspectListing(l)} className="h-7 text-xs font-semibold px-2">
                        Inspect
                      </Button>
                      {l.status !== "approved" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus.mutate({
                              id: l.id,
                              status: "approved",
                              sellerId: l.seller_id,
                              title: l.title,
                            })
                          }
                          className="h-7 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5"
                        >
                          Approve
                        </Button>
                      )}
                      {l.status !== "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRejectingListing(l);
                            setRejectReason(COMMON_REJECT_REASONS[0]);
                          }}
                          className="h-7 text-xs font-bold text-destructive hover:bg-destructive/10 border-destructive/30 px-2.5"
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* INSPECT MODAL (Full Vehicle Details & Photos) */}
      <Dialog open={!!inspectListing} onOpenChange={(open) => !open && setInspectListing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {inspectListing && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  {statusBadge(inspectListing.status)}
                  <span className="text-xs text-muted-foreground">ID: {inspectListing.id}</span>
                </div>
                <DialogTitle className="text-lg sm:text-xl font-black text-foreground">
                  {inspectListing.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Submitted on {format(new Date(inspectListing.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Photo Gallery Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Photos ({inspectListing.images?.length || 1})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(inspectListing.images && inspectListing.images.length > 0
                      ? inspectListing.images
                      : [inspectListing.image || "/placeholder.svg"]
                    ).map((imgUrl, i) => (
                      <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border">
                        <img
                          src={imgUrl}
                          alt={`Vehicle photo ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Walkaround if present */}
                {inspectListing.video_url && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <IconVideo size={14} /> Video Walkaround
                    </h4>
                    <video
                      src={inspectListing.video_url}
                      controls
                      className="w-full max-h-60 rounded-xl bg-black object-contain"
                    />
                  </div>
                )}

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/40 p-3 rounded-xl border border-border text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Price</span>
                    <span className="font-black text-primary text-sm">
                      {inspectListing.currency} {Number(inspectListing.price).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Year</span>
                    <span className="font-bold text-foreground">{inspectListing.year}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Mileage</span>
                    <span className="font-bold text-foreground">
                      {inspectListing.mileage ? `${inspectListing.mileage.toLocaleString()} km` : "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Transmission</span>
                    <span className="font-bold text-foreground">{inspectListing.transmission || "Automatic"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Fuel Type</span>
                    <span className="font-bold text-foreground">{inspectListing.fuel_type || "Petrol"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Condition</span>
                    <span className="font-bold text-foreground">{inspectListing.condition || "Used"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Location</span>
                    <span className="font-bold text-foreground">{inspectListing.city || "East Africa"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Views</span>
                    <span className="font-bold text-foreground">{inspectListing.views}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Description</h4>
                  <div className="bg-background border border-border rounded-xl p-3 text-xs text-foreground whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
                    {inspectListing.description || "No description provided."}
                  </div>
                </div>

                {/* Seller Contact Card */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Seller: {inspectListing.seller?.display_name || "Motokah Member"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {inspectListing.seller?.phone || "No phone registered"} &bull; {inspectListing.seller?.seller_type || "Private"}
                    </p>
                  </div>
                  {inspectListing.seller?.phone && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild className="h-8 text-xs font-bold gap-1 text-emerald-600 border-emerald-500/30">
                        <a
                          href={`https://wa.me/${inspectListing.seller.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <IconBrandWhatsapp size={14} /> WhatsApp
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild className="h-8 text-xs font-bold gap-1">
                        <a href={`tel:${inspectListing.seller.phone}`}>
                          <IconPhone size={14} /> Call
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setInspectListing(null)}
                  className="w-full sm:w-auto text-xs"
                >
                  Close
                </Button>
                {inspectListing.status !== "approved" && (
                  <Button
                    onClick={() => {
                      updateStatus.mutate({
                        id: inspectListing.id,
                        status: "approved",
                        sellerId: inspectListing.seller_id,
                        title: inspectListing.title,
                      });
                      setInspectListing(null);
                    }}
                    className="w-full sm:w-auto text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                  >
                    <IconCheck size={14} /> Approve & Publish Live
                  </Button>
                )}
                {inspectListing.status !== "rejected" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setRejectingListing(inspectListing);
                      setInspectListing(null);
                      setRejectReason(COMMON_REJECT_REASONS[0]);
                    }}
                    className="w-full sm:w-auto text-xs font-bold gap-1"
                  >
                    <IconX size={14} /> Reject Listing
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* REJECT WITH REASON DIALOG */}
      <Dialog open={!!rejectingListing} onOpenChange={(open) => !open && setRejectingListing(null)}>
        <DialogContent className="max-w-md">
          {rejectingListing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
                  <IconAlertCircle size={18} /> Reject Listing
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Select a reason for rejecting "{rejectingListing.title}". The seller will receive this explanation via email and notification.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Common Reasons</label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {COMMON_REJECT_REASONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRejectReason(r)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors ${
                          rejectReason === r
                            ? "bg-destructive/10 border-destructive/50 text-foreground font-semibold"
                            : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Custom Message to Seller</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    className="w-full text-xs p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-destructive"
                    placeholder="Provide specific instructions so the seller can fix and resubmit..."
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" size="sm" onClick={() => setRejectingListing(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    updateStatus.mutate({
                      id: rejectingListing.id,
                      status: "rejected",
                      sellerId: rejectingListing.seller_id,
                      title: rejectingListing.title,
                      customReason: rejectReason,
                    });
                    setRejectingListing(null);
                  }}
                  className="font-bold gap-1"
                >
                  <IconX size={14} /> Confirm Rejection
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The vehicle post and its associated images will be permanently removed from Motokah.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
