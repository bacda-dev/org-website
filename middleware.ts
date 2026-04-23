/**
 * Root middleware.
 *
 * 1. Refreshes Supabase auth cookies per the official `@supabase/ssr`
 *    Next.js pattern. Calls `updateSession()` from `lib/supabase/middleware`.
 * 2. Protects `/admin/*` (except `/admin/login`) by redirecting unauth'd
 *    requests to `/admin/login?from=<pathname>`.
 *
 * Excludes static assets via the matcher so we don't run on images, fonts,
 * or the Next.js build output.
 *
 * Ref: https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types/database';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Start with a pass-through response that mirrors the incoming headers,
  // per the Supabase SSR docs.
  let response = NextResponse.next({ request: { headers: request.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const pathname = request.nextUrl.pathname;
  const isAdminRoute =
    pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  // Without Supabase env vars configured we degrade gracefully: public
  // routes pass through, admin routes still redirect so we don't leak the
  // admin shell in demo mode.
  if (!url || !anon) {
    if (isAdminRoute) {
      return redirectToLogin(request);
    }
    return response;
  }

  const supabase = createServerClient<Database>(url, anon, {
    cookies: {
      get(name: string): string | undefined {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions): void {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions): void {
        request.cookies.set({ name, value: '', ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  // Touch the session so auth cookies refresh if expired. The response
  // already carries any rotated cookies via the `set`/`remove` handlers above.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminRoute && !user) {
    return redirectToLogin(request);
  }

  return response;
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/admin/login';
  loginUrl.search = '';
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  /**
   * Run on everything EXCEPT:
   *  - _next/static and _next/image (Next.js build output)
   *  - favicons, icons, OG images in /public
   *  - common static file extensions
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|favicon.svg|apple-touch-icon.png|icon-192.png|icon-512.png|og-image.png|og-image-square.png|robots.txt|sitemap.xml|brand/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot|otf)$).*)',
  ],
};
