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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Legacy fallback photo set — used when `event_photos` has no rows so the
 * Gallery page never presents an empty Photos tab to first-time visitors.
 * Sourced from /public/legacy/ (copied from legacy-website/public_html/img).
 */
const FALLBACK_GALLERY_PHOTOS = [
  { id: 'lg-1', url: '/legacy/photo-cover-1.jpg', alt: 'BACDA dancers in formation on stage', caption: 'Stage formation' },
  { id: 'lg-2', url: '/legacy/photo-cover-2.jpg', alt: 'BACDA production cover photo', caption: 'Production still' },
  { id: 'lg-3', url: '/legacy/photo-stage-1.jpg', alt: 'Solo classical performance', caption: 'Classical solo' },
  { id: 'lg-4', url: '/legacy/photo-folk-1.jpg', alt: 'Folk dance ensemble in costume', caption: 'Folk ensemble' },
  { id: 'lg-5', url: '/legacy/photo-folk-2.jpg', alt: 'Folk dance ensemble, second formation', caption: 'Folk ensemble II' },
  { id: 'lg-6', url: '/legacy/photo-theater-2019.jpg', alt: 'Theater festival night, 2019', caption: 'Theater Fest, 2019' },
  { id: 'lg-7', url: '/legacy/photo-bangamela-2019.jpg', alt: 'Banga Mela 2019 production', caption: 'Banga Mela, 2019' },
  { id: 'lg-8', url: '/legacy/photo-dhadkan.jpg', alt: 'Abstract Dhadkan staging', caption: 'Abstract Dhadkan' },
  { id: 'lg-9', url: '/legacy/photo-ehsaas.jpg', alt: 'Ehsaas — original BACDA production', caption: 'Ehsaas' },
  { id: 'lg-10', url: '/legacy/photo-nov13.jpg', alt: 'November 13 event cover', caption: 'Nov 13 cover' },
  { id: 'lg-11', url: '/legacy/photo-opening.png', alt: 'Opening ceremony tableau', caption: 'Opening ceremony' },
  { id: 'lg-12', url: '/legacy/poster-sanjib.jpg', alt: 'Sanjib production poster', caption: 'Sanjib — poster' },
];

const FALLBACK_GALLERY_VIDEOS = [
  {
    id: 'fallback-1',
    youtube_id: 'R4Bkme6VYk8',
    title: 'Tasher Desh — opening',
    description: "A BACDA staging of Tagore's Tasher Desh.",
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-2',
    youtube_id: 'BMFBOWVmAUc',
    title: 'Bodhayon',
    description: 'A BACDA original musical production — filmed during Durga Puja 2020.',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-3',
    youtube_id: 'LDdBAEWIfh4',
    title: 'Abstract Dhadkan',
    description: 'Contemporary fusion — an abstract reading of rhythm.',
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-4',
    youtube_id: 'KWzwSzxBUis',
    title: 'Festival ensemble',
    description: 'Full ensemble — festival night.',
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-5',
    youtube_id: 'U4GBhShiU94',
    title: 'Community staging',
    description: 'A piece from a BACDA community gathering.',
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fallback-6',
    youtube_id: 'aX0ykUf-g0k',
    title: 'Workshop rehearsal',
    description: 'Rehearsal footage from a BACDA workshop.',
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Photos and videos from Bay Area Creative Dance Academy performances — NABC ceremonies, Raabta, Bodhayon, Ehsaas, Kingdom of Dreams, and more.',
  alternates: { canonical: SITE_URL + '/gallery' },
  openGraph: {
    title: 'Gallery — Bay Area Creative Dance Academy',
    description: 'Photos and videos from BACDA performances over the years.',
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
  const dbPhotos = photoGroups.flatMap(({ event, photos }) =>
    photos.map((p) => ({
      id: p.id,
      url: storageUrl('gallery', p.storage_path),
      alt: p.caption ?? `${event.title} — photo`,
      caption: p.caption ?? null,
    })),
  );
  // Fallback to curated legacy photos until admins upload real event photos.
  const allPhotos = dbPhotos.length > 0 ? dbPhotos : FALLBACK_GALLERY_PHOTOS;

  // Fallback to the curated BACDA YouTube IDs harvested from the legacy site.
  const effectiveVideos =
    videos.length > 0 ? videos : (FALLBACK_GALLERY_VIDEOS as typeof videos);

  return (
    <>
      <section className="relative bg-ink pt-36 md:pt-44">
        <div className="container">
          <Reveal>
            <span className="label-eyebrow">Archive</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 max-w-[14ch] display-xl italic leading-[0.95] text-cream">
              Two decades of movement.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-cream/65 md:text-xl">
              Moments from BACDA&apos;s productions, rehearsals, and public
              performances — from NABC ceremonies to original musicals to
              community gatherings.
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
              {effectiveVideos.length === 0 ? (
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
                  {effectiveVideos.map((v, i) => (
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
