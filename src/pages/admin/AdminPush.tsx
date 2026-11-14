import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { IconCheck, IconEdit, IconX, IconChecks } from "@tabler/icons-react";

interface Campaign {
  id: string;
  scheduled_at: string;
  language: "en" | "sw";
  country: string | null;
  title: string;
  body: string;
  link: string;
  status: "draft" | "approved" | "sending" | "sent" | "cancelled";
  sent_count: number | null;
}

const STATUS_STYLE: Record<Campaign["status"], string> = {
  draft: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  sending: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  sent: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const eat = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString("en-GB", { timeZone: "Africa/Nairobi", ...opts });

export default function AdminPush() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: "", body: "" });

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["admin-push"],
    queryFn: async () => {
      const since = new Date(Date.now() - 7 * 86400000).toISOString();
      const { data, error } = await supabase
        .from("push_campaigns" as never)
        .select("*")
        .gte("scheduled_at", since)
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return data as unknown as Campaign[];
    },
  });

  const { data: optedIn = 0 } = useQuery({
    queryKey: ["admin-push-optin"],
    queryFn: async () => {
      const { count } = await supabase.from("device_tokens").select("id", { count: "exact", head: true }).eq("marketing_opt_in" as never, true as never);
      return count ?? 0;
    },
  });

  const update = async (ids: string[], fields: Partial<Campaign> & Record<string, unknown>) => {
    const { error } = await supabase.from("push_campaigns" as never).update(fields as never).in("id", ids);
    if (error) { toast.error(error.message); return false; }
    qc.invalidateQueries({ queryKey: ["admin-push"] });
    return true;
  };

  const approve = (ids: string[]) =>
    update(ids, { status: "approved", approved_by: user?.id, approved_at: new Date().toISOString() }).then(
      (ok) => ok && toast.success(ids.length > 1 ? `${ids.length} notifications approved` : "Approved"),
    );

  const saveEdit = async (c: Campaign) => {
    if (draft.title.length > 60 || draft.body.length > 180) return toast.error("Title max 60, message max 180 characters");
    // Editing an approved message sends it back for approval.
    if (await update([c.id], { title: draft.title, body: draft.body, status: "draft" })) setEditing(null);
  };

  const drafts = campaigns.filter((c) => c.status === "draft");
  const days = campaigns.reduce<Record<string, Campaign[]>>((acc, c) => {
    const d = eat(c.scheduled_at, { weekday: "long", day: "numeric", month: "long" });
    (acc[d] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Push Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Nothing is sent until approved. Sent only to people who opted in ({optedIn} devices). Times are East Africa Time.
          </p>
        </div>
        {drafts.length > 0 && (
          <Button onClick={() => approve(drafts.map((d) => d.id))} className="gap-1.5">
            <IconChecks size={16} /> Approve all {drafts.length} drafts
          </Button>
        )}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {!isLoading && campaigns.length === 0 && <p className="text-sm text-muted-foreground">No notifications scheduled.</p>}

      {Object.entries(days).map(([day, list]) => (
        <div key={day} className="space-y-2">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{day}</h2>
          {list.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-foreground">{eat(c.scheduled_at, { hour: "2-digit", minute: "2-digit" })}</span>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
                  {c.language === "sw" ? "Swahili" : "English"} · {c.country ?? "All countries"}
                </span>
                <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${STATUS_STYLE[c.status]}`}>{c.status}</span>
                {c.status === "sent" && <span className="text-muted-foreground">{c.sent_count ?? 0} delivered</span>}
              </div>

              {editing === c.id ? (
                <div className="space-y-2">
                  <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                  <p className="text-[10px] text-muted-foreground text-right">{draft.title.length}/60</p>
                  <Textarea rows={3} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
                  <p className="text-[10px] text-muted-foreground text-right">{draft.body.length}/180</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveEdit(c)}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-foreground">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.body}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Opens: {c.link}</p>
                </div>
              )}

              {editing !== c.id && (c.status === "draft" || c.status === "approved") && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {c.status === "draft" && (
                    <Button size="sm" onClick={() => approve([c.id])} className="gap-1"><IconCheck size={14} /> Approve</Button>
                  )}
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => { setEditing(c.id); setDraft({ title: c.title, body: c.body }); }}>
                    <IconEdit size={14} /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => update([c.id], { status: "cancelled" })}>
                    <IconX size={14} /> Don't send
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
