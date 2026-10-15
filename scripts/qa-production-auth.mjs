import "dotenv/config";
import dotenv from "dotenv";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local", override: false });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publicKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !serviceRoleKey || !publicKey) {
  throw new Error("Supabase QA credentials are missing.");
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const email = `qa-auth-${Date.now()}@motokah.com`;
const originalPassword = `MotoQA!${Date.now()}`;
const replacementPassword = `${originalPassword}R`;
let userId;
let browser;

const result = {
  productionLoads: false,
  emailPasswordLogin: false,
  recoveryPageLoads: false,
  passwordUpdate: false,
  replacementLogin: false,
  finalUrl: "",
  errors: [],
};

try {
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: originalPassword,
    email_confirm: true,
    user_metadata: { display_name: "Motokah QA" },
  });
  if (createError) throw createError;
  userId = created.user.id;

  const { data: recovery, error: recoveryError } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: "https://www.motokah.com/reset-password" },
  });
  if (recoveryError) throw recoveryError;

  browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on("console", (message) => {
    if (message.type() === "error") result.errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => result.errors.push(`page: ${error.message}`));
  await page.addInitScript(() => localStorage.setItem("motokah_welcome_completed", "true"));

  await page.goto("https://www.motokah.com/auth", { waitUntil: "networkidle" });
  result.productionLoads = await page.locator("form").getByRole("button", { name: "Sign In", exact: true }).isVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(originalPassword);
  await page.locator("form").getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(/\/(profile|admin|dealer-dashboard)/, { timeout: 20_000 });
  result.emailPasswordLogin = true;

  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
  await page.goto(recovery.properties.action_link, { waitUntil: "networkidle" });
  result.finalUrl = page.url();
  result.recoveryPageLoads = await page.getByRole("heading", { name: "Set New Password" }).isVisible().catch(() => false);
  if (result.recoveryPageLoads) {
    await page.getByPlaceholder("New password").fill(replacementPassword);
    await page.getByRole("button", { name: "Update Password" }).click();
    await page.waitForURL("https://www.motokah.com/", { timeout: 20_000 });
    result.passwordUpdate = true;
  }

  const verifier = createClient(supabaseUrl, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: replacementLoginError } = await verifier.auth.signInWithPassword({
    email,
    password: replacementPassword,
  });
  result.replacementLogin = !replacementLoginError;
} catch (error) {
  result.errors.push(error instanceof Error ? error.message : String(error));
} finally {
  if (browser) await browser.close();
  if (userId) await admin.auth.admin.deleteUser(userId);
}

console.log(JSON.stringify(result, null, 2));
if (!result.productionLoads || !result.emailPasswordLogin || !result.recoveryPageLoads || !result.passwordUpdate || !result.replacementLogin || result.errors.length) {
  process.exitCode = 1;
}
