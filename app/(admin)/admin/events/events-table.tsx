'use client';

/**
 * EventsTable — filter chips + table with row-level actions.
 *
 * Client component so we can track filter state and wire row-level
 * optimistic actions (toggle featured, delete) via useTransition. Table
 * body renders a row per event with link to /admin/events/[id].
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Star, StarOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import {
  DataTable,
  DataTableEmpty,
  DataTableHead,
} from '@/components/admin/data-table';
import { deleteEvent, toggleFeaturedEvent } from '@/lib/actions/events';
import { cn } from '@/lib/utils';
import type { EventRow } from '@/types/database';

type Filter = 'all' | 'upcoming' | 'past' | 'draft';

const FILTERS: ReadonlyArray<{ value: Filter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'draft', label: 'Draft' },
];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function statusBadge(status: EventRow['status']): React.ReactNode {
  switch (status) {
    case 'upcoming':
      return <Badge variant="default">Upcoming</Badge>;
    case 'past':
      return <Badge variant="outline">Past</Badge>;
    case 'draft':
      return <Badge variant="secondary">Draft</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export interface EventsTableProps {
  events: EventRow[];
}

export function EventsTable({ events }: EventsTableProps) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<Filter>('all');
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    if (filter === 'all') return events;
    return events.filter((e) => e.status === filter);
  }, [events, filter]);

  const toggleFeatured = async (id: string) => {
    setPendingId(id);
    try {
      const result = await toggleFeaturedEvent(id);
      if (!result.ok) {
        toast.error(result.error ?? 'Could not update featured flag');
        return;
      }
      toast.success(
        result.data.is_featured
          ? 'Event featured on home'
          : 'Event unfeatured'
      );
      router.refresh();
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteEvent(id);
    if (!result.ok) {
      toast.error(result.error ?? 'Delete failed');
      return;
    }
    toast.success('Event deleted');
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Filter events"
        className="flex flex-wrap items-center gap-2"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
              filter === f.value
                ? 'border-burgundy bg-burgundy text-cream'
                : 'border-border bg-white text-ink hover:bg-accent'
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted">
          {filtered.length} of {events.length}
        </span>
      </div>

      <DataTable caption="Events list">
        <DataTableHead
          columns={[
            { key: 'title', label: 'Title', className: 'w-[40%]' },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status' },
            { key: 'featured', label: 'Featured' },
            { key: 'actions', label: 'Actions', className: 'text-right' },
          ]}
        />
        <tbody>
          {filtered.length === 0 ? (
            <DataTableEmpty colSpan={5} message="No events match this filter." />
          ) : (
            filtered.map((event) => (
              <tr
                key={event.id}
                className="border-b border-border transition-colors hover:bg-accent/30"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="font-medium text-ink hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
                  >
                    {event.title}
                  </Link>
                  {event.subtitle ? (
                    <p className="mt-0.5 text-xs text-muted">{event.subtitle}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-sm text-ink">
                  {formatDate(event.event_date)}
                </td>
                <td className="px-4 py-3">{statusBadge(event.status)}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    aria-label={
                      event.is_featured ? 'Unfeature event' : 'Feature event'
                    }
                    disabled={pendingId === event.id}
                    onClick={() => toggleFeatured(event.id)}
                    className={cn(
                      'inline-flex size-8 items-center justify-center rounded',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy',
                      event.is_featured
                        ? 'text-burgundy'
                        : 'text-muted hover:text-ink'
                    )}
                  >
                    {event.is_featured ? (
                      <Star className="size-4 fill-current" aria-hidden="true" />
                    ) : (
                      <StarOff className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/events/${event.id}`}>
                        <Pencil className="size-4" aria-hidden="true" />
                        <span className="sr-only">Edit {event.title}</span>
                      </Link>
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="sm" className="text-error hover:bg-error/10">
                          <Trash2 className="size-4" aria-hidden="true" />
                          <span className="sr-only">Delete {event.title}</span>
                        </Button>
                      }
                      title={`Delete "${event.title}"?`}
                      description="This permanently removes the event, its photos, and videos. This cannot be undone."
                      confirmLabel="Delete event"
                      onConfirm={() => handleDelete(event.id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </DataTable>
    </div>
  );
}
