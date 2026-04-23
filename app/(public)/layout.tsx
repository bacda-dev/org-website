import { Nav } from '@/components/site/nav';
import { Footer } from '@/components/site/footer';
import { getHomeContent } from '@/lib/fetchers/home';
import { getPastEvents } from '@/lib/fetchers/events';

/**
 * Public-route layout — "Kinetic Editorial / Concert-Hall Noir".
 *
 * Dark-ink shell wraps every non-admin page. Fetches:
 *   - home_content.donate_url (nav + footer Donate CTA)
 *   - past-event titles (footer marquee ticker)
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [home, past] = await Promise.all([
    getHomeContent(),
    getPastEvents(),
  ]);
  const donateUrl = home?.donate_url ?? null;
  const marqueeTitles = past.map((e) => e.title);

  return (
    <div className="relative min-h-screen bg-ink text-cream">
      <Nav donateUrl={donateUrl} />
      <main id="main-content" className="relative min-h-screen bg-ink">
        {children}
      </main>
      <Footer donateUrl={donateUrl} marqueeTitles={marqueeTitles} />
    </div>
  );
}
