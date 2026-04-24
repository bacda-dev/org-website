/**
 * Admin layout — wraps every `/admin/*` page except `/admin/login`.
 *
 * Belt-and-suspenders auth gate: `middleware.ts` (backend-dev) also redirects
 * unauthenticated `/admin/*` requests to `/admin/login`. This layout checks
 * again in the RSC render path so a race or misconfigured middleware cannot
 * leak admin surfaces.
 *
 * Visual: ink header (cream text) + cream content bg. Distinct from the
 * public site so admins always know which surface they're on.
 */

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { AdminNav } from '@/components/admin/admin-nav';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Peek at the incoming pathname to skip the auth gate for the login route.
  // `next/headers` surfaces the original URL via `x-invoke-path` (Next 14) /
  // `x-pathname` (set by middleware). We fall back to a conservative "assume
  // protected" behaviour when neither header is present.
  const hdrs = headers();
  const pathname =
    hdrs.get('x-invoke-path') ??
    hdrs.get('x-pathname') ??
    hdrs.get('next-url') ??
    '';
  const isLoginRoute = pathname.includes('/admin/login');

  if (isLoginRoute) {
    // Login page renders standalone without nav / auth gate.
    return <>{children}</>;
  }

  const session = await getSession();
  if (!session) {
    const from = pathname.startsWith('/admin')
      ? pathname
      : '/admin';
    redirect(`/admin/login?from=${encodeURIComponent(from)}`);
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <AdminNav userEmail={session.user.email} />
      <main id="main-content" className="mx-auto w-full max-w-7xl px-6 py-10 md:py-14">
        {children}
      </main>
    </div>
  );
}
