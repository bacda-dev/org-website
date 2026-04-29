import { AnniversaryBadge } from '@/components/brand/anniversary-badge';

/**
 * Anniversary band — sits directly under the hero on the home page.
 *
 * Three-column editorial layout on solid ink:
 *   - Left (col-3): the Silver Jubilee badge.
 *   - Middle (col-6): eyebrow + headline + lead paragraph.
 *   - Right (col-3): a restrained editorial "stamp" — mono caption,
 *     a Fraunces "XXV" roman numeral as the visual anchor, and a small
 *     amber-hairline date range. Mirrors the marginalia feel of a
 *     printed concert program and keeps the right rail from reading empty.
 *
 * On mobile the columns stack: badge → caption → stamp.
 */
export function AnniversaryBand() {
  return (
    <section
      aria-label="BACDA Silver Jubilee — 25 years"
      className="relative bg-ink py-12 md:py-16"
    >
      <div className="container grid items-center gap-10 md:grid-cols-12 md:gap-10 lg:gap-14">
        {/* Badge */}
        <div className="md:col-span-3">
          <div className="w-[140px] md:w-full md:max-w-[200px] lg:max-w-[220px]">
            <AnniversaryBadge size={220} />
          </div>
        </div>

        {/* Caption */}
        <div className="md:col-span-6">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.32em] text-burgundy">
            Silver Jubilee · 2002 — 2026
          </span>
          <p className="mt-5 font-display text-3xl leading-[1.15] text-cream md:text-[2rem] lg:text-[2.25rem]">
            Twenty-five years of dance, told in movement.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/70 md:text-[1.0625rem]">
            We&apos;re celebrating BACDA&apos;s silver jubilee — a quarter
            century of classical, contemporary, and fusion Indian dance from
            the San Francisco Bay Area.
          </p>
        </div>

        {/* Editorial stamp — fills the right rail without crowding it */}
        <aside className="md:col-span-3 md:border-l md:border-cream/10 md:pl-8 lg:pl-10">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.3em] text-cream/45">
            A quarter century
          </p>
          <p
            aria-hidden="true"
            className="mt-3 font-display text-7xl leading-none tracking-tight text-cream md:text-[5.5rem]"
          >
            XXV
          </p>
          <div
            aria-hidden="true"
            className="mt-5 h-px w-10 bg-burgundy/55"
          />
          <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.3em] text-burgundy">
            2002 — 2026
          </p>
        </aside>
      </div>
    </section>
  );
}
