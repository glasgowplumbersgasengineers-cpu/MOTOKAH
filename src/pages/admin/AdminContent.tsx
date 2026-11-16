import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  IconCheck,
  IconX,
  IconSend,
  IconCalendarEvent,
  IconClock,
  IconEye,
  IconTrash,
} from "@/components/icons";

type Status = "draft" | "pending" | "approved" | "published" | "rejected";

interface ContentPost {
  id: string;
  title: string;
  caption: string | null;
  caption_sw: string | null;
  platform: string;
  post_type: string;
  pillar: string | null;
  language: string | null;
  scheduled_date: string | null;
  media_urls: unknown;
  status: Status;
  created_at: string;
}

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-amber-500/15 text-amber-600",
  approved: "bg-blue-500/15 text-blue-600",
  published: "bg-green-500/15 text-green-600",
  rejected: "bg-destructive/15 text-destructive",
};

const FILTERS: (Status | "all")[] = ["all", "pending", "approved", "draft", "published", "rejected"];

export default function AdminContent() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("pending");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_posts")
        .select("*")
        .order("scheduled_date", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data as ContentPost[];
    },
  });

  // Traffic — page views last 30 days
  const { data: traffic } = useQuery({
    queryKey: ["admin-content-traffic"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 864e5).toISOString();
      const { count } = await supabase
        .from("page_views")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since);
      return count ?? 0;
    },
  });

  const setStatus = async (id: string, status: Status) => {
    const { error } = await supabase
      .from("content_posts")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error("Failed: " + error.message);
    toast.success(`Marked ${status}`);
    qc.invalidateQueries({ queryKey: ["admin-content"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this content post?")) return;
    const { error } = await supabase.from("content_posts").delete().eq("id", id);
    if (error) return toast.error("Failed: " + error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-content"] });
  };

  const counts = {
    total: posts.length,
    pending: posts.filter((p) => p.status === "pending").length,
    approved: posts.filter((p) => p.status === "approved").length,
    published: posts.filter((p) => p.status === "published").length,
  };

  const shown = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  if (isLoading) return <div className="text-muted-foreground">Loading content…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Content Calendar</h2>
        <p className="text-muted-foreground">Plan, approve and schedule Instagram & social content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat icon={<IconCalendarEvent size={18} />} label="Total posts" value={counts.total} />
        <Stat icon={<IconClock size={18} />} label="Pending approval" value={counts.pending} accent="text-amber-600" />
        <Stat icon={<IconCheck size={18} />} label="Approved" value={counts.approved} accent="text-blue-600" />
        <Stat icon={<IconSend size={18} />} label="Published" value={counts.published} accent="text-green-600" />
        <Stat icon={<IconEye size={18} />} label="Site views (30d)" value={traffic ?? 0} />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm capitalize border transition-colors ${
              filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {shown.length === 0 && <p className="text-muted-foreground text-sm">No {filter} content.</p>}
        {shown.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusStyles[p.status]}`}>{p.status}</span>
                  <span className="text-[11px] text-muted-foreground capitalize">{p.post_type}</span>
                  {p.pillar && <span className="text-[11px] text-muted-foreground">· {p.pillar}</span>}
                  {p.scheduled_date && (
                    <span className="text-[11px] text-muted-foreground">· {format(new Date(p.scheduled_date), "MMM d, yyyy")}</span>
                  )}
                </div>
                <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                {p.caption && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.caption}</p>}
                {p.caption_sw && <p className="text-xs text-muted-foreground/80 mt-1 italic line-clamp-1">SW: {p.caption_sw}</p>}
              </div>
              <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive shrink-0" title="Delete">
                <IconTrash size={16} />
              </button>
            </div>

            <div className="flex gap-2 mt-3 flex-wrap">
              {(p.status === "pending" || p.status === "draft") && (
                <Button size="sm" className="h-8 gap-1.5" onClick={() => setStatus(p.id, "approved")}>
                  <IconCheck size={14} /> Approve
                </Button>
              )}
              {p.status === "pending" && (
                <Button size="sm" variant="outline" className="h-8 gap-1.5 text-destructive" onClick={() => setStatus(p.id, "rejected")}>
                  <IconX size={14} /> Reject
                </Button>
              )}
              {p.status === "approved" && (
                <Button size="sm" className="h-8 gap-1.5 bg-green-600 hover:bg-green-700" onClick={() => setStatus(p.id, "published")}>
                  <IconSend size={14} /> Mark Published
                </Button>
              )}
              {p.status !== "pending" && p.status !== "draft" && (
                <Button size="sm" variant="ghost" className="h-8 text-muted-foreground" onClick={() => setStatus(p.id, "pending")}>
                  Move to Pending
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">{icon}<span className="text-[11px]">{label}</span></div>
      <p className={`text-2xl font-bold ${accent ?? "text-foreground"}`}>{value.toLocaleString()}</p>
    </div>
  );
}
