import { supabase } from "@/integrations/supabase/client";

interface SendEmailOptions {
  /** Supabase user UUID — the edge function will resolve the email address */
  toUserId?: string;
  /** Direct email address */
  toEmail?: string;
  subject: string;
  html: string;
}

/**
 * Invoke the send-email edge function. Silently swallows errors so that the
 * caller's primary action (status update, notification) is never blocked by
 * an email failure or a missing RESEND_API_KEY.
 */
export async function sendEmail({ toUserId, toEmail, subject, html }: SendEmailOptions) {
  try {
    await supabase.functions.invoke("send-email", {
      body: { to_user_id: toUserId, to_email: toEmail, subject, html },
    });
  } catch {
    // Email is best-effort — never block the primary action
  }
}

export function getAdminNotificationEmails(): string[] {
  const custom = localStorage.getItem("motokah_admin_notification_emails");
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return ["admin@motokah.com", "info@motokah.com"];
}

export async function notifyAdminsOnNewListing(params: {
  listingId: string;
  title: string;
  price: number | string;
  currency: string;
  make: string;
  model: string;
  sellerName?: string;
  sellerEmail?: string;
  phone?: string;
  city?: string;
}) {
  const adminEmails = getAdminNotificationEmails();
  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
  <div style="background: #0284c7; padding: 20px 24px; color: #ffffff;">
    <h1 style="margin: 0; font-size: 20px; font-weight: 700;">🚗 New Vehicle Ad Awaiting Review</h1>
    <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Motokah Marketplace Admin Alert</p>
  </div>
  <div style="padding: 24px;">
    <p style="font-size: 15px; color: #111827; margin-top: 0;">
      A seller just posted a new vehicle listing that requires admin approval before going live:
    </p>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 16px;">${escHtml(params.title)}</h3>
      <p style="margin: 4px 0; font-size: 14px; color: #0284c7; font-weight: bold;">
        Price: ${escHtml(params.currency)} ${Number(params.price).toLocaleString()}
      </p>
      <p style="margin: 4px 0; font-size: 13px; color: #64748b;">
        Location: ${escHtml(params.city || "East Africa")} &bull; Make: ${escHtml(params.make)} &bull; Model: ${escHtml(params.model)}
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
      <p style="margin: 2px 0; font-size: 13px; color: #334155;">
        <strong>Seller:</strong> ${escHtml(params.sellerName || "Motokah User")} (${escHtml(params.sellerEmail || "No email")})
      </p>
      <p style="margin: 2px 0; font-size: 13px; color: #334155;">
        <strong>Phone / WhatsApp:</strong> ${escHtml(params.phone || "Not specified")}
      </p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="https://www.motokah.com/admin/listings" style="background: #0284c7; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">
        Review & Approve Listing &rarr;
      </a>
    </div>
    <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
      Motokah Marketplace &bull; Auto-generated notification for platform administrators
    </p>
  </div>
</div>`;

  for (const email of adminEmails) {
    await sendEmail({
      toEmail: email,
      subject: `🚗 New Listing Pending Approval: ${params.title}`,
      html,
    });
  }
}

export async function notifyAdminsOnNewSignup(params: {
  email: string;
  displayName?: string;
  phone?: string;
  sellerType?: string;
}) {
  const adminEmails = getAdminNotificationEmails();
  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
  <div style="background: #16a34a; padding: 20px 24px; color: #ffffff;">
    <h1 style="margin: 0; font-size: 20px; font-weight: 700;">👤 New User Registered on Motokah</h1>
    <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Motokah Community Growth Alert</p>
  </div>
  <div style="padding: 24px;">
    <p style="font-size: 15px; color: #111827; margin-top: 0;">
      A new user just created an account on the Motokah platform:
    </p>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 4px 0; font-size: 14px; color: #0f172a;">
        <strong>Name:</strong> ${escHtml(params.displayName || "Not provided")}
      </p>
      <p style="margin: 4px 0; font-size: 14px; color: #0f172a;">
        <strong>Email:</strong> ${escHtml(params.email)}
      </p>
      <p style="margin: 4px 0; font-size: 14px; color: #64748b;">
        <strong>Account Type:</strong> ${escHtml(params.sellerType || "Private Seller / Buyer")}
      </p>
      ${params.phone ? `<p style="margin: 4px 0; font-size: 14px; color: #64748b;"><strong>Phone:</strong> ${escHtml(params.phone)}</p>` : ""}
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="https://www.motokah.com/admin/users" style="background: #16a34a; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">
        View User Management &rarr;
      </a>
    </div>
    <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
      Motokah Marketplace &bull; Auto-generated notification for platform administrators
    </p>
  </div>
</div>`;

  for (const email of adminEmails) {
    await sendEmail({
      toEmail: email,
      subject: `👤 New Motokah User Sign-Up: ${params.displayName || params.email}`,
      html,
    });
  }
}

// ── Pre-built templates ──────────────────────────────────────────────────

export function listingApprovedEmail(title: string): string {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
  <h2 style="color:#16a34a">Your listing has been approved! 🎉</h2>
  <p>Great news — your listing <strong>"${escHtml(title)}"</strong> has been approved and is now live on Motokah.</p>
  <p>Potential buyers can now find your vehicle in search results.</p>
  <p style="margin-top:32px;font-size:12px;color:#888">
    You're receiving this because you posted a listing on Motokah.
  </p>
</div>`;
}

export function listingRejectedEmail(title: string): string {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
  <h2 style="color:#dc2626">Listing not approved</h2>
  <p>Unfortunately your listing <strong>"${escHtml(title)}"</strong> was not approved at this time.</p>
  <p>Common reasons include incomplete information, unclear photos, or a price that doesn't match the description. Please review our guidelines and resubmit.</p>
  <p style="margin-top:32px;font-size:12px;color:#888">
    You're receiving this because you posted a listing on Motokah.
  </p>
</div>`;
}

export function dealerApprovedEmail(businessName: string): string {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
  <h2 style="color:#16a34a">Dealer application approved! 🏪</h2>
  <p>Congratulations! Your dealer application for <strong>"${escHtml(businessName)}"</strong> has been approved.</p>
  <p>You now have dealer status on Motokah and can list vehicles under your dealership profile.</p>
  <p style="margin-top:32px;font-size:12px;color:#888">
    You're receiving this because you applied to become a dealer on Motokah.
  </p>
</div>`;
}

export function dealerRejectedEmail(businessName: string): string {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
  <h2 style="color:#dc2626">Dealer application not approved</h2>
  <p>We were unable to approve the dealer application for <strong>"${escHtml(businessName)}"</strong> at this time.</p>
  <p>Please ensure your registration documents are valid and contact our support team if you have questions.</p>
  <p style="margin-top:32px;font-size:12px;color:#888">
    You're receiving this because you applied to become a dealer on Motokah.
  </p>
</div>`;
}

function escHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
