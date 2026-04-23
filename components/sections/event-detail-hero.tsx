import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Event-detail hero. Large scrimmed poster backdrop, title + subtitle +
 * date/venue meta, and an optional ticket CTA for upcoming shows.
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
    <section className="relative overflow-hidden bg-ink pt-20 md:pt-24">
      <div className="relative min-h-[60vh] w-full">
        {posterUrl && (
          <Image
            src={posterUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/50 to-ink/90"
        />
        <div className="container relative flex min-h-[60vh] flex-col justify-end py-16 md:py-24">
          <Link
            href="/events"
            className="mb-6 inline-flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-cream"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All events
          </Link>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cream/70">
            {isPast ? 'Past production' : 'Upcoming'}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-medium italic leading-[1.05] text-cream md:text-6xl lg:text-7xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl font-display text-xl text-cream/80 md:text-2xl">
              {subtitle}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-6 text-cream/85">
            <span className="inline-flex items-center gap-2 text-sm">
              <Calendar className="size-4" aria-hidden="true" />
              {dateLabel}
            </span>
            {venueName && (
              <span className="inline-flex items-center gap-2 text-sm">
                <MapPin className="size-4" aria-hidden="true" />
                {venueName}
              </span>
            )}
          </div>
          {!isPast && ticketUrl && (
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="border border-cream/40 bg-cream text-ink hover:bg-cream/90"
              >
                <a
                  href={ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ticketCta ?? 'Get Tickets'}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
