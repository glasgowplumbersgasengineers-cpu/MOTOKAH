import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminReports() {
  const qc = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("id, listing_id, listing_ref, reported_user_id, context, reason, created_at, reporter_id")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  const removeListing = useMutation({
    mutationFn: async ({ reportId, listingId }: { reportId: string; listingId: string }) => {
      // Reject the listing
      const { error: listingError } = await supabase
        .from("listings")
        .update({ status: "rejected" as any })
        .eq("id", listingId);
      if (listingError) throw listingError;

      // Delete all reports for this listing
      const { error: reportError } = await supabase
        .from("reports")
        .delete()
        .eq("listing_id", listingId);
      if (reportError) throw reportError;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success("Listing removed and reports cleared.");
    },
    onError: () => toast.error("Failed to remove listing."),
  });

  const dismissReport = useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase.from("reports").delete().eq("id", reportId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success("Report dismissed.");
    },
    onError: () => toast.error("Failed to dismiss report."),
  });

  if (isLoading) return <div className="text-muted-foreground">Loading reports…</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Reports</h2>
      {reports.length === 0 ? (
        <p className="text-muted-foreground">No reports yet.</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing ID</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs">
                    <span className="font-mono">{r.listing_id ? `${r.listing_id.slice(0, 8)}…` : r.listing_ref || (r.reported_user_id ? `user ${r.reported_user_id.slice(0, 8)}…` : "-")}</span>
                    {r.context && <span className="block text-muted-foreground">{r.context}</span>}
                  </TableCell>
                  <TableCell>{r.reason}</TableCell>
                  <TableCell>{format(new Date(r.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="space-x-1">
                    {r.listing_id && <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Remove this listing? This will reject it and clear all its reports.")) {
                          removeListing.mutate({ reportId: r.id, listingId: r.listing_id! });
                        }
                      }}
                    >
                      Remove Listing
                    </Button>}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dismissReport.mutate(r.id)}
                    >
                      Dismiss
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
