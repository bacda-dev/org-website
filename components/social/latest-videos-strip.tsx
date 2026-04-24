/**
 * Home-page strip of latest videos — horizontal scroll with snap points.
 * Server Component. Each card opens the video in a Dialog lightbox via the
 * same `YouTubeCardTrigger` used by `YouTubeGrid`.
 *
 * Layout decisions:
 *   - `snap-x snap-mandatory` for a touch-friendly carousel on mobile.
 *   - Fixed card width at each breakpoint (rather than `%`) so partial cards
 *     peek into view, signalling "swipe for more".
 *   - Ends with a "See all videos" CTA linking to `/gallery`.
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { getVideoThumbnail } from '@/lib/integrations/youtube';
import { cn } from '@/lib/utils';
import { YouTubeCardTrigger } from './youtube-card-trigger';

export interface LatestVideo {
  id: string;
  title?: string | null;
}

export interface LatestVideosStripProps {
  videos: LatestVideo[];
  className?: string;
  /** Link destination for the "See all" CTA. Defaults to `/gallery`. */
  seeAllHref?: string;
}

export function LatestVideosStrip({
  videos,
  className,
  seeAllHref = '/gallery',
}: LatestVideosStripProps) {
  if (videos.length === 0) return null;

  return (
    <div className={cn('relative', className)}>
      <ul
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-thin -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        aria-label="Recent BACDA videos"
      >
        {videos.map((video) => {
          const title = video.title?.trim() || 'BACDA video';
          return (
            <li
              key={video.id}
              className="w-[75vw] shrink-0 snap-start sm:w-[45vw] md:w-[320px]"
            >
              <YouTubeCardTrigger id={video.id} title={title}>
                <article className="group overflow-hidden rounded-md border border-cream/10 bg-ink-50 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="relative aspect-video w-full overflow-hidden bg-ink">
                    <Image
                      src={getVideoThumbnail(video.id, 'maxres')}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 320px, 75vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/15 transition-colors duration-200 group-hover:bg-ink/25">
                      <span className="flex size-12 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform duration-200 group-hover:scale-110">
                        <Play
                          className="size-5 translate-x-0.5 fill-burgundy text-burgundy"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 font-display text-base font-medium leading-snug text-cream">
                      {title}
                    </h3>
                  </div>
                </article>
              </YouTubeCardTrigger>
            </li>
          );
        })}
        <li className="flex w-[60vw] shrink-0 snap-start items-center sm:w-[240px]">
          <Link
            href={seeAllHref}
            className="group flex h-full w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-cream/10 bg-white/50 p-6 text-center text-burgundy transition-colors hover:bg-ink-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            <span className="font-display text-lg font-medium">
              See all videos
            </span>
            <ArrowRight
              className="size-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </li>
      </ul>
    </div>
  );
}
