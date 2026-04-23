import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { Reveal } from './reveal';
import { storageUrl } from '@/lib/utils';
import type { EventRow } from '@/types/database';

/**
 * Featured upcoming event — concert-hall noir.
 *
 * Asymmetric split: a large poster left, a playbill-style date/venue stack
 * right, with the title spanning the column and oversized italic. The
 * structure echoes a theatre program: index number, title in italic serif,
 * date/venue in caps metadata, then the CTAs.
 */
export interface FeaturedEventProps {
  event: EventRow;
}

export function FeaturedEvent({ event }: FeaturedEventProps) {
  const poster = event.poster_url
    ? event.poster_url.startsWith('http')
      ? event.poster_url
      : storageUrl('posters', event.poster_url)
    : null;

  let dateLine = '';
  let monthLine = '';
  let dayLine = '';
  try {
    const d = parseISO(event.event_date);
    dateLine = format(d, 'EEEE · MMMM d, yyyy');
    monthLine = format(d, 'MMM').toUpperCase();
    dayLine = format(d, 'dd');
  } catch {
    dateLine = event.event_date;
  }

  return (
    <section
      aria-labelledby="featured-event-heading"
      className="relative overflow-hidden bg-ink py-24 md:py-32"
    >
      {/* Section header strip */}
      <div className="container">
        <Reveal className="flex items-center justify-between border-b border-cream/10 pb-6">
          <span className="label-eyebrow">Now on stage</span>
          <Link
            href="/events"
            className="group hidden items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cream/50 transition-colors hover:text-cream md:inline-flex"
          >
            All events
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-10">
          {/* Poster */}
          <Reveal className="md:col-span-6">
            <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-ink-100 shadow-lg">
              {poster ? (
                <Image
                  src={poster}
                  alt={`${event.title} poster`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-8 text-center">
                  <span className="font-display text-3xl italic text-cream/40">
                    {event.title}
                  </span>
                </div>
              )}
              {/* Poster frame overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cream/10"
              />
              {/* Date stamp — bottom-left of poster */}
              {dayLine && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-4 left-4 flex flex-col items-start rounded-sm bg-ink/75 px-3 py-2 backdrop-blur-sm"
                >
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-burgundy">
                    {monthLine}
                  </span>
                  <span className="font-display text-3xl font-medium leading-none text-cream">
                    {dayLine}
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          {/* Prose column */}
          <div className="md:col-span-6 md:pt-2">
            <Reveal delay={0.05}>
              <p className="label-eyebrow">{dateLine}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                id="featured-event-heading"
                className="mt-4 display-lg italic text-cream"
              >
                {event.title}
              </h2>
            </Reveal>
            {event.subtitle && (
              <Reveal delay={0.15}>
                <p className="mt-5 max-w-xl font-display text-2xl italic text-cream/60 md:text-3xl">
                  {event.subtitle}
                </p>
              </Reveal>
            )}

            {event.venue_name && (
              <Reveal delay={0.2}>
                <div className="mt-8 flex items-center gap-2 text-cream/75">
                  <MapPin
                    className="size-4 text-burgundy"
                    aria-hidden="true"
                  />
                  <span>{event.venue_name}</span>
                </div>
              </Reveal>
            )}

            {event.description && (
              <Reveal delay={0.25}>
                <p className="mt-8 max-w-xl text-lg leading-[1.65] text-cream/70">
                  {stripMarkdown(event.description)}
                </p>
              </Reveal>
            )}

            <Reveal delay={0.3} className="mt-12 flex flex-wrap items-center gap-5">
              {event.ticket_url && (
                <a
                  href={event.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-burgundy py-3 pl-6 pr-3 text-sm font-medium text-ink transition-colors hover:bg-burgundy-dark"
                >
                  <span>{event.ticket_cta ?? 'Get Tickets'}</span>
                  <span
                    aria-hidden="true"
                    className="inline-flex size-8 items-center justify-center rounded-full bg-ink/15 transition-transform group-hover:translate-x-0.5"
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </a>
              )}
              <Link
                href={`/events/${event.slug}`}
                className="group inline-flex items-baseline gap-2 font-display text-lg italic text-cream transition-colors hover:text-burgundy"
              >
                <span className="border-b border-cream/30 pb-1 transition-colors group-hover:border-burgundy">
                  Read the program
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Strip markdown emphasis / headings for the 1-paragraph preview. */
function stripMarkdown(md: string): string {
  const firstPara = md.split(/\n\n/)[0] ?? md;
  return firstPara
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/^#+\s+/gm, '')
    .trim();
}
