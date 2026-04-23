import type { Metadata } from 'next';
import Image from 'next/image';
import { PlayCircle, Instagram } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PhotoGallery } from '@/components/sections/photo-gallery';
import { Reveal } from '@/components/sections/reveal';
import { BreadcrumbSchema } from '@/lib/seo/json-ld';
import { getGalleryVideos } from '@/lib/fetchers/gallery';
import { getInstagramHighlights } from '@/lib/fetchers/instagram';
import { getAllEvents } from '@/lib/fetchers/events';
import { getEventPhotos } from '@/lib/fetchers/gallery';
import {
  getVideoThumbnail,
  getWatchUrl,
} from '@/lib/integrations/youtube';
import { storageUrl } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Photos and videos from Bay Area Creative Dancers performances — NABC ceremonies, Raabdta, Bodhayon, Chitra, and more.',
  alternates: { canonical: SITE_URL + '/gallery' },
  openGraph: {
    title: 'Gallery — Bay Area Creative Dancers',
    description: 'Photos and videos from BACDA performances.',
    url: SITE_URL + '/gallery',
    type: 'website',
  },
};

export default async function GalleryPage() {
  const [videos, instagram, events] = await Promise.all([
    getGalleryVideos(),
    getInstagramHighlights(),
    getAllEvents(),
  ]);

  // Aggregate photos from all events (cap at 60 to avoid heavy page).
  const photoGroups = await Promise.all(
    events.slice(0, 40).map(async (e) => ({
      event: e,
      photos: await getEventPhotos(e.id),
    })),
  );
  const allPhotos = photoGroups.flatMap(({ event, photos }) =>
    photos.map((p) => ({
      id: p.id,
      url: storageUrl('gallery', p.storage_path),
      alt: p.caption ?? `${event.title} — photo`,
      caption: p.caption ?? null,
    })),
  );

  return (
    <>
      <section className="pt-32 md:pt-40">
        <div className="container">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
            Archive
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium italic leading-[1.05] md:text-6xl lg:text-7xl">
            Gallery
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Moments from BACDA&apos;s productions, rehearsals, and public
            performances across two decades.
          </p>
        </div>
      </section>

      <section className="pb-24 pt-16 md:pb-32">
        <div className="container">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="pt-10">
              {videos.length === 0 ? (
                <p className="py-16 text-center text-muted">
                  Videos will be added soon.
                </p>
              ) : (
                // TODO: swap for <YouTubeGrid /> once integrator ships
                // components/social/youtube-grid.tsx.
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {videos.map((v, i) => (
                    <Reveal key={v.id} delay={(i % 3) * 0.06}>
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
                        {v.description && (
                          <p className="mt-2 text-sm text-muted line-clamp-2">
                            {v.description}
                          </p>
                        )}
                      </a>
                    </Reveal>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="photos" className="pt-10">
              <PhotoGallery
                photos={allPhotos}
                variant="masonry"
                emptyLabel="Photos will appear here once the admin publishes them."
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Instagram highlights (conditional) */}
      {instagram.length > 0 && (
        <section
          aria-labelledby="instagram-heading"
          className="bg-[#F5EFE4] py-20 md:py-28"
        >
          <div className="container">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
                  From our feed
                </p>
                <h2
                  id="instagram-heading"
                  className="mt-4 font-display text-3xl font-medium italic md:text-4xl"
                >
                  Instagram highlights
                </h2>
              </div>
              <a
                href="https://www.instagram.com/bayareacreativedanceacademy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-burgundy underline-offset-4 hover:underline"
              >
                <Instagram className="size-4" aria-hidden="true" />
                @bayareacreativedanceacademy
              </a>
            </div>
            {/* TODO: swap for <InstagramGrid /> once integrator ships
                components/social/instagram-grid.tsx. */}
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
              {instagram.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 0.05}>
                  <li>
                    <a
                      href={p.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block aspect-square overflow-hidden rounded-md bg-ink/5"
                    >
                      {p.thumbnail_url ? (
                        <Image
                          src={p.thumbnail_url}
                          alt={p.caption ?? 'Instagram post'}
                          width={600}
                          height={600}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-burgundy/10">
                          <Instagram
                            className="size-8 text-burgundy"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL + '/' },
          { name: 'Gallery', url: SITE_URL + '/gallery' },
        ]}
      />
    </>
  );
}
