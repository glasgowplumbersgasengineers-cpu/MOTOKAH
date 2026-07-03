export const ALLOWED_PILLARS = new Set(["Listings", "Dealer", "Education", "Brand", "Promotion", "Boats", "Culture"]);
export const ALLOWED_POST_TYPES = new Set(["feed", "carousel", "story"]);
export const BLOCKED_PILLARS = new Set(["News", "Regional News", "Fuel", "Politics", "Sports"]);
export const BLOCKED_POST_TYPES = new Set(["news", "breaking_news", "fuel_update", "rss"]);

const BLOCKED_PATTERNS = [
  /\baccident\b/i,
  /\bcrash\b/i,
  /\bcollision\b/i,
  /\bdeath\b/i,
  /\bdead\b/i,
  /\binjur(?:y|ed|ies)\b/i,
  /\bpolitic/i,
  /\belection\b/i,
  /\bgovernment\b/i,
  /\bminister\b/i,
  /\bpresident\b/i,
  /\bsponsorship\b/i,
  /\bthunder\b/i,
  /\bfuel price update\b/i,
  /\bfuel prices?\b/i,
  /\bpetrol prices?\b/i,
  /\bglobal oil\b/i,
  /\broad rules\b/i,
  /\bbreaking\b/i,
  /\brss\b/i,
  /\bnews\b/i,
];

export function isSafeMotokahPost(post) {
  const title = post?.title || "";
  const caption = post?.caption || "";
  const pillar = post?.pillar || "";
  const postType = post?.post_type || "";
  const text = `${title}\n${caption}`;
  if (!ALLOWED_PILLARS.has(pillar)) return false;
  if (!ALLOWED_POST_TYPES.has(postType)) return false;
  if (BLOCKED_PILLARS.has(post?.pillar)) return false;
  if (BLOCKED_POST_TYPES.has(post?.post_type)) return false;
  if (!/\b(motokah|car|cars|vehicle|vehicles|dealer|dealers|showroom|listings?|toyota|nissan|subaru|mazda|honda|bmw|mercedes|boats?|marine)\b/i.test(text)) return false;
  return !BLOCKED_PATTERNS.some((pattern) => pattern.test(text));
}

export function safetyReason(post) {
  if (!ALLOWED_PILLARS.has(post?.pillar || "")) return `unapproved pillar: ${post?.pillar || "(blank)"}`;
  if (!ALLOWED_POST_TYPES.has(post?.post_type || "")) return `unapproved post_type: ${post?.post_type || "(blank)"}`;
  if (BLOCKED_PILLARS.has(post?.pillar)) return `blocked pillar: ${post.pillar}`;
  if (BLOCKED_POST_TYPES.has(post?.post_type)) return `blocked post_type: ${post.post_type}`;
  const text = `${post?.title || ""}\n${post?.caption || ""}`;
  if (!/\b(motokah|car|cars|vehicle|vehicles|dealer|dealers|showroom|listings?|toyota|nissan|subaru|mazda|honda|bmw|mercedes|boats?|marine)\b/i.test(text)) return "missing Motokah/vehicle relevance";
  const pattern = BLOCKED_PATTERNS.find((item) => item.test(text));
  return pattern ? `blocked keyword: ${pattern}` : "";
}

export const HASHTAGS = {
  Listings: "#motokah #carsforsale #usedcars #eastafrica #kenya #tanzania #nairobi #daressalaam #carshopping",
  Dealer: "#motokah #cardealer #carsforsale #eastafrica #tanzania #kenya #showroom #usedcars",
  Education: "#motokah #carbuyingtips #usedcars #eastafrica #caradvice #kenya #tanzania #safecarbuying",
  Brand: "#motokah #eastafrica #carmarketplace #usedcars #cars #kenya #tanzania #uganda",
  Promotion: "#motokah #sellcar #listyourcar #eastafrica #dealers #carsforsale #usedcars",
  Boats: "#motokah #boatsforsale #eastafrica #zanzibar #daressalaam #marine #boats",
  Culture: "#motokah #eastafrica #carculture #roadtrip #usedcars #kenya #tanzania",
};
