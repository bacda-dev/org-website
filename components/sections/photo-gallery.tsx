'use client';

import * as React from 'react';
import Image from 'next/image';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Photo gallery with Radix Dialog lightbox. Supports keyboard arrow nav
 * (← prev, → next, Esc close) once the dialog is open. Masonry-ish layout
 * via CSS columns for the `masonry` variant, or a simple grid for `grid`.
 *
 * Thumbnails are lazy-loaded via next/image. Full-size lightbox image is
 * eager once open.
 */
export interface PhotoGalleryPhoto {
  id: string;
  url: string; // absolute URL (resolved by caller)
  alt: string;
  caption?: string | null;
}

export interface PhotoGalleryProps {
  photos: PhotoGalleryPhoto[];
  variant?: 'grid' | 'masonry';
  emptyLabel?: string;
}

export function PhotoGallery({
  photos,
  variant = 'grid',
  emptyLabel,
}: PhotoGalleryProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const open = openIndex !== null;

  const close = React.useCallback(() => setOpenIndex(null), []);
  const prev = React.useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);
  const next = React.useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  // Keyboard nav while open
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, next, prev]);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 border-t border-cream/10 py-20">
        <span className="label-eyebrow-muted">Intermission</span>
        <p className="max-w-md font-display text-2xl italic text-cream/70 md:text-3xl">
          {emptyLabel ?? 'No photos to display yet.'}
        </p>
      </div>
    );
  }

  const activePhoto = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <ul
        className={
          variant === 'masonry'
            ? 'columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>li]:mb-4 [&>li]:break-inside-avoid'
            : 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4'
        }
      >
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Open photo: ${p.alt}`}
              className={cn(
                'group relative block w-full overflow-hidden rounded-sm bg-ink-100',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-4 focus-visible:ring-offset-ink',
                variant === 'grid' && 'aspect-[4/5]'
              )}
            >
              <Image
                src={p.url}
                alt={p.alt}
                width={800}
                height={1000}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className={cn(
                  'transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]',
                  variant === 'grid'
                    ? 'h-full w-full object-cover'
                    : 'h-auto w-full'
                )}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cream/10"
              />
              <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/15" />
            </button>
          </li>
        ))}
      </ul>

      <DialogPrimitive.Root
        open={open}
        onOpenChange={(o) => {
          if (!o) close();
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
          <DialogPrimitive.Content
            aria-label="Photo viewer"
            className="fixed inset-0 z-50 flex flex-col data-[state=open]:animate-in data-[state=open]:fade-in-0"
          >
            <DialogPrimitive.Title className="sr-only">
              Photo gallery viewer
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Use left and right arrow keys to navigate, Escape to close.
            </DialogPrimitive.Description>

            <div className="flex h-14 items-center justify-between px-4 text-cream md:px-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cream/70">
                {openIndex !== null ? `${openIndex + 1} / ${photos.length}` : ''}
              </span>
              <DialogPrimitive.Close
                aria-label="Close photo viewer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cream hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
              >
                <X className="size-5" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-4 pb-10 md:px-16">
              {activePhoto && (
                <div className="relative flex max-h-full max-w-full items-center justify-center">
                  <Image
                    src={activePhoto.url}
                    alt={activePhoto.alt}
                    width={1800}
                    height={1200}
                    className="max-h-[80vh] w-auto max-w-full rounded-sm object-contain"
                    priority
                  />
                </div>
              )}

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full border border-cream/40 bg-ink/40 p-3 text-cream backdrop-blur-sm transition-colors hover:bg-cream hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream md:left-6"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full border border-cream/40 bg-ink/40 p-3 text-cream backdrop-blur-sm transition-colors hover:bg-cream hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream md:right-6"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            {activePhoto?.caption && (
              <div className="bg-ink/60 px-6 py-4 text-center text-sm text-cream/80">
                {activePhoto.caption}
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
