/**
 * Browser Supabase client — honors RLS as the anon role unless the user is
 * authenticated (then auth cookies elevate to the signed-in JWT).
 *
 * Falls back to a harmless mock when env vars are missing so that
 * `npm run build` and SSG don't break in a pre-Supabase environment.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { createMockClient } from './mock';

/**
 * Return type intentionally inferred — `@supabase/ssr` and the installed
 * `@supabase/supabase-js` disagree on the `SupabaseClient` generic shape,
 * so we let the compiler infer the concrete client type.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    // Build-time or local-without-supabase — return an inert mock.
    return createMockClient<Database>();
  }

  return createBrowserClient<Database>(url, anon);
}
