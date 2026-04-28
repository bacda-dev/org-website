/**
 * Dynamic sitemap — static public routes + one row per non-draft event.
 *
 * Next.js serves the result at `/sitemap.xml` automatically. We pull the
 * event list from Supabase via the existing `getAllEvents` fetcher (which is
 * `unstable_cache`-wrapped, so this is cheap on repeated requests).
 *
 * Resilience: if Supabase is unreachable or returns an error, `getAllEvents`
 * degrades to `[]` per our fetcher contract. We still want a valid sitemap
 * in that case, so we just emit the static routes.
 */

import type { MetadataRoute } from 'next';
import { getAllEvents } from '@/lib/fetchers/events';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bayareacreativedancers.org'
).replace(/\/+$/, '');

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: Array<Pick<SitemapEntry, 'url' | 'changeFrequency' | 'priority'>> = [
  { url: '/', changeFrequency: 'weekly', priority: 1.0 },
  { url: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { url: '/events', changeFrequency: 'weekly', priority: 0.9 },
  { url: '/gallery', changeFrequency: 'weekly', priority: 0.7 },
  { url: '/contact', changeFrequency: 'yearly', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const base: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let events: Awaited<ReturnType<typeof getAllEvents>> = [];
  try {
    events = await getAllEvents();
  } catch {
    // Fetcher already swallows errors, but belt-and-braces: a thrown error
    // must not break the build or take the sitemap down.
    events = [];
  }

  const eventEntries: MetadataRoute.Sitemap = events
    .filter((e) => typeof e.slug === 'string' && e.slug.length > 0)
    .map((e) => {
      const lastMod = e.updated_at ? new Date(e.updated_at) : now;
      return {
        url: `${SITE_URL}/events/${e.slug}`,
        lastModified: lastMod,
        // Upcoming events get updated often (tickets, lineup); past events
        // are effectively frozen.
        changeFrequency: e.status === 'upcoming' ? 'weekly' : 'yearly',
        priority: e.status === 'upcoming' ? 0.8 : 0.5,
      };
    });

  return [...base, ...eventEntries];
}
