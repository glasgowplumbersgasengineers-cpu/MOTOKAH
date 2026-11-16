import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { IconSend } from "@/components/icons";

export default function AdminNewsletter() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const { data: subs = [], isLoading } = useQuery({
    queryKey: ["admin-newsletter"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Please fill in both subject and message.");
      return;
    }
    if (subs.length === 0) {
      toast.error("No subscribers to send to.");
      return;
    }
    if (!confirm(`Send this campaign to ${subs.length} subscriber(s)?`)) return;

    setSending(true);
    const { data, error } = await supabase.functions.invoke("send-newsletter", {
      body: { subject: subject.trim(), body: body.trim() },
    });
    setSending(false);

    if (error) {
      toast.error("Failed to send: " + error.message);
    } else if (data?.error) {
      toast.error("Error: " + data.error);
    } else {
      toast.success(`Campaign sent to ${data?.sent ?? subs.length} subscriber(s)!`);
      setSubject("");
      setBody("");
    }
  };

  if (isLoading) return <div className="text-muted-foreground">Loading subscribers…</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Newsletter</h2>
        <p className="text-muted-foreground">{subs.length} subscriber{subs.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Campaign Composer */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Send Campaign</h3>
        <p className="text-xs text-muted-foreground">
          Requires <code>RESEND_API_KEY</code> to be set in your Supabase project secrets and the <code>send-newsletter</code> edge function deployed.
        </p>
        <div className="space-y-1">
          <Label>Subject</Label>
          <Input
            placeholder="Your email subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Message</Label>
          <Textarea
            placeholder="Write your newsletter content here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
          />
        </div>
        <Button onClick={handleSend} disabled={sending || subs.length === 0} className="gap-2">
          <IconSend size={16} />
          {sending ? "Sending..." : `Send to ${subs.length} subscriber${subs.length !== 1 ? "s" : ""}`}
        </Button>
      </div>

      {/* Subscriber List */}
      {subs.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{format(new Date(s.created_at), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
