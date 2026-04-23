/**
 * Home-content fetcher — singleton row, cached 60s, tag 'home'.
 */

import { unstable_cache } from 'next/cache';
import { createAnonServerClient } from '@/lib/supabase/server';
import type { HomeContentRow } from '@/types/database';

const REVALIDATE_SECONDS = 60;
const TAGS = ['home'];

async function fetchHome(): Promise<HomeContentRow | null> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('home_content')
    .select('*')
    .eq('singleton_key', 'home')
    .maybeSingle();
  if (error) return null;
  return (data as HomeContentRow | null) ?? null;
}

export const getHomeContent = unstable_cache(fetchHome, ['home:singleton'], {
  revalidate: REVALIDATE_SECONDS,
  tags: TAGS,
});
