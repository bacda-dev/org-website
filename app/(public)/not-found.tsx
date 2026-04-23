import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getUpcomingEvents, getPastEvents } from '@/lib/fetchers/events';

/**
 * 404 — concert-hall noir.
 *
 * Editorial-framed apology with a curated set of recent productions. Matches
 * the public shell (ink ground, cream type, amber accents).
 */
export default async function NotFound() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);
  const suggestions = [
    ...upcoming.slice(0, 2),
    ...past.slice(0, 3),
  ].slice(0, 4);

  return (
    <section className="relative flex min-h-[80vh] items-center bg-ink pt-36 md:pt-44">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-cream/45">
              Err · 404
            </span>
            <span className="inline-block h-[1px] w-10 bg-burgundy" />
            <span className="label-eyebrow">Off the stage</span>
          </div>
          <h1 className="mt-6 display-xl italic leading-[0.95] text-cream">
            This page slipped off the stage.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-[1.6] text-cream/65 md:text-xl">
            The page you&apos;re looking for may have been moved or never
            existed. Try one of these instead.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-full bg-burgundy py-3 pl-6 pr-3 text-sm font-medium text-ink transition-colors hover:bg-burgundy-dark"
            >
              <span>Back to home</span>
              <span
                aria-hidden="true"
                className="inline-flex size-8 items-center justify-center rounded-full bg-ink/15 transition-transform group-hover:translate-x-0.5"
              >
                <ArrowRight className="size-4" />
              </span>
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 text-sm font-medium text-cream transition-colors hover:border-cream/60 hover:bg-cream/5"
            >
              Browse events
            </Link>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-20 border-t border-cream/10 pt-10">
              <p className="label-eyebrow-muted">Recent productions</p>
              <ul className="mt-8 divide-y divide-cream/10 border-y border-cream/10">
                {suggestions.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/events/${e.slug}`}
                      className="group flex items-center justify-between gap-4 py-5 transition-colors hover:text-burgundy"
                    >
                      <span className="font-display text-xl italic text-cream group-hover:text-burgundy md:text-2xl">
                        {e.title}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-xs uppercase tracking-[0.22em] text-cream/55 group-hover:text-burgundy">
                          {e.year}
                        </span>
                        <ArrowUpRight
                          className="size-4 text-cream/40 transition-all group-hover:text-burgundy group-hover:translate-x-0.5 group-hover:translate-y-[-2px]"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
