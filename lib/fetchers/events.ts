/**
 * Event fetchers — RLS-respecting reads against the public schema.
 *
 * Every fetcher falls back to the static library in
 * `lib/data/events-fallback.ts` when the DB is empty (fresh cloud
 * project, RLS deny, migration not yet run). That keeps the public
 * site fully populated before an admin has uploaded anything, and
 * silently hands over to live data once rows exist.
 *
 * Cached with `unstable_cache` (60s revalidation, tagged 'events').
 */

import { unstable_cache } from 'next/cache';
import { createPublicReadClient } from '@/lib/supabase/server';
import type { EventRow } from '@/types/database';
import {
  FALLBACK_EVENTS,
  getFallbackEventBySlug,
} from '@/lib/data/events-fallback';

const REVALIDATE_SECONDS = 60;
const TAGS = ['events'];

async function fetchUpcoming(): Promise<EventRow[]> {
  const supabase = createPublicReadClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
    .order('event_date', { ascending: true });
  if (error) return upcomingFallback();
  const rows = (data ?? []) as EventRow[];
  return rows.length > 0 ? rows : upcomingFallback();
}

async function fetchPast(): Promise<EventRow[]> {
  const supabase = createPublicReadClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'past')
    .order('event_date', { ascending: false });
  if (error) return pastFallback();
  const rows = (data ?? []) as EventRow[];
  return rows.length > 0 ? rows : pastFallback();
}

async function fetchAll(): Promise<EventRow[]> {
  const supabase = createPublicReadClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .neq('status', 'draft')
    .order('event_date', { ascending: false });
  if (error) return allFallback();
  const rows = (data ?? []) as EventRow[];
  return rows.length > 0 ? rows : allFallback();
}

async function fetchBySlug(slug: string): Promise<EventRow | null> {
  const supabase = createPublicReadClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return getFallbackEventBySlug(slug);
  return (data as EventRow | null) ?? getFallbackEventBySlug(slug);
}

async function fetchFeatured(): Promise<EventRow | null> {
  const supabase = createPublicReadClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_featured', true)
    .neq('status', 'draft')
    .order('event_date', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return (data as EventRow | null) ?? null;
}

async function fetchYears(): Promise<number[]> {
  const supabase = createPublicReadClient();
  const { data, error } = await supabase
    .from('events')
    .select('year')
    .eq('status', 'past')
    .order('year', { ascending: false });
  if (error || !data || data.length === 0) return yearsFallback();
  const years = new Set<number>();
  for (const row of data as Array<{ year: number | null }>) {
    if (row.year != null) years.add(row.year);
  }
  const dbYears = Array.from(years).sort((a, b) => b - a);
  return dbYears.length > 0 ? dbYears : yearsFallback();
}

// ── fallback helpers ──────────────────────────────────────────────────────

function upcomingFallback(): EventRow[] {
  return FALLBACK_EVENTS.filter((e) => e.status === 'upcoming').sort(
    (a, b) => a.event_date.localeCompare(b.event_date),
  );
}

function pastFallback(): EventRow[] {
  return FALLBACK_EVENTS.filter((e) => e.status === 'past').sort((a, b) =>
    b.event_date.localeCompare(a.event_date),
  );
}

function allFallback(): EventRow[] {
  return [...FALLBACK_EVENTS].sort((a, b) =>
    b.event_date.localeCompare(a.event_date),
  );
}

function yearsFallback(): number[] {
  return Array.from(
    new Set(FALLBACK_EVENTS.filter((e) => e.status === 'past').map((e) => e.year)),
  ).sort((a, b) => b - a);
}

export const getUpcomingEvents = unstable_cache(fetchUpcoming, ['events:upcoming'], {
  revalidate: REVALIDATE_SECONDS,
  tags: TAGS,
});

export const getPastEvents = unstable_cache(fetchPast, ['events:past'], {
  revalidate: REVALIDATE_SECONDS,
  tags: TAGS,
});

export const getAllEvents = unstable_cache(fetchAll, ['events:all'], {
  revalidate: REVALIDATE_SECONDS,
  tags: TAGS,
});

export const getEventBySlug = (slug: string): Promise<EventRow | null> =>
  unstable_cache(
    () => fetchBySlug(slug),
    ['events:slug', slug],
    { revalidate: REVALIDATE_SECONDS, tags: TAGS },
  )();

export const getFeaturedEvent = unstable_cache(fetchFeatured, ['events:featured'], {
  revalidate: REVALIDATE_SECONDS,
  tags: TAGS,
});

export const getEventYears = unstable_cache(fetchYears, ['events:years'], {
  revalidate: REVALIDATE_SECONDS,
  tags: TAGS,
});
