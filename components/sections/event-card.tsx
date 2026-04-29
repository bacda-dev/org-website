import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';
import { storageUrl } from '@/lib/utils';
import type { EventRow } from '@/types/database';

/**
 * Event card — concert-hall noir.
 *
 * Poster + title + date/venue, linking to the detail page. Uses an amber
 * hairline as the visual anchor, a subtle scale on hover, and a small
 * program-index label at the top of each card.
 */
export interface EventCardProps {
  event: EventRow;
  /** Optional 1-based index from the parent grid for the label chip. */
  index?: number;
}

export function EventCard({ event, index }: EventCardProps) {
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
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-ink-100">
          {poster ? (
            <Image
              src={poster}
              alt={`${event.title} poster`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-4 text-center">
              <span className="font-display text-2xl text-cream/40">
                {event.title}
              </span>
            </div>
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cream/10"
          />
          {/* Index chip */}
          {index !== undefined && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-cream/80 backdrop-blur-sm">
              {String(index).padStart(2, '0')}
            </div>
          )}
          {/* Date stamp */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/85">
              {dateLabel}
            </p>
            <ArrowUpRight
              className="size-4 text-cream/60 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-burgundy"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="mt-5">
          <h3 className="font-display text-xl leading-snug text-cream transition-colors group-hover:text-burgundy md:text-2xl">
            {event.title}
          </h3>
          {event.venue_name && (
            <p className="mt-1.5 text-sm text-cream/55">{event.venue_name}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
