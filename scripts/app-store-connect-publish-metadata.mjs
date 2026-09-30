import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const SECRETS = path.join(ROOT, "secrets");
const KEY_ID = "9GQSUWV935";
const ISSUER_ID = "bc8e67e1-9146-489f-8e26-54c56226ff1f";
const PRIVATE_KEY = fs.readFileSync(path.join(SECRETS, "AuthKey_9GQSUWV935.p8"), "utf8");
const API = "https://api.appstoreconnect.apple.com/v1";

const VERSION_ID = "afbfa4be-3762-461c-ad43-4d77766b2313";
const LOCALIZATION_ID = "6cc1694f-2840-44c6-a0df-0fb730792132";

// Only fields verified in full from the App Store Connect screenshot (short, fully
// visible, unambiguous). Description is deliberately NOT touched here — only its
// first ~300 chars of a 3,077-char draft were ever visible, pushing that would
// truncate whatever the owner actually wrote. Push description separately once the
// full text is available.
const KEYWORDS = "cars,tanzania,kenya,africa,marketplace,dealer,used cars,bikes,vehicles,auto,sell car,buy car";
const SUPPORT_URL = "https://www.motokah.com/faq";
const MARKETING_URL = "https://www.motokah.com";
const COPYRIGHT = "2026 Motokah Africa Limited";

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

const headers = { Authorization: `Bearer ${makeToken()}`, "Content-Type": "application/json" };

async function patch(url, body) {
  const res = await fetch(url, { method: "PATCH", headers, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`PATCH ${url} failed (${res.status}): ${text}`);
  return JSON.parse(text);
}

await patch(`${API}/appStoreVersions/${VERSION_ID}`, {
  data: { id: VERSION_ID, type: "appStoreVersions", attributes: { copyright: COPYRIGHT } },
});
console.log("copyright set:", COPYRIGHT);

await patch(`${API}/appStoreVersionLocalizations/${LOCALIZATION_ID}`, {
  data: {
    id: LOCALIZATION_ID,
    type: "appStoreVersionLocalizations",
    attributes: { keywords: KEYWORDS, supportUrl: SUPPORT_URL, marketingUrl: MARKETING_URL },
  },
});
console.log("keywords/supportUrl/marketingUrl set");
console.log("\nDescription NOT touched — only ~300 of 3,077 chars were ever visible to me. Send me the full text (or paste it) and I'll push that too.");
