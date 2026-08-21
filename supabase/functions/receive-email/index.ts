import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const forwardRecipients = [
  "waleedmurtazamalil@gmail.com",
  "motokahafrica@gmail.com",
];

const jsonHeaders = {
  "Content-Type": "application/json",
};

type ResendEmailReceivedEvent = {
  type?: string;
  data?: {
    from?: string | { email?: string; name?: string };
    to?: string[] | Array<{ email?: string; name?: string }> | string;
    subject?: string;
    html?: string;
    text?: string;
    created_at?: string;
    attachments?: unknown[];
  };
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAddress(value: ResendEmailReceivedEvent["data"]["from"]) {
  if (!value) return "Unknown sender";
  if (typeof value === "string") return value;
  if (value.name && value.email) return `${value.name} <${value.email}>`;
  return value.email || value.name || "Unknown sender";
}

function formatRecipients(value: ResendEmailReceivedEvent["data"]["to"]) {
  if (!value) return "Unknown recipient";
  if (typeof value === "string") return value;
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item.name && item.email) return `${item.name} <${item.email}>`;
      return item.email || item.name || "";
    })
    .filter(Boolean)
    .join(", ");
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST required" }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: jsonHeaders,
      });
    }

    const event = (await req.json()) as ResendEmailReceivedEvent;
    if (event.type && event.type !== "email.received") {
      return new Response(JSON.stringify({ ignored: true, type: event.type }), {
        headers: jsonHeaders,
      });
    }

    const inbound = event.data ?? {};
    const from = formatAddress(inbound.from);
    const to = formatRecipients(inbound.to);
    const subject = inbound.subject || "(no subject)";
    const bodyHtml = inbound.html || `<pre style="white-space:pre-wrap">${escapeHtml(inbound.text || "")}</pre>`;
    const attachmentCount = Array.isArray(inbound.attachments) ? inbound.attachments.length : 0;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;color:#0f172a;line-height:1.5">
        <h2 style="margin:0 0 16px;color:#0066cc">Motokah inbound email</h2>
        <table style="border-collapse:collapse;width:100%;margin:0 0 20px;font-size:14px">
          <tr><td style="padding:6px 0;color:#64748b;width:120px">From</td><td>${escapeHtml(from)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">To</td><td>${escapeHtml(to)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Subject</td><td>${escapeHtml(subject)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Received</td><td>${escapeHtml(inbound.created_at || new Date().toISOString())}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Attachments</td><td>${attachmentCount}</td></tr>
        </table>
        <div style="border-top:1px solid #e2e8f0;padding-top:20px">
          ${bodyHtml}
        </div>
        ${
          attachmentCount
            ? '<p style="margin-top:24px;color:#b45309;font-size:13px">This email included attachments. Open the original inbound event in Resend if attachment download is needed.</p>'
            : ""
        }
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Motokah Mail <noreply@motokah.com>",
        to: forwardRecipients,
        subject: `[Motokah inbound] ${subject}`,
        html,
        reply_to: typeof inbound.from === "string" ? inbound.from : inbound.from?.email,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(`Resend forward failed: ${errorText}`);
    }

    return new Response(JSON.stringify({ forwarded: true, to: forwardRecipients }), {
      headers: jsonHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});
