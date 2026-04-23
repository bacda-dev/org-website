'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Sticky site navigation. Transparent over hero, solid cream/blurred on scroll.
 *
 * - Logo variant flips between `mono-light` (over hero/transparent) and `color`
 *   (on solid cream) based on scroll state.
 * - Home page is the only page with a hero-dark state; every other route
 *   forces the solid style immediately so the white-on-cream nav never flashes.
 * - Mobile opens a full-screen sheet via Radix Dialog (focus-trapped,
 *   Escape-closable, overlay-click-closable).
 */
const LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact' },
];

export interface NavProps {
  donateUrl?: string | null;
}

export function Nav({ donateUrl }: NavProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isHome = pathname === '/';
  const overHero = isHome && !scrolled;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile sheet on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const showDonate = Boolean(donateUrl && donateUrl.trim().length > 0);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        overHero
          ? 'bg-transparent'
          : 'border-b border-border bg-cream/95 backdrop-blur'
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6 md:h-20">
        <Link
          href="/"
          aria-label="Bay Area Creative Dancers — home"
          className="shrink-0"
        >
          <Logo variant={overHero ? 'mono-light' : 'color'} size="md" priority />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative font-sans text-sm tracking-wide transition-colors',
                  overHero
                    ? 'text-cream/90 hover:text-cream'
                    : 'text-ink/70 hover:text-ink',
                  active &&
                    (overHero
                      ? 'text-cream after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-cream'
                      : 'text-ink after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-burgundy')
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          {showDonate && (
            <Button
              asChild
              size="sm"
              variant={overHero ? 'outline' : 'default'}
              className={cn(
                'hidden md:inline-flex',
                overHero &&
                  'border-cream text-cream hover:bg-cream hover:text-ink'
              )}
            >
              <a
                href={donateUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                Donate
              </a>
            </Button>
          )}

          {/* Mobile trigger */}
          <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogPrimitive.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className={cn(
                  'inline-flex h-11 w-11 items-center justify-center rounded-md md:hidden',
                  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
                  overHero ? 'text-cream' : 'text-ink'
                )}
              >
                <Menu className="size-6" aria-hidden="true" />
              </button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
              <DialogPrimitive.Content
                aria-label="Site navigation"
                className={cn(
                  'fixed inset-0 z-50 flex flex-col bg-cream',
                  'data-[state=open]:animate-in data-[state=closed]:animate-out',
                  'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0'
                )}
              >
                <DialogPrimitive.Title className="sr-only">
                  Site navigation
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">
                  Primary site navigation
                </DialogPrimitive.Description>
                <div className="flex h-16 items-center justify-between px-6">
                  <Logo variant="color" size="md" />
                  <DialogPrimitive.Close
                    aria-label="Close menu"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  >
                    <X className="size-6" aria-hidden="true" />
                  </DialogPrimitive.Close>
                </div>
                <nav
                  aria-label="Mobile primary"
                  className="flex flex-1 flex-col justify-center gap-2 px-8 pb-24"
                >
                  {LINKS.map((l) => {
                    const active =
                      pathname === l.href || pathname.startsWith(l.href + '/');
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'font-display text-4xl font-medium leading-snug tracking-tight transition-colors',
                          active ? 'text-burgundy' : 'text-ink hover:text-burgundy'
                        )}
                      >
                        {l.label}
                      </Link>
                    );
                  })}
                  {showDonate && (
                    <Button
                      asChild
                      size="lg"
                      className="mt-8 self-start"
                    >
                      <a
                        href={donateUrl ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Donate
                      </a>
                    </Button>
                  )}
                </nav>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        </div>
      </div>
    </header>
  );
}
