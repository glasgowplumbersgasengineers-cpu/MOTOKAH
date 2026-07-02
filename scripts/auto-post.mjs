/**
 * Auto-post to Instagram.
 * Picks next pending post from content_posts, generates image, uploads to Supabase,
 * posts to IG Graph API, marks status = 'published'.
 *
 * Usage:
 *   node scripts/auto-post.mjs              -- post next 1 pending
 *   node scripts/auto-post.mjs --count=3    -- post next 3
 *   node scripts/auto-post.mjs --dry-run    -- generate images only, no IG post
 */
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { buildHtml } from '../content/instagram/templates.mjs';
import { loadEnv, requireEnv } from './lib/env.mjs';
import { HASHTAGS, isSafeMotokahPost, safetyReason } from '../content/instagram/content-strategy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CARS_JSON = path.join(ROOT, 'content', 'instagram', 'cars.json');
const TMP = path.join(ROOT, 'content', 'instagram', 'auto-tmp');
fs.mkdirSync(TMP, { recursive: true });

const CHROME_CANDIDATES = [
  'C:/Users/rapid/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe',
  'C:/Users/rapid/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',
];
const EXE = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));

const env = loadEnv(ROOT);
requireEnv(env, ['VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const IG_TOKEN = env.IG_GRAPH_TOKEN;
const IG_UID   = env.IG_USER_ID;
const BUCKET   = 'ig-posts';

const DRY_RUN  = process.argv.includes('--dry-run');
const INCLUDE_PENDING = process.argv.includes('--include-pending');
const countArg = process.argv.find(a => a.startsWith('--count='));
const COUNT    = parseInt(countArg?.split('=')[1] || '1');

const cars = JSON.parse(fs.readFileSync(CARS_JSON, 'utf8'));

// ── clean text for IG caption ────────────────────────────────
const clean = s => (s || '').replace(/\s*[—–]\s*/g, ' - ').replace(/\s+/g, ' ').replace(/&#x[A-Fa-f0-9]+;/g, '').trim();
const trunc = (s, n) => { if (!s || s.length <= n) return s; const c = s.slice(0,n); return c.slice(0,c.lastIndexOf(' '))+'...'; };

function buildCaption(p) {
  const eng = trunc(clean(p.caption), 300);
  const sw  = p.caption_sw ? clean(p.caption_sw) : '';

  const lines = [eng];
  if (sw) lines.push(`\n${sw}`);
  lines.push('\nmotokah.com');

  lines.push(`\n${HASHTAGS[p.pillar] || '#motokah #eastafrica #cars #usedcars'}`);
  return lines.join('\n');
}

function igPost(endpoint, params) {
  const qs = new URLSearchParams(params).toString();
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'graph.facebook.com',
      path: `/v19.0/${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(qs),
      },
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(b) }); }
        catch { resolve({ status: res.statusCode, data: { raw: b } }); }
      });
    });
    req.on('error', reject);
    req.write(qs); req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  if (!EXE) throw new Error('No Playwright Chromium executable found. Run npx playwright install chromium.');
  if (!DRY_RUN) requireEnv(env, ['IG_GRAPH_TOKEN', 'IG_USER_ID']);

  // Fetch pending posts
  const allowedStatuses = INCLUDE_PENDING ? ['approved', 'pending'] : ['approved'];
  const { data: pending, error } = await supabase
    .from('content_posts')
    .select('*')
    .in('status', allowedStatuses)
    .order('scheduled_date', { ascending: true })
    .limit(Math.max(COUNT * 3, COUNT));

  if (error) { console.error('DB fetch error:', error.message); process.exit(1); }
  const safePending = (pending || []).filter((post) => {
    const safe = isSafeMotokahPost(post);
    if (!safe) console.log(`Skipping unsafe post "${post.title}": ${safetyReason(post)}`);
    return safe;
  }).slice(0, COUNT);

  if (!safePending.length) {
    console.log(`No safe ${allowedStatuses.join('/')} posts found.`);
    return;
  }

  console.log(`Found ${safePending.length} safe post(s). DRY_RUN=${DRY_RUN}`);

  const browser = await chromium.launch({ headless: true, executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });

  for (let idx = 0; idx < safePending.length; idx++) {
    const p = safePending[idx];
    const car = cars[idx % cars.length];
    console.log(`\n[${idx+1}/${safePending.length}] "${p.title}" (${p.pillar})`);

    // 1. Generate image
    const html = buildHtml(p, car);
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForFunction(
      () => { const img = document.querySelector('.car-img'); return !img || img.complete; },
      { timeout: 8000 }
    ).catch(() => {});
    await page.waitForTimeout(300);
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const tmpFile = path.join(TMP, `${slug}.png`);
    await page.locator('.frame').screenshot({ path: tmpFile });
    console.log(`  Generated: ${tmpFile}`);

    if (DRY_RUN) { console.log('  DRY RUN — skipping upload/post'); continue; }

    // 2. Upload to Supabase Storage
    const imgBuffer = fs.readFileSync(tmpFile);
    const storageKey = `auto-posts/${Date.now()}-${slug}.png`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storageKey, imgBuffer, { contentType: 'image/png', upsert: true });
    if (upErr) { console.error('  Upload error:', upErr.message); continue; }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storageKey);
    const imageUrl = urlData.publicUrl;
    console.log(`  Uploaded: ${imageUrl}`);

    // 3. Create IG media container
    const caption = buildCaption(p);
    const container = await igPost(`${IG_UID}/media`, {
      image_url: imageUrl,
      caption,
      access_token: IG_TOKEN,
    });
    console.log(`  IG container HTTP ${container.status}`);
    if (container.data.error) {
      console.error(`  IG error: ${container.data.error.message} (code ${container.data.error.code})`);
      continue;
    }

    // 4. Publish
    await sleep(5000);
    const pub = await igPost(`${IG_UID}/media_publish`, {
      creation_id: container.data.id,
      access_token: IG_TOKEN,
    });
    console.log(`  Publish HTTP ${pub.status}:`, JSON.stringify(pub.data).slice(0, 120));

    if (pub.data.error) {
      console.error(`  Publish error: ${pub.data.error.message}`);
      continue;
    }

    // 5. Mark as published in DB
    const { error: dbErr } = await supabase
      .from('content_posts')
      .update({
        status: 'published',
        media_urls: [imageUrl],
        updated_at: new Date().toISOString(),
      })
      .eq('id', p.id);
    if (dbErr) console.error('  DB update error:', dbErr.message);
    else console.log(`  Marked published in DB. IG media: ${pub.data.id}`);

    if (idx < safePending.length - 1) await sleep(4000);
  }

  await browser.close();
  console.log('\nDone.');
}

main().catch(console.error);
