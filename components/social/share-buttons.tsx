'use client';

/**
 * Share buttons — row of icon anchors for FB / WhatsApp / X / Email / Copy.
 * On mobile, also surfaces the native Web Share API button when available.
 *
 * Design choices:
 *   - Anchors, not buttons, for the 4 share targets — so they work without JS
 *     (graceful degradation) and middle-click / right-click → "open in new
 *     tab" behaves as the user expects.
 *   - Copy-link is a real `<button>` (needs clipboard API).
 *   - Native share: we only render the button if `navigator.share` exists,
 *     detected on mount to avoid SSR hydration mismatches.
 */

import { useEffect, useState } from 'react';
import {
  Copy,
  Facebook,
  Check,
  Mail,
  Share2,
  Twitter,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  copyShareLink,
  emailShareUrl,
  fbShareUrl,
  twitterShareUrl,
  whatsappShareUrl,
} from '@/lib/integrations/facebook';
import { cn } from '@/lib/utils';

export interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

/** WhatsApp lucide icon is only available in newer releases; render an inline SVG. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const iconClass =
  'inline-flex size-10 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:bg-burgundy hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream';

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // Detect on mount, not render, to avoid SSR/CSR mismatches.
    setCanNativeShare(
      typeof navigator !== 'undefined' && typeof navigator.share === 'function',
    );
  }, []);

  async function handleCopy() {
    const ok = await copyShareLink(url);
    if (ok) {
      setCopied(true);
      toast.success('Link copied');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Could not copy link');
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ url, title, text: title });
    } catch {
      // User dismissed the share sheet or the API rejected; silently no-op.
    }
  }

  return (
    <div
      className={cn('flex flex-wrap items-center gap-3', className)}
      role="group"
      aria-label="Share this page"
    >
      <a
        href={fbShareUrl(url)}
        target="_blank"
        rel="noopener noreferrer"
        className={iconClass}
        aria-label="Share on Facebook"
      >
        <Facebook className="size-5" aria-hidden="true" />
      </a>
      <a
        href={whatsappShareUrl(url, title)}
        target="_blank"
        rel="noopener noreferrer"
        className={iconClass}
        aria-label="Share on WhatsApp"
      >
        <WhatsAppIcon className="size-5" />
      </a>
      <a
        href={twitterShareUrl(url, title)}
        target="_blank"
        rel="noopener noreferrer"
        className={iconClass}
        aria-label="Share on X (Twitter)"
      >
        <Twitter className="size-5" aria-hidden="true" />
      </a>
      <a
        href={emailShareUrl(title, `${title}\n\n${url}`)}
        className={iconClass}
        aria-label="Share via email"
      >
        <Mail className="size-5" aria-hidden="true" />
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className={iconClass}
        aria-label={copied ? 'Link copied' : 'Copy link'}
      >
        {copied ? (
          <Check className="size-5" aria-hidden="true" />
        ) : (
          <Copy className="size-5" aria-hidden="true" />
        )}
      </button>
      {canNativeShare ? (
        <button
          type="button"
          onClick={handleNativeShare}
          className={cn(iconClass, 'md:hidden')}
          aria-label="Open device share sheet"
        >
          <Share2 className="size-5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
