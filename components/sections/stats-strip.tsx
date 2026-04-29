import { Reveal } from '@/components/sections/reveal';

/**
 * StatsStrip — editorial number row that sits under the hero to establish
 * scale and credibility. Four cells on desktop, 2×2 on mobile. JetBrains
 * Mono eyebrows, Fraunces display numerals, hair-thin separators.
 *
 * Values default to BACDA's actual footprint per PRD §2.1. The `items` prop
 * lets admin-driven copy override once we wire `home_content.stats` (future).
 */
export interface StatItem {
  label: string;
  value: string;
  detail?: string;
}

const DEFAULT_STATS: StatItem[] = [
  { label: 'Est.', value: '2002', detail: 'A community of dancers' },
  { label: 'Nonprofit', value: '2018', detail: 'Registered NGO' },
  { label: 'Productions', value: '20+', detail: 'NABC, originals, recitals' },
  { label: 'Dancers', value: '100+', detail: 'Across the U.S. & beyond' },
];

export function StatsStrip({ items }: { items?: StatItem[] }) {
  const stats = items && items.length > 0 ? items : DEFAULT_STATS;
  return (
    <section
      aria-label="BACDA at a glance"
      className="relative border-y border-cream/10 bg-ink py-16 md:py-20"
    >
      <div className="container">
        <Reveal>
          <span className="label-eyebrow-muted">By the numbers</span>
        </Reveal>
        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-10 md:grid-cols-4 md:gap-y-0">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.06}
              className="relative md:pl-8 md:first:pl-0 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-cream/10"
            >
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-cream/45">
                {s.label}
              </dt>
              <dd className="mt-3 font-display text-5xl leading-none tracking-tight text-cream md:text-6xl">
                {s.value}
              </dd>
              {s.detail && (
                <p className="mt-3 text-sm leading-relaxed text-cream/55">
                  {s.detail}
                </p>
              )}
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
