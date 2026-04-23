'use client';

import * as React from 'react';
import { EventGrid } from './event-grid';
import { cn } from '@/lib/utils';
import type { EventRow } from '@/types/database';

/**
 * Past-events year filter — a horizontal pill rail (not a generic select box).
 * Scrollable on mobile. Active year is amber-filled; inactive reads as a
 * cream-ghost pill. Count updates live.
 */
export interface PastEventsFilterProps {
  events: EventRow[];
  years: number[];
}

export function PastEventsFilter({ events, years }: PastEventsFilterProps) {
  const [year, setYear] = React.useState<'all' | number>('all');
  const filtered =
    year === 'all' ? events : events.filter((e) => e.year === year);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 border-y border-cream/10 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="label-eyebrow-muted">Filter · Year</span>
          <span className="font-mono text-xs text-cream/55">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'performance' : 'performances'}
          </span>
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-1 md:pb-0"
          role="tablist"
          aria-label="Year filter"
        >
          <FilterPill
            active={year === 'all'}
            onClick={() => setYear('all')}
            label="All"
          />
          {years.map((y) => (
            <FilterPill
              key={y}
              active={year === y}
              onClick={() => setYear(y)}
              label={String(y)}
            />
          ))}
        </div>
      </div>

      <EventGrid
        events={filtered}
        emptyLabel="No performances found for the selected year."
      />
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] transition-colors',
        active
          ? 'border-burgundy bg-burgundy text-ink'
          : 'border-cream/20 text-cream/70 hover:border-cream/50 hover:text-cream'
      )}
    >
      {label}
    </button>
  );
}
