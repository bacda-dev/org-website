/**
 * Instagram-highlight fetcher — cached 60s, tag 'instagram'.
 */

import { unstable_cache } from 'next/cache';
import { createAnonServerClient } from '@/lib/supabase/server';
import type { InstagramHighlightRow } from '@/types/database';

const REVALIDATE_SECONDS = 60;
const TAGS = ['instagram'];

async function fetchHighlights(): Promise<InstagramHighlightRow[]> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('instagram_highlights')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as InstagramHighlightRow[];
}

export const getInstagramHighlights = unstable_cache(
  fetchHighlights,
  ['instagram:all'],
  { revalidate: REVALIDATE_SECONDS, tags: TAGS },
);
