import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const WINDOW_DAYS = 30;

function topCounts(values: (string | null | undefined)[], limit = 10) {
  const counts = new Map<string, number>();
  for (const v of values) {
    const key = v?.trim() || "(direct / none)";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export default function AdminAnalytics() {
  const since = new Date(Date.now() - WINDOW_DAYS * 864e5).toISOString();

  const { data: events = [], isLoading, error: analyticsError } = useQuery({
    queryKey: ["admin-analytics-events"],
    refetchInterval: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("session_id, event_name, page, metadata, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(10000);
      if (error) throw error;
      return data;
    },
  });

  const pageViews = events.filter((e) => e.event_name === "page_view");
  const uniqueSessions = new Set(pageViews.map((v) => v.session_id)).size;
  const signUps = events.filter((e) => e.event_name === "sign_up");
  const listingsPosted = events.filter((e) => e.event_name === "listing_posted");
  const contactsSeller = events.filter((e) => e.event_name === "contact_seller");
  const searches = events.filter((e) => e.event_name === "search_performed");

  const sessionsThatSignedUp = new Set(signUps.map((e) => e.session_id));
  const sessionsThatPosted = new Set(listingsPosted.map((e) => e.session_id));
  const sessionsThatContacted = new Set(contactsSeller.map((e) => e.session_id));

  const topPages = topCounts(pageViews.map((v) => v.page));
  const topReferrers = topCounts(pageViews.map((v) => (v.metadata as any)?.referrer));
  const platforms = topCounts(pageViews.map((v) => (v.metadata as any)?.platform));
  const recentSessions = [...new Set(events.map((e) => e.session_id))].slice(0, 20).map((id) => ({
    id,
    activity: events.filter((e) => e.session_id === id).slice(0, 12),
  }));
  const topSearches = topCounts(events.filter((e) => e.event_name === "search_performed").map((e) => (e.metadata as any)?.query));
  const contactMethods = topCounts(contactsSeller.map((e) => (e.metadata as any)?.method));

  const stat = (label: string, value: number | string) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading analytics...</div>;
  }
  if (analyticsError) {
    return <div className="p-6 text-destructive">Could not load analytics. Sign in with a real admin account and check your connection.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Analytics</h2>
        <p className="text-sm text-muted-foreground">Last {WINDOW_DAYS} days of first-party website and app activity.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stat("Page views", pageViews.length)}
        {stat("Unique sessions", uniqueSessions)}
        {stat("Sign-ups", signUps.length)}
        {stat("Listings posted", listingsPosted.length)}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Website and app</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm">
          {platforms.map(([platform, count]) => (
            <span key={platform} className="rounded bg-muted px-3 py-2">{platform}: {count} page views</span>
          ))}
          {platforms.length === 0 && <span className="text-muted-foreground">No visits recorded yet</span>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Funnel (unique sessions)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-lg bg-muted px-3 py-2 font-medium">{uniqueSessions} visited</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-muted px-3 py-2 font-medium">
              {sessionsThatSignedUp.size} signed up
              {uniqueSessions > 0 && <span className="text-muted-foreground ml-1">({((sessionsThatSignedUp.size / uniqueSessions) * 100).toFixed(1)}%)</span>}
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-muted px-3 py-2 font-medium">
              {sessionsThatPosted.size} posted a listing
              {uniqueSessions > 0 && <span className="text-muted-foreground ml-1">({((sessionsThatPosted.size / uniqueSessions) * 100).toFixed(1)}%)</span>}
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-muted px-3 py-2 font-medium">
              {sessionsThatContacted.size} contacted a seller
              {uniqueSessions > 0 && <span className="text-muted-foreground ml-1">({((sessionsThatContacted.size / uniqueSessions) * 100).toFixed(1)}%)</span>}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Top pages</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Page</TableHead><TableHead className="text-right">Views</TableHead></TableRow></TableHeader>
              <TableBody>
                {topPages.map(([page, count]) => (
                  <TableRow key={page}><TableCell className="font-mono text-xs">{page}</TableCell><TableCell className="text-right">{count}</TableCell></TableRow>
                ))}
                {topPages.length === 0 && <TableRow><TableCell colSpan={2} className="text-muted-foreground text-sm">No data yet</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Traffic sources</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Referrer</TableHead><TableHead className="text-right">Visits</TableHead></TableRow></TableHeader>
              <TableBody>
                {topReferrers.map(([ref, count]) => (
                  <TableRow key={ref}><TableCell className="text-xs">{ref}</TableCell><TableCell className="text-right">{count}</TableCell></TableRow>
                ))}
                {topReferrers.length === 0 && <TableRow><TableCell colSpan={2} className="text-muted-foreground text-sm">No data yet</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">What people search for</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Query</TableHead><TableHead className="text-right">Times</TableHead></TableRow></TableHeader>
              <TableBody>
                {topSearches.map(([q, count]) => (
                  <TableRow key={q}><TableCell className="text-xs">{q}</TableCell><TableCell className="text-right">{count}</TableCell></TableRow>
                ))}
                {topSearches.length === 0 && <TableRow><TableCell colSpan={2} className="text-muted-foreground text-sm">No searches yet</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">How buyers contact sellers</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Method</TableHead><TableHead className="text-right">Times</TableHead></TableRow></TableHeader>
              <TableBody>
                {contactMethods.map(([method, count]) => (
                  <TableRow key={method}><TableCell className="text-xs capitalize">{method}</TableCell><TableCell className="text-right">{count}</TableCell></TableRow>
                ))}
                {contactMethods.length === 0 && <TableRow><TableCell colSpan={2} className="text-muted-foreground text-sm">No contacts yet</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent visitor journeys</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {recentSessions.map(({ id, activity }) => (
            <div key={id} className="border-b pb-3 last:border-0">
              <div className="text-xs text-muted-foreground mb-1">
                {id.slice(0, 8)} · {(activity[0]?.metadata as any)?.platform || "web"} · {new Date(activity[0].created_at).toLocaleString()}
              </div>
              <div className="text-sm break-words">
                {[...activity].reverse().map((e) => e.event_name === "page_view" ? e.page : e.event_name.replaceAll("_", " ")).join(" → ")}
              </div>
            </div>
          ))}
          {recentSessions.length === 0 && <p className="text-sm text-muted-foreground">No activity recorded yet</p>}
        </CardContent>
      </Card>
    </div>
  );
}
