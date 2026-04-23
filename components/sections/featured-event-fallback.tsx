import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { Reveal } from './reveal';

/**
 * FeaturedEventFallback — renders in the Featured slot when no upcoming
 * event is in the database. Not a "404" / "coming soon" placeholder, but a
 * proper editorial card that still carries the section's weight: a real
 * legacy poster, numbered index, italic headline, and a redirect to
 * /events so the visitor can still browse past productions.
 */
export function FeaturedEventFallback() {
  return (
    <section
      aria-labelledby="featured-fallback-heading"
      className="relative overflow-hidden bg-ink py-24 md:py-32"
    >
      <div className="container">
        <Reveal className="flex items-center justify-between border-b border-cream/10 pb-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-cream/40">
              N° 01
            </span>
            <span className="label-eyebrow">The current program</span>
          </div>
          <Link
            href="/events"
            className="group hidden items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cream/50 transition-colors hover:text-cream md:inline-flex"
          >
            All events
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]"
              aria-hidden="true"
            />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-6">
            <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-ink-100 ring-1 ring-inset ring-cream/10">
              <Image
                src="/legacy/poster-current.jpg"
                alt="Recent BACDA production poster"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
              />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-sm bg-ink/80 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-burgundy backdrop-blur-sm">
                <Calendar className="size-3" aria-hidden="true" />
                Programming in flight
              </div>
            </div>
          </Reveal>

          <div className="md:col-span-6 md:pt-2">
            <Reveal>
              <p className="label-eyebrow">The next season is being cast.</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="featured-fallback-heading"
                className="mt-4 display-lg italic text-cream"
              >
                Between productions,<br />
                we’re still on the floor.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-xl text-lg leading-[1.65] text-cream/70">
                BACDA is actively rehearsing the next program. In the
                meantime, the archive speaks for itself — twenty-plus
                productions since 2008, including NABC ceremonies, devotional
                works, and festival nights across the Bay Area.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-12 flex flex-wrap items-center gap-5">
              <Link
                href="/events"
                className="group inline-flex items-center gap-3 rounded-full bg-burgundy py-3 pl-6 pr-3 text-sm font-medium text-ink transition-colors hover:bg-burgundy-dark"
              >
                <span>Browse past productions</span>
                <span
                  aria-hidden="true"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-ink/15 transition-transform group-hover:translate-x-0.5"
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-baseline gap-2 font-display text-lg italic text-cream transition-colors hover:text-burgundy"
              >
                <span className="border-b border-cream/30 pb-1 transition-colors group-hover:border-burgundy">
                  Get notified of the next show
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
