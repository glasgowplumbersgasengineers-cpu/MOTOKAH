import fs from "node:fs";
import path from "node:path";
import { GoogleAuth } from "google-auth-library";

const root = process.cwd();
const graphic = path.join(root, "public", "brand-2026", "play-feature-graphic-1024x500.png");
const apply = process.argv.includes("--apply");
if (!fs.existsSync(graphic)) throw new Error(`Missing feature graphic: ${graphic}`);
if (!apply) {
  console.log(`Ready to replace the Google Play en-GB feature graphic with ${graphic}`);
  console.log("Run with --apply to upload and commit the change.");
  process.exit(0);
}

const auth = new GoogleAuth({
  keyFile: path.join(root, "secrets", "google-play-service-account.json"),
  scopes: ["https://www.googleapis.com/auth/androidpublisher"],
});
const token = (await (await auth.getClient()).getAccessToken()).token;
if (!token) throw new Error("Google Play did not issue an access token");
const api = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/com.motokah.app/edits";
const uploadApi = "https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/com.motokah.app/edits";

async function request(url, method = "GET", body, contentType) {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(contentType ? { "Content-Type": contentType } : {}),
    },
    body,
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${method} failed (${response.status}): ${text}`);
  return text ? JSON.parse(text) : null;
}

const edit = await request(api, "POST", "{}", "application/json");
try {
  const url = `${api}/${edit.id}/listings/en-GB/featureGraphic`;
  await request(url, "DELETE");
  await request(
    `${uploadApi}/${edit.id}/listings/en-GB/featureGraphic?uploadType=media`,
    "POST",
    fs.readFileSync(graphic),
    "image/png",
  );
  const uploaded = await request(url);
  if (uploaded.images?.length !== 1) throw new Error("Expected exactly one uploaded feature graphic");
  await request(`${api}/${edit.id}:commit`, "POST", "{}", "application/json");
  console.log(`Google Play feature graphic updated. Image ID: ${uploaded.images[0].id}`);
} catch (error) {
  await request(`${api}/${edit.id}`, "DELETE").catch(() => {});
  throw error;
}
