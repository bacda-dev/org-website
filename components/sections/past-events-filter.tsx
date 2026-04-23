'use client';

import * as React from 'react';
import { EventGrid } from './event-grid';
import type { EventRow } from '@/types/database';

/**
 * Past-events year filter + grid. Client component because the select is
 * interactive. Filters in-memory over the server-fetched list.
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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {filtered.length} {filtered.length === 1 ? 'performance' : 'performances'}
        </p>
        <div className="flex items-center gap-3">
          <label
            htmlFor="year-filter"
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted"
          >
            Year
          </label>
          <select
            id="year-filter"
            value={String(year)}
            onChange={(e) => {
              const v = e.target.value;
              setYear(v === 'all' ? 'all' : Number(v));
            }}
            className="rounded-md border border-border bg-cream px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      <EventGrid
        events={filtered}
        emptyLabel="No performances found for the selected year."
      />
    </div>
  );
}
