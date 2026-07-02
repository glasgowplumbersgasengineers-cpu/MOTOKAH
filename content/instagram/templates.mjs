/**
 * Instagram post templates — 1080×1350 (4:5) format.
 * Critical content kept within center 1080×1080 "grid safe zone"
 * (top 135px + bottom 135px are background-only bleed zones).
 */
const fmtPrice = (p, c) => `${c} ${Number(p).toLocaleString()}`;
const esc = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export const clean = s => (s||'').replace(/\s*[—–]\s*/g,' - ').replace(/\s+/g,' ').replace(/&#x[A-Fa-f0-9]+;/g,'').trim();
export const trunc = (s,n) => { if(!s||s.length<=n) return s; const c=s.slice(0,n); return c.slice(0,c.lastIndexOf(' '))+'...'; };
const countryTag = t => { const m=t.match(/^([A-Za-z\s]+):/); return m?m[1].trim().toUpperCase():'AFRICA'; };

export function isCarCard(p) {
  return p.pillar==='Listings'||p.pillar==='Promotion'||/^From /i.test(p.title)||/Sunday Drive/i.test(p.title);
}

// Shared base styles injected into every template
const BASE_CSS = `
*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',system-ui,Arial,sans-serif}
/* 4:5 outer canvas */
.frame{width:1080px;height:1350px;position:relative;overflow:hidden;background:var(--bg)}
/* Center 1080x1080 safe zone — all critical content here */
.safe{
  position:absolute;left:0;right:0;
  top:135px;height:1080px;
  display:grid;gap:0;
}
`;

// ─────────────────────────────────────────────────────────────
//  MARKET UPDATE  1080x1350 — no random news/filler
// ─────────────────────────────────────────────────────────────
export function newsHtml(p) {
  const headline = esc(clean(p.title.replace(/^[A-Za-z\s]+:\s*/,'')));
  const country  = esc(countryTag(p.title));
  const body     = esc(trunc(clean(p.caption),200));
  const sw       = p.caption_sw ? esc(clean(p.caption_sw)) : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${BASE_CSS}
.frame{--bg:linear-gradient(145deg,#0077ee 0%,#0055bb 60%,#003d8f 100%);color:#fff}
/* decorative circles bleed into top/bottom zones — fine */
.frame::before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;
  background:rgba(255,255,255,.06);top:-150px;right:-150px}
.frame::after{content:'';position:absolute;width:300px;height:300px;border-radius:50%;
  background:rgba(255,255,255,.04);bottom:-80px;left:-60px}
/* safe zone uses 3-row grid */
.safe{grid-template-rows:100px 1fr 100px}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:0 60px;z-index:1}
.logo{font-size:44px;font-weight:900;letter-spacing:-1px;line-height:1}
.logo-dot{display:inline-block;width:11px;height:11px;background:#f5a623;border-radius:50%;margin-left:4px;vertical-align:7px}
.news-badge{background:#f5a623;color:#0a1730;font-size:20px;font-weight:900;letter-spacing:3px;padding:8px 22px;border-radius:6px}
.country-tag{background:rgba(255,255,255,.15);font-size:20px;font-weight:700;letter-spacing:1px;padding:8px 22px;border-radius:999px}
.middle{display:flex;flex-direction:column;justify-content:center;padding:0 60px;gap:30px;z-index:1}
.rule{height:3px;background:rgba(255,255,255,.3);border-radius:3px;width:80px;flex-shrink:0}
.headline{font-size:76px;font-weight:900;line-height:1.05;letter-spacing:-1px}
.body-text{font-size:33px;line-height:1.55;color:rgba(255,255,255,.88)}
.sw-text{font-size:27px;font-style:italic;color:#ffd98a;border-left:4px solid #f5a623;padding-left:18px;line-height:1.45}
.bottom{display:flex;align-items:center;justify-content:space-between;padding:0 60px;
  border-top:2px solid rgba(255,255,255,.15);z-index:1}
.handle{font-size:30px;font-weight:800}
.source{font-size:22px;color:rgba(255,255,255,.5);font-style:italic}
</style></head><body><div class="frame">
  <div class="safe">
    <div class="topbar">
      <div class="logo">Motokah<span class="logo-dot"></span></div>
      <div class="news-badge">MOTOKAH</div>
      <div class="country-tag">${country}</div>
    </div>
    <div class="middle">
      <div class="rule"></div>
      <div class="headline">${headline}</div>
      ${body?`<div class="body-text">${body}</div>`:''}
      ${sw?`<div class="sw-text">${sw}</div>`:''}
    </div>
    <div class="bottom">
      <div class="handle">@motokahafrica</div>
      <div class="source">motokah.com</div>
    </div>
  </div>
</div></body></html>`;
}

// ─────────────────────────────────────────────────────────────
//  LISTING  1080×1350 — car image takes more vertical space
// ─────────────────────────────────────────────────────────────
export function listingHtml(p, car) {
  const title = esc(clean(p.title));
  const sub   = esc(trunc(clean(p.caption),110));
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${BASE_CSS}
.frame{--bg:linear-gradient(150deg,#0077ee 0%,#0066cc 45%,#0052a3 100%);color:#fff}
/* safe zone: topbar | card | footer */
.safe{grid-template-rows:90px 1fr 110px;padding:0 54px;gap:20px}
.topbar{display:flex;align-items:center;justify-content:space-between}
.logo{font-size:44px;font-weight:900;letter-spacing:-1px;line-height:1}
.logo-dot{display:inline-block;width:11px;height:11px;background:#f5a623;border-radius:50%;margin-left:4px;vertical-align:7px}
.tag{background:rgba(255,255,255,.2);font-weight:700;font-size:20px;letter-spacing:2px;text-transform:uppercase;padding:8px 22px;border-radius:999px}
.card{background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,50,.4);
  display:grid;grid-template-rows:1fr auto;min-height:0}
.img-wrap{overflow:hidden;min-height:0}
.car-img{width:100%;height:100%;object-fit:cover;display:block}
.card-body{display:grid;grid-template-columns:1fr auto;align-items:center;
  padding:22px 30px;border-top:1px solid #e0ecf8;gap:12px;flex-shrink:0}
.car-title{color:#0d2040;font-size:30px;font-weight:800;line-height:1.2}
.car-meta{color:#5a7090;font-size:22px;margin-top:4px}
.car-price{color:#0066cc;font-size:38px;font-weight:900;text-align:right;white-space:nowrap}
.footer{display:grid;grid-template-columns:1fr auto;align-items:center;gap:16px;
  border-top:2px solid rgba(255,255,255,.2);padding-top:18px}
.footer-title{font-size:26px;font-weight:700;line-height:1.2}
.footer-sub{font-size:21px;color:rgba(255,255,255,.72);margin-top:4px;line-height:1.3}
.handle{font-size:26px;font-weight:800;white-space:nowrap}
</style></head><body><div class="frame">
  <div class="safe">
    <div class="topbar">
      <div class="logo">Motokah<span class="logo-dot"></span></div>
      <div class="tag">${esc(p.pillar||'Featured')}</div>
    </div>
    <div class="card">
      <div class="img-wrap"><img class="car-img" src="${car.image}" alt="${esc(car.title)}"/></div>
      <div class="card-body">
        <div>
          <div class="car-title">${esc(car.title)}</div>
          <div class="car-meta">${esc(car.city)} &nbsp;·&nbsp; ${car.year}</div>
        </div>
        <div class="car-price">${fmtPrice(car.price,car.currency)}</div>
      </div>
    </div>
    <div class="footer">
      <div>
        <div class="footer-title">${title}</div>
        ${sub?`<div class="footer-sub">${sub}</div>`:''}
      </div>
      <div class="handle">@motokahafrica</div>
    </div>
  </div>
</div></body></html>`;
}

// ─────────────────────────────────────────────────────────────
//  BRAND / FACT  1080×1350 — big bold title, grid-readable
// ─────────────────────────────────────────────────────────────
export function brandHtml(p) {
  const title  = esc(clean(p.title));
  const tag    = esc((p.pillar||'Motokah').toUpperCase());
  const isFact = ['Culture','Education'].includes(p.pillar);
  const factLine = isFact ? esc(trunc(clean(p.caption),130)) : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${BASE_CSS}
.frame{--bg:linear-gradient(145deg,#0077ee 0%,#0055bb 55%,#003d8f 100%);color:#fff}
.bg-circle{position:absolute;width:750px;height:750px;border-radius:50%;
  background:rgba(255,255,255,.07);top:-180px;right:-180px}
.bg-circle2{position:absolute;width:350px;height:350px;border-radius:50%;
  background:rgba(255,255,255,.05);bottom:-120px;left:-80px}
.accent-bar{position:absolute;left:0;top:0;bottom:0;width:10px;
  background:linear-gradient(to bottom,#f5a623,#ff8c00)}
/* safe zone: topbar | main | handle */
.safe{grid-template-rows:90px 1fr 90px;padding:0 64px 0 70px;z-index:1}
.topbar{display:flex;align-items:center;justify-content:space-between}
.logo{font-size:44px;font-weight:900;letter-spacing:-1px;line-height:1}
.logo-dot{display:inline-block;width:11px;height:11px;background:#f5a623;border-radius:50%;margin-left:4px;vertical-align:7px}
.tag-pill{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);
  font-size:18px;font-weight:700;letter-spacing:3px;padding:7px 22px;border-radius:999px}
.main{display:flex;flex-direction:column;justify-content:center;gap:28px}
.title{font-size:100px;font-weight:900;line-height:1.0;letter-spacing:-3px}
.fact-box{background:rgba(255,255,255,.12);border-left:5px solid #f5a623;
  border-radius:0 14px 14px 0;padding:28px 32px;display:flex;flex-direction:column;gap:8px}
.fact-label{font-size:16px;font-weight:700;letter-spacing:4px;color:#f5a623;text-transform:uppercase}
.fact-text{font-size:32px;font-weight:600;line-height:1.4}
.bottom{display:flex;align-items:center;justify-content:space-between;
  border-top:2px solid rgba(255,255,255,.15)}
.handle{font-size:30px;font-weight:800}
.url{font-size:22px;color:rgba(255,255,255,.5);letter-spacing:1px}
</style></head><body><div class="frame">
  <div class="bg-circle"></div>
  <div class="bg-circle2"></div>
  <div class="accent-bar"></div>
  <div class="safe">
    <div class="topbar">
      <div class="logo">Motokah<span class="logo-dot"></span></div>
      <div class="tag-pill">${tag}</div>
    </div>
    <div class="main">
      <div class="title">${title}</div>
      ${isFact&&factLine?`<div class="fact-box"><div class="fact-label">Quick Fact</div><div class="fact-text">${factLine}</div></div>`:''}
    </div>
    <div class="bottom">
      <div class="handle">@motokahafrica</div>
      <div class="url">motokah.com</div>
    </div>
  </div>
</div></body></html>`;
}

export function buildHtml(p, car) {
  if (p.post_type==='update') return newsHtml(p);
  if (isCarCard(p))         return listingHtml(p,car);
  return brandHtml(p);
}
