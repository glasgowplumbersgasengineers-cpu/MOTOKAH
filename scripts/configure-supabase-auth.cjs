#!/usr/bin/env node

const PROJECT_REF = process.env.PROJECT_REF || "eiofmomywxcsezbyzjth";
const APP_URL = (process.env.APP_URL || "https://www.motokah.com").replace(/\/$/, "");
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

const missing = TOKEN ? [] : ["SUPABASE_ACCESS_TOKEN"];
if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  console.error("Example:");
  console.error("$env:SUPABASE_ACCESS_TOKEN='sbp_...'; node scripts/configure-supabase-auth.cjs");
  console.error("To enable SMTP too, also set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_ADMIN_EMAIL.");
  process.exit(1);
}

const smtpValues = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_ADMIN_EMAIL: process.env.SMTP_ADMIN_EMAIL || "no-reply@motokah.com",
};
const smtpProvided = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"].some((key) => smtpValues[key]);
const smtpComplete = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"].every((key) => smtpValues[key]);
if (smtpProvided && !smtpComplete) {
  const smtpMissing = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"].filter((key) => !smtpValues[key]);
  console.error(`Partial SMTP config provided. Missing: ${smtpMissing.join(", ")}`);
  process.exit(1);
}

const endpoint = `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`;
const redirectUrls = [
  APP_URL,
  `${APP_URL}/auth`,
  `${APP_URL}/reset-password`,
  "https://motokah.com",
  "https://motokah.com/auth",
  "https://motokah.com/reset-password",
  "http://localhost:8080/auth",
  "http://localhost:8080/reset-password",
].join(",");

const emailShell = (title, body, ctaText, ctaUrl = "{{ .ConfirmationURL }}") => `
<!doctype html>
<html>
  <body style="margin:0;background:#f5f7fb;font-family:Inter,Arial,sans-serif;color:#132238;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="background:#006bd6;padding:22px 28px;color:#ffffff;">
                <div style="font-size:24px;font-weight:800;letter-spacing:.2px;">Motokah</div>
                <div style="font-size:13px;opacity:.9;margin-top:4px;">Find Your Perfect Ride</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#132238;">${title}</h1>
                <div style="font-size:15px;line-height:1.7;color:#4b5b70;">${body}</div>
                <div style="margin:26px 0;">
                  <a href="${ctaUrl}" style="display:inline-block;background:#006bd6;color:#ffffff;text-decoration:none;font-weight:700;border-radius:8px;padding:13px 20px;">${ctaText}</a>
                </div>
                <p style="font-size:12px;line-height:1.6;color:#718096;margin:0;">If the button does not work, copy and paste this link into your browser:<br><span style="word-break:break-all;">${ctaUrl}</span></p>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e2e8f0;padding:18px 28px;font-size:12px;line-height:1.6;color:#718096;">
                You are receiving this email because you used Motokah. If this was not you, you can ignore this message.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim();

const payload = {
  site_url: APP_URL,
  uri_allow_list: redirectUrls,
  external_email_enabled: true,
  password_min_length: 8,
  mailer_autoconfirm: false,
  mailer_secure_email_change_enabled: true,
  mailer_notifications_password_changed_enabled: true,
  mailer_subjects_confirmation: "Confirm your Motokah account",
  mailer_subjects_magic_link: "Your Motokah login link",
  mailer_subjects_recovery: "Reset your Motokah password",
  mailer_subjects_email_change: "Confirm your Motokah email change",
  mailer_subjects_invite: "You have been invited to Motokah",
  mailer_templates_confirmation_content: emailShell(
    "Confirm your Motokah account",
    "Welcome to Motokah. Confirm your email so you can save vehicles, contact sellers, post listings and manage your account securely.",
    "Confirm email"
  ),
  mailer_templates_magic_link_content: emailShell(
    "Sign in to Motokah",
    "Use this secure link to sign in to your Motokah account. The link expires soon for your protection.",
    "Sign in"
  ),
  mailer_templates_recovery_content: emailShell(
    "Reset your Motokah password",
    "We received a request to reset your password. Use the button below to choose a new password.",
    "Reset password"
  ),
  mailer_templates_email_change_content: emailShell(
    "Confirm your new email",
    "Confirm this change to update the email address on your Motokah account.",
    "Confirm email change"
  ),
  mailer_templates_invite_content: emailShell(
    "You have been invited to Motokah",
    "Accept your invitation to join Motokah and start managing vehicle listings, leads and marketplace activity.",
    "Accept invitation"
  ),
};

if (process.env.ENABLE_LEAKED_PASSWORD_PROTECTION === "true") {
  payload.password_hibp_enabled = true;
}

if (smtpComplete) {
  Object.assign(payload, {
    smtp_admin_email: smtpValues.SMTP_ADMIN_EMAIL,
    smtp_host: smtpValues.SMTP_HOST,
    smtp_port: Number(smtpValues.SMTP_PORT),
    smtp_user: smtpValues.SMTP_USER,
    smtp_pass: smtpValues.SMTP_PASS,
    smtp_sender_name: process.env.SMTP_SENDER_NAME || "Motokah",
  });
}

async function request(method, body) {
  const res = await fetch(endpoint, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    throw new Error(`${method} ${endpoint} failed (${res.status}): ${typeof data === "string" ? data : JSON.stringify(data)}`);
  }
  return data;
}

(async () => {
  console.log(`Configuring Supabase Auth for ${PROJECT_REF}...`);
  await request("PATCH", payload);
  const config = await request("GET");
  console.log(JSON.stringify({
    project_ref: PROJECT_REF,
    site_url: config.site_url,
    uri_allow_list: config.uri_allow_list,
    external_email_enabled: config.external_email_enabled,
    smtp_configured: smtpComplete,
    smtp_admin_email: config.smtp_admin_email,
    smtp_host: config.smtp_host,
    smtp_port: config.smtp_port,
    smtp_sender_name: config.smtp_sender_name,
    confirmation_subject: config.mailer_subjects_confirmation,
    recovery_subject: config.mailer_subjects_recovery,
    magic_link_subject: config.mailer_subjects_magic_link,
  }, null, 2));
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
