'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, MapPin } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils';

/**
 * Site navigation — Concert-Hall Noir.
 *
 * A thin playbill ticker strip sits above the nav on desktop — it establishes
 * place (Fremont, CA) and anchors the site's "program" aesthetic. The nav
 * itself is transparent on the home hero, solid ink after scroll, and solid
 * ink on every other route from the first frame (no flash).
 *
 * Mobile nav is a full-screen ink sheet with oversized italic links —
 * reads like the back of a concert program.
 */
const LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
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
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const showDonate = Boolean(donateUrl && donateUrl.trim().length > 0);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-500',
        overHero
          ? 'bg-transparent'
          : 'bg-ink/85 backdrop-blur-md border-b border-border'
      )}
    >
      {/* Playbill ticker strip (desktop only) */}
      <div
        className={cn(
          'hidden border-b border-cream/10 transition-opacity duration-500 md:block',
          overHero ? 'opacity-100' : 'opacity-70'
        )}
      >
        <div className="container flex h-8 items-center justify-between text-[0.68rem] uppercase tracking-[0.28em]">
          <div className="flex items-center gap-4 text-cream/55">
            <span className="font-mono">EST. 2008</span>
            <span className="inline-block h-[1px] w-6 bg-cream/25" />
            <span className="font-mono">501(c) NON-PROFIT</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-cream/55">
            <MapPin className="size-3" aria-hidden="true" />
            FREMONT, CALIFORNIA
          </div>
        </div>
      </div>

      {/* Primary bar */}
      <div className="container flex h-20 items-center justify-between gap-6 md:h-24">
        <Link
          href="/"
          aria-label="Bay Area Creative Dancers — home"
          className="shrink-0 transition-opacity hover:opacity-85"
        >
          <Logo
            size="2xl"
            priority
            className={cn(
              'transition-transform duration-500 ease-out-expo',
              overHero && 'logo-glow drop-shadow-[0_6px_24px_rgba(245,166,35,0.35)]'
            )}
          />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 md:flex"
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
                  'group relative py-2 font-sans text-[0.95rem] font-medium tracking-wide transition-colors',
                  active ? 'text-cream' : 'text-cream/70 hover:text-cream'
                )}
              >
                <span className="relative">
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -bottom-1 left-0 right-0 h-[1px] origin-left scale-x-0 bg-burgundy transition-transform duration-500 ease-out-expo group-hover:scale-x-100',
                      active && 'scale-x-100'
                    )}
                  />
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          {showDonate && (
            <a
              href={donateUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors',
                'border border-burgundy bg-burgundy text-ink hover:bg-burgundy-dark hover:border-burgundy-dark'
              )}
            >
              Donate
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          )}

          {/* Mobile trigger */}
          <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogPrimitive.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className={cn(
                  'inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden',
                  'border border-cream/20 text-cream transition-colors hover:border-cream/50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
                )}
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
              <DialogPrimitive.Content
                aria-label="Site navigation"
                className={cn(
                  'fixed inset-0 z-50 flex flex-col bg-ink',
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

                <div className="container flex h-20 items-center justify-between">
                  <Logo
                    size="2xl"
                    className="drop-shadow-[0_6px_24px_rgba(245,166,35,0.35)]"
                  />
                  <DialogPrimitive.Close
                    aria-label="Close menu"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream hover:border-cream/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </DialogPrimitive.Close>
                </div>

                <nav
                  aria-label="Mobile primary"
                  className="container flex flex-1 flex-col justify-between pb-10 pt-8"
                >
                  <ul className="flex flex-col gap-1">
                    {LINKS.map((l, i) => {
                      const active =
                        pathname === l.href || pathname.startsWith(l.href + '/');
                      return (
                        <li
                          key={l.href}
                          className="border-b border-cream/10"
                          style={{
                            animation: `fade-in-up 0.5s cubic-bezier(0.22,1,0.36,1) ${
                              100 + i * 60
                            }ms both`,
                          }}
                        >
                          <Link
                            href={l.href}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                              'flex items-baseline justify-between gap-6 py-5 transition-colors',
                              active ? 'text-burgundy' : 'text-cream hover:text-burgundy'
                            )}
                          >
                            <span className="font-display text-3xl font-normal italic leading-none md:text-4xl">
                              {l.label}
                            </span>
                            <ArrowUpRight
                              className="size-5 text-cream/40"
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="flex flex-col gap-4 pt-10">
                    {showDonate && (
                      <a
                        href={donateUrl ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-burgundy bg-burgundy px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-ink hover:bg-burgundy-dark"
                      >
                        Donate
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    )}
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-cream/40">
                      Fremont, California · Est. 2008
                    </p>
                  </div>
                </nav>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        </div>
      </div>
    </header>
  );
}
