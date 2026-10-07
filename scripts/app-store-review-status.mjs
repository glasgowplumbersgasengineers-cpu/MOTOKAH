import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const API = "https://api.appstoreconnect.apple.com/v1";
const APP_ID = "6814840993";
const KEY_ID = process.env.APPLE_API_KEY_ID || "9GQSUWV935";
const ISSUER_ID = process.env.APPLE_API_ISSUER_ID || "bc8e67e1-9146-489f-8e26-54c56226ff1f";
const keyPath = process.env.APPLE_API_KEY_PATH || path.join(ROOT, "secrets", `AuthKey_${KEY_ID}.p8`);
const privateKey = fs.readFileSync(keyPath, "utf8");

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

async function get(pathname) {
  const response = await fetch(`${API}${pathname}`, {
    headers: { Authorization: `Bearer ${makeToken()}` },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`${response.status} ${JSON.stringify(body)}`);
  return body;
}

const versions = await get(
  `/apps/${APP_ID}/appStoreVersions?filter[platform]=IOS&include=build,appStoreReviewDetail&limit=10`,
);

const included = new Map((versions.included || []).map((item) => [`${item.type}:${item.id}`, item]));
const summary = versions.data.map((version) => {
  const buildRef = version.relationships?.build?.data;
  const reviewRef = version.relationships?.appStoreReviewDetail?.data;
  const build = buildRef ? included.get(`${buildRef.type}:${buildRef.id}`) : null;
  const review = reviewRef ? included.get(`${reviewRef.type}:${reviewRef.id}`) : null;
  return {
    versionId: version.id,
    version: version.attributes?.versionString,
    state: version.attributes?.appVersionState || version.attributes?.appStoreState,
    buildId: build?.id || null,
    buildNumber: build?.attributes?.version || null,
    buildProcessingState: build?.attributes?.processingState || null,
    reviewDetailId: review?.id || reviewRef?.id || null,
    demoAccountRequired: review?.attributes?.demoAccountRequired ?? null,
    notesLength: review?.attributes?.notes?.length || 0,
  };
});

console.log(JSON.stringify(summary, null, 2));
