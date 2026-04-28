import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './reveal';

/**
 * FeaturedEventFallback — renders in the Featured slot when no upcoming
 * event is in the database. Typography-first editorial card: no poster
 * (so we never accidentally re-show a past production's artwork), just
 * a grounded prose statement and a redirect to the full archive.
 */
export function FeaturedEventFallback() {
  return (
    <section
      aria-labelledby="featured-fallback-heading"
      className="relative overflow-hidden bg-ink py-24 md:py-36"
    >
      <div className="container">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          <Reveal className="md:col-span-5">
            <span className="label-eyebrow">Between seasons</span>
            <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.32em] text-cream/40">
              Programming in flight
            </p>
          </Reveal>

          <div className="md:col-span-7">
            <Reveal>
              <h2
                id="featured-fallback-heading"
                className="display-lg italic text-cream"
              >
                We&rsquo;re on the floor<br />
                between productions.
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-8 max-w-xl text-lg leading-[1.65] text-cream/70">
                BACDA is actively rehearsing the next program. In the
                meantime, the archive speaks for itself — twenty-plus
                productions since 2008, across NABC ceremonies, original
                musical productions, and community festival nights.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-6">
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
