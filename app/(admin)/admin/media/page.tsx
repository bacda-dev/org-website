/**
 * Admin — Media: gallery videos CRUD + simple storage browser.
 */

import { getGalleryVideos } from '@/lib/fetchers/gallery';
import { createServerClient } from '@/lib/supabase/server';
import { GalleryVideosManager } from './gallery-videos-manager';
import { StorageBrowser } from './storage-browser';

export const dynamic = 'force-dynamic';

interface StorageEntry {
  name: string;
  path: string;
  publicUrl: string;
}

async function listBucket(
  bucket: string,
  prefix: string,
  limit = 100
): Promise<StorageEntry[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit,
    sortBy: { column: 'name', order: 'asc' },
  });
  if (error || !data) return [];
  const entries: StorageEntry[] = [];
  for (const f of data) {
    if (!f.name) continue;
    // Skip "placeholder" entries (folders) — Supabase returns `null` id for
    // folders; files have an id.
    if (!f.id) continue;
    const path = prefix ? `${prefix}/${f.name}` : f.name;
    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    entries.push({ name: f.name, path, publicUrl });
  }
  return entries;
}

export default async function AdminMediaPage() {
  const [videos, galleryFiles, posterFiles] = await Promise.all([
    getGalleryVideos(),
    listBucket('gallery', ''),
    listBucket('posters', ''),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cream/55">
          Admin · Media
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
          Media
        </h1>
        <p className="mt-1 text-sm text-cream/55">
          Gallery videos + storage buckets.
        </p>
      </div>

      <section>
        <h2 className="mb-4 font-display text-xl font-medium">Gallery videos</h2>
        <GalleryVideosManager videos={videos} />
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-medium">Storage</h2>
        <StorageBrowser
          buckets={[
            { name: 'gallery', entries: galleryFiles },
            { name: 'posters', entries: posterFiles },
          ]}
        />
      </section>
    </div>
  );
}
