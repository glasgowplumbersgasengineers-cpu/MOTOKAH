import { createClient } from "@supabase/supabase-js";
import { loadEnv, requireEnv } from "./lib/env.mjs";
import { isSafeMotokahPost, safetyReason } from "../content/instagram/content-strategy.mjs";

const env = loadEnv(process.cwd());
requireEnv(env, ["VITE_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const { data, error } = await supabase
  .from("content_posts")
  .select("id,scheduled_date,status,pillar,post_type,title,caption")
  .order("scheduled_date", { ascending: true });

if (error) throw error;

const unsafe = (data || []).filter((post) => !isSafeMotokahPost(post));
console.log(JSON.stringify({
  total: data?.length || 0,
  unsafe: unsafe.length,
  unsafePosts: unsafe.map((post) => ({
    id: post.id,
    scheduled_date: post.scheduled_date,
    status: post.status,
    pillar: post.pillar,
    post_type: post.post_type,
    title: post.title,
    reason: safetyReason(post),
  })),
}, null, 2));
