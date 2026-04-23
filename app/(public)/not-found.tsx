import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getUpcomingEvents, getPastEvents } from '@/lib/fetchers/events';

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
    <section className="flex min-h-[70vh] items-center pt-32 md:pt-40">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
            404
          </p>
          <h1 className="mt-4 font-display text-5xl font-medium italic leading-[1.05] md:text-7xl">
            This page slipped off the stage.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            The page you&apos;re looking for may have been moved or never
            existed. Try one of these instead.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md bg-burgundy px-6 py-3 text-sm font-medium text-cream hover:bg-burgundy-dark"
            >
              Back to home
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-md border border-ink px-6 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-cream"
            >
              Browse events
            </Link>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-16">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Recent productions
              </p>
              <ul className="mt-6 divide-y divide-border border-y border-border">
                {suggestions.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/events/${e.slug}`}
                      className="group flex items-center justify-between py-4 text-sm transition-colors hover:text-burgundy"
                    >
                      <span className="font-display text-lg italic">
                        {e.title}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted group-hover:text-burgundy">
                        {e.year}
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
