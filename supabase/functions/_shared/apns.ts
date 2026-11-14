import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

// APNs JWT, valid for 1 hour, cached across invocations within the same isolate.
let apnsJwt: string | null = null;
let apnsJwtExp = 0;

async function getApnsJwt(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (apnsJwt && now < apnsJwtExp - 60) return apnsJwt;

  const keyId = Deno.env.get("APNS_KEY_ID");
  const teamId = Deno.env.get("APNS_TEAM_ID");
  const privateKeyPem = Deno.env.get("APNS_PRIVATE_KEY");
  if (!keyId || !teamId || !privateKeyPem) {
    throw new Error("APNS_KEY_ID, APNS_TEAM_ID, and APNS_PRIVATE_KEY must be set");
  }

  const privateKey = await jose.importPKCS8(privateKeyPem, "ES256");
  apnsJwtExp = now + 3600;
  apnsJwt = await new jose.SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(teamId)
    .setIssuedAt(now)
    .sign(privateKey);
  return apnsJwt;
}

export type SendResult = "sent" | "stale" | "failed";

export async function sendApns(
  token: string,
  title: string,
  body: string,
  data: Record<string, string>,
): Promise<SendResult> {
  const jwt = await getApnsJwt();
  const res = await fetch(`https://api.push.apple.com/3/device/${token}`, {
    method: "POST",
    headers: {
      authorization: `bearer ${jwt}`,
      "apns-topic": "com.motokah.app",
      "apns-push-type": "alert",
      "apns-priority": "10",
      "content-type": "application/json",
    },
    body: JSON.stringify({ aps: { alert: { title, body }, sound: "default" }, ...data }),
  });

  if (res.ok) return "sent";
  const err = await res.text();
  console.error(`APNs ${res.status} for token ${token.slice(0, 8)}...: ${err}`);
  // Only these mean the token itself is dead. Auth/config errors (403 etc.) must
  // not delete tokens, or one bad secret would wipe every registered device.
  if (res.status === 410 || err.includes("BadDeviceToken")) return "stale";
  return "failed";
}
