import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { storageUrl } from '@/lib/utils';
import type { EventRow } from '@/types/database';

/**
 * Event card — poster + title + date + venue, linking either to the detail
 * page (past events) or exposing a ticket CTA (upcoming events).
 */
export interface EventCardProps {
  event: EventRow;
}

export function EventCard({ event }: EventCardProps) {
  const poster = event.poster_url
    ? event.poster_url.startsWith('http')
      ? event.poster_url
      : storageUrl('posters', event.poster_url)
    : null;

  let dateLabel = '';
  try {
    dateLabel = format(
      parseISO(event.event_date),
      event.status === 'past' ? 'yyyy' : 'MMM d, yyyy'
    );
  } catch {
    dateLabel = String(event.year);
  }

  return (
    <article className="group relative">
      <Link
        href={`/events/${event.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-ink/5">
          {poster ? (
            <Image
              src={poster}
              alt={`${event.title} poster`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4 text-center">
              <span className="font-display text-xl italic text-muted">
                {event.title}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/70">
              {dateLabel}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-display text-xl font-medium italic leading-snug text-ink transition-colors group-hover:text-burgundy md:text-2xl">
            {event.title}
          </h3>
          {event.venue_name && (
            <p className="mt-1 text-sm text-muted">{event.venue_name}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
