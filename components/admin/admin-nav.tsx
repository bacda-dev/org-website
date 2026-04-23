'use client';

/**
 * Admin top-navigation bar.
 *
 * Rendered once by `app/(admin)/layout.tsx`. Ink background + cream text is
 * intentionally distinct from the public site so admins always know which
 * surface they're on (per PRD §7.4 admin UX principles).
 *
 * - Brand row: Logo (mono-light) + "Admin" label, user email dropdown on right.
 * - Secondary row: 11 section links. Active link gets a burgundy underline.
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { LogOut, Settings as SettingsIcon, User } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const SECTIONS: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/home', label: 'Home' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/sponsors', label: 'Sponsors' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/social', label: 'Social' },
  { href: '/admin/instagram-highlights', label: 'Instagram' },
  { href: '/admin/submissions', label: 'Submissions' },
  { href: '/admin/settings', label: 'Settings' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export interface AdminNavProps {
  userEmail: string | null;
}

export function AdminNav({ userEmail }: AdminNavProps) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
        toast.success('Signed out');
        router.push('/admin/login');
        router.refresh();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign out failed';
        toast.error(message);
      }
    });
  };

  return (
    <header className="bg-ink text-cream">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/admin"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <Logo variant="mono-light" size="sm" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-cream/70">
            Admin
          </span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                'inline-flex items-center gap-2 rounded px-3 py-2 text-sm',
                'text-cream/90 hover:bg-cream/10',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
              )}
              aria-label="Account menu"
            >
              <User className="size-4" aria-hidden="true" />
              <span className="max-w-[180px] truncate">
                {userEmail ?? 'Signed in'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-ink">
            <DropdownMenuLabel>{userEmail ?? 'Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="flex items-center gap-2">
                <SettingsIcon className="size-4" aria-hidden="true" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handleSignOut();
              }}
              className="text-error focus:bg-error/10 focus:text-error"
            >
              <LogOut className="size-4" aria-hidden="true" />
              {isPending ? 'Signing out…' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        aria-label="Admin sections"
        className="border-t border-cream/10 bg-ink/95"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-1 px-6">
          {SECTIONS.map((section) => {
            const active = isActive(pathname, section.href);
            return (
              <Link
                key={section.href}
                href={section.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative py-3 text-sm font-medium tracking-tight transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
                  active
                    ? 'text-cream after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-burgundy'
                    : 'text-cream/70 hover:text-cream'
                )}
              >
                {section.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Fallback for when the dropdown can't render (extremely small viewport) */}
      <noscript>
        <div className="mx-auto max-w-7xl px-6 py-2 text-xs text-cream/80">
          {userEmail ?? 'Signed in'}
        </div>
      </noscript>

      {/* Reserved: quick sign-out button kept for keyboard-only bailout */}
      <span className="sr-only">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          disabled={isPending}
        >
          Sign out
        </Button>
      </span>
    </header>
  );
}
