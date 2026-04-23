import type { Metadata } from 'next';
import { Hero } from '@/components/sections/hero';
import { FeaturedEvent } from '@/components/sections/featured-event';
import { FeaturedEventFallback } from '@/components/sections/featured-event-fallback';
import { StatsStrip } from '@/components/sections/stats-strip';
import { PhotoWall } from '@/components/sections/photo-wall';
import { Programs } from '@/components/sections/programs';
import { RecentVideos } from '@/components/sections/recent-videos';
import { SponsorsStrip } from '@/components/sections/sponsors-strip';
import { JoinCta } from '@/components/sections/join-cta';
import { EventSchema } from '@/lib/seo/json-ld';
import { getHomeContent } from '@/lib/fetchers/home';
import { getFeaturedEvent } from '@/lib/fetchers/events';
import { getGalleryVideos } from '@/lib/fetchers/gallery';
import { getActiveSponsors } from '@/lib/fetchers/sponsors';
import { storageUrl } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Bay Area Creative Dancers — Foster the Love of Dance',
  description:
    'Bay Area Creative Dancers is a non-profit dance organization led by artistic director Dalia Sen. Classical, contemporary, and fusion Indian dance productions from the San Francisco Bay Area.',
  alternates: { canonical: SITE_URL + '/' },
  openGraph: {
    title: 'Bay Area Creative Dancers',
    description: 'Foster the Love of Dance',
    url: SITE_URL + '/',
    type: 'website',
    images: [{ url: '/brand/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bay Area Creative Dancers',
    description: 'Foster the Love of Dance',
    images: ['/brand/og-image.png'],
  },
};

export default async function HomePage() {
  const [home, featured, videos, sponsors] = await Promise.all([
    getHomeContent(),
    getFeaturedEvent(),
    getGalleryVideos(),
    getActiveSponsors(),
  ]);

  // Hero image: use admin value if set, otherwise the stunning classical
  // dancer-in-archway photograph shipped in /public/legacy/.
  const heroImage = home?.hero_image_url ?? '/legacy/hero-classical.jpg';

  const heroHeadline = home?.hero_headline ?? 'Foster the Love of Dance';
  const heroSub =
    home?.hero_subheadline ??
    'Classical, contemporary, and fusion Indian dance from the San Francisco Bay Area. Since 2008, BACDA has staged over twenty productions — NABC ceremonies, devotional works, workshops, and festival nights.';

  const featuredCta = featured?.ticket_url
    ? {
        label: featured.ticket_cta ?? 'Get Tickets',
        href: featured.ticket_url,
        external: true,
      }
    : featured
      ? {
          label: 'Read the program',
          href: `/events/${featured.slug}`,
          external: false,
        }
      : {
          label: 'Browse past productions',
          href: '/events',
          external: false,
        };

  return (
    <>
      <Hero
        imageUrl={heroImage}
        headline={heroHeadline}
        subheadline={heroSub}
        ctaLabel={featuredCta.label}
        ctaHref={featuredCta.href}
        ctaExternal={featuredCta.external}
      />

      <StatsStrip />

      {featured ? (
        <FeaturedEvent event={featured} />
      ) : (
        <FeaturedEventFallback />
      )}

      <PhotoWall />

      <Programs />

      <RecentVideos videos={videos} />

      <SponsorsStrip sponsors={sponsors} />

      <JoinCta />

      {featured && (
        <EventSchema
          name={featured.title}
          startDate={featured.event_date}
          endDate={featured.end_date ?? undefined}
          venueName={featured.venue_name ?? undefined}
          venueAddress={featured.venue_address ?? undefined}
          description={featured.description ?? undefined}
          imageUrl={
            featured.poster_url
              ? featured.poster_url.startsWith('http')
                ? featured.poster_url
                : storageUrl('posters', featured.poster_url)
              : undefined
          }
          ticketUrl={featured.ticket_url ?? undefined}
          isPast={featured.status === 'past'}
        />
      )}
    </>
  );
}
