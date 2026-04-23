import { EventCard } from './event-card';
import type { EventRow } from '@/types/database';

/**
 * Responsive event grid — 1 / 2 / 3 / 4 columns depending on viewport.
 */
export interface EventGridProps {
  events: EventRow[];
  emptyLabel?: string;
}

export function EventGrid({ events, emptyLabel }: EventGridProps) {
  if (events.length === 0) {
    return (
      <p className="py-16 text-center text-muted">
        {emptyLabel ?? 'No events to display.'}
      </p>
    );
  }
  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {events.map((e) => (
        <li key={e.id}>
          <EventCard event={e} />
        </li>
      ))}
    </ul>
  );
}
