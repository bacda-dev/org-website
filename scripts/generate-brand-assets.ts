/**
 * Brand asset generator for BACDA.
 *
 * Takes `public/brand/bacda-logo-original.png` and produces every raster
 * deliverable required by PRD §14.3.2:
 *   - favicon.ico (32x32 PNG bytes; browsers accept PNG inside .ico filename)
 *   - apple-touch-icon.png (180x180 with padding)
 *   - icon-192.png, icon-512.png (PWA manifest)
 *   - og-image.png (1200x630 social card)
 *   - og-image-square.png (1200x1200 Instagram/WhatsApp)
 *
 * SVG assets (bacda-logo.svg, bacda-logo-mono-light.svg, bacda-logo-mono-dark.svg,
 * favicon.svg) are hand-authored in public/brand/ and not regenerated here.
 *
 * Run with:  npx tsx scripts/generate-brand-assets.ts
 *
 * Idempotent — re-running overwrites outputs deterministically.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'brand', 'bacda-logo-original.png');
const OUT_BRAND = path.join(ROOT, 'public', 'brand');
const OUT_PUBLIC = path.join(ROOT, 'public');

// Brand palette (mirrors tailwind.config.ts post §14.3.5 color extraction).
const CREAM = '#FAF7F2';
const INK = '#1A1A1A';

async function ensureOutputs(): Promise<void> {
  await fs.mkdir(OUT_BRAND, { recursive: true });
}

/**
 * Render the source logo centered on a colored canvas with padding.
 */
async function renderOnCanvas(opts: {
  canvasWidth: number;
  canvasHeight: number;
  background: string;
  logoScale: number; // 0-1, fraction of shorter canvas dimension
  outPath: string;
}): Promise<void> {
  const { canvasWidth, canvasHeight, background, logoScale, outPath } = opts;
  const shorter = Math.min(canvasWidth, canvasHeight);
  const targetLogoSize = Math.round(shorter * logoScale);

  // Trim transparent edges of the source PNG, then resize.
  const logo = await sharp(SRC)
    .trim()
    .resize({
      width: targetLogoSize,
      height: targetLogoSize,
      fit: 'inside',
      withoutEnlargement: false,
    })
    .toBuffer();

  const logoMeta = await sharp(logo).metadata();
  const lw = logoMeta.width ?? targetLogoSize;
  const lh = logoMeta.height ?? targetLogoSize;

  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background,
    },
  })
    .composite([
      {
        input: logo,
        left: Math.round((canvasWidth - lw) / 2),
        top: Math.round((canvasHeight - lh) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}

/**
 * OG image: 1200x630 cream canvas, logo centered at ~55% height,
 * with tagline and URL rendered via an inline SVG composite (avoids font
 * dependencies on the system — the SVG text falls back to generic serif).
 */
async function renderOgImage(
  outPath: string,
  dims: { width: number; height: number }
): Promise<void> {
  const { width, height } = dims;
  const logoSize = Math.round(height * 0.42);

  const logo = await sharp(SRC)
    .trim()
    .resize({ width: logoSize, height: logoSize, fit: 'inside' })
    .toBuffer();
  const logoMeta = await sharp(logo).metadata();
  const lw = logoMeta.width ?? logoSize;
  const lh = logoMeta.height ?? logoSize;

  // SVG overlay: tagline + URL. Uses serif stack; Fraunces isn't embedded
  // in the raster pipeline (would require font file loading). This renders
  // cleanly in any browser / social scraper preview.
  const textSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .tag { font-family: 'Georgia', 'Times New Roman', serif;
               font-style: italic; font-weight: 500;
               font-size: 44px; fill: ${INK}; }
        .url { font-family: 'Helvetica', 'Arial', sans-serif;
               font-size: 22px; fill: #6B6B6B; letter-spacing: 2px; }
      </style>
      <text x="50%" y="${height - 110}" text-anchor="middle" class="tag">
        Foster the Love of Dance
      </text>
      <text x="50%" y="${height - 60}" text-anchor="middle" class="url">
        BAYAREACREATIVEDANCERS.ORG
      </text>
    </svg>
  `);

  const logoTop = Math.round(height * 0.18);
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: CREAM,
    },
  })
    .composite([
      {
        input: logo,
        left: Math.round((width - lw) / 2),
        top: logoTop + Math.round((logoSize - lh) / 2),
      },
      { input: textSvg, top: 0, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}

async function main(): Promise<void> {
  await ensureOutputs();

  // Verify source exists.
  try {
    await fs.access(SRC);
  } catch {
    throw new Error(`Source logo not found at ${SRC}`);
  }

  console.log('Generating brand raster assets from', SRC);

  // 1. favicon.ico — 32x32 PNG bytes. Browsers accept PNG for a .ico
  //    filename when served with image/x-icon or image/png.
  await renderOnCanvas({
    canvasWidth: 32,
    canvasHeight: 32,
    background: CREAM,
    logoScale: 0.88,
    outPath: path.join(OUT_PUBLIC, 'favicon.ico'),
  });
  console.log('  favicon.ico');

  // 2. apple-touch-icon 180x180
  await renderOnCanvas({
    canvasWidth: 180,
    canvasHeight: 180,
    background: CREAM,
    logoScale: 0.82,
    outPath: path.join(OUT_BRAND, 'apple-touch-icon.png'),
  });
  console.log('  apple-touch-icon.png');

  // 3. PWA icon 192x192
  await renderOnCanvas({
    canvasWidth: 192,
    canvasHeight: 192,
    background: CREAM,
    logoScale: 0.84,
    outPath: path.join(OUT_BRAND, 'icon-192.png'),
  });
  console.log('  icon-192.png');

  // 4. PWA icon 512x512 (maskable-safe ~80% content area)
  await renderOnCanvas({
    canvasWidth: 512,
    canvasHeight: 512,
    background: CREAM,
    logoScale: 0.78,
    outPath: path.join(OUT_BRAND, 'icon-512.png'),
  });
  console.log('  icon-512.png');

  // 5. OG landscape 1200x630
  await renderOgImage(path.join(OUT_BRAND, 'og-image.png'), {
    width: 1200,
    height: 630,
  });
  console.log('  og-image.png');

  // 6. OG square 1200x1200
  await renderOgImage(path.join(OUT_BRAND, 'og-image-square.png'), {
    width: 1200,
    height: 1200,
  });
  console.log('  og-image-square.png');

  console.log('Done.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
