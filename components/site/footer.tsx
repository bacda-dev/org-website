import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils';

/**
 * Site footer — concert-hall noir.
 *
 * Structure:
 *   1. Hairline + marquee ticker of past production titles
 *   2. Oversized italic tagline + brand block + columns
 *   3. Legal strip
 *
 * The marquee establishes continuity with the nav's ticker strip and doubles
 * as a proof-of-work badge for a company with 20+ productions. Runs infinitely
 * via pure CSS; pauses under `prefers-reduced-motion`.
 */
const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/BayAreaCreativeDanceAcademy',
    Icon: Facebook,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/bayareacreativedanceacademy',
    Icon: Instagram,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UCPYZ8dOpCwy-bFLRqoiX90g',
    Icon: Youtube,
  },
] as const;

const CONTACT_EMAIL = 'contactus@bayareacreativedancers.org';

export interface FooterProps {
  donateUrl?: string | null;
  marqueeTitles?: string[];
}

export function Footer({ donateUrl, marqueeTitles = [] }: FooterProps) {
  const showDonate = Boolean(donateUrl && donateUrl.trim().length > 0);
  const year = new Date().getFullYear();

  const titles =
    marqueeTitles.length > 0
      ? marqueeTitles
      : [
          'Tasher Desh',
          'NABC 2009',
          'OMG — Oh My God',
          'Kalamahotsav 2014',
          'Chirosokha',
          'Chitra',
          'Raabdta',
          'Bodhayon',
          'Kingdom Of Dreams',
        ];

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      {/* Past productions — quiet archival line, no animation */}
      <div className="border-y border-cream/10">
        <div className="container flex flex-col gap-3 py-6 md:flex-row md:items-baseline md:gap-6">
          <span className="label-eyebrow-muted shrink-0">
            Past productions
          </span>
          <p className="text-sm leading-relaxed text-cream/55">
            {titles.map((t, i) => (
              <span key={`${t}-${i}`}>
                <span>{t}</span>
                {i < titles.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="mx-3 text-cream/20"
                  >
                    /
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="container grid gap-14 py-16 md:grid-cols-12 md:gap-10 md:py-24">
        {/* Brand block */}
        <div className="md:col-span-5">
          <Logo
            size="2xl"
            className="drop-shadow-[0_8px_32px_rgba(245,166,35,0.25)]"
          />
          <p className="mt-8 font-display text-3xl italic leading-tight text-cream md:text-4xl">
            Foster the Love of Dance.
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/65">
            A 501(c) non-profit dedicated to passing on classical, contemporary,
            and fusion Indian dance to generations to come.
          </p>

          <div className="mt-8 flex items-center gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={cn(
                  'inline-flex h-11 w-11 items-center justify-center rounded-full',
                  'border border-cream/20 text-cream/75 transition-all',
                  'hover:border-burgundy hover:text-burgundy',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <nav aria-label="Footer navigation" className="md:col-span-3">
          <h2 className="label-eyebrow-muted">Explore</h2>
          <ul className="mt-8 space-y-4 font-display text-lg italic">
            {[
              { href: '/about', label: 'About' },
              { href: '/events', label: 'Events' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/contact', label: 'Contact' },
              { href: '/admin/login', label: 'Admin' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex items-baseline gap-1 text-cream/85 transition-colors hover:text-burgundy"
                >
                  {l.label}
                  <ArrowUpRight
                    className="size-3.5 translate-y-[-2px] text-cream/30 transition-colors group-hover:text-burgundy"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Connect + Donate */}
        <div className="md:col-span-4">
          <h2 className="label-eyebrow-muted">Connect</h2>
          <ul className="mt-8 space-y-4 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group inline-flex items-center gap-2 text-cream/85 transition-colors hover:text-burgundy"
              >
                <Mail className="size-4 text-cream/50 group-hover:text-burgundy" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="text-cream/65">Fremont, California</li>
          </ul>

          {showDonate && (
            <a
              href={donateUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group mt-10 inline-flex items-center gap-2 rounded-full',
                'bg-burgundy px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-ink',
                'transition-colors hover:bg-burgundy-dark',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
              )}
            >
              Support BACDA
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container flex flex-col items-start justify-between gap-3 py-6 text-xs text-cream/40 md:flex-row md:items-center">
          <p className="font-mono uppercase tracking-[0.22em]">
            &copy; {year} Bay Area Creative Dancers
          </p>
          <span className="font-mono tracking-[0.32em] text-cream/40">
            B · A · C · D · A
          </span>
        </div>
      </div>
    </footer>
  );
}
