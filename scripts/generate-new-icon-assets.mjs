// Rebuilds app-icon / favicon assets from the new brand glyph (Africa outline +
// magnifier + car — "icon only" mark from the 2026-09 logo sheet). Wordmark/header
// logo is intentionally left untouched (existing sheet mis-spells "MOTOKA", owner
// chose icon-only adoption until a corrected wordmark exists).
//
// Source of truth for the glyph: scripts/assets/motokah-glyph.png (blue silhouette,
// alpha channel, extracted+verified from the logo sheet). Run this script after
// replacing that file to regenerate every derived icon.
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const ROOT = process.cwd();
const GLYPH = path.join(ROOT, "scripts", "assets", "motokah-glyph.png");
const BRAND_BLUE = { r: 1, g: 77, b: 197 };
const BRAND_BLUE_HEX = "#014dc5";

async function whiteGlyphBuffer() {
  const { data, info } = await sharp(GLYPH).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function blueGlyphBuffer() {
  const { data, info } = await sharp(GLYPH).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = BRAND_BLUE.r; data[i + 1] = BRAND_BLUE.g; data[i + 2] = BRAND_BLUE.b;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function fitGlyph(buf, boxSize) {
  return sharp(buf).resize(boxSize, boxSize, { fit: "inside" }).toBuffer();
}

async function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

// Opaque square icon: solid brand-blue background, white glyph inset. No alpha channel
// (Apple/Play both reject icons with transparency or pre-baked rounded corners).
async function opaqueSquareIcon(size, safeRatio, outPath) {
  const glyphBuf = await fitGlyph(await whiteGlyphBuffer(), Math.round(size * safeRatio));
  await ensureDir(outPath);
  await sharp({ create: { width: size, height: size, channels: 4, background: { ...BRAND_BLUE, alpha: 1 } } })
    .composite([{ input: glyphBuf, gravity: "center" }])
    .flatten({ background: BRAND_BLUE })
    .removeAlpha()
    .png()
    .toFile(outPath);
}

// Same as above but masked to a circle (transparent corners) for *_round.png.
async function roundIcon(size, safeRatio, outPath) {
  const glyphBuf = await fitGlyph(await whiteGlyphBuffer(), Math.round(size * safeRatio));
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  );
  await ensureDir(outPath);
  const square = await sharp({ create: { width: size, height: size, channels: 4, background: { ...BRAND_BLUE, alpha: 1 } } })
    .composite([{ input: glyphBuf, gravity: "center" }])
    .png()
    .toBuffer();
  await sharp(square).composite([{ input: circleMask, blend: "dest-in" }]).png().toFile(outPath);
}

// Transparent foreground layer for Android adaptive icons.
async function foregroundIcon(size, safeRatio, outPath) {
  const glyphBuf = await fitGlyph(await whiteGlyphBuffer(), Math.round(size * safeRatio));
  await ensureDir(outPath);
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: glyphBuf, gravity: "center" }])
    .png()
    .toFile(outPath);
}

// Transparent favicon/PWA "any" icon: blue glyph, no background.
async function transparentGlyphIcon(size, padRatio, outPath) {
  const glyphBuf = await fitGlyph(await blueGlyphBuffer(), Math.round(size * (1 - padRatio)));
  await ensureDir(outPath);
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: glyphBuf, gravity: "center" }])
    .png()
    .toFile(outPath);
}

function buildIco(pngBuffers) {
  // pngBuffers: [{ size, buf }] — modern ICO directory entries pointing at embedded PNGs.
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  const imageBuffers = [];
  let offset = 6 + count * 16;
  for (const { size, buf } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    imageBuffers.push(buf);
    offset += buf.length;
  }
  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

async function main() {
  if (!fs.existsSync(GLYPH)) throw new Error(`Missing glyph source: ${GLYPH}`);

  // --- Web: favicons + PWA icons (public/) ---
  const pub = path.join(ROOT, "public");
  await transparentGlyphIcon(16, 0.08, path.join(pub, "favicon-16x16.png"));
  await transparentGlyphIcon(32, 0.08, path.join(pub, "favicon-32x32.png"));
  await transparentGlyphIcon(48, 0.08, path.join(pub, "favicon-48x48.png"));
  await transparentGlyphIcon(192, 0.12, path.join(pub, "pwa-192x192.png"));
  await opaqueSquareIcon(512, 0.62, path.join(pub, "pwa-512x512.png")); // maskable: full-bleed + safe zone

  const icoSizes = [16, 32, 48];
  const icoBuffers = [];
  for (const size of icoSizes) {
    icoBuffers.push({ size, buf: fs.readFileSync(path.join(pub, `favicon-${size}x${size}.png`)) });
  }
  fs.writeFileSync(path.join(pub, "favicon.ico"), buildIco(icoBuffers));

  const svgPng = fs.readFileSync(path.join(pub, "favicon-48x48.png")).toString("base64");
  fs.writeFileSync(
    path.join(pub, "favicon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><image width="48" height="48" href="data:image/png;base64,${svgPng}"/></svg>`
  );

  // --- iOS native app icon (must be opaque, exactly 1024x1024) ---
  await opaqueSquareIcon(
    1024, 0.62,
    path.join(ROOT, "ios", "App", "App", "Assets.xcassets", "AppIcon.appiconset", "AppIcon-512@2x.png")
  );

  // --- Android native launcher icons ---
  const densities = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
  for (const [dpi, size] of Object.entries(densities)) {
    const dir = path.join(ROOT, "android", "app", "src", "main", "res", `mipmap-${dpi}`);
    await opaqueSquareIcon(size, 0.62, path.join(dir, "ic_launcher.png"));
    await roundIcon(size, 0.62, path.join(dir, "ic_launcher_round.png"));
    await foregroundIcon(size, 0.44, path.join(dir, "ic_launcher_foreground.png")); // tighter: adaptive safe zone
  }

  const bgXmlPath = path.join(ROOT, "android", "app", "src", "main", "res", "values", "ic_launcher_background.xml");
  fs.writeFileSync(
    bgXmlPath,
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BRAND_BLUE_HEX}</color>\n</resources>\n`
  );

  console.log("Icon assets regenerated from new glyph.");
}

main();
