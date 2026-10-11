import fs from "node:fs";
import path from "node:path";
import { GoogleAuth } from "google-auth-library";

const ROOT = process.cwd();
const PACKAGE = "com.motokah.app";
const KEY_FILE = path.join(ROOT, "secrets", "google-play-service-account.json");
const AAB = path.join(ROOT, "android", "app", "build", "outputs", "bundle", "release", "app-release.aab");
const ASSETS = path.join(ROOT, "reports", "play-store-assets");
const SCREENSHOTS = path.join(ROOT, "reports", "store-screenshots");
const APPLY = process.argv.includes("--apply");

const required = [
  KEY_FILE,
  AAB,
  path.join(ASSETS, "listing-en-GB.json"),
  path.join(ASSETS, "app-icon-512.png"),
  path.join(ASSETS, "feature-graphic-1024x500.png"),
  ...["01-home.png", "02-search-tanzania.png", "03-listing.png", "04-dealers.png", "05-sell.png"].map((name) => path.join(SCREENSHOTS, name)),
];

for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing required release file: ${file}`);
}

if (!APPLY) {
  console.log("Preflight passed. Re-run with --apply to update Google Play internal testing.");
  process.exit(0);
}

const auth = new GoogleAuth({
  keyFile: KEY_FILE,
  scopes: ["https://www.googleapis.com/auth/androidpublisher"],
});
const client = await auth.getClient();
const token = await client.getAccessToken();
if (!token.token) throw new Error("Google Play access token was not issued");

const api = "https://androidpublisher.googleapis.com/androidpublisher/v3";
const uploadApi = "https://androidpublisher.googleapis.com/upload/androidpublisher/v3";
const headers = { Authorization: `Bearer ${token.token}` };

async function request(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  const text = await response.text();
  if (!response.ok) throw new Error(`${options.method || "GET"} ${url} failed (${response.status}): ${text}`);
  return text ? JSON.parse(text) : null;
}

async function upload(editId, imageType, file) {
  return request(`${uploadApi}/applications/${PACKAGE}/edits/${editId}/listings/en-GB/${imageType}?uploadType=media`, {
    method: "POST",
    headers: { "Content-Type": "image/png" },
    body: fs.readFileSync(file),
  });
}

const edit = await request(`${api}/applications/${PACKAGE}/edits`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{}",
});
const editId = edit.id;
console.log(`Play edit created: ${editId}`);

const bundle = await request(`${uploadApi}/applications/${PACKAGE}/edits/${editId}/bundles?uploadType=media`, {
  method: "POST",
  headers: { "Content-Type": "application/octet-stream" },
  body: fs.readFileSync(AAB),
});
if (String(bundle.versionCode) !== "10") throw new Error(`Expected uploaded version code 10, received ${bundle.versionCode}`);
console.log(`Bundle uploaded: version ${bundle.versionCode}`);

const listing = JSON.parse(fs.readFileSync(path.join(ASSETS, "listing-en-GB.json"), "utf8"));
await request(`${api}/applications/${PACKAGE}/edits/${editId}/listings/en-GB`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(listing),
});

for (const imageType of ["icon", "featureGraphic", "phoneScreenshots"]) {
  await request(`${api}/applications/${PACKAGE}/edits/${editId}/listings/en-GB/${imageType}`, { method: "DELETE" });
}
await upload(editId, "icon", path.join(ASSETS, "app-icon-512.png"));
await upload(editId, "featureGraphic", path.join(ASSETS, "feature-graphic-1024x500.png"));
for (const name of ["01-home.png", "02-search-tanzania.png", "03-listing.png", "04-dealers.png", "05-sell.png"]) {
  await upload(editId, "phoneScreenshots", path.join(SCREENSHOTS, name));
}
console.log("Store listing and graphics uploaded");

await request(`${api}/applications/${PACKAGE}/edits/${editId}/tracks/internal`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    track: "internal",
    releases: [{
      name: "1.9 Internal testing",
      versionCodes: ["10"],
      status: "completed",
      releaseNotes: [{ language: "en-GB", text: "Fixed the commercial filter showing SUVs instead of trucks/pickups, added Lexus to the make list, removed placeholder demo listings, fixed the car-search filter, cut ~30MB of unused stock images/data." }],
    }],
  }),
});

await request(`${api}/applications/${PACKAGE}/edits/${editId}:commit`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{}",
});
console.log("Google Play internal-testing release 1.8 committed successfully");
