/**
 * Instagram highlights grid — square tiles, 2 cols mobile, 3 cols desktop.
 * Server Component.
 *
 * Tiles open the source post on instagram.com in a new tab (rel noopener).
 * When a tile has no `thumbnail_url` (FB_OEMBED_TOKEN unset / admin skipped
 * the auto-fetch / Instagram blocked our server), we render a branded
 * placeholder with an Instagram icon + "View on Instagram" text.
 *
 * Caption hover overlay is desktop-only (`md:`) so it doesn't steal taps on
 * mobile — on touch, the tap opens the post.
 */

import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InstagramHighlightTile {
  post_url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
}

export interface InstagramGridProps {
  highlights: InstagramHighlightTile[];
  className?: string;
}

export function InstagramGrid({ highlights, className }: InstagramGridProps) {
  if (highlights.length === 0) {
    return (
      <p className="text-cream/55">
        No Instagram highlights yet — follow{' '}
        <a
          href="https://www.instagram.com/bayareacreativedanceacademy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-burgundy underline-offset-4 hover:underline"
        >
          @bayareacreativedanceacademy
        </a>{' '}
        on Instagram.
      </p>
    );
  }

  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3',
        className,
      )}
    >
      {highlights.map((tile, idx) => {
        const caption = tile.caption?.trim() ?? '';
        const hasThumb =
          typeof tile.thumbnail_url === 'string' &&
          tile.thumbnail_url.length > 0;
        const ariaLabel = caption
          ? `View Instagram post: ${caption.slice(0, 80)}`
          : 'View Instagram post';

        return (
          <li key={`${tile.post_url}-${idx}`}>
            <a
              href={tile.post_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              className="group relative block aspect-square overflow-hidden rounded-md border border-cream/10 bg-ink-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              {hasThumb ? (
                <Image
                  src={tile.thumbnail_url as string}
                  alt={caption || 'Instagram post'}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-cream to-border text-burgundy">
                  <Instagram className="size-10" aria-hidden="true" />
                  <span className="px-3 text-center text-xs font-medium text-cream">
                    View on Instagram
                  </span>
                </div>
              )}
              {caption ? (
                <div className="pointer-events-none absolute inset-0 hidden items-end bg-gradient-to-t from-ink/80 via-ink/30 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:flex">
                  <p className="line-clamp-3 text-xs leading-snug text-white">
                    {caption}
                  </p>
                </div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
