import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EventDetailHero } from '@/components/sections/event-detail-hero';
import { PhotoGallery } from '@/components/sections/photo-gallery';
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

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
    `${event.title} — a Bay Area Creative Dancers production.`;
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
        <section className="bg-cream py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <article className="leading-relaxed text-ink/85 [&_em]:italic [&_p]:mt-6 [&_p:first-child]:mt-0 [&_strong]:font-semibold [&_strong]:text-ink">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="text-lg leading-[1.7]">{children}</p>
                    ),
                  }}
                >
                  {event.description}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </section>
      )}

      {primaryYoutubeId && (
        <section className="bg-[#F5EFE4] py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
                On film
              </p>
              <h2 className="mt-4 font-display text-2xl font-medium italic md:text-3xl">
                Watch the performance
              </h2>
              {/* TODO: swap for <YouTubePlayer id={...} /> once integrator ships
                  components/social/youtube-player.tsx. */}
              <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-md bg-ink shadow-lg">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${primaryYoutubeId}`}
                  title={`${event.title} — video`}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {event.collaborators && event.collaborators.length > 0 && (
        <section className="bg-cream py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Collaborators
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {event.collaborators.map((c) => (
                  <li key={c}>
                    <Badge variant="outline" className="font-sans">
                      {c}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {galleryPhotos.length > 0 && (
        <section className="bg-cream py-20 md:py-28">
          <div className="container">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
              From the stage
            </p>
            <h2 className="mt-4 font-display text-2xl font-medium italic md:text-3xl">
              Photo gallery
            </h2>
            <div className="mt-10">
              <PhotoGallery photos={galleryPhotos} />
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#F5EFE4] py-16">
        <div className="container text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-display text-lg italic text-burgundy underline-offset-4 hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to all events
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
