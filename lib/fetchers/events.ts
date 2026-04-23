/**
 * Event fetchers — RLS-respecting reads against the public schema.
 * Cached with `unstable_cache` (60s revalidation, tagged 'events').
 */

import { unstable_cache } from 'next/cache';
import { createAnonServerClient } from '@/lib/supabase/server';
import type { EventRow } from '@/types/database';

const REVALIDATE_SECONDS = 60;
const TAGS = ['events'];

async function fetchUpcoming(): Promise<EventRow[]> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
    .order('event_date', { ascending: true });
  if (error) return [];
  return (data ?? []) as EventRow[];
}

async function fetchPast(): Promise<EventRow[]> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'past')
    .order('event_date', { ascending: false });
  if (error) return [];
  return (data ?? []) as EventRow[];
}

async function fetchAll(): Promise<EventRow[]> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .neq('status', 'draft')
    .order('event_date', { ascending: false });
  if (error) return [];
  return (data ?? []) as EventRow[];
}

async function fetchBySlug(slug: string): Promise<EventRow | null> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return null;
  return (data as EventRow | null) ?? null;
}

async function fetchFeatured(): Promise<EventRow | null> {
  const supabase = createAnonServerClient();
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
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('year')
    .eq('status', 'past')
    .order('year', { ascending: false });
  if (error || !data) return [];
  const years = new Set<number>();
  for (const row of data as Array<{ year: number | null }>) {
    if (row.year != null) years.add(row.year);
  }
  return Array.from(years).sort((a, b) => b - a);
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
