import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';

/**
 * JoinCta — full-bleed closing band before the footer. Amber gradient bleed
 * on ink with oversized italic Fraunces, single underline CTA to /contact.
 *
 * Sits between the sponsor strip and the footer marquee — the page's final
 * "ask" without resorting to a SaaS-style block.
 */
export function JoinCta() {
  return (
    <section
      aria-label="Get in touch"
      className="relative overflow-hidden bg-ink py-28 md:py-40"
    >
      {/* Warm radial glow sourced from logo amber */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 100%, rgba(245,166,35,0.22) 0%, rgba(245,166,35,0.08) 35%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-burgundy/40 to-transparent"
      />

      <div className="container relative">
        <Reveal className="mx-auto max-w-4xl text-center">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-burgundy">
            — Join the company —
          </span>
          <h2 className="mt-8 font-display italic leading-[0.98] text-cream display-2xl">
            Stage yours next.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-cream/65">
            Whether you dance, host, sponsor, or simply love the form —
            BACDA is built on the people who show up. Tell us how you want
            to be part of the next program.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-8">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-3 rounded-full bg-burgundy px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ink transition-all hover:bg-burgundy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Get in touch
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-sm text-cream/85 transition-colors hover:text-cream"
            >
              <span className="border-b border-cream/30 pb-0.5 transition-colors group-hover:border-cream">
                Read about BACDA first
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
