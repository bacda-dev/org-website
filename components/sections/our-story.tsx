import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';

/**
 * OurStory — short editorial narrative that sets the human stakes for the
 * rest of the home page. Sits between the stats strip and featured event:
 * by the time a visitor reaches Productions / Portfolio / Community, they
 * already know the why.
 */
export function OurStory() {
  return (
    <section
      aria-labelledby="our-story-heading"
      className="relative bg-ink py-24 md:py-32"
    >
      <div className="container">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-4">
            <span className="label-eyebrow">Our story</span>
            <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.28em] text-cream/45">
              Bay Area · Since 2002
            </p>
          </Reveal>

          <div className="md:col-span-8">
            <Reveal delay={0.05}>
              <h2
                id="our-story-heading"
                className="display-lg leading-[1.05] text-cream"
              >
                More than a dance group.
                <br />
                <span className="text-cream/55">
                  A community built on bonding,
                </span>
                <br />
                <span className="text-burgundy">love, and a passion for dance.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-10 max-w-2xl text-lg leading-[1.7] text-cream/75">
                Bay Area Creative Dance Academy began in 2002 as a circle of
                dancers and friends in the South Bay. Sixteen years later, in
                2018, we became a registered nonprofit — but the heart of it
                is still the same room of people showing up for each other
                through rehearsals, monthly meet-ups, and the rituals of
                putting up a show.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-cream/75">
                Two decades in, BACDA stages original musical productions,
                anchors marquee community events like NABC, and collaborates
                with renowned artists across India and the diaspora. We dance
                because it bonds us — and we use that bond, in turn, to give
                back.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <Link
                href="/about"
                className="group mt-12 inline-flex items-center gap-2 text-sm text-cream/85 transition-colors hover:text-burgundy"
              >
                <span className="border-b border-burgundy pb-0.5">
                  Read the full story
                </span>
                <ArrowUpRight
                  className="size-4 text-burgundy transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
