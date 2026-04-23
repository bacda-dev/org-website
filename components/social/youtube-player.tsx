'use client';

/**
 * YouTube player — thin React wrapper around the `<lite-youtube>` custom
 * element from `lite-youtube-embed`.
 *
 * Why lite-youtube-embed: the stock YouTube iframe pulls ~1.3 MB of scripts
 * on page load even when the user never plays the video, tanking Lighthouse
 * Performance. lite-youtube-embed renders a poster image + play button and
 * only loads the real iframe on click — dropping initial payload to <1 KB.
 *
 * CLIENT-ONLY. The custom element is registered by a side-effectful import,
 * which we defer to `useEffect` so SSR doesn't choke on `customElements`.
 *
 * We import the CSS directly in this module so every page that uses a player
 * gets the styling without the author having to remember a global import.
 */

import { useEffect } from 'react';
import 'lite-youtube-embed/src/lite-yt-embed.css';
import { cn } from '@/lib/utils';

export interface YouTubePlayerProps {
  /** 11-character YouTube video ID. */
  id: string;
  /** Accessible title — becomes the play button's aria-label. */
  title: string;
  /** Optional Tailwind className override. */
  className?: string;
  /** Optional custom poster image URL. Defaults to YouTube-hosted thumbnail. */
  poster?: string;
  /**
   * URL-encoded query string forwarded to the YouTube embed iframe.
   * Example: "autoplay=1&mute=1&start=30". Do NOT include a leading `?`.
   */
  params?: string;
}

export function YouTubePlayer({
  id,
  title,
  className,
  poster,
  params,
}: YouTubePlayerProps) {
  useEffect(() => {
    // Register the `<lite-youtube>` custom element exactly once. Dynamic import
    // keeps it out of the server bundle and defers it until the component
    // actually mounts.
    void import('lite-youtube-embed');
  }, []);

  return (
    <lite-youtube
      videoid={id}
      playlabel={`Play: ${title}`}
      {...(poster ? { poster } : {})}
      {...(params ? { params } : {})}
      className={cn('block w-full overflow-hidden rounded-md', className)}
    />
  );
}
