import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PushPayload {
  user_id: string;
  title: string;
  body?: string;
  data?: Record<string, string>;
}

// APNs JWT — valid for 1 hour, cached across invocations within the same
// Deno isolate so we don't regenerate on every push.
let apnsJwt: string | null = null;
let apnsJwtExp = 0;

async function getApnsJwt(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (apnsJwt && now < apnsJwtExp - 60) return apnsJwt;

  const keyId = Deno.env.get("APNS_KEY_ID");
  const teamId = Deno.env.get("APNS_TEAM_ID");
  const privateKeyPem = Deno.env.get("APNS_PRIVATE_KEY");
  if (!keyId || !teamId || !privateKeyPem) {
    throw new Error("APNS_KEY_ID, APNS_TEAM_ID, and APNS_PRIVATE_KEY must be set");
  }

  const privateKey = await jose.importPKCS8(privateKeyPem, "ES256");
  apnsJwtExp = now + 3600;
  apnsJwt = await new jose.SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(teamId)
    .setIssuedAt(now)
    .sign(privateKey);

  return apnsJwt;
}

async function sendApns(
  token: string,
  title: string,
  body: string,
  data: Record<string, string>,
): Promise<boolean> {
  const jwt = await getApnsJwt();
  const bundleId = "com.motokah.app";
  const host = "api.push.apple.com"; // production

  const payload = {
    aps: {
      alert: { title, body },
      sound: "default",
      badge: 1,
    },
    ...data,
  };

  const res = await fetch(`https://${host}/3/device/${token}`, {
    method: "POST",
    headers: {
      authorization: `bearer ${jwt}`,
      "apns-topic": bundleId,
      "apns-push-type": "alert",
      "apns-priority": "10",
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`APNs ${res.status} for token ${token.slice(0, 8)}...: ${err}`);
    if (res.status === 410 || res.status === 400) {
      // Token is invalid or unregistered — caller should delete it.
      return false;
    }
  }
  return res.ok;
}

// TODO: Add FCM support when Android push is needed.
// async function sendFcm(token, title, body, data) { ... }

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: PushPayload = await req.json();
    const { user_id, title, body, data } = payload;

    if (!user_id || !title) {
      return new Response(
        JSON.stringify({ error: "user_id and title are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

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
        const ok = await sendApns(t.token, title, body ?? "", data ?? {});
        if (ok) sent++;
        else staleIds.push(t.id);
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
