import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Full-bleed editorial hero for the home page.
 *
 * - Background image fills the viewport (80-100vh depending on breakpoint).
 * - Dark ink gradient overlay grades 0 → 50% to ensure headline contrast.
 * - Grain overlay for the tactile, print-press aesthetic per PRD §14.2.
 * - Logo (mono-light) sits above the fold, priority-loaded.
 * - Headline in Fraunces italic, subheadline in Instrument Sans.
 */
export interface HeroProps {
  imageUrl: string | null;
  headline: string;
  subheadline?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  ctaExternal?: boolean;
}

export function Hero({
  imageUrl,
  headline,
  subheadline,
  ctaLabel,
  ctaHref,
  ctaExternal = false,
}: HeroProps) {
  return (
    <section
      aria-label="Introduction"
      className={cn(
        'relative flex min-h-[80vh] w-full items-end overflow-hidden',
        'md:min-h-[92vh] grain-overlay'
      )}
    >
      {/* Background */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-[#2a1a0f] to-burgundy-dark" />
        )}
        {/* Gradient scrim for contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink/80"
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="max-w-3xl">
          <div className="mb-8 md:mb-12">
            <Logo variant="mono-light" size="lg" priority />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cream/70">
            Bay Area Creative Dancers
          </p>
          <h1
            className={cn(
              'mt-4 font-display font-medium italic text-cream',
              'text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.02] tracking-tight'
            )}
          >
            {headline}
          </h1>
          {subheadline && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85 md:text-xl">
              {subheadline}
            </p>
          )}
          {ctaHref && ctaLabel && (
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="border border-cream/40 bg-cream text-ink hover:bg-cream/90"
              >
                {ctaExternal ? (
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ctaLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Link href={ctaHref}>
                    {ctaLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
