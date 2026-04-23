import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils';

/**
 * Site footer — dark ink ground with cream type. Three columns on md+:
 *   1. Brand + tagline + mission snippet
 *   2. Quick links
 *   3. Contact + socials + donate
 *
 * Socials are FB / IG / YT only per user directive. No newsletter.
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
}

export function Footer({ donateUrl }: FooterProps) {
  const showDonate = Boolean(donateUrl && donateUrl.trim().length > 0);
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink text-cream">
      <div className="container grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
        {/* Brand */}
        <div className="md:col-span-5">
          <Logo variant="mono-light" size="lg" />
          <p className="mt-6 font-display text-2xl italic leading-tight text-cream/90">
            Foster the Love of Dance.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            Bay Area Creative Dancers is a 501(c) non-profit dance organization
            dedicated to passing on classical, contemporary, and fusion Indian
            dance to generations to come.
          </p>
        </div>

        {/* Quick links */}
        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-cream/50">
            Explore
          </h2>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              { href: '/about', label: 'About' },
              { href: '/events', label: 'Events' },
              { href: '/gallery', label: 'Gallery' },
              { href: '/testimonials', label: 'Testimonials' },
              { href: '/contact', label: 'Contact' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-cream/80 transition-colors hover:text-cream"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + socials */}
        <div className="md:col-span-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-cream/50">
            Connect
          </h2>
          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-cream/80 transition-colors hover:text-cream"
              >
                <Mail className="size-4" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="text-cream/80">Based in Fremont, CA</li>
          </ul>

          <div className="mt-6 flex items-center gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-full',
                  'border border-cream/20 text-cream/80 transition-all',
                  'hover:border-cream/60 hover:text-cream',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>

          {showDonate && (
            <a
              href={donateUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'mt-8 inline-flex items-center justify-center rounded-md',
                'border border-cream px-6 py-3 text-sm font-medium tracking-wide',
                'text-cream transition-colors hover:bg-cream hover:text-ink',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
              )}
            >
              Donate
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container flex flex-col items-start justify-between gap-2 py-6 text-xs text-cream/50 md:flex-row md:items-center">
          <p>
            &copy; {year} Bay Area Creative Dancers. A 501(c) non-profit
            organization.
          </p>
          <p className="font-mono uppercase tracking-[0.2em]">BACDA</p>
        </div>
      </div>
    </footer>
  );
}
