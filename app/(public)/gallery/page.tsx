import type { Metadata } from 'next';
import Image from 'next/image';
import { Play, Instagram, ArrowUpRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PhotoGallery } from '@/components/sections/photo-gallery';
import { Reveal, StaggerGroup, RevealItem } from '@/components/sections/reveal';
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
      <section className="relative bg-ink pt-36 md:pt-44">
        <div className="container">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-cream/45">
                Chapter 03
              </span>
              <span className="inline-block h-[1px] w-10 bg-burgundy" />
              <span className="label-eyebrow">Archive</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 max-w-[14ch] display-xl italic leading-[0.95] text-cream">
              Two decades of movement.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-cream/65 md:text-xl">
              Moments from BACDA&apos;s productions, rehearsals, and public
              performances — from NABC ceremonies to devotional works.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink pb-24 pt-16 md:pb-32">
        <div className="container">
          <Tabs defaultValue="videos" className="w-full">
            <div className="text-cream">
              <TabsList>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="videos" className="pt-12">
              {videos.length === 0 ? (
                <div className="flex flex-col items-start gap-3 border-t border-cream/10 py-20">
                  <span className="label-eyebrow-muted">Intermission</span>
                  <p className="max-w-md font-display text-2xl italic text-cream/70 md:text-3xl">
                    Videos will be added soon.
                  </p>
                </div>
              ) : (
                <StaggerGroup
                  as="ul"
                  step={0.06}
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
                >
                  {videos.map((v, i) => (
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
                            className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cream/10"
                          />
                          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/80 backdrop-blur-sm">
                            <Play
                              className="size-3 fill-burgundy text-burgundy"
                              aria-hidden="true"
                            />
                            Watch
                          </div>
                          <div className="absolute bottom-4 right-4 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-cream/60">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                        </div>
                        {v.title && (
                          <h3 className="mt-5 font-display text-xl italic text-cream transition-colors group-hover:text-burgundy md:text-2xl">
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
              )}
            </TabsContent>

            <TabsContent value="photos" className="pt-12">
              <PhotoGallery
                photos={allPhotos}
                variant="masonry"
                emptyLabel="Photos will appear here once the admin publishes them."
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {instagram.length > 0 && (
        <section
          aria-labelledby="instagram-heading"
          className="relative bg-ink-100 py-20 md:py-28"
        >
          <div className="container">
            <Reveal className="flex flex-col gap-6 border-b border-cream/10 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-cream/40">
                    @feed
                  </span>
                  <span className="label-eyebrow">Instagram</span>
                </div>
                <h2
                  id="instagram-heading"
                  className="mt-4 display-md italic text-cream"
                >
                  From the studio.
                </h2>
              </div>
              <a
                href="https://www.instagram.com/bayareacreativedanceacademy"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cream/70 transition-colors hover:text-cream"
              >
                <Instagram className="size-4" aria-hidden="true" />
                @bayareacreativedanceacademy
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]"
                  aria-hidden="true"
                />
              </a>
            </Reveal>

            <StaggerGroup
              as="ul"
              step={0.05}
              className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4"
            >
              {instagram.map((p) => (
                <RevealItem key={p.id} as="li">
                  <a
                    href={p.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block aspect-square overflow-hidden rounded-sm bg-ink"
                  >
                    {p.thumbnail_url ? (
                      <Image
                        src={p.thumbnail_url}
                        alt={p.caption ?? 'Instagram post'}
                        width={600}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-ink-100">
                        <Instagram
                          className="size-8 text-burgundy"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </a>
                </RevealItem>
              ))}
            </StaggerGroup>
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
