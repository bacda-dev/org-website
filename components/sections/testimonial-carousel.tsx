'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { storageUrl, cn } from '@/lib/utils';
import type { TestimonialRow } from '@/types/database';

/**
 * Testimonial carousel — full-bleed pull quote, concert-hall noir.
 *
 * A single quote dominates the viewport. Enormous italic Fraunces, faint amber
 * ornamental mark. Auto-advances every 10s, pauses on hover/focus, honors
 * reduced motion. Controls live at the bottom with thin progress dots and
 * minimal icon buttons.
 */
export interface TestimonialCarouselProps {
  testimonials: TestimonialRow[];
}

const AUTO_MS = 10000;

/**
 * Editorial fallback quote — attributed per PRD §2.1 so the Voices section
 * never renders empty while admins gather testimonials from the community.
 */
const FALLBACK_TESTIMONIALS: TestimonialRow[] = [
  {
    id: 'fallback-dalia',
    quote:
      'We opened BACDA to give the Bay Area’s next generation of dancers the same stage that was given to us — a place to carry tradition forward and answer it with the present.',
    author_name: 'Dalia Sen',
    author_title: 'Artistic Director, BACDA',
    author_photo_url: null,
    is_featured: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as TestimonialRow,
  {
    id: 'fallback-nabc',
    quote:
      'BACDA’s choreography anchored our opening ceremony. The craft, the discipline, and the warmth of the company are exactly what the community needed to see on that stage.',
    author_name: 'NABC 2022 Program Committee',
    author_title: 'North American Bengali Conference',
    author_photo_url: null,
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as TestimonialRow,
];

export function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduce = useReducedMotion();
  const effective = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;
  const count = effective.length;

  React.useEffect(() => {
    if (count <= 1 || paused || reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [count, paused, reduce]);

  const active = effective[index];
  if (!active) return null;
  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + count) % count);

  return (
    <section
      aria-labelledby="testimonial-heading"
      className="relative overflow-hidden bg-ink py-24 md:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Decorative giant italic "V" in the background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-start justify-end overflow-hidden opacity-[0.04]"
      >
        <span
          className="select-none font-display font-medium italic leading-none text-burgundy"
          style={{ fontSize: 'clamp(20rem, 50vw, 48rem)' }}
        >
          ❛
        </span>
      </div>

      <div className="container relative">
        <div className="flex items-center justify-between border-b border-cream/10 pb-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-cream/40">
              N° 04
            </span>
            <span
              id="testimonial-heading"
              className="label-eyebrow"
            >
              Voices
            </span>
          </div>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-cream/40">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl md:mt-20">
          <div className="min-h-[360px] md:min-h-[440px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={active.id}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote className="display-md italic leading-[1.08] text-cream">
                  <span className="text-burgundy">&ldquo;</span>
                  {active.quote}
                  <span className="text-burgundy">&rdquo;</span>
                </blockquote>
                <figcaption className="mt-12 flex items-center gap-5 border-t border-cream/10 pt-8">
                  {active.author_photo_url ? (
                    <Image
                      src={resolveAuthorPhoto(active.author_photo_url)}
                      alt={active.author_name}
                      width={64}
                      height={64}
                      className="size-16 rounded-full object-cover ring-1 ring-cream/15"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="inline-flex size-16 items-center justify-center rounded-full bg-burgundy/15 font-display text-2xl italic text-burgundy ring-1 ring-burgundy/30"
                    >
                      {active.author_name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <div className="font-display text-xl italic text-cream md:text-2xl">
                      {active.author_name}
                    </div>
                    {active.author_title && (
                      <div className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-cream/55">
                        {active.author_title}
                      </div>
                    )}
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div className="mt-12 flex items-center justify-between gap-6">
              <div
                className="flex items-center gap-2.5"
                role="tablist"
                aria-label="Testimonial slides"
              >
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show testimonial ${i + 1} of ${count}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      'h-1 rounded-full transition-all duration-500',
                      i === index
                        ? 'w-14 bg-burgundy'
                        : 'w-6 bg-cream/20 hover:bg-cream/40'
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className={cn(
                    'inline-flex h-11 w-11 items-center justify-center rounded-full',
                    'border border-cream/20 text-cream/70 transition-all hover:border-cream/50 hover:text-cream',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
                  )}
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className={cn(
                    'inline-flex h-11 w-11 items-center justify-center rounded-full',
                    'border border-cream/20 text-cream/70 transition-all hover:border-cream/50 hover:text-cream',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
                  )}
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function resolveAuthorPhoto(value: string): string {
  if (value.startsWith('http')) return value;
  return storageUrl('gallery', value);
}
