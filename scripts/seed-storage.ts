/**
 * scripts/seed-storage.ts
 * ─────────────────────────
 * Idempotently uploads legacy BACDA images from
 *   legacy-website/public_html/img/**
 * into the Supabase Storage buckets `gallery` and `posters`.
 *
 * Usage:
 *   npm run seed:storage              # real upload (requires .env.local)
 *   npx tsx scripts/seed-storage.ts --dry-run
 *
 * Also emits `supabase/seed-photos.sql` with INSERT statements that link
 * uploaded gallery photos to their event rows via slug. Run that file after
 * storage is populated (`psql` or Supabase SQL editor).
 *
 * Design notes:
 *   - Skips files larger than 2 MB (flagged for manual handling).
 *   - Uses `upsert: true` so running repeatedly is safe.
 *   - If Supabase isn't reachable (or env vars are missing), logs and
 *     exits 0 — so CI and fresh clones don't fail.
 */

import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import * as path from 'path';

// ─────────────────────────────────────────────────────────────────────────
// Lightweight .env.local loader (avoids pulling in dotenv as a dep).
// Reads KEY=VALUE pairs, strips optional surrounding quotes, skips comments.
// Anything the process already has in env wins — we don't overwrite.
// ─────────────────────────────────────────────────────────────────────────
async function loadDotEnv(): Promise<void> {
  const envPath = path.resolve(__dirname, '..', '.env.local');
  let raw: string;
  try {
    raw = await fs.readFile(envPath, 'utf8');
  } catch {
    return;
  }
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (key in process.env) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// CLI flag parsing
// ─────────────────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run');
const MAX_BYTES = 2 * 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────
// Paths
// ─────────────────────────────────────────────────────────────────────────
const REPO_ROOT = path.resolve(__dirname, '..');
const LEGACY_IMG = path.join(
  REPO_ROOT,
  'legacy-website',
  'public_html',
  'img',
);
const SEED_PHOTOS_SQL = path.join(REPO_ROOT, 'supabase', 'seed-photos.sql');

// ─────────────────────────────────────────────────────────────────────────
// Upload plan
// ─────────────────────────────────────────────────────────────────────────
type PlanItem = {
  localPath: string;          // absolute path under legacy-website/
  bucket: 'gallery' | 'posters';
  storagePath: string;        // key in the bucket
  eventSlug?: string;         // when set, a row is inserted into event_photos
  sortOrder?: number;
};

function addIfExists(plan: PlanItem[], item: PlanItem) {
  plan.push(item);
}

/** Numbered legacy folders (img/events/1..10) — best-effort slug mapping. */
const LEGACY_EVENT_FOLDER_MAP: Record<string, string> = {
  '1': 'nabc-2017-opening',
  '2': 'nabc-2017-closing',
  '3': 'raabdta-2018',
  '4': 'spring-india-festival',
  '5': 'folk-dance-agomoni-2019',
  '6': 'west-coast-theater-festival-2019',
  '7': 'banga-mela-2019',
  '8': 'bodhayon-2020',
  '9': 'chitra-enacte-2017',
  '10': 'sitar-concert-sugato-nag',
};

async function buildPlan(): Promise<PlanItem[]> {
  const plan: PlanItem[] = [];

  // Brand / logo backup
  addIfExists(plan, {
    localPath: path.join(LEGACY_IMG, 'bacda-2020-logo.png'),
    bucket: 'gallery',
    storagePath: 'brand/bacda-logo.png',
  });

  // Hero slider → gallery/hero/
  for (const [legacy, dest] of [
    ['slider1-new.jpg', 'slider1.jpg'],
    ['slider1-new1.jpg', 'slider2.jpg'],
    ['slider1-new2.jpg', 'slider3.jpg'],
    ['slider1-new3.jpg', 'slider4.jpg'],
    ['slider2-new.jpg', 'slider5.jpg'],
    ['slider3-new.jpg', 'slider6.jpg'],
    ['slider4-new.jpg', 'slider7.jpg'],
  ] as const) {
    addIfExists(plan, {
      localPath: path.join(LEGACY_IMG, 'parallax-slider', legacy),
      bucket: 'gallery',
      storagePath: `hero/${dest}`,
    });
  }

  // Testimonial photos → gallery/testimonials/
  for (const [legacy, dest] of [
    ['tshankars.jpg', 'tanushree-shankar.jpg'],
    ['dmishras.jpg',  'debojyoti-mishra.jpg'],
    ['gjoshi.jpg',    'gayatri-joshi.jpg'],
    ['sanjibs.jpg',   'sanjib-bhattacharya.jpg'],
  ] as const) {
    addIfExists(plan, {
      localPath: path.join(LEGACY_IMG, 'team', legacy),
      bucket: 'gallery',
      storagePath: `testimonials/${dest}`,
    });
  }

  // Event posters → posters/<slug>/poster.*
  const posterMap: Array<[string, string, string]> = [
    ['BACDA2025.png',      'kingdom-of-dreams-2025',         'poster.png'],
    ['raabdta.jpg',        'raabdta-2018',                    'poster.jpg'],
    ['tanushree-2023.jpg', 'tanushree-shankar-workshop-2023', 'poster.jpg'],
    ['mallikas-2023.jpg',  'mallika-sarabhai-workshop-2023',  'poster.jpg'],
    ['sanjib-workshop.jpg','sanjib-bhattacharya-workshop',   'poster.jpg'],
  ];
  for (const [legacy, slug, dest] of posterMap) {
    addIfExists(plan, {
      localPath: path.join(LEGACY_IMG, 'events', 'upcoming', legacy),
      bucket: 'posters',
      storagePath: `${slug}/${dest}`,
    });
  }

  // Event gallery folders img/events/1..10 → gallery/events/<slug>/<n>.jpg
  const eventsDir = path.join(LEGACY_IMG, 'events');
  for (const folder of Object.keys(LEGACY_EVENT_FOLDER_MAP)) {
    const slug = LEGACY_EVENT_FOLDER_MAP[folder]!;
    const folderPath = path.join(eventsDir, folder);
    let entries: string[] = [];
    try {
      entries = await fs.readdir(folderPath);
    } catch {
      continue;
    }
    const photos = entries.filter((e) => /\.(jpe?g|png)$/i.test(e)).sort();
    for (let i = 0; i < photos.length; i += 1) {
      const file = photos[i]!;
      const ext = path.extname(file).toLowerCase() || '.jpg';
      const storageName = `${String(i + 1).padStart(2, '0')}${ext}`;
      addIfExists(plan, {
        localPath: path.join(folderPath, file),
        bucket: 'gallery',
        storagePath: `events/${slug}/${storageName}`,
        eventSlug: slug,
        sortOrder: i,
      });
    }
  }

  // Home imagery → gallery/home/
  const homeDir = path.join(LEGACY_IMG, 'home');
  try {
    const entries = await fs.readdir(homeDir);
    for (const entry of entries) {
      if (!/\.(jpe?g|png)$/i.test(entry)) continue;
      addIfExists(plan, {
        localPath: path.join(homeDir, entry),
        bucket: 'gallery',
        storagePath: `home/${entry.toLowerCase().replace(/\s+/g, '-')}`,
      });
    }
  } catch {
    // home dir missing — nothing to do.
  }

  return plan;
}

// ─────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────
async function main() {
  await loadDotEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const plan = await buildPlan();

  console.log(
    `[seed-storage] planned ${plan.length} uploads (${DRY_RUN ? 'DRY RUN' : 'LIVE'})`,
  );

  if (DRY_RUN) {
    printPlan(plan);
    await writePhotosSql(plan);
    console.log('[seed-storage] wrote supabase/seed-photos.sql');
    return;
  }

  if (!url || !serviceKey) {
    console.warn(
      '[seed-storage] NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — skipping storage seed',
    );
    await writePhotosSql(plan);
    console.log('[seed-storage] wrote supabase/seed-photos.sql (for later)');
    return;
  }

  // Lightweight reachability probe — avoid tanking on a cold local.
  // A 401 counts as reachable (endpoint alive; auth required). Only network
  // failures or 5xx errors should abort the seed.
  try {
    const probe = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: serviceKey },
    }).catch(() => null);
    if (!probe || probe.status >= 500) {
      console.warn(
        `[seed-storage] Supabase not reachable at ${url} (${probe?.status ?? 'network fail'}), skipping storage seed`,
      );
      await writePhotosSql(plan);
      return;
    }
  } catch {
    console.warn(
      `[seed-storage] Supabase not reachable at ${url}, skipping storage seed`,
    );
    await writePhotosSql(plan);
    return;
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let uploaded = 0;
  let skippedMissing = 0;
  let skippedLarge = 0;
  let failed = 0;
  const tooLarge: PlanItem[] = [];

  for (const item of plan) {
    let buffer: Buffer;
    let stat;
    try {
      stat = await fs.stat(item.localPath);
      if (stat.size > MAX_BYTES) {
        skippedLarge += 1;
        tooLarge.push(item);
        continue;
      }
      buffer = await fs.readFile(item.localPath);
    } catch {
      skippedMissing += 1;
      continue;
    }

    const contentType = inferContentType(item.localPath);
    const { error } = await supabase.storage
      .from(item.bucket)
      .upload(item.storagePath, buffer, {
        upsert: true,
        contentType,
        cacheControl: '3600',
      });

    if (error) {
      failed += 1;
      console.error(
        `[seed-storage] upload failed: ${item.bucket}/${item.storagePath} — ${error.message}`,
      );
    } else {
      uploaded += 1;
    }
  }

  await writePhotosSql(plan);

  console.log(
    `[seed-storage] done — uploaded: ${uploaded}, missing: ${skippedMissing}, too-large: ${skippedLarge}, failed: ${failed}`,
  );
  if (tooLarge.length > 0) {
    console.log('[seed-storage] files skipped for size (>2 MB):');
    for (const item of tooLarge) console.log(`  - ${item.localPath}`);
  }
}

function printPlan(plan: PlanItem[]) {
  for (const item of plan) {
    const suffix = item.eventSlug ? `  (event: ${item.eventSlug})` : '';
    console.log(
      `  ${item.bucket}/${item.storagePath}  ←  ${path.relative(REPO_ROOT, item.localPath)}${suffix}`,
    );
  }
}

function inferContentType(p: string): string {
  const ext = path.extname(p).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  return 'image/jpeg';
}

async function writePhotosSql(plan: PlanItem[]) {
  const bySlug = new Map<string, PlanItem[]>();
  for (const item of plan) {
    if (!item.eventSlug) continue;
    const bucket = bySlug.get(item.eventSlug) ?? [];
    bucket.push(item);
    bySlug.set(item.eventSlug, bucket);
  }

  const lines: string[] = [];
  lines.push(
    '-- seed-photos.sql — generated by scripts/seed-storage.ts',
  );
  lines.push(
    '-- Links uploaded gallery photos to event rows by slug. Safe to re-run.',
  );
  lines.push('');

  for (const [slug, items] of bySlug) {
    items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    lines.push(
      `-- ${slug} (${items.length} photo${items.length === 1 ? '' : 's'})`,
    );
    lines.push(
      `delete from event_photos where event_id = (select id from events where slug = '${slug}');`,
    );
    for (const item of items) {
      const safePath = item.storagePath.replace(/'/g, "''");
      lines.push(
        `insert into event_photos (event_id, storage_path, sort_order)\n` +
          `  select id, '${safePath}', ${item.sortOrder ?? 0} from events where slug = '${slug}';`,
      );
    }
    lines.push('');
  }

  await fs.writeFile(SEED_PHOTOS_SQL, lines.join('\n') + '\n', 'utf8');
}

main().catch((err) => {
  console.error('[seed-storage] fatal error:', err);
  process.exit(1);
});
