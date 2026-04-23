import type { Metadata } from 'next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EventGrid } from '@/components/sections/event-grid';
import { PastEventsFilter } from '@/components/sections/past-events-filter';
import { Reveal } from '@/components/sections/reveal';
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
      {/* Editorial header */}
      <section className="relative bg-ink pt-36 md:pt-44">
        <div className="container">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-cream/45">
                Chapter 02
              </span>
              <span className="inline-block h-[1px] w-10 bg-burgundy" />
              <span className="label-eyebrow">Program archive</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 max-w-[16ch] display-xl italic leading-[0.95] text-cream">
              Events, past and coming.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-cream/65 md:text-xl">
              From NABC opening ceremonies to intimate devotional works — an
              archive of BACDA&apos;s programming, with what&apos;s coming next.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink pb-24 pt-16 md:pb-36">
        <div className="container">
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="border-b border-cream/10 text-cream">
              <TabsList className="border-cream/10">
                <TabsTrigger value="upcoming">
                  Upcoming
                  {upcoming.length > 0 && (
                    <span className="ml-2 text-burgundy">
                      ({upcoming.length})
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past
                  {past.length > 0 && (
                    <span className="ml-2 text-burgundy">
                      ({past.length})
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="pt-12">
              <EventGrid
                events={upcoming}
                emptyLabel="No upcoming performances right now — check back soon."
              />
            </TabsContent>

            <TabsContent value="past" className="pt-12">
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
