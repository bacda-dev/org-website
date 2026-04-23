/**
 * Session-refresh helper for Next.js middleware.
 *
 * Call from `middleware.ts`:
 *
 *   export async function middleware(request: NextRequest) {
 *     return updateSession(request);
 *   }
 *
 * The helper reads Supabase auth cookies, refreshes expiring tokens, and
 * writes the rotated cookies onto the response.
 *
 * When env vars are missing it returns a pass-through NextResponse so that
 * local dev and preview deploys without Supabase still route normally.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return response;

  const supabase = createServerClient<Database>(url, anon, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  // Touch the session so auth-cookies refresh if expired.
  await supabase.auth.getUser();

  return response;
}
