import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Calendar, MapPin } from 'lucide-react';

/**
 * Event detail hero — concert-hall noir.
 *
 * Full-bleed poster backdrop on ink with a layered scrim. The title stacks
 * large italic Fraunces with a subtle program number, back link, and meta
 * row. When an upcoming show has a ticket URL, a chip-style CTA lands at
 * the bottom of the hero.
 */
export interface EventDetailHeroProps {
  title: string;
  subtitle: string | null;
  dateLabel: string;
  venueName: string | null;
  posterUrl: string | null;
  isPast: boolean;
  ticketUrl: string | null;
  ticketCta: string | null;
}

export function EventDetailHero({
  title,
  subtitle,
  dateLabel,
  venueName,
  posterUrl,
  isPast,
  ticketUrl,
  ticketCta,
}: EventDetailHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pt-24 md:pt-28 grain">
      <div className="relative min-h-[70vh] w-full">
        {posterUrl && (
          <Image
            src={posterUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-55"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent"
        />

        <div className="container relative flex min-h-[70vh] flex-col justify-end py-16 md:py-24">
          <Link
            href="/events"
            className="group mb-10 inline-flex w-fit items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cream/60 transition-colors hover:text-cream"
          >
            <ArrowLeft
              className="size-3.5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            All events
          </Link>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-cream/45">
              {isPast ? 'Past production' : 'In program'}
            </span>
            <span className="inline-block h-[1px] w-10 bg-burgundy" />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-burgundy">
              {dateLabel}
            </span>
          </div>

          <h1 className="mt-5 max-w-[16ch] display-xl italic text-cream">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-6 max-w-2xl font-display text-2xl italic text-cream/70 md:text-3xl">
              {subtitle}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-6 text-cream/80">
            <span className="inline-flex items-center gap-2 text-sm">
              <Calendar
                className="size-4 text-burgundy"
                aria-hidden="true"
              />
              {dateLabel}
            </span>
            {venueName && (
              <span className="inline-flex items-center gap-2 text-sm">
                <MapPin
                  className="size-4 text-burgundy"
                  aria-hidden="true"
                />
                {venueName}
              </span>
            )}
          </div>

          {!isPast && ticketUrl && (
            <div className="mt-12">
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-burgundy py-3 pl-6 pr-3 text-sm font-medium text-ink transition-colors hover:bg-burgundy-dark"
              >
                <span>{ticketCta ?? 'Get Tickets'}</span>
                <span
                  aria-hidden="true"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-ink/15 transition-transform group-hover:translate-x-0.5"
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
