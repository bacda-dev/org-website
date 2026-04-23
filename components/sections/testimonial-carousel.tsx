'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { storageUrl, cn } from '@/lib/utils';
import type { TestimonialRow } from '@/types/database';

/**
 * Auto-advancing testimonial carousel. Auto-plays every 8s, pauses on hover /
 * focus, respects prefers-reduced-motion (disables auto-advance + fades).
 * Supports keyboard nav with Tab → prev/next buttons.
 */
export interface TestimonialCarouselProps {
  testimonials: TestimonialRow[];
}

const AUTO_MS = 8000;

export function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduce = useReducedMotion();
  const count = testimonials.length;

  React.useEffect(() => {
    if (count <= 1 || paused || reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [count, paused, reduce]);

  if (count === 0) return null;

  const active = testimonials[index];
  if (!active) return null;
  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + count) % count);

  return (
    <section
      aria-labelledby="testimonial-heading"
      className="relative bg-[#F5EFE4] py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
            Voices
          </p>
          <h2
            id="testimonial-heading"
            className="mt-4 font-display text-3xl font-medium italic md:text-4xl"
          >
            What collaborators say
          </h2>
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <Quote
            className="absolute -top-4 left-0 size-10 text-burgundy/30 md:-top-6 md:size-14"
            aria-hidden="true"
          />

          <div className="min-h-[320px] md:min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={active.id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="px-4 md:px-8"
              >
                <blockquote className="font-display text-xl font-normal italic leading-relaxed text-ink md:text-2xl lg:text-3xl">
                  &ldquo;{active.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  {active.author_photo_url ? (
                    <Image
                      src={resolveAuthorPhoto(active.author_photo_url)}
                      alt={active.author_name}
                      width={56}
                      height={56}
                      className="size-14 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="inline-flex size-14 items-center justify-center rounded-full bg-burgundy/10 font-display text-xl text-burgundy"
                    >
                      {active.author_name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <div className="font-display text-lg font-medium text-ink">
                      {active.author_name}
                    </div>
                    {active.author_title && (
                      <div className="text-sm text-muted">
                        {active.author_title}
                      </div>
                    )}
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div className="mt-10 flex items-center justify-between gap-6">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className={cn(
                  'inline-flex h-11 w-11 items-center justify-center rounded-full',
                  'border border-ink/20 text-ink/70 transition-all hover:border-burgundy hover:text-burgundy',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2'
                )}
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>

              <div
                className="flex items-center gap-2"
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
                      'h-1.5 rounded-full transition-all',
                      i === index
                        ? 'w-8 bg-burgundy'
                        : 'w-1.5 bg-ink/20 hover:bg-ink/40'
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className={cn(
                  'inline-flex h-11 w-11 items-center justify-center rounded-full',
                  'border border-ink/20 text-ink/70 transition-all hover:border-burgundy hover:text-burgundy',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2'
                )}
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
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
