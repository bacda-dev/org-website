/**
 * Admin — Home content editor.
 *
 * Edits the singleton `home_content` row. Server component loads current
 * values + upcoming-events list for the "featured event" dropdown, then
 * hands off to the HomeEditor client component.
 */

import Link from 'next/link';
import { getHomeContent } from '@/lib/fetchers/home';
import { getUpcomingEvents } from '@/lib/fetchers/events';
import { HomeEditor } from './home-editor';

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const [home, upcoming] = await Promise.all([
    getHomeContent(),
    getUpcomingEvents(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cream/55">
            Admin · Home
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
            Home content
          </h1>
          <p className="mt-1 text-sm text-cream/55">
            Edits the singleton home page record — hero, mission, featured
            event, donate URL.
          </p>
        </div>
        <Link
          href="/?preview=1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-burgundy underline-offset-4 hover:underline"
        >
          Preview on site ↗
        </Link>
      </div>

      <HomeEditor
        initial={{
          hero_headline: home?.hero_headline ?? '',
          hero_subheadline: home?.hero_subheadline ?? '',
          hero_image_url: home?.hero_image_url ?? '',
          hero_video_url: home?.hero_video_url ?? '',
          mission_statement: home?.mission_statement ?? '',
          featured_event_id: home?.featured_event_id ?? '',
          donate_url: home?.donate_url ?? '',
        }}
        upcomingEvents={upcoming.map((e) => ({ id: e.id, title: e.title }))}
      />
    </div>
  );
}
