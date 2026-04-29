// Render scripts/style-pdf/brand-guide.html → BACDA-Brand-Guide.pdf
// Uses the Playwright Chromium that's already installed via @playwright/test.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, 'brand-guide.html');
const pdfPath = resolve(__dirname, '..', '..', 'BACDA-Brand-Guide.pdf');

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
// Give Google Fonts an extra beat to swap.
await page.waitForTimeout(800);
await page.pdf({
  path: pdfPath,
  format: 'Letter',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  preferCSSPageSize: true,
});
await browser.close();
console.log('wrote', pdfPath);
