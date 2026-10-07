import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1).replace(/^"|"$/g, "")];
    }),
);

const url = env.VITE_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !serviceRoleKey || !publishableKey) {
  throw new Error("Missing Supabase QA credentials in .env.local.");
}

const email = `apple-delete-qa-${Date.now()}@example.com`;
const password = "ReviewDelete2026!";
const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
const userClient = createClient(url, publishableKey, { auth: { persistSession: false } });

const created = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: "Apple Delete QA" },
});
if (created.error) throw created.error;

const userId = created.data.user.id;

try {
  const signedIn = await userClient.auth.signInWithPassword({ email, password });
  if (signedIn.error) throw signedIn.error;

  const response = await fetch(`${url}/functions/v1/delete-account`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${signedIn.data.session.access_token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  if (!response.ok) throw new Error(`Delete endpoint returned ${response.status}: ${await response.text()}`);

  const verification = await admin.auth.admin.getUserById(userId);
  if (!verification.error) throw new Error("Disposable QA account still exists after deletion.");

  console.log("PASS: disposable account created, authenticated, deleted, and confirmed absent.");
} catch (error) {
  await admin.auth.admin.deleteUser(userId).catch(() => undefined);
  throw error;
}
