import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";
import type { SendResult } from "./apns.ts";

// FCM HTTP v1 for Android. FCM_SERVICE_ACCOUNT holds the Google service account JSON
// (project motokah-507507). OAuth token cached across invocations within the same isolate.
let fcmToken: string | null = null;
let fcmTokenExp = 0;
let projectId = "";

async function getFcmToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (fcmToken && now < fcmTokenExp - 60) return fcmToken;

  const raw = Deno.env.get("FCM_SERVICE_ACCOUNT");
  if (!raw) throw new Error("FCM_SERVICE_ACCOUNT must be set");
  const sa = JSON.parse(raw);
  projectId = sa.project_id;

  const key = await jose.importPKCS8(sa.private_key, "RS256");
  const assertion = await new jose.SignJWT({ scope: "https://www.googleapis.com/auth/firebase.messaging" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(sa.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(`FCM auth failed: ${JSON.stringify(json)}`);
  fcmToken = json.access_token;
  fcmTokenExp = now + (json.expires_in ?? 3600);
  return fcmToken!;
}

export async function sendFcm(
  token: string,
  title: string,
  body: string,
  data: Record<string, string>,
): Promise<SendResult> {
  const access = await getFcmToken();
  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: "POST",
    headers: { authorization: `Bearer ${access}`, "content-type": "application/json" },
    body: JSON.stringify({
      message: {
        token,
        notification: { title, body },
        // FCM data values must be strings.
        data: Object.fromEntries(Object.entries(data).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])),
        android: { priority: "high", notification: { sound: "default" } },
      },
    }),
  });

  if (res.ok) return "sent";
  const err = await res.text();
  console.error(`FCM ${res.status} for token ${token.slice(0, 8)}...: ${err}`);
  // Only these mean the token itself is dead; auth/config errors must not delete tokens.
  if (res.status === 404 || err.includes("UNREGISTERED")) return "stale";
  return "failed";
}
