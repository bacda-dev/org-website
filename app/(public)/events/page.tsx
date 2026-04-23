import type { Metadata } from 'next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EventGrid } from '@/components/sections/event-grid';
import { PastEventsFilter } from '@/components/sections/past-events-filter';
import { BreadcrumbSchema } from '@/lib/seo/json-ld';
import {
  getUpcomingEvents,
  getPastEvents,
  getEventYears,
} from '@/lib/fetchers/events';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Events & Performances',
  description:
    'Upcoming and past performances by Bay Area Creative Dancers — classical, contemporary, and fusion Indian dance productions including NABC ceremonies, Raabdta, Bodhayon, and Kingdom Of Dreams.',
  alternates: { canonical: SITE_URL + '/events' },
  openGraph: {
    title: 'Events & Performances — Bay Area Creative Dancers',
    description:
      'Upcoming and past BACDA productions — NABC ceremonies, Raabdta, Bodhayon, Kingdom Of Dreams, and more.',
    url: SITE_URL + '/events',
    type: 'website',
  },
};

export default async function EventsPage() {
  const [upcoming, past, years] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
    getEventYears(),
  ]);

  return (
    <>
      <section className="pt-32 md:pt-40">
        <div className="container">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
            Performances
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium italic leading-[1.05] md:text-6xl lg:text-7xl">
            Events & past productions
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            From NABC opening ceremonies to intimate devotional works — an
            archive of BACDA&apos;s programming, with what&apos;s coming next.
          </p>
        </div>
      </section>

      <section className="pb-24 pt-16 md:pb-32">
        <div className="container">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming
                {upcoming.length > 0 && (
                  <span className="ml-2 text-xs text-muted">
                    ({upcoming.length})
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="past">
                Past
                {past.length > 0 && (
                  <span className="ml-2 text-xs text-muted">
                    ({past.length})
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="pt-10">
              <EventGrid
                events={upcoming}
                emptyLabel="No upcoming performances right now — check back soon."
              />
            </TabsContent>

            <TabsContent value="past" className="pt-10">
              <PastEventsFilter events={past} years={years} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL + '/' },
          { name: 'Events', url: SITE_URL + '/events' },
        ]}
      />
    </>
  );
}
