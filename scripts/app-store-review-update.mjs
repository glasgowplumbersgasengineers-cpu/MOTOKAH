import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const API = "https://api.appstoreconnect.apple.com/v1";
const APP_ID = "6814840993";
const KEY_ID = process.env.APPLE_API_KEY_ID || "9GQSUWV935";
const ISSUER_ID = process.env.APPLE_API_ISSUER_ID || "bc8e67e1-9146-489f-8e26-54c56226ff1f";
const keyPath = process.env.APPLE_API_KEY_PATH || path.join(ROOT, "secrets", `AuthKey_${KEY_ID}.p8`);
const notesPath = path.join(ROOT, "launch", "apple-app-review-notes.txt");
const reviewAccountPath = path.join(ROOT, "secrets", "apple-review-account.txt");
const privateKey = fs.readFileSync(keyPath, "utf8");
const notes = fs.readFileSync(notesPath, "utf8").trim();
const apply = process.argv.includes("--apply");
const credentialsOnly = process.argv.includes("--credentials-only");

if (notes.length > 4000) throw new Error(`Review notes exceed Apple's 4,000-character limit (${notes.length}).`);

function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function makeToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "ES256", kid: KEY_ID, typ: "JWT" };
  const payload = { iss: ISSUER_ID, iat: now, exp: now + 15 * 60, aud: "appstoreconnect-v1" };
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = crypto.createSign("SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign({ key: privateKey, dsaEncoding: "ieee-p1363" });
  return `${signingInput}.${base64url(signature)}`;
}

const headers = { Authorization: `Bearer ${makeToken()}`, "Content-Type": "application/json" };

async function request(method, pathname, body) {
  const response = await fetch(`${API}${pathname}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`${response.status} ${JSON.stringify(payload)}`);
  return payload;
}

const versions = await request(
  "GET",
  `/apps/${APP_ID}/appStoreVersions?filter[platform]=IOS&filter[versionString]=1.0&include=appStoreReviewDetail&limit=1`,
);
const version = versions.data?.[0];
if (!version) throw new Error("App Store version 1.0 was not found.");
const reviewRef = version.relationships?.appStoreReviewDetail?.data;
if (!reviewRef?.id) throw new Error("App Store review detail was not found.");

console.log(`Review detail: ${reviewRef.id}`);
console.log(`Prepared notes: ${notes.length}/4000 characters`);

if (!apply) {
  console.log("Dry run only. Re-run with --apply after the physical-device recording is attached.");
  process.exit(0);
}

const attributes = credentialsOnly ? {} : { notes };
let reviewUser = process.env.APP_REVIEW_USER;
let reviewPassword = process.env.APP_REVIEW_PASSWORD;

if ((!reviewUser || !reviewPassword) && fs.existsSync(reviewAccountPath)) {
  const savedAccount = fs.readFileSync(reviewAccountPath, "utf8");
  reviewUser = savedAccount.match(/^Email: (.+)$/m)?.[1];
  reviewPassword = savedAccount.match(/^Password: (.+)$/m)?.[1];
}

if (reviewUser && reviewPassword) {
  attributes.demoAccountRequired = true;
  attributes.demoAccountName = reviewUser;
  attributes.demoAccountPassword = reviewPassword;
}

if (credentialsOnly && (!reviewUser || !reviewPassword)) {
  throw new Error("App Review credentials were not supplied or found in secrets/apple-review-account.txt.");
}

await request("PATCH", `/appStoreReviewDetails/${reviewRef.id}`, {
  data: { id: reviewRef.id, type: "appStoreReviewDetails", attributes },
});

console.log(credentialsOnly ? "App Review sign-in credentials updated successfully." : "App Review notes and credentials updated successfully.");
