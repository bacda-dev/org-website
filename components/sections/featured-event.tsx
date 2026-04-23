import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from './reveal';
import { storageUrl } from '@/lib/utils';
import type { EventRow } from '@/types/database';

/**
 * Featured upcoming event card — asymmetric two-column layout with the poster
 * on the left and a stacked prose + CTA column on the right. Tickets link
 * opens externally (`rel="noopener noreferrer"`). Designed to carry the weight
 * of the home page below the hero.
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

  let formattedDate = '';
  try {
    formattedDate = format(parseISO(event.event_date), 'MMMM d, yyyy');
  } catch {
    formattedDate = event.event_date;
  }

  return (
    <section
      aria-labelledby="featured-event-heading"
      className="relative bg-cream py-24 md:py-32"
    >
      <div className="container">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
            Now on Stage
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-16">
          {/* Poster */}
          <Reveal className="md:col-span-5">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-ink/5 shadow-md">
              {poster ? (
                <Image
                  src={poster}
                  alt={`${event.title} poster`}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-6 text-center">
                  <span className="font-display text-2xl italic text-muted">
                    {event.title}
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          {/* Prose column */}
          <div className="md:col-span-7 md:pt-8">
            <Reveal delay={0.05}>
              <h2
                id="featured-event-heading"
                className="font-display text-4xl font-medium italic leading-tight md:text-5xl lg:text-6xl"
              >
                {event.title}
              </h2>
            </Reveal>
            {event.subtitle && (
              <Reveal delay={0.1}>
                <p className="mt-4 font-display text-xl text-muted md:text-2xl">
                  {event.subtitle}
                </p>
              </Reveal>
            )}

            <Reveal delay={0.15} className="mt-8 space-y-3 text-base text-ink/80">
              <div className="flex items-center gap-3">
                <Calendar
                  className="size-4 text-burgundy"
                  aria-hidden="true"
                />
                <span>{formattedDate}</span>
              </div>
              {event.venue_name && (
                <div className="flex items-center gap-3">
                  <MapPin
                    className="size-4 text-burgundy"
                    aria-hidden="true"
                  />
                  <span>{event.venue_name}</span>
                </div>
              )}
            </Reveal>

            {event.description && (
              <Reveal delay={0.2}>
                <p className="mt-8 max-w-xl leading-relaxed text-ink/80">
                  {stripMarkdown(event.description)}
                </p>
              </Reveal>
            )}

            <Reveal delay={0.25} className="mt-10 flex flex-wrap gap-3">
              {event.ticket_url && (
                <Button asChild size="lg">
                  <a
                    href={event.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {event.ticket_cta ?? 'Get Tickets'}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
              <Button asChild size="lg" variant="outline">
                <a href={`/events/${event.slug}`}>Read more</a>
              </Button>
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
