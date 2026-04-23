import { Nav } from '@/components/site/nav';
import { Footer } from '@/components/site/footer';
import { getHomeContent } from '@/lib/fetchers/home';

/**
 * Public-route layout. Wraps every non-admin page with the sticky nav and
 * the editorial footer. Fetches home_content once so both nav (Donate CTA)
 * and footer (Donate link) stay in sync without a second round-trip.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const home = await getHomeContent();
  const donateUrl = home?.donate_url ?? null;
  return (
    <>
      <Nav donateUrl={donateUrl} />
      <main id="main-content" className="min-h-screen bg-cream">
        {children}
      </main>
      <Footer donateUrl={donateUrl} />
    </>
  );
}
