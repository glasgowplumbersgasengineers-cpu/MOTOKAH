import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_INBOX = "motokahafrica@gmail.com";

interface EmailPayload {
  /** Pass either a user_id (we look up the email) or a direct email address */
  to_user_id?: string;
  to_email?: string;
  subject: string;
  html: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    const { to_user_id, to_email, subject, html } = payload;

    if (!subject || !html || (!to_user_id && !to_email)) {
      return new Response(
        JSON.stringify({ error: "subject, html, and one of to_user_id or to_email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Who may send to whom. Without this anyone with the public anon key could send
    // arbitrary mail from noreply@motokah.com.
    //  - server senders (x-internal-secret) and signed-in admins: any recipient
    //  - everyone else (signup / new listing / dealer application alerts): only the Motokah inbox
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const internalSecret = Deno.env.get("INTERNAL_PUSH_SECRET");
    let privileged = !!internalSecret && req.headers.get("x-internal-secret") === internalSecret;
    if (!privileged) {
      const jwt = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
      const { data: caller } = jwt ? await admin.auth.getUser(jwt) : { data: { user: null } };
      if (caller?.user) {
        const { data: roles } = await admin
          .from("user_roles")
          .select("role")
          .eq("user_id", caller.user.id)
          .eq("role", "admin");
        privileged = Array.isArray(roles) && roles.length > 0;
      }
    }
    if (!privileged && (to_user_id || (to_email || "").trim().toLowerCase() !== ADMIN_INBOX)) {
      return new Response(JSON.stringify({ error: "Not allowed to send to this recipient" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      // Log and return success so the rest of the action (notification etc.) still completes
      console.warn("RESEND_API_KEY not configured — email not sent");
      return new Response(JSON.stringify({ skipped: true, reason: "RESEND_API_KEY not set" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let recipientEmail = to_email;

    if (to_user_id && !recipientEmail) {
      const { data: userData } = await admin.auth.admin.getUserById(to_user_id);
      recipientEmail = userData?.user?.email;
    }

    if (!recipientEmail) {
      return new Response(JSON.stringify({ error: "Could not resolve recipient email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Motokah <noreply@motokah.com>",
        to: recipientEmail,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ sent: true, to: recipientEmail }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
