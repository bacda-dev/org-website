import Image from 'next/image';
import { Reveal } from './reveal';
import { storageUrl } from '@/lib/utils';
import type { SponsorRow } from '@/types/database';

/**
 * Sponsor logo strip. Rendered only when the upstream fetcher returns ≥1
 * active sponsor. Logos render in grayscale by default, colorize on hover.
 * Clicking a logo opens the sponsor's website in a new tab.
 */
export interface SponsorsStripProps {
  sponsors: SponsorRow[];
}

export function SponsorsStrip({ sponsors }: SponsorsStripProps) {
  if (sponsors.length === 0) return null;
  return (
    <section
      aria-labelledby="sponsors-heading"
      className="bg-cream py-16 md:py-24"
    >
      <div className="container">
        <Reveal>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              With gratitude
            </p>
            <h2
              id="sponsors-heading"
              className="mt-3 font-display text-2xl italic text-ink md:text-3xl"
            >
              To our supporters
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mt-12 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sponsors.map((s) => {
              const logo = s.logo_url
                ? s.logo_url.startsWith('http')
                  ? s.logo_url
                  : storageUrl('gallery', s.logo_url)
                : null;
              const inner = logo ? (
                <Image
                  src={logo}
                  alt={s.name}
                  width={160}
                  height={64}
                  className="mx-auto h-12 w-auto object-contain opacity-70 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0"
                />
              ) : (
                <span className="block text-center font-display text-lg italic text-muted transition-colors group-hover:text-ink">
                  {s.name}
                </span>
              );
              return (
                <li key={s.id} className="flex justify-center">
                  {s.website_url ? (
                    <a
                      href={s.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="group inline-block"
                    >
                      {inner}
                    </a>
                  ) : (
                    <span className="group inline-block" aria-label={s.name}>
                      {inner}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
