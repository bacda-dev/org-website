'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Home hero — concert-hall noir.
 *
 * Full-bleed performance photography, deep ink gradient scrim, grain overlay.
 * Headline renders word-by-word with a stagger via framer-motion (the
 * motion-framer pattern). Subhead + CTA reveal after.
 *
 * The right-rail index number "N° 2008→" anchors the layout to the playbill
 * aesthetic — a concert program, not a startup landing page.
 */
export interface HeroProps {
  imageUrl: string | null;
  headline: string;
  subheadline?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  ctaExternal?: boolean;
}

export function Hero({
  imageUrl,
  headline,
  subheadline,
  ctaLabel,
  ctaHref,
  ctaExternal = false,
}: HeroProps) {
  const reduce = useReducedMotion();
  const words = headline.split(/\s+/);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.06,
        delayChildren: reduce ? 0 : 0.12,
      },
    },
  };
  const wordVariants = {
    hidden: { opacity: 1, y: reduce ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      aria-label="Introduction"
      className="relative isolate flex min-h-[92vh] w-full items-end overflow-hidden bg-ink grain"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top scale-[0.92]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-100 to-[#3a1f0b]" />
        )}
        {/* Layered scrims — extra-dark top band keeps the nav readable over
            whatever part of the image sits behind it. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink via-ink/70 to-transparent md:h-48"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/35 to-ink"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent"
        />
      </div>

      {/* Top-right vertical program mark (desktop only) */}
      <div
        aria-hidden="true"
        className="absolute right-6 top-28 hidden select-none items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-cream/35 md:flex lg:right-10"
      >
        <span>Program</span>
        <span className="inline-block h-[1px] w-8 bg-cream/25" />
        <span className="text-burgundy">2025/26</span>
      </div>

      {/* Content */}
      <div className="container relative z-10 pb-20 pt-36 md:pb-28 md:pt-44">
        <motion.div
          className="grid gap-10 md:grid-cols-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left — eyebrow + headline */}
          <div className="md:col-span-9">
            <motion.div
              variants={wordVariants}
              className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.3em] text-burgundy"
            >
              <span className="inline-block h-[1px] w-10 bg-burgundy" />
              Bay Area Creative Dancers
            </motion.div>

            <h1
              className={cn(
                'mt-6 font-display font-normal text-cream',
                'display-xl'
              )}
            >
              <span className="block italic">
                {words.map((w, i) => (
                  <motion.span
                    key={`${w}-${i}`}
                    variants={wordVariants}
                    className="mr-[0.28em] inline-block"
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
            </h1>

            {subheadline && (
              <motion.p
                variants={wordVariants}
                className="mt-8 max-w-xl text-lg leading-[1.6] text-cream/75 md:text-xl"
              >
                {subheadline}
              </motion.p>
            )}

            {ctaHref && ctaLabel && (
              <motion.div variants={wordVariants} className="mt-10">
                <HeroCta
                  href={ctaHref}
                  label={ctaLabel}
                  external={ctaExternal}
                />
              </motion.div>
            )}
          </div>

          {/* Right — small meta column (desktop) */}
          <motion.div
            variants={wordVariants}
            className="hidden md:col-span-3 md:flex md:flex-col md:items-start md:justify-end md:gap-2 md:pb-2"
          >
            <div className="h-[1px] w-16 bg-cream/25" />
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cream/50">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3" aria-hidden="true" />
                Fremont · Bay Area
              </span>
            </p>
            <p className="mt-1 font-display text-sm italic leading-snug text-cream/65">
              Classical, contemporary,<br />and fusion Indian dance.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom hairline + scroll hint */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 flex h-10 items-center justify-between border-t border-cream/10 bg-ink/60 backdrop-blur-sm"
      >
        <div className="container flex items-center justify-between text-[0.65rem] font-mono uppercase tracking-[0.3em] text-cream/50">
          <span>Est. 2008</span>
          <span className="hidden md:inline">Scroll to discover</span>
          <span className="text-burgundy">Foster the Love of Dance</span>
        </div>
      </div>
    </section>
  );
}

function HeroCta({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external: boolean;
}) {
  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-3">
        <span>{label}</span>
        <span
          aria-hidden="true"
          className="inline-flex size-9 items-center justify-center rounded-full bg-burgundy text-ink transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </span>
    </>
  );
  const base =
    'group inline-flex items-center gap-2 rounded-full border border-cream/30 bg-cream/5 py-2 pl-6 pr-2 text-sm font-medium text-cream backdrop-blur-sm transition-all hover:border-cream/60 hover:bg-cream/10';
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={base}>
      {inner}
    </Link>
  );
}
