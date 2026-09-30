import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const SECRETS = path.join(ROOT, "secrets");
const KEY_ID = "9GQSUWV935";
const ISSUER_ID = "bc8e67e1-9146-489f-8e26-54c56226ff1f";
const PRIVATE_KEY = fs.readFileSync(path.join(SECRETS, "AuthKey_9GQSUWV935.p8"), "utf8");
const BUNDLE_ID = "com.motokah.app";
const API = "https://api.appstoreconnect.apple.com/v1";

function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function makeToken() {
  const header = { alg: "ES256", kid: KEY_ID, typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: ISSUER_ID, iat: now, exp: now + 15 * 60, aud: "appstoreconnect-v1" };
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = crypto.createSign("SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign({ key: PRIVATE_KEY, dsaEncoding: "ieee-p1363" });
  return `${signingInput}.${base64url(signature)}`;
}

const token = makeToken();
const headers = { Authorization: `Bearer ${token}` };

async function get(url) {
  const res = await fetch(url, { headers });
  const text = await res.text();
  if (!res.ok) throw new Error(`GET ${url} failed (${res.status}): ${text}`);
  return JSON.parse(text);
}

const apps = await get(`${API}/apps?filter[bundleId]=${BUNDLE_ID}`);
if (!apps.data.length) throw new Error(`No app found for bundle id ${BUNDLE_ID}`);
const app = apps.data[0];
console.log(`App: ${app.attributes.name || "(unnamed)"} — id ${app.id}`);

const versions = await get(`${API}/apps/${app.id}/appStoreVersions?filter[platform]=IOS&limit=5`);
for (const v of versions.data) {
  console.log(`\nVersion ${v.attributes.versionString} — state ${v.attributes.appStoreState} — id ${v.id}`);
  console.log(`  copyright: ${v.attributes.copyright}`);
  console.log(`  releaseType: ${v.attributes.releaseType}`);
  console.log(`  earliestReleaseDate: ${v.attributes.earliestReleaseDate}`);

  const locs = await get(`${API}/appStoreVersions/${v.id}/appStoreVersionLocalizations`);
  for (const loc of locs.data) {
    console.log(`  [${loc.attributes.locale}] localization id ${loc.id}`);
    console.log(`    description: ${(loc.attributes.description || "").slice(0, 80)}...`);
    console.log(`    keywords: ${loc.attributes.keywords}`);
    console.log(`    supportUrl: ${loc.attributes.supportUrl}`);
    console.log(`    marketingUrl: ${loc.attributes.marketingUrl}`);
  }

  const build = await get(`${API}/appStoreVersions/${v.id}/build`).catch((e) => ({ error: e.message }));
  console.log(`  build: ${build.data ? build.data.id : build.error || "none attached"}`);
}

const builds = await get(`${API}/apps/${app.id}/builds?limit=10`);
console.log(`\nAll uploaded builds (${builds.data.length}):`);
for (const b of builds.data) {
  console.log(`  ${b.attributes.version} — processingState ${b.attributes.processingState} — uploaded ${b.attributes.uploadedDate}`);
}
if (builds.data.length === 0) {
  console.log("  (none — no .ipa has ever been uploaded to App Store Connect for this app)");
}
