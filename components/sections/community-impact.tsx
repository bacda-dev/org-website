import Image from 'next/image';
import { Reveal, StaggerGroup, RevealItem } from '@/components/sections/reveal';

/**
 * CommunityImpact — the off-stage half of BACDA.
 *
 * Two halves: (1) community — monthly meet-ups and the bond that makes the
 * company a community, and (2) charitable work — laptops to underprivileged
 * students in the Sundarbans, school building support across rural Bengal.
 *
 * Visually denser than the surrounding editorial sections — uses a warm
 * gradient bleed and an inline photo to break the rhythm.
 */
const PILLARS = [
  {
    n: '01',
    eyebrow: 'Community',
    title: 'Monthly meet-ups',
    body:
      "We don't only meet in rehearsal. Every month, BACDA gathers — dancers, families, friends — to celebrate togetherness through dance, food, and the rituals that hold a community together.",
  },
  {
    n: '02',
    eyebrow: 'Charity · India',
    title: 'Laptops to the Sundarbans',
    body:
      'BACDA has donated laptops to underprivileged students in the Sundarbans region of West Bengal — supporting access to education for children living far from the resources of a city.',
  },
  {
    n: '03',
    eyebrow: 'Charity · India',
    title: 'School buildings',
    body:
      'We have helped fund and promote school-building work across rural West Bengal — small contributions year on year toward better classrooms for children whose families cannot otherwise afford them.',
  },
] as const;

export function CommunityImpact() {
  return (
    <section
      aria-labelledby="community-heading"
      className="relative overflow-hidden bg-ink py-24 md:py-32"
    >
      {/* Warm radial bleed — anchors this as the "human" section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(60% 80% at 80% 0%, rgba(245,166,35,0.18) 0%, rgba(245,166,35,0.04) 35%, transparent 65%)',
        }}
      />

      <div className="container relative">
        <div className="grid gap-14 md:grid-cols-12 md:gap-16">
          {/* Intro */}
          <Reveal className="md:col-span-5">
            <span className="label-eyebrow">Beyond the stage</span>
            <h2
              id="community-heading"
              className="mt-6 display-lg italic leading-[1.04] text-cream"
            >
              We are a
              <br />
              <span className="text-burgundy">community</span>
              <br />
              first.
            </h2>
            <p className="mt-8 max-w-md text-base leading-[1.7] text-cream/70">
              Dance is the reason we gather — but the bond is what stays. BACDA
              has grown into a community that supports its dancers, celebrates
              together, and gives back to communities far beyond the Bay Area.
            </p>

            {/* Inline photo — hidden on mobile to keep section vertical rhythm tight */}
            <div className="relative mt-10 hidden aspect-[4/3] w-full overflow-hidden rounded-sm bg-ink-100 ring-1 ring-inset ring-cream/5 md:block">
              <Image
                src="/legacy/photo-folk-1.jpg"
                alt="BACDA community gathering"
                fill
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
              />
            </div>
          </Reveal>

          {/* Pillars */}
          <StaggerGroup
            as="ol"
            className="md:col-span-7"
            step={0.06}
          >
            {PILLARS.map((p) => (
              <RevealItem
                as="li"
                key={p.n}
                className="grid gap-3 border-t border-cream/10 py-10 md:grid-cols-12 md:gap-6"
              >
                <div className="md:col-span-2">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-burgundy">
                    {p.n}
                  </span>
                  <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/40">
                    {p.eyebrow}
                  </p>
                </div>
                <div className="md:col-span-10">
                  <h3 className="font-display text-3xl italic leading-[1.08] text-cream md:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/70">
                    {p.body}
                  </p>
                </div>
              </RevealItem>
            ))}

            {/* Closing pull-quote */}
            <li className="border-t border-cream/10 pt-12">
              <p className="font-display text-3xl italic leading-snug text-cream md:text-4xl">
                &ldquo;We are more than a dance group. We are a community that
                thrives on bonding, love, and a passion for dance.&rdquo;
              </p>
              <p className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-burgundy">
                — BACDA, in its own words
              </p>
            </li>
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
