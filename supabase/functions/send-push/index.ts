import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendApns } from "../_shared/apns.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};


serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);
    const json = (b: unknown, status = 200) =>
      new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const input = await req.json();
    let user_id: string, title: string, body: string | null, data: Record<string, string>;

    const internalSecret = Deno.env.get("INTERNAL_PUSH_SECRET");
    const callerIsService = !!internalSecret && req.headers.get("x-internal-secret") === internalSecret;
    if (callerIsService && input.user_id && input.title) {
      // Server-side senders (scheduled campaigns) may send free text.
      ({ user_id, title } = input);
      body = input.body ?? "";
      data = input.data ?? {};
    } else {
      // App users can only trigger delivery of a notification row the database already accepted,
      // once, shortly after it was created.
      if (!input.notification_id) return json({ error: "notification_id is required" }, 400);
      const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: n } = await sb
        .from("notifications")
        .update({ pushed_at: new Date().toISOString() })
        .eq("id", input.notification_id)
        .is("pushed_at", null)
        .gte("created_at", since)
        .select("user_id, title, body, type")
        .maybeSingle();
      if (!n) return json({ sent: 0, reason: "not_found_or_already_pushed" });
      ({ user_id, title, body } = n);
      data = { type: n.type };
    }

    const { data: tokens, error } = await sb
      .from("device_tokens")
      .select("id, token, platform")
      .eq("user_id", user_id);

    if (error || !tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, reason: "no_device_tokens" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let sent = 0;
    const staleIds: string[] = [];

    for (const t of tokens) {
      if (t.platform === "ios") {
        const result = await sendApns(t.token, title, body ?? "", data);
        if (result === "sent") sent++;
        else if (result === "stale") staleIds.push(t.id);
      }
      // else if (t.platform === "android") { await sendFcm(...); }
    }

    // Clean up stale/invalid tokens
    if (staleIds.length > 0) {
      await sb.from("device_tokens").delete().in("id", staleIds);
    }

    return new Response(
      JSON.stringify({ sent, stale_removed: staleIds.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
