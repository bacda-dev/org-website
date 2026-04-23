/**
 * Server Supabase clients.
 *
 * - `createAnonServerClient()` — RLS-respecting, cookie-driven. Use this for
 *   user-facing pages and for fetchers that should only surface public data
 *   or the signed-in user's data.
 * - `createServerClient()` — service-role. Bypasses RLS. ONLY use from
 *   admin server actions / trusted API routes. NEVER ship to the client.
 *
 * Both degrade gracefully to a mock when env vars are missing so that
 * `npm run build` succeeds without a live Supabase instance.
 */

import { cookies } from 'next/headers';
import {
  createServerClient as createSsrServerClient,
  type CookieOptions,
} from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { createMockClient } from './mock';

/**
 * Return types intentionally inferred — see note in `./client.ts` on the
 * `@supabase/ssr` ↔ `@supabase/supabase-js` generic-shape mismatch.
 */

export function createAnonServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return createMockClient<Database>();
  }

  const cookieStore = cookies();

  return createSsrServerClient<Database>(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // `set` is a no-op in Server Components. Middleware handles refresh.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // ignored — middleware performs the real cookie write.
        }
      },
    },
  });
}

/**
 * Service-role client. RLS is bypassed. Use only from trusted server code.
 */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return createMockClient<Database>();
  }

  return createSupabaseClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
