/**
 * Exchange and validate a Meta Graph token for Motokah Instagram publishing.
 *
 * Required env:
 *   META_APP_ID
 *   META_APP_SECRET
 *   META_SHORT_LIVED_TOKEN
 *   IG_USER_ID
 *
 * Optional:
 *   WRITE_ENV_LOCAL=1  updates IG_GRAPH_TOKEN in .env.local after validation
 *
 * The script never prints token values.
 */
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import { loadEnv, requireEnv } from "./lib/env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GRAPH_VERSION = "v21.0";
const env = loadEnv(ROOT);

requireEnv(env, ["META_APP_ID", "META_APP_SECRET", "META_SHORT_LIVED_TOKEN", "IG_USER_ID"]);

function graphGet(pathname, params) {
  const qs = new URLSearchParams(params).toString();
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "graph.facebook.com",
        path: `/${GRAPH_VERSION}${pathname}?${qs}`,
        method: "GET",
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, data: { raw: body } });
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function appAccessToken() {
  return `${env.META_APP_ID}|${env.META_APP_SECRET}`;
}

function maskDateFromSeconds(seconds) {
  if (!seconds) return null;
  return new Date(Date.now() + Number(seconds) * 1000).toISOString();
}

function upsertEnvValue(filePath, key, value) {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const line = `${key}=${value}`;
  const next = existing.match(new RegExp(`^${key}=.*$`, "m"))
    ? existing.replace(new RegExp(`^${key}=.*$`, "m"), line)
    : `${existing.replace(/\s*$/, "")}\n${line}\n`;
  fs.writeFileSync(filePath, next, "utf8");
}

async function main() {
  const exchange = await graphGet("/oauth/access_token", {
    grant_type: "fb_exchange_token",
    client_id: env.META_APP_ID,
    client_secret: env.META_APP_SECRET,
    fb_exchange_token: env.META_SHORT_LIVED_TOKEN,
  });

  if (exchange.status !== 200 || exchange.data.error || !exchange.data.access_token) {
    console.error("Token exchange failed:", {
      status: exchange.status,
      error: exchange.data.error?.message || exchange.data.raw || "unknown",
      code: exchange.data.error?.code,
    });
    process.exit(1);
  }

  const longLivedToken = exchange.data.access_token;
  console.log("Token exchange: ok");
  console.log("Token expires at:", maskDateFromSeconds(exchange.data.expires_in) || "unknown");

  const debug = await graphGet("/debug_token", {
    input_token: longLivedToken,
    access_token: appAccessToken(),
  });
  if (debug.status !== 200 || debug.data.error || !debug.data.data?.is_valid) {
    console.error("Token debug failed:", {
      status: debug.status,
      error: debug.data.error?.message || "invalid token",
      code: debug.data.error?.code,
    });
    process.exit(1);
  }
  console.log("Token debug: valid");
  console.log("Scopes:", (debug.data.data.scopes || []).join(", ") || "(none reported)");
  console.log("Debug expires at:", debug.data.data.expires_at ? new Date(debug.data.data.expires_at * 1000).toISOString() : "unknown");

  const ig = await graphGet(`/${env.IG_USER_ID}`, {
    fields: "id,username",
    access_token: longLivedToken,
  });
  if (ig.status !== 200 || ig.data.error || String(ig.data.id) !== String(env.IG_USER_ID)) {
    console.error("Instagram account validation failed:", {
      status: ig.status,
      error: ig.data.error?.message || "IG user id mismatch",
      code: ig.data.error?.code,
    });
    process.exit(1);
  }
  console.log("Instagram account: ok");
  console.log("Username:", ig.data.username || "(not returned)");

  if (env.WRITE_ENV_LOCAL === "1") {
    upsertEnvValue(path.join(ROOT, ".env.local"), "IG_GRAPH_TOKEN", longLivedToken);
    upsertEnvValue(path.join(ROOT, ".env.local"), "IG_USER_ID", env.IG_USER_ID);
    console.log(".env.local updated: IG_GRAPH_TOKEN, IG_USER_ID");
  } else {
    console.log("Dry token setup only. Set WRITE_ENV_LOCAL=1 to update .env.local.");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
