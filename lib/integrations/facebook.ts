/**
 * Facebook / social share URL helpers.
 *
 * Per user directive: NO Facebook SDK, NO Page Plugin iframe, NO Twitter SDK.
 * Share buttons are plain anchor tags pointing at each network's public
 * share intent URL — zero third-party JavaScript, zero tracking pixels.
 *
 * Every input is `encodeURIComponent`-ed before interpolation.
 */

/** BACDA's canonical Facebook page URL (per CLAUDE.md / PRD §15.5). */
export const BACDA_FACEBOOK_URL =
  'https://www.facebook.com/BayAreaCreativeDanceAcademy';

/**
 * Facebook "Share this link" endpoint (PRD §15.5.3). Opens a prefilled share
 * composer. No app ID or SDK required.
 */
export function fbShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

/**
 * X/Twitter intent URL. We keep the function name `twitterShareUrl` to match
 * the PRD's vocabulary, even though the user directive bans Twitter/X
 * marketing accounts for BACDA. This helper is for visitor share buttons
 * only; there is no BACDA Twitter account.
 */
export function twitterShareUrl(url: string, text: string): string {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

/** WhatsApp share intent — works on both web and mobile (opens native app). */
export function whatsappShareUrl(url: string, text: string): string {
  // Single `text` param that contains both message + link is WhatsApp's
  // documented pattern; consumers see one preview card in the chat.
  const combined = `${text} ${url}`.trim();
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(combined)}`;
}

/** `mailto:` URL for an Email share fallback. */
export function emailShareUrl(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Copies a URL to the clipboard using the async Clipboard API.
 * Returns `true` on success, `false` if the API is unavailable or denied.
 *
 * CLIENT-ONLY: `navigator` is undefined in server components. Import this
 * from a `'use client'` component.
 */
export async function copyShareLink(url: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
