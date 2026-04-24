'use client';

/**
 * Admin top-navigation bar — Concert-Hall Noir to match the public shell.
 *
 * - Brand row: logo + "Admin" mono label, user email dropdown on the right.
 * - Section row: scrollable on narrow viewports, amber underline on active.
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { LogOut, Settings as SettingsIcon, User } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/brand/logo';
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
    <header className="sticky top-0 z-30 border-b border-cream/10 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/admin"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <Logo size="lg" />
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-cream/55">
            Admin
          </span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-sm',
                'text-cream/85 transition-colors hover:border-cream/50 hover:bg-cream/5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink'
              )}
              aria-label="Account menu"
            >
              <User className="size-4" aria-hidden="true" />
              <span className="hidden max-w-[200px] truncate md:inline">
                {userEmail ?? 'Signed in'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-ink-50 text-cream border-cream/10">
            <DropdownMenuLabel className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-cream/55">
              {userEmail ?? 'Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-cream/10" />
            <DropdownMenuItem asChild className="focus:bg-cream/5 focus:text-cream">
              <Link href="/admin/settings" className="flex items-center gap-2">
                <SettingsIcon className="size-4" aria-hidden="true" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-cream/10" />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                handleSignOut();
              }}
              className="flex items-center gap-2 text-error focus:bg-error/10 focus:text-error"
            >
              <LogOut className="size-4" aria-hidden="true" />
              {isPending ? 'Signing out…' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        aria-label="Admin sections"
        className="border-t border-cream/10"
      >
        <div className="mx-auto w-full max-w-7xl overflow-x-auto px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex min-w-max items-center gap-x-7">
            {SECTIONS.map((section) => {
              const active = isActive(pathname, section.href);
              return (
                <li key={section.href}>
                  <Link
                    href={section.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative flex items-center py-3 font-sans text-sm font-medium tracking-wide transition-colors whitespace-nowrap',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
                      active
                        ? 'text-cream'
                        : 'text-cream/60 hover:text-cream'
                    )}
                  >
                    {section.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 -bottom-px h-[2px] origin-left scale-x-0 bg-burgundy transition-transform duration-500 ease-out-expo group-hover:scale-x-100',
                        active && 'scale-x-100'
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
