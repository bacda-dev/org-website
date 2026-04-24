/**
 * Admin — Instagram Highlights CRUD.
 */

import { getInstagramHighlights } from '@/lib/fetchers/instagram';
import { InstagramHighlightsManager } from './instagram-manager';

export const dynamic = 'force-dynamic';

export default async function AdminInstagramHighlightsPage() {
  const highlights = await getInstagramHighlights();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cream/55">
          Admin · Instagram
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
          Instagram highlights
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-cream/55">
          Paste Instagram post URLs to feature them in the gallery. If an
          oEmbed token is configured, thumbnail + caption auto-populate.
          Otherwise, paste those fields manually after the post is saved.
        </p>
      </div>

      <InstagramHighlightsManager highlights={highlights} />
    </div>
  );
}
