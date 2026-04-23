'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';
import { cn } from '@/lib/utils';

/**
 * PhotoWall — horizontally scrolling editorial carousel.
 *
 * Implementation: native CSS `scroll-snap` so touch swipe and trackpad work
 * for free. Prev/Next buttons scroll the container by one tile width using
 * `scrollBy({ left, behavior: 'smooth' })`. No carousel dependency.
 *
 * Each card is 78vw on mobile (one-up + peek), 38vw on tablet (two-up), and
 * 28vw on desktop (three-up + peek). Edge fades signal scrollability.
 *
 * Falls back to a curated set of legacy stage photos when no DB photos
 * are passed.
 */
export interface PhotoTile {
  src: string;
  alt: string;
  caption?: string;
}

const FALLBACK_TILES: PhotoTile[] = [
  { src: '/legacy/photo-cover-1.jpg', alt: 'BACDA dancers in formation on stage', caption: 'Stage formation' },
  { src: '/legacy/photo-stage-1.jpg', alt: 'Solo classical performance', caption: 'Rehearsal' },
  { src: '/legacy/photo-folk-1.jpg', alt: 'Folk dance ensemble in costume', caption: 'Folk ensemble' },
  { src: '/legacy/photo-nov13.jpg', alt: 'Raabdta production poster', caption: 'Raabdta' },
  { src: '/legacy/photo-opening.png', alt: 'Opening ceremony tableau', caption: 'Opening ceremony' },
  { src: '/legacy/photo-folk-2.jpg', alt: 'Folk dance ensemble, second formation', caption: 'Folk ensemble II' },
  { src: '/legacy/hero-2.jpg', alt: 'Dance performance from the archive', caption: 'From the archive' },
  { src: '/legacy/photo-cover-2.jpg', alt: 'BACDA cover production photo', caption: 'Cover production' },
  { src: '/legacy/hero-3.jpg', alt: 'Stage lighting during a performance', caption: 'On stage' },
  { src: '/legacy/hero-4.jpg', alt: 'Full company ensemble', caption: 'Ensemble' },
];

export function PhotoWall({ tiles }: { tiles?: PhotoTile[] }) {
  const photos = tiles && tiles.length >= 4 ? tiles : FALLBACK_TILES;
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);

  const updateEdges = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  const scrollByTile = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // Tile width matches first child outer width so we always advance by one card.
    const first = el.querySelector<HTMLElement>('[data-tile]');
    const w = first ? first.offsetWidth + 16 /* gap-4 */ : el.clientWidth * 0.6;
    el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  return (
    <section
      aria-label="Performance archive"
      className="relative bg-ink py-24 md:py-32"
    >
      <div className="container">
        <Reveal className="flex flex-col gap-6 border-b border-cream/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-eyebrow">From the stage</span>
            <h2 className="mt-4 max-w-3xl display-md italic text-cream">
              Moments from the archive.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByTile(-1)}
              disabled={!canPrev}
              aria-label="Previous photos"
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all',
                'border-cream/20 text-cream/75 hover:border-burgundy hover:text-burgundy',
                'disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-cream/20 disabled:hover:text-cream/75',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
              )}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollByTile(1)}
              disabled={!canNext}
              aria-label="Next photos"
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all',
                'border-cream/20 text-cream/75 hover:border-burgundy hover:text-burgundy',
                'disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-cream/20 disabled:hover:text-cream/75',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
              )}
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
            <Link
              href="/gallery"
              className="group ml-2 hidden items-center gap-2 text-sm text-cream/75 transition-colors hover:text-burgundy md:inline-flex"
            >
              <span className="border-b border-burgundy/40 pb-0.5 transition-colors group-hover:border-burgundy">
                Browse the full archive
              </span>
              <ArrowUpRight
                className="size-4 text-cream/50 transition-all group-hover:translate-x-0.5 group-hover:text-burgundy"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Carousel — full-bleed with edge fades */}
      <div className="relative mt-8">
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-ink to-transparent transition-opacity duration-300 md:w-24',
            canPrev ? 'opacity-100' : 'opacity-0'
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-ink to-transparent transition-opacity duration-300 md:w-24',
            canNext ? 'opacity-100' : 'opacity-0'
          )}
        />

        <div
          ref={trackRef}
          className={cn(
            'flex gap-4 overflow-x-auto scroll-smooth pb-2',
            'snap-x snap-mandatory',
            'px-[max(1.25rem,calc((100vw-72rem)/2))]',
            '[scrollbar-width:none] [-ms-overflow-style:none]',
            '[&::-webkit-scrollbar]:hidden'
          )}
        >
          {photos.map((tile, i) => (
            <figure
              key={`${tile.src}-${i}`}
              data-tile
              className={cn(
                'group relative shrink-0 snap-start overflow-hidden rounded-sm bg-ink-100',
                'aspect-[4/5] w-[78vw] md:aspect-[3/4] md:w-[38vw] lg:w-[28vw]',
                'ring-1 ring-inset ring-cream/5 transition-all duration-700 ease-out-expo hover:ring-burgundy/40'
              )}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                priority={i < 2}
                sizes="(max-width:768px) 78vw, (max-width:1024px) 38vw, 28vw"
                className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.05]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent"
              />
              {tile.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 px-5 pb-5">
                  <span className="font-display text-lg italic leading-tight text-cream md:text-xl">
                    {tile.caption}
                  </span>
                </figcaption>
              )}
            </figure>
          ))}
        </div>

        <div className="container mt-8 md:hidden">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 text-sm text-cream/75 transition-colors hover:text-burgundy"
          >
            <span className="border-b border-burgundy/40 pb-0.5 transition-colors group-hover:border-burgundy">
              Browse the full archive
            </span>
            <ArrowUpRight
              className="size-4 text-cream/50 transition-all group-hover:translate-x-0.5 group-hover:text-burgundy"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
