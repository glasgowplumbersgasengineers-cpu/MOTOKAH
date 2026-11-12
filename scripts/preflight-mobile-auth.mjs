import fs from "node:fs";
import path from "node:path";

const envFile = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");

const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/settings`, {
  headers: { apikey: key },
  signal: AbortSignal.timeout(10000),
});
if (!response.ok) throw new Error(`Supabase Auth settings unavailable (${response.status})`);

const settings = await response.json();

// Social login (Apple/Google/Facebook) was deliberately removed app-wide —
// see Apple rejection history in D:\vault\Projects\project_motokah.md.
// Auth.tsx now only offers email/password + magic link. This check must
// stay aligned with what's actually in the UI, or it blocks every release
// by checking for a feature that no longer exists.
if (settings.external?.email !== true) {
  throw new Error("Release blocked: email/password auth is disabled in Supabase, but Auth.tsx has no other sign-in method.");
}
const shouldBeDisabled = ["apple", "google", "facebook"];
const unexpectedlyEnabled = shouldBeDisabled.filter((provider) => settings.external?.[provider] === true);
if (unexpectedlyEnabled.length) {
  throw new Error(`Release blocked: Supabase has ${unexpectedlyEnabled.join(", ")} enabled, but the app no longer renders those sign-in buttons — remove the Supabase config or add the button back, don't ship a mismatch.`);
}
console.log("Mobile auth preflight passed: email/password enabled, no orphaned social providers.");
