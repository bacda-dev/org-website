/**
 * JSON-LD schema components. Stamp into RSC layouts/pages.
 * Validation: every schema must pass https://search.google.com/test/rich-results
 * with zero errors (PRD §1.3 success criterion).
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bayareacreativedancers.org';

type JsonLd = Record<string, unknown>;

function Script({ data }: { data: JsonLd }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PerformingGroup',
    name: 'Bay Area Creative Dancers',
    alternateName: 'BACDA',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/bacda-logo.svg`,
    description:
      'A San Francisco Bay Area non-profit dance organization led by artistic director Dalia Sen. BACDA produces classical, contemporary, and fusion Indian dance performances.',
    foundingDate: '2018',
    founder: {
      '@type': 'Person',
      name: 'Dalia Sen',
      jobTitle: 'Artistic Director',
    },
    location: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'CA',
        addressCountry: 'US',
        addressLocality: 'Fremont',
      },
    },
    email: 'contactus@bayareacreativedancers.org',
    sameAs: [
      'https://www.facebook.com/BayAreaCreativeDanceAcademy',
      'https://www.youtube.com/channel/UCPYZ8dOpCwy-bFLRqoiX90g',
      'https://www.instagram.com/bayareacreativedanceacademy',
    ],
  };
  return <Script data={data} />;
}

type EventSchemaProps = {
  name: string;
  startDate: string;
  endDate?: string;
  venueName?: string;
  venueAddress?: string;
  description?: string;
  imageUrl?: string;
  ticketUrl?: string;
  isPast?: boolean;
};

export function EventSchema(props: EventSchemaProps) {
  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DanceEvent',
    name: props.name,
    startDate: props.startDate,
    ...(props.endDate && { endDate: props.endDate }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(props.venueName && {
      location: {
        '@type': 'Place',
        name: props.venueName,
        ...(props.venueAddress && { address: props.venueAddress }),
      },
    }),
    ...(props.imageUrl && { image: [props.imageUrl] }),
    ...(props.description && { description: props.description }),
    organizer: { '@type': 'Organization', name: 'Bay Area Creative Dancers' },
    performer: [
      { '@type': 'PerformingGroup', name: 'Bay Area Creative Dancers' },
    ],
    ...(props.ticketUrl &&
      !props.isPast && {
        offers: {
          '@type': 'Offer',
          url: props.ticketUrl,
          availability: 'https://schema.org/InStock',
          validFrom: new Date().toISOString(),
        },
      }),
  };
  return <Script data={data} />;
}

type PersonSchemaProps = {
  name: string;
  jobTitle?: string;
  description?: string;
  imageUrl?: string;
  knowsAbout?: string[];
};

export function PersonSchema(props: PersonSchemaProps) {
  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: props.name,
    ...(props.jobTitle && { jobTitle: props.jobTitle }),
    affiliation: { '@type': 'Organization', name: 'Bay Area Creative Dancers' },
    ...(props.description && { description: props.description }),
    ...(props.knowsAbout && { knowsAbout: props.knowsAbout }),
    ...(props.imageUrl && { image: props.imageUrl }),
  };
  return <Script data={data} />;
}

type VideoSchemaProps = {
  name: string;
  description?: string;
  youtubeId: string;
  uploadDate?: string;
};

export function VideoObjectSchema(props: VideoSchemaProps) {
  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: props.name,
    ...(props.description && { description: props.description }),
    thumbnailUrl: `https://i.ytimg.com/vi/${props.youtubeId}/maxresdefault.jpg`,
    uploadDate: props.uploadDate ?? new Date().toISOString(),
    embedUrl: `https://www.youtube.com/embed/${props.youtubeId}`,
  };
  return <Script data={data} />;
}

type BreadcrumbSchemaProps = {
  items: Array<{ name: string; url?: string }>;
};

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
  return <Script data={data} />;
}
