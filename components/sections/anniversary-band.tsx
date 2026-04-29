import { AnniversaryBadge } from '@/components/brand/anniversary-badge';

/**
 * Anniversary band — sits directly under the hero on the home page.
 *
 * Solid ink (black) ground so the badge's own black background blends in
 * cleanly. Badge is left-aligned within the container; a slim editorial
 * caption block on the right gives the moment context without competing
 * with the hero headline above.
 */
export function AnniversaryBand() {
  return (
    <section
      aria-label="BACDA Silver Jubilee — 25 years"
      className="relative bg-ink py-12 md:py-16"
    >
      <div className="container flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
        {/* Badge — left side, fixed-ish width */}
        <div className="w-[140px] shrink-0 md:w-[180px] lg:w-[210px]">
          <AnniversaryBadge size={210} />
        </div>

        {/* Caption block */}
        <div className="md:flex-1">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.32em] text-burgundy">
            Silver Jubilee · 2002 — 2026
          </span>
          <p className="mt-4 max-w-xl font-display text-2xl leading-snug text-cream md:text-3xl">
            Twenty-five years of dance, told in movement.
          </p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-cream/65">
            We&apos;re celebrating BACDA&apos;s silver jubilee — a quarter
            century of classical, contemporary, and fusion Indian dance from
            the San Francisco Bay Area.
          </p>
        </div>
      </div>
    </section>
  );
}
