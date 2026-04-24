/**
 * Admin — Sponsors CRUD. New screen per user directive.
 */

import { createServerClient } from '@/lib/supabase/server';
import { SponsorsManager } from './sponsors-manager';
import type { SponsorRow } from '@/types/database';

export const dynamic = 'force-dynamic';

async function loadAllSponsors(): Promise<SponsorRow[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as SponsorRow[];
}

export default async function AdminSponsorsPage() {
  const sponsors = await loadAllSponsors();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cream/55">
          Admin · Sponsors
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
          Sponsors
        </h1>
        <p className="mt-1 text-sm text-cream/55">
          Logos shown on the sponsors strip when active. Ships empty until
          confirmed live.
        </p>
      </div>

      <SponsorsManager sponsors={sponsors} />
    </div>
  );
}
