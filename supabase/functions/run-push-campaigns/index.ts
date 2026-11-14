import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendApns } from "../_shared/apns.ts";

// Called every 15 minutes by pg_cron. Sends approved campaigns that are due, only to devices
// that opted in to marketing pushes, matching the campaign's language and country.
const MAX_LATENESS_MS = 6 * 60 * 60 * 1000;

serve(async (req) => {
  const secret = Deno.env.get("INTERNAL_PUSH_SECRET");
  if (!secret || req.headers.get("x-internal-secret") !== secret) {
    return new Response("forbidden", { status: 403 });
  }
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: due, error } = await sb
    .from("push_campaigns")
    .update({ status: "sending" })
    .eq("status", "approved")
    .lte("scheduled_at", new Date().toISOString())
    .select("*");
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const results = [];
  for (const c of due ?? []) {
    // A campaign missed by hours (e.g. scheduler outage) would land at an odd time of day.
    if (Date.now() - new Date(c.scheduled_at).getTime() > MAX_LATENESS_MS) {
      await sb.from("push_campaigns").update({ status: "cancelled" }).eq("id", c.id);
      results.push({ id: c.id, skipped: "too_late" });
      continue;
    }

    let q = sb.from("device_tokens").select("id, token").eq("platform", "ios").eq("marketing_opt_in", true);
    // English campaigns also reach users who picked a language we don't write campaigns in yet.
    q = c.language === "sw" ? q.eq("language", "sw") : q.neq("language", "sw");
    if (c.country) q = q.eq("country", c.country);
    const { data: tokens } = await q;

    let sent = 0;
    const stale: string[] = [];
    const list = tokens ?? [];
    for (let i = 0; i < list.length; i += 20) {
      const chunk = list.slice(i, i + 20);
      const out = await Promise.all(
        chunk.map((t) => sendApns(t.token, c.title, c.body, { type: "campaign", link: c.link }).catch(() => "failed" as const)),
      );
      out.forEach((r, j) => {
        if (r === "sent") sent++;
        else if (r === "stale") stale.push(chunk[j].id);
      });
    }
    if (stale.length) await sb.from("device_tokens").delete().in("id", stale);
    await sb.from("push_campaigns").update({ status: "sent", sent_at: new Date().toISOString(), sent_count: sent }).eq("id", c.id);
    results.push({ id: c.id, sent, stale: stale.length });
  }

  return new Response(JSON.stringify({ processed: results.length, results }), { headers: { "Content-Type": "application/json" } });
});
