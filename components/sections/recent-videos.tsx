import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';
import { Reveal } from './reveal';
import { getVideoThumbnail, getWatchUrl } from '@/lib/integrations/youtube';
import type { GalleryVideoRow } from '@/types/database';

/**
 * Recent videos strip — 6-up responsive grid of YouTube thumbnails that open
 * on YouTube in a new tab. Uses `getVideoThumbnail` from the integrator's
 * youtube util (no API key, direct ytimg.com URLs).
 *
 * TODO: swap the thumbnail link for <YouTubePlayer /> once the integrator's
 * lite-youtube-embed wrapper ships at `components/social/youtube-player.tsx`.
 * Current implementation links out cleanly so users still reach the content.
 */
export interface RecentVideosProps {
  videos: GalleryVideoRow[];
}

export function RecentVideos({ videos }: RecentVideosProps) {
  if (videos.length === 0) {
    return (
      <section
        aria-labelledby="recent-videos-heading"
        className="bg-[#F5EFE4] py-24 md:py-32"
      >
        <div className="container">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
              On film
            </p>
            <h2
              id="recent-videos-heading"
              className="mt-4 max-w-2xl font-display text-3xl font-medium italic md:text-4xl"
            >
              Videos coming soon
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              New recordings from recent productions will appear here shortly.
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  const top = videos.slice(0, 6);
  return (
    <section
      aria-labelledby="recent-videos-heading"
      className="bg-cream py-24 md:py-32"
    >
      <div className="container">
        <div className="flex items-end justify-between gap-6">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
              On film
            </p>
            <h2
              id="recent-videos-heading"
              className="mt-4 max-w-2xl font-display text-3xl font-medium italic md:text-4xl"
            >
              Recent performances
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="hidden md:block">
            <Link
              href="/gallery"
              className="text-sm text-burgundy underline-offset-4 hover:underline"
            >
              View all &rarr;
            </Link>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 0.08}>
              <a
                href={getWatchUrl(v.youtube_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-video overflow-hidden rounded-md bg-ink/5">
                  <Image
                    src={getVideoThumbnail(v.youtube_id, 'hq')}
                    alt={v.title ?? 'BACDA performance video'}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-ink/20 transition-opacity group-hover:bg-ink/10" />
                  <PlayCircle
                    className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-cream drop-shadow-lg transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  />
                </div>
                {v.title && (
                  <h3 className="mt-4 font-display text-lg italic text-ink transition-colors group-hover:text-burgundy">
                    {v.title}
                  </h3>
                )}
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
