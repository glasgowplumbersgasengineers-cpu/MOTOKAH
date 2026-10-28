import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const brandDir = path.join(root, "public", "brand-2026");
const playDir = path.join(root, "reports", "play-store-assets");
const source = fs.readFileSync(path.join(brandDir, "motokah-logo-horizontal.svg"), "utf8");
const pathMatch = source.match(/<path d="([^"]+)"/);
if (!pathMatch) throw new Error("Could not find the original Africa glyph path");
const glyphPath = pathMatch[1];
const blue = "#014dc5";

function glyph(fill) {
  return `<defs><clipPath id="glyph-only"><rect x="0" y="0" width="395" height="395"/></clipPath></defs><path d="${glyphPath}" fill="${fill}" fill-rule="evenodd" clip-path="url(#glyph-only)"/>`;
}

function horizontalLogo(fill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1820" height="395" viewBox="0 0 1820 395" role="img" aria-label="Motokah">${glyph(fill)}<text x="415" y="286" fill="${fill}" font-family="Arial Black, Arial, sans-serif" font-size="245" font-weight="900">MOTOKAH</text></svg>`;
}

fs.writeFileSync(path.join(brandDir, "motokah-logo-horizontal.svg"), horizontalLogo(blue));
fs.writeFileSync(path.join(brandDir, "motokah-logo-horizontal-white.svg"), horizontalLogo("#ffffff"));
await sharp(Buffer.from(horizontalLogo(blue))).png().toFile(path.join(brandDir, "motokah-logo-horizontal.png"));
await sharp(Buffer.from(horizontalLogo("#ffffff"))).png().toFile(path.join(brandDir, "motokah-logo-horizontal-white.png"));

const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
<rect width="1024" height="500" fill="#ffffff"/>
<rect width="352" height="500" fill="${blue}"/>
<g transform="translate(24 98) scale(.77)">${glyph("#ffffff")}</g>
<text x="394" y="229" fill="${blue}" font-family="Arial Black, Arial, sans-serif" font-size="86" font-weight="900">MOTOKAH</text>
<rect x="397" y="257" width="552" height="4" fill="${blue}"/>
<text x="397" y="311" fill="#18263d" font-family="Arial, sans-serif" font-size="29" font-weight="700">East Africa's vehicle marketplace</text>
<text x="397" y="352" fill="#46566e" font-family="Arial, sans-serif" font-size="23">Browse. Compare. Connect.</text>
</svg>`;
fs.mkdirSync(playDir, { recursive: true });
fs.writeFileSync(path.join(brandDir, "play-feature-graphic.svg"), cover);
await sharp(Buffer.from(cover)).png().toFile(path.join(brandDir, "play-feature-graphic-1024x500.png"));
await sharp(path.join(brandDir, "motokah-app-icon-1024.png"))
  .resize(512, 512)
  .png()
  .toFile(path.join(brandDir, "play-app-icon-512.png"));
fs.copyFileSync(path.join(brandDir, "play-feature-graphic-1024x500.png"), path.join(playDir, "feature-graphic-1024x500.png"));
fs.copyFileSync(path.join(brandDir, "play-app-icon-512.png"), path.join(playDir, "app-icon-512.png"));
console.log("Corrected MOTOKAH wordmark and Google Play artwork generated.");
