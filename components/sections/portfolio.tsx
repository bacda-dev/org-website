import { Reveal, StaggerGroup, RevealItem } from '@/components/sections/reveal';

/**
 * Portfolio — the marquee stages BACDA has danced on.
 *
 * Editorial 2-column grid of named events: NABC ceremonies (multiple years),
 * Kala Mahotsav, Bangamela, PM Modi 2015, plus a forward-looking NABC 2026
 * card. Reads as a portfolio strip — what we've done, where we've done it.
 */
const STAGES = [
  {
    title: 'NABC',
    sub: '2009 · 2012 · 2017',
    body:
      'Opening and closing ceremonies for the North American Bengali Conference — three editions, each in front of audiences in the tens of thousands.',
    tag: 'Marquee stages',
  },
  {
    title: 'Kala Mahotsav',
    sub: '2014 · 2015',
    body:
      'A festival of dance, music, and theater — BACDA presented commissioned ensemble work across two consecutive editions.',
    tag: 'Cultural festival',
  },
  {
    title: 'Bangamela',
    sub: 'Bay Area',
    body:
      "BACDA has been a recurring presence at Bangamela — the Bay Area's largest open-air Bengali cultural gathering.",
    tag: 'Community festival',
  },
  {
    title: 'PM Modi · SAP Center',
    sub: '2015',
    body:
      "BACDA performed at the inaugural Bay Area address by Prime Minister Narendra Modi — a 18,000-seat arena, a 6-minute opening, and one of the company's most-watched programs.",
    tag: 'Inaugural performance',
  },
] as const;

export function Portfolio() {
  return (
    <section
      aria-labelledby="portfolio-heading"
      className="relative bg-ink py-24 md:py-32"
    >
      <div className="container">
        <Reveal className="border-b border-cream/10 pb-10">
          <span className="label-eyebrow">Portfolio</span>
          <h2
            id="portfolio-heading"
            className="mt-4 max-w-3xl display-md italic leading-[1.05] text-cream"
          >
            Where we&apos;ve danced.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/65 md:text-lg">
            Beyond our own productions, BACDA has been entrusted with the
            largest community stages in the diaspora — NABC ceremonies, cultural
            festivals like Kala Mahotsav and Bangamela, and a marquee SAP
            Center program for the Prime Minister&apos;s Bay Area address.
          </p>
        </Reveal>

        <StaggerGroup
          as="ul"
          className="mt-12 grid gap-0 sm:grid-cols-2"
          step={0.06}
        >
          {STAGES.map((s, i) => (
            <RevealItem
              as="li"
              key={s.title}
              className={`group relative border-cream/10 p-8 md:p-10 ${
                i % 2 === 0 ? 'sm:border-r' : ''
              } ${i < 2 ? 'sm:border-b' : 'border-t sm:border-t-0'} ${
                i === 0 ? 'border-t' : ''
              } ${i === 1 ? 'border-t sm:border-t-0' : ''}`}
            >
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-burgundy">
                {s.tag}
              </p>
              <h3 className="mt-5 font-display text-4xl italic leading-[1.04] text-cream md:text-5xl">
                {s.title}
              </h3>
              <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cream/45">
                {s.sub}
              </p>
              <p className="mt-6 max-w-md text-base leading-relaxed text-cream/70">
                {s.body}
              </p>
            </RevealItem>
          ))}
        </StaggerGroup>

        {/* Forward-looking — NABC 2026 callout */}
        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-sm border border-burgundy/40 bg-ink-100 p-8 md:p-12">
            <div className="grid gap-6 md:grid-cols-12 md:items-center md:gap-10">
              <div className="md:col-span-3">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-burgundy">
                  Coming up · 2026
                </p>
                <p className="mt-3 font-display text-5xl italic leading-none text-cream md:text-6xl">
                  NABC
                </p>
              </div>
              <div className="md:col-span-9">
                <p className="font-display text-2xl italic leading-snug text-cream md:text-3xl">
                  An ensemble of dancers from across the United States,
                  collaborating with{' '}
                  <span className="text-burgundy">Kumar Sharma</span> of Kathak
                  Rockers on artistic direction.
                </p>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream/65">
                  BACDA returns to the NABC stage in 2026 with its largest
                  cross-country company yet. Currently in development.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
