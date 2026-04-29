import Image from 'next/image';
import { Reveal } from './reveal';
import { storageUrl } from '@/lib/utils';
import type { SponsorRow } from '@/types/database';

/**
 * Sponsor strip — concert-hall noir.
 *
 * Flat horizontal list (not a cheesy centered grid of logos). The heading
 * sits left, logos flow right. Grayscale + amber-on-hover keeps the noise
 * down while letting partners reads as meaningful.
 */
export interface SponsorsStripProps {
  sponsors: SponsorRow[];
}

export function SponsorsStrip({ sponsors }: SponsorsStripProps) {
  if (sponsors.length === 0) return null;
  return (
    <section
      aria-labelledby="sponsors-heading"
      className="bg-ink py-20 md:py-24"
    >
      <div className="container">
        <Reveal className="flex flex-col gap-10 border-t border-cream/10 pt-14 md:flex-row md:items-center md:justify-between md:gap-16">
          <div className="md:max-w-xs">
            <p className="label-eyebrow-muted">With gratitude</p>
            <h2
              id="sponsors-heading"
              className="mt-3 font-display text-2xl text-cream md:text-3xl"
            >
              Partners & supporters
            </h2>
          </div>

          <ul className="grid grid-cols-2 items-center gap-8 sm:grid-cols-3 md:grid-cols-4 md:flex-1 md:gap-10">
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
                  width={180}
                  height={72}
                  className="mx-auto h-12 w-auto object-contain opacity-55 brightness-0 invert transition-all duration-500 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0 group-hover:[filter:sepia(0.6)_saturate(3)_hue-rotate(-15deg)]"
                />
              ) : (
                <span className="block text-center font-display text-lg text-cream/60 transition-colors group-hover:text-cream">
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
                      className="group inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
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
