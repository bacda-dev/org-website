/**
 * Team-member fetchers — cached 60s, tag 'team'.
 */

import { unstable_cache } from 'next/cache';
import { createAnonServerClient } from '@/lib/supabase/server';
import type { TeamMemberRow } from '@/types/database';

const REVALIDATE_SECONDS = 60;
const TAGS = ['team'];

async function fetchMembers(): Promise<TeamMemberRow[]> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as TeamMemberRow[];
}

async function fetchLead(): Promise<TeamMemberRow | null> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_lead', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return (data as TeamMemberRow | null) ?? null;
}

export const getTeamMembers = unstable_cache(fetchMembers, ['team:all'], {
  revalidate: REVALIDATE_SECONDS,
  tags: TAGS,
});

export const getLeadMember = unstable_cache(fetchLead, ['team:lead'], {
  revalidate: REVALIDATE_SECONDS,
  tags: TAGS,
});
