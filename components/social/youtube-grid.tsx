/**
 * YouTube video grid — responsive card grid that opens each video in a
 * lightbox-style Radix Dialog. Used on `/gallery`.
 *
 * This module splits into:
 *   - `YouTubeGrid` (Server Component) — renders the responsive grid + next/image
 *     thumbnails. All data shaping happens here; no client JS is required to
 *     see the thumbnails.
 *   - `YouTubeCardTrigger` (Client Component) — wraps one card in a Dialog so
 *     clicking it mounts `<YouTubePlayer>` in a modal. We only ship JS for
 *     the interactive parts.
 *
 * Accessibility:
 *   - Each card is a real <button> with an aria-label of the video title.
 *   - Dialog traps focus and restores it on close (Radix handles this).
 *   - Escape key dismisses (Radix handles this).
 */

import Image from 'next/image';
import { Play } from 'lucide-react';
import { getVideoThumbnail, getWatchUrl } from '@/lib/integrations/youtube';
import { cn } from '@/lib/utils';
import { YouTubeCardTrigger } from './youtube-card-trigger';

export interface YouTubeGridItem {
  id: string;
  title?: string | null;
  description?: string | null;
}

export interface YouTubeGridProps {
  videos: YouTubeGridItem[];
  className?: string;
}

export function YouTubeGrid({ videos, className }: YouTubeGridProps) {
  if (videos.length === 0) {
    return (
      <p className="text-muted">
        No videos yet — check back soon.
      </p>
    );
  }

  return (
    <ul
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {videos.map((video) => {
        const title = video.title?.trim() || 'BACDA performance video';
        return (
          <li key={video.id}>
            <YouTubeCardTrigger id={video.id} title={title}>
              <article className="group relative overflow-hidden rounded-md border border-border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-video w-full overflow-hidden bg-ink">
                  <Image
                    src={getVideoThumbnail(video.id, 'maxres')}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors duration-200 group-hover:bg-ink/30">
                    <span className="flex size-14 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform duration-200 group-hover:scale-110">
                      <Play
                        className="size-6 translate-x-0.5 fill-burgundy text-burgundy"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-medium leading-snug text-ink">
                    {title}
                  </h3>
                  {video.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-muted">
                      {video.description}
                    </p>
                  ) : null}
                  {/* Non-JS fallback: direct YouTube link, visually hidden. */}
                  <a
                    href={getWatchUrl(video.id)}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="sr-only"
                  >
                    Watch {title} on YouTube
                  </a>
                </div>
              </article>
            </YouTubeCardTrigger>
          </li>
        );
      })}
    </ul>
  );
}
