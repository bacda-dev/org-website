/**
 * Instagram integration — oEmbed (optional) + URL helpers.
 *
 * Per user directive: Instagram posts are admin-curated into the
 * `instagram_highlights` table. The oEmbed fetch is a convenience — if
 * `FB_OEMBED_TOKEN` is set, we can auto-fetch the thumbnail + caption when
 * the admin pastes a post URL. If absent, the admin pastes the thumbnail
 * URL manually; the UI MUST degrade gracefully.
 *
 * This module is server-side only. The Facebook Graph oEmbed endpoint
 * requires an access token, which is a Facebook App token (classic, no GCP).
 *
 * Reference: https://developers.facebook.com/docs/instagram/oembed
 */

/**
 * The subset of oEmbed fields BACDA renders. The real API returns more,
 * but we narrow to what the UI + schema consume.
 */
export interface InstagramOEmbedResponse {
  thumbnail_url: string | null;
  author_name: string | null;
  title: string | null;
  html: string | null;
}

/**
 * Canonical BACDA Instagram handle + profile URL (per CLAUDE.md / PRD §15.4).
 * Exported for nav, footer, and share links.
 */
export const BACDA_INSTAGRAM_HANDLE = 'bayareacreativedanceacademy';
export const BACDA_INSTAGRAM_URL = `https://www.instagram.com/${BACDA_INSTAGRAM_HANDLE}`;

/** Builds a profile URL from any raw handle (strips leading `@`). */
export function buildProfileUrl(handle: string): string {
  const cleaned = handle.trim().replace(/^@/, '');
  return `https://www.instagram.com/${encodeURIComponent(cleaned)}`;
}

/** Builds a post URL from a shortcode/post ID. */
export function buildPostUrl(postId: string): string {
  return `https://www.instagram.com/p/${encodeURIComponent(postId.trim())}/`;
}

/**
 * Fetches oEmbed data for a public Instagram post URL. Returns `null` in any
 * of these cases (caller MUST handle null):
 *   - `FB_OEMBED_TOKEN` is not configured (graceful degradation)
 *   - The fetch fails (network, 4xx/5xx)
 *   - The response shape is unexpected
 *
 * The token lives in env as `FB_OEMBED_TOKEN` and is SERVER-SIDE only. Never
 * import this function into a client component — it will leak the token into
 * the browser bundle.
 */
export async function fetchOEmbed(
  postUrl: string,
): Promise<InstagramOEmbedResponse | null> {
  const token = process.env.FB_OEMBED_TOKEN;
  if (!token) return null;
  if (!postUrl || typeof postUrl !== 'string') return null;

  const endpoint = new URL('https://graph.facebook.com/v18.0/instagram_oembed');
  endpoint.searchParams.set('url', postUrl);
  endpoint.searchParams.set('access_token', token);
  // Skip the script injection — we don't want the embed.js loader.
  endpoint.searchParams.set('omitscript', 'true');

  try {
    const res = await fetch(endpoint.toString(), {
      method: 'GET',
      // Cache for an hour. Instagram content is mostly static per-post.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as Record<string, unknown>;
    return {
      thumbnail_url:
        typeof raw.thumbnail_url === 'string' ? raw.thumbnail_url : null,
      author_name:
        typeof raw.author_name === 'string' ? raw.author_name : null,
      title: typeof raw.title === 'string' ? raw.title : null,
      html: typeof raw.html === 'string' ? raw.html : null,
    };
  } catch {
    return null;
  }
}
