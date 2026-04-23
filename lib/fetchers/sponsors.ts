/**
 * Sponsor fetcher — cached 60s, tag 'sponsors'.
 */

import { unstable_cache } from 'next/cache';
import { createAnonServerClient } from '@/lib/supabase/server';
import type { SponsorRow } from '@/types/database';

const REVALIDATE_SECONDS = 60;
const TAGS = ['sponsors'];

async function fetchActive(): Promise<SponsorRow[]> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as SponsorRow[];
}

export const getActiveSponsors = unstable_cache(fetchActive, ['sponsors:active'], {
  revalidate: REVALIDATE_SECONDS,
  tags: TAGS,
});
