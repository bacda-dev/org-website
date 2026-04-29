import { EventCard } from './event-card';
import { StaggerGroup, RevealItem } from './reveal';
import type { EventRow } from '@/types/database';

/**
 * Event grid — staggered reveal, asymmetric column counts so it doesn't feel
 * like a generic SaaS card grid. 3 columns on xl, 2 on md, 1 on mobile.
 */
export interface EventGridProps {
  events: EventRow[];
  emptyLabel?: string;
}

export function EventGrid({ events, emptyLabel }: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 border-t border-cream/10 py-20">
        <span className="label-eyebrow-muted">Intermission</span>
        <p className="max-w-md font-display text-2xl text-cream/70 md:text-3xl">
          {emptyLabel ?? 'No events to display.'}
        </p>
      </div>
    );
  }
  return (
    <StaggerGroup
      as="ul"
      step={0.06}
      className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:grid-cols-3"
    >
      {events.map((e, i) => (
        <RevealItem key={e.id} as="li">
          <EventCard event={e} index={i + 1} />
        </RevealItem>
      ))}
    </StaggerGroup>
  );
}
