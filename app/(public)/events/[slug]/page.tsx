import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { EventDetailHero } from '@/components/sections/event-detail-hero';
import { PhotoGallery } from '@/components/sections/photo-gallery';
import { Reveal } from '@/components/sections/reveal';
import { YouTubePlayer } from '@/components/social/youtube-player';
import {
  EventSchema,
  VideoObjectSchema,
  BreadcrumbSchema,
} from '@/lib/seo/json-ld';
import {
  getEventBySlug,
  getAllEvents,
} from '@/lib/fetchers/events';
import { getEventPhotos, getEventVideos } from '@/lib/fetchers/gallery';
import { storageUrl } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const dynamicParams = true;

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: 'Event not found' };
  const poster = resolvePoster(event.poster_url);
  const title = event.subtitle
    ? `${event.title} — ${event.subtitle}`
    : event.title;
  const description =
    event.description?.slice(0, 200) ??
    `${event.title} — a Bay Area Creative Dance Academy production.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/events/${event.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/events/${event.slug}`,
      type: 'article',
      ...(poster && {
        images: [{ url: poster, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(poster && { images: [poster] }),
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();

  const [photos, videos] = await Promise.all([
    getEventPhotos(event.id),
    getEventVideos(event.id),
  ]);

  const poster = resolvePoster(event.poster_url);

  let dateLabel = '';
  try {
    dateLabel = format(parseISO(event.event_date), 'MMMM d, yyyy');
  } catch {
    dateLabel = String(event.year);
  }

  const isPast = event.status === 'past';
  const primaryYoutubeId = event.youtube_id ?? videos[0]?.youtube_id ?? null;

  const galleryPhotos = photos.map((p) => ({
    id: p.id,
    url: storageUrl('gallery', p.storage_path),
    alt: p.caption ?? `${event.title} — photo`,
    caption: p.caption ?? null,
  }));

  return (
    <>
      <EventDetailHero
        title={event.title}
        subtitle={event.subtitle}
        dateLabel={dateLabel}
        venueName={event.venue_name}
        posterUrl={poster}
        isPast={isPast}
        ticketUrl={event.ticket_url}
        ticketCta={event.ticket_cta}
      />

      {event.description && (
        <section className="relative bg-ink py-20 md:py-28">
          <div className="container">
            <Reveal className="mx-auto max-w-3xl border-t border-cream/10 pt-10">
              <p className="label-eyebrow">Program notes</p>
            </Reveal>
            <Reveal delay={0.05} className="mx-auto max-w-3xl">
              <article className="mt-10 leading-relaxed text-cream/80 [&_em]:italic [&_p]:mt-6 [&_p:first-child]:mt-0 [&_strong]:text-cream [&_strong]:font-semibold">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="text-lg leading-[1.75]">{children}</p>
                    ),
                  }}
                >
                  {event.description}
                </ReactMarkdown>
              </article>
            </Reveal>
          </div>
        </section>
      )}

      {primaryYoutubeId && (
        <section className="relative bg-ink-100 py-20 md:py-28">
          <div className="container">
            <Reveal className="flex items-center gap-4 border-b border-cream/10 pb-6">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-cream/40">
                Reel
              </span>
              <span className="label-eyebrow">On film</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-10 display-md italic text-cream">
                Watch the performance.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 overflow-hidden rounded-sm shadow-lg">
                <YouTubePlayer
                  id={primaryYoutubeId}
                  title={event.title}
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {event.collaborators && event.collaborators.length > 0 && (
        <section className="relative bg-ink py-20">
          <div className="container">
            <Reveal className="mx-auto max-w-4xl border-t border-cream/10 pt-8">
              <p className="label-eyebrow-muted">Collaborators</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {event.collaborators.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-cream/20 px-4 py-1.5 text-sm text-cream/80"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {galleryPhotos.length > 0 && (
        <section className="relative bg-ink py-20 md:py-28">
          <div className="container">
            <Reveal className="flex items-center justify-between border-b border-cream/10 pb-6">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-cream/40">
                  Gallery
                </span>
                <span className="label-eyebrow">From the stage</span>
              </div>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-cream/45">
                {galleryPhotos.length} photos
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-10 display-md italic text-cream">
                Moments, captured.
              </h2>
            </Reveal>
            <div className="mt-14">
              <PhotoGallery photos={galleryPhotos} variant="grid" />
            </div>
          </div>
        </section>
      )}

      <section className="relative bg-ink-100 py-20">
        <div className="container flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 font-display text-2xl italic text-cream transition-colors hover:text-burgundy md:text-3xl"
          >
            <ArrowLeft
              className="size-5 text-cream/60 transition-transform group-hover:-translate-x-1 group-hover:text-burgundy"
              aria-hidden="true"
            />
            Back to all events
          </Link>
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cream/55 transition-colors hover:text-cream"
          >
            Browse the full gallery
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      <EventSchema
        name={event.title}
        startDate={event.event_date}
        endDate={event.end_date ?? undefined}
        venueName={event.venue_name ?? undefined}
        venueAddress={event.venue_address ?? undefined}
        description={event.description ?? undefined}
        imageUrl={poster ?? undefined}
        ticketUrl={event.ticket_url ?? undefined}
        isPast={isPast}
      />
      {primaryYoutubeId && (
        <VideoObjectSchema
          name={event.title}
          description={event.subtitle ?? undefined}
          youtubeId={primaryYoutubeId}
        />
      )}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL + '/' },
          { name: 'Events', url: SITE_URL + '/events' },
          { name: event.title, url: `${SITE_URL}/events/${event.slug}` },
        ]}
      />
    </>
  );
}

function resolvePoster(value: string | null): string | null {
  if (!value) return null;
  return value.startsWith('http') ? value : storageUrl('posters', value);
}
