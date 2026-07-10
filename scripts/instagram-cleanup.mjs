/**
 * Audit or delete junk posts from the connected Motokah Instagram account.
 *
 * Defaults to audit-only. Deletion requires both:
 *   --apply
 *   DELETE_LIVE_INSTAGRAM=1
 *
 * Required env:
 *   IG_USER_ID
 *   IG_GRAPH_TOKEN
 */
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import { loadEnv, requireEnv } from "./lib/env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GRAPH_VERSION = "v21.0";
const APPLY = process.argv.includes("--apply");
const LIMIT_ARG = process.argv.find((arg) => arg.startsWith("--limit="));
const LIMIT = Number(LIMIT_ARG?.split("=")[1] || 100);
const env = loadEnv(ROOT);

requireEnv(env, ["IG_USER_ID", "IG_GRAPH_TOKEN"]);

const BLOCKED_PATTERNS = [
  /\baccident\b/i,
  /\bbreaking\b/i,
  /\bcrash\b/i,
  /\bdeath\b/i,
  /\belection\b/i,
  /\bfuel prices?\b/i,
  /\bglobal oil\b/i,
  /\bgovernment\b/i,
  /\bminister\b/i,
  /\bnews\b/i,
  /\bpetrol prices?\b/i,
  /\bpolitic/i,
  /\bpresident\b/i,
  /\broad rules\b/i,
  /\brss\b/i,
  /\bsponsorship\b/i,
  /\bthunder\b/i,
];

const KEEP_PATTERNS = [
  /\bmotokah\b/i,
  /\bcar(?:s)?\b/i,
  /\bvehicle(?:s)?\b/i,
  /\bdealer(?:s)?\b/i,
  /\bshowroom\b/i,
  /\blisting(?:s)?\b/i,
  /\btoyota\b/i,
  /\bnissan\b/i,
  /\bsubaru\b/i,
  /\bmazda\b/i,
  /\bhonda\b/i,
  /\bbmw\b/i,
  /\bmercedes\b/i,
  /\bboats?\b/i,
  /\bmarine\b/i,
];

function graphRequest(method, pathname, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const pathWithQuery = qs ? `/${GRAPH_VERSION}${pathname}?${qs}` : `/${GRAPH_VERSION}${pathname}`;
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "graph.facebook.com",
        path: pathWithQuery,
        method,
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

async function listMedia() {
  const fields = "id,caption,media_type,permalink,timestamp";
  const first = await graphRequest("GET", `/${env.IG_USER_ID}/media`, {
    fields,
    limit: Math.min(LIMIT, 100),
    access_token: env.IG_GRAPH_TOKEN,
  });
  if (first.status !== 200 || first.data.error) {
    throw new Error(`IG media list failed: ${first.data.error?.message || first.data.raw || first.status}`);
  }

  const media = [...(first.data.data || [])];
  let next = first.data.paging?.next;
  while (next && media.length < LIMIT) {
    const url = new URL(next);
    const page = await graphRequest("GET", url.pathname.replace(`/${GRAPH_VERSION}`, ""), Object.fromEntries(url.searchParams));
    if (page.status !== 200 || page.data.error) {
      throw new Error(`IG media page failed: ${page.data.error?.message || page.status}`);
    }
    media.push(...(page.data.data || []));
    next = page.data.paging?.next;
  }
  return media.slice(0, LIMIT);
}

function classifyPost(post) {
  const caption = post.caption || "";
  const blocked = BLOCKED_PATTERNS.find((pattern) => pattern.test(caption));
  if (blocked) return { action: "delete_candidate", reason: `blocked keyword ${blocked}` };
  const relevant = KEEP_PATTERNS.some((pattern) => pattern.test(caption));
  if (!relevant) return { action: "review", reason: "caption does not look Motokah/vehicle related" };
  return { action: "keep", reason: "vehicle/dealer relevant" };
}

async function main() {
  const media = await listMedia();
  const reviewed = media.map((post) => ({ ...post, ...classifyPost(post) }));
  const deleteCandidates = reviewed.filter((post) => post.action === "delete_candidate");
  const reviewCandidates = reviewed.filter((post) => post.action === "review");

  const outDir = path.join(ROOT, "reports");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "instagram-cleanup-audit.json");
  fs.writeFileSync(outPath, JSON.stringify(reviewed, null, 2));

  console.log(`Fetched ${media.length} Instagram media items.`);
  console.log(`Delete candidates: ${deleteCandidates.length}`);
  console.log(`Manual review candidates: ${reviewCandidates.length}`);
  console.log(`Audit written: ${outPath}`);

  for (const post of deleteCandidates.slice(0, 20)) {
    console.log(`DELETE? ${post.id} | ${post.timestamp || ""} | ${post.reason} | ${post.permalink || ""}`);
  }
  if (deleteCandidates.length > 20) console.log(`...and ${deleteCandidates.length - 20} more delete candidates.`);

  if (!APPLY) {
    console.log("Audit only. Re-run with --apply and DELETE_LIVE_INSTAGRAM=1 to delete candidates.");
    return;
  }
  if (env.DELETE_LIVE_INSTAGRAM !== "1") {
    throw new Error("Refusing live delete without DELETE_LIVE_INSTAGRAM=1.");
  }

  for (const post of deleteCandidates) {
    const result = await graphRequest("DELETE", `/${post.id}`, {
      access_token: env.IG_GRAPH_TOKEN,
    });
    if (result.status === 200 && result.data.success) {
      console.log(`Deleted ${post.id}`);
    } else {
      console.error(`Failed to delete ${post.id}: ${result.data.error?.message || JSON.stringify(result.data)}`);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
