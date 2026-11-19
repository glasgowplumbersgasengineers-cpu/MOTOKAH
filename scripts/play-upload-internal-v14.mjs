import { GoogleAuth } from "google-auth-library";
import fs from "fs";

const PACKAGE = "com.motokah.app";
const KEY_FILE = "D:/MOTOKAH/secrets/google-play-service-account.json";
const AAB_PATH = "D:/motokah-android-wt/android/app/build/outputs/bundle/release/app-release.aab";
const VERSION_CODE = 20;

const auth = new GoogleAuth({ keyFile: KEY_FILE, scopes: ["https://www.googleapis.com/auth/androidpublisher"] });
const client = await auth.getClient();
const token = (await client.getAccessToken()).token;
const h = { Authorization: `Bearer ${token}` };
const api = "https://androidpublisher.googleapis.com/androidpublisher/v3";

async function req(url, opts = {}) {
  const r = await fetch(url, opts);
  const t = await r.text();
  if (!r.ok) throw new Error(`${opts.method || "GET"} ${url} -> ${r.status}: ${t.substring(0, 500)}`);
  return t ? JSON.parse(t) : {};
}

console.log("Opening edit...");
const edit = await req(`${api}/applications/${PACKAGE}/edits`, {
  method: "POST", headers: { ...h, "Content-Type": "application/json" }, body: "{}",
});
const editId = edit.id;
console.log("editId:", editId);

console.log("Uploading AAB...");
const aabBuffer = fs.readFileSync(AAB_PATH);
const uploadRes = await req(
  `https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/${PACKAGE}/edits/${editId}/bundles?uploadType=media`,
  {
    method: "POST",
    headers: { ...h, "Content-Type": "application/octet-stream" },
    body: aabBuffer,
  },
);
console.log("Uploaded bundle versionCode:", uploadRes.versionCode);

console.log("Assigning to internal track...");
const trackRes = await req(`${api}/applications/${PACKAGE}/edits/${editId}/tracks/internal`, {
  method: "PUT",
  headers: { ...h, "Content-Type": "application/json" },
  body: JSON.stringify({
    track: "internal",
    releases: [
      {
        name: "1.19",
        versionCodes: [String(VERSION_CODE)],
        status: "completed",
        releaseNotes: [
          { language: "en-GB", text: "Car photos load much faster. Bottom bar no longer covers page content." },
        ],
      },
    ],
  }),
});
console.log("Track set:", JSON.stringify(trackRes.releases));

console.log("Committing edit...");
const commitRes = await req(`${api}/applications/${PACKAGE}/edits/${editId}:commit`, {
  method: "POST", headers: h,
});
console.log("Committed. editId:", commitRes.id);
