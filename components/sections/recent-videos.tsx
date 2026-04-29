import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowUpRight } from 'lucide-react';
import { Reveal, StaggerGroup, RevealItem } from './reveal';
import { getVideoThumbnail, getWatchUrl } from '@/lib/integrations/youtube';
import { cn } from '@/lib/utils';
import type { GalleryVideoRow } from '@/types/database';

/**
 * Recent videos — concert-hall noir.
 *
 * Three prominent editorial cards with numbered index labels, dark-ground
 * thumbnails, amber play chip, and titles. Opens on YouTube (the
 * existing `lite-youtube-embed` wrapper is used on the Gallery page for
 * in-page play; the home strip keeps the list light).
 */
export interface RecentVideosProps {
  videos: GalleryVideoRow[];
}

/**
 * Curated fallback — real YouTube IDs harvested from the legacy site so the
 * home page stays visually rich before admins seed `gallery_videos`.
 */
const FALLBACK_VIDEOS: GalleryVideoRow[] = [
  {
    id: 'fallback-1',
    youtube_id: 'R4Bkme6VYk8',
    title: 'Tasher Desh — opening',
    description: 'A BACDA staging of Tagore’s Tasher Desh.',
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as GalleryVideoRow,
  {
    id: 'fallback-2',
    youtube_id: 'BMFBOWVmAUc',
    title: 'Bodhayon',
    description: 'A BACDA original musical production — filmed during Durga Puja 2020.',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as GalleryVideoRow,
  {
    id: 'fallback-3',
    youtube_id: 'LDdBAEWIfh4',
    title: 'Abstract Dhadkan',
    description: 'Contemporary fusion — an abstract reading of rhythm.',
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as GalleryVideoRow,
];

export function RecentVideos({ videos }: RecentVideosProps) {
  const top = (videos.length > 0 ? videos : FALLBACK_VIDEOS).slice(0, 3);

  return (
    <section
      aria-labelledby="recent-videos-heading"
      className="relative bg-ink py-24 md:py-32"
    >
      <div className="container">
        <Reveal className="flex flex-col gap-6 border-b border-cream/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-eyebrow">On film</span>
            <h2
              id="recent-videos-heading"
              className="mt-4 max-w-3xl display-md text-cream"
            >
              Recent performances, on film.
            </h2>
          </div>
          <Link
            href="/gallery"
            className="group hidden items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cream/50 transition-colors hover:text-cream md:inline-flex"
          >
            View all
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]" aria-hidden="true" />
          </Link>
        </Reveal>

        <StaggerGroup
          as="ul"
          step={0.1}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {top.map((v, i) => (
            <RevealItem key={v.id} as="li">
              <a
                href={getWatchUrl(v.youtube_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
              >
                <div className="relative aspect-video overflow-hidden rounded-sm bg-ink-100">
                  <Image
                    src={getVideoThumbnail(v.youtube_id, 'hq')}
                    alt={v.title ?? 'BACDA performance video'}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent transition-opacity duration-500 group-hover:from-ink/60"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cream/10"
                  />
                  {/* Play chip */}
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/80 backdrop-blur-sm">
                    <Play
                      className="size-3 fill-burgundy text-burgundy"
                      aria-hidden="true"
                    />
                    Watch
                  </div>
                </div>
                {v.title && (
                  <h3
                    className={cn(
                      'mt-5 font-display text-xl text-cream transition-colors group-hover:text-burgundy',
                      'md:text-2xl'
                    )}
                  >
                    {v.title}
                  </h3>
                )}
                {v.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-cream/55">
                    {v.description}
                  </p>
                )}
              </a>
            </RevealItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
