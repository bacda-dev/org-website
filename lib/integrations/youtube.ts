/**
 * YouTube integration — URL parsing and thumbnail helpers ONLY.
 *
 * Explicit scope per user directive #8 (no Google Cloud Console):
 *   - NO calls to googleapis.com / youtube.googleapis.com / YouTube Data API.
 *   - NO API keys. No OAuth.
 *   - YouTube content is 100% admin-curated — admins paste URLs into
 *     `event_videos` / `gallery_videos` via `/admin/*`. This module exists
 *     to validate and normalize those pasted URLs on the client and server,
 *     and to derive thumbnail / embed / watch URLs from a raw 11-char video ID.
 *
 * Thumbnail URLs resolve to `https://i.ytimg.com/vi/<id>/<quality>.jpg`, which
 * YouTube serves publicly without any credential. `maxres` may 404 for very old
 * or low-res uploads; callers that care can fall back to `hq` or `default`.
 */

/** 11-character alphanumeric + underscore/hyphen YouTube video ID. */
const YT_ID = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Extracts the 11-character YouTube video ID from any of the standard URL
 * shapes YouTube exposes, or accepts a bare ID as-is.
 *
 * Accepted inputs:
 *   - Bare ID: `KWzwSzxBUis`
 *   - Short:   `https://youtu.be/KWzwSzxBUis`
 *   - Long:    `https://www.youtube.com/watch?v=KWzwSzxBUis`
 *   - Embed:   `https://www.youtube.com/embed/KWzwSzxBUis`
 *   - Shorts:  `https://www.youtube.com/shorts/KWzwSzxBUis`
 *   - /v/:     `https://www.youtube.com/v/KWzwSzxBUis`
 *   - nocookie:`https://www.youtube-nocookie.com/embed/KWzwSzxBUis`
 *   - Mobile:  `https://m.youtube.com/watch?v=KWzwSzxBUis`
 *   - With query params / timestamps / playlists (ignored — we only extract v).
 *
 * Returns `null` for anything we cannot confidently parse (invalid URL, wrong
 * host, missing ID). Callers MUST handle null — never assume parse success.
 */
export function parseYouTubeId(input: string): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (trimmed.length === 0) return null;

  // Fast path: already a bare 11-char ID.
  if (YT_ID.test(trimmed)) return trimmed;

  // URL path: try to parse via WHATWG URL. Reject anything that fails.
  let url: URL;
  try {
    // URL() needs a protocol; if the caller passed `youtube.com/watch?v=…`
    // without one, prefix https:// so we can still parse it.
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    url = new URL(withScheme);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();

  // youtu.be short links — the video ID is the first path segment.
  if (host === 'youtu.be' || host === 'www.youtu.be') {
    const id = url.pathname.replace(/^\/+/, '').split('/')[0] ?? '';
    return YT_ID.test(id) ? id : null;
  }

  // youtube.com family (incl. m.youtube.com, music.youtube.com) + nocookie mirror.
  const isYouTubeHost =
    host === 'youtube.com' ||
    host.endsWith('.youtube.com') ||
    host === 'youtube-nocookie.com' ||
    host.endsWith('.youtube-nocookie.com');

  if (!isYouTubeHost) return null;

  // /watch?v=<id> — preferred.
  const v = url.searchParams.get('v');
  if (v && YT_ID.test(v)) return v;

  // /embed/<id>, /shorts/<id>, /v/<id>, /live/<id>
  const parts = url.pathname.split('/').filter(Boolean);
  for (const part of parts) {
    if (YT_ID.test(part)) return part;
  }

  return null;
}

/**
 * Returns true iff the input is a valid bare ID or a parseable YouTube URL.
 * Convenience for Zod refinements and admin form validators.
 */
export function isValidYouTubeInput(input: string): boolean {
  return parseYouTubeId(input) !== null;
}

export type YouTubeThumbnailQuality = 'default' | 'hq' | 'maxres';

/**
 * Thumbnail URL served directly by YouTube's CDN. No API key required.
 *
 * Quality map (YouTube's canonical asset names):
 *   - `default`: `default.jpg`        — 120x90
 *   - `hq`:      `hqdefault.jpg`      — 480x360 (always available)
 *   - `maxres`:  `maxresdefault.jpg`  — 1280x720 (may 404 on old uploads)
 */
export function getVideoThumbnail(
  id: string,
  quality: YouTubeThumbnailQuality = 'maxres',
): string {
  const file =
    quality === 'maxres'
      ? 'maxresdefault.jpg'
      : quality === 'hq'
        ? 'hqdefault.jpg'
        : 'default.jpg';
  return `https://i.ytimg.com/vi/${id}/${file}`;
}

/**
 * Canonical embed URL for `<iframe>` or the `<lite-youtube>` custom element.
 * We do NOT append autoplay/mute/start params — let callers pass those
 * through the component's `params` prop so each embed is explicit.
 */
export function getEmbedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}`;
}

/** Canonical `watch?v=<id>` link, for "Open on YouTube" CTAs and sharing. */
export function getWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
