export const BLOCKED_PILLARS = new Set(["News", "Regional News"]);
export const BLOCKED_POST_TYPES = new Set(["news"]);

const BLOCKED_PATTERNS = [
  /\baccident\b/i,
  /\bcrash\b/i,
  /\bdeath\b/i,
  /\bdead\b/i,
  /\bpolitic/i,
  /\belection\b/i,
  /\bsponsorship\b/i,
  /\bthunder\b/i,
  /\bfuel price update\b/i,
  /\bglobal oil\b/i,
  /\broad rules\b/i,
  /\bnews\b/i,
];

export function isSafeMotokahPost(post) {
  const title = post?.title || "";
  const caption = post?.caption || "";
  if (BLOCKED_PILLARS.has(post?.pillar)) return false;
  if (BLOCKED_POST_TYPES.has(post?.post_type)) return false;
  return !BLOCKED_PATTERNS.some((pattern) => pattern.test(`${title}\n${caption}`));
}

export function safetyReason(post) {
  if (BLOCKED_PILLARS.has(post?.pillar)) return `blocked pillar: ${post.pillar}`;
  if (BLOCKED_POST_TYPES.has(post?.post_type)) return `blocked post_type: ${post.post_type}`;
  const text = `${post?.title || ""}\n${post?.caption || ""}`;
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
