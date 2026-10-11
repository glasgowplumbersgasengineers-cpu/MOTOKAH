import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const defaultForwardRecipients = [
  "waleedmurtazamalik@gmail.com",
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

const encoder = new TextEncoder();

function getHeader(req: Request, names: string[]) {
  for (const name of names) {
    const value = req.headers.get(name);
    if (value) return value;
  }
  return null;
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

async function verifyWebhookSignature(req: Request, payload: string) {
  const secret = Deno.env.get("RESEND_WEBHOOK_SECRET");
  if (!secret) {
    throw new Error("RESEND_WEBHOOK_SECRET not configured");
  }

  const id = getHeader(req, ["svix-id", "webhook-id"]);
  const timestamp = getHeader(req, ["svix-timestamp", "webhook-timestamp"]);
  const signature = getHeader(req, ["svix-signature", "webhook-signature"]);

  if (!id || !timestamp || !signature) {
    throw new Error("Missing webhook signature headers");
  }

  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds)) {
    throw new Error("Invalid webhook timestamp");
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - timestampSeconds);
  if (ageSeconds > 300) {
    throw new Error("Webhook timestamp outside tolerance");
  }

  const secretValue = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret;
  const key = await crypto.subtle.importKey(
    "raw",
    base64ToBytes(secretValue),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signedContent = `${id}.${timestamp}.${payload}`;
  const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(signedContent)));
  const providedSignatures = signature
    .split(" ")
    .map((part) => part.split(",").at(-1)?.trim())
    .filter((part): part is string => Boolean(part));

  if (!providedSignatures.some((part) => timingSafeEqual(expected, base64ToBytes(part)))) {
    throw new Error("Invalid webhook signature");
  }
}

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

function getForwardRecipients() {
  const configured = Deno.env.get("INBOUND_FORWARD_TO");
  if (!configured) return defaultForwardRecipients;
  const recipients = configured
    .split(",")
    .map((email) => email.trim().replace(/^["'\[]+|["'\]]+$/g, ""))
    .filter(Boolean);
  return recipients.length > 0 ? recipients : defaultForwardRecipients;
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

    const payload = await req.text();
    await verifyWebhookSignature(req, payload);

    const event = JSON.parse(payload) as ResendEmailReceivedEvent;
    if (event.type && event.type !== "email.received") {
      return new Response(JSON.stringify({ ignored: true, type: event.type }), {
        headers: jsonHeaders,
      });
    }

    const inbound = event.data ?? {};
    const forwardRecipients = getForwardRecipients();
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
