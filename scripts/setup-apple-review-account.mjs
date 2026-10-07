import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1).replace(/^"|"$/g, "")];
    }),
);

const email = "appreview@motokah.com";
const password = `Motokah-${crypto.randomBytes(9).toString("base64url")}!`;
const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

let user;
for (let page = 1; page <= 10 && !user; page += 1) {
  const result = await admin.auth.admin.listUsers({ page, perPage: 1000 });
  if (result.error) throw result.error;
  user = result.data.users.find((candidate) => candidate.email?.toLowerCase() === email);
  if (result.data.users.length < 1000) break;
}

if (user) {
  const updated = await admin.auth.admin.updateUserById(user.id, {
    password,
    email_confirm: true,
    user_metadata: { full_name: "App Review" },
  });
  if (updated.error) throw updated.error;
  user = updated.data.user;
} else {
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "App Review" },
  });
  if (created.error) throw created.error;
  user = created.data.user;
}

const userClient = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false },
});
const login = await userClient.auth.signInWithPassword({ email, password });
if (login.error) throw login.error;

const outputPath = path.join(ROOT, "secrets", "apple-review-account.txt");
fs.writeFileSync(
  outputPath,
  [
    "APPLE APP REVIEW ACCOUNT",
    `Email: ${email}`,
    `Password: ${password}`,
    `Supabase user ID: ${user.id}`,
    `Updated: ${new Date().toISOString()}`,
    "Purpose: App Review only. Re-run this script to recreate or rotate after Apple tests account deletion.",
    "",
  ].join("\n"),
);

console.log(`PASS: real App Review account is active; credentials saved to ${outputPath}.`);
