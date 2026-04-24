/**
 * Admin — Events list.
 *
 * Server component reads all events (incl. drafts) via service-role client
 * since `getAllEvents()` hides drafts. Hands off to EventsTable client
 * component for filter chips + row actions.
 */

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createServerClient } from '@/lib/supabase/server';
import type { EventRow } from '@/types/database';
import { EventsTable } from './events-table';

export const dynamic = 'force-dynamic';

async function loadAllEvents(): Promise<EventRow[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });
  if (error) return [];
  return (data ?? []) as EventRow[];
}

export default async function AdminEventsPage() {
  const events = await loadAllEvents();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cream/55">
            Admin · Events
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
            Events
          </h1>
          <p className="mt-1 text-sm text-cream/55">
            Productions, workshops, concerts. Drafts are visible here only.
          </p>
        </div>
        <Button asChild size="md">
          <Link href="/admin/events/new">
            <Plus className="size-4" aria-hidden="true" />
            New event
          </Link>
        </Button>
      </div>

      <EventsTable events={events} />
    </div>
  );
}
