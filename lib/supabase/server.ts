/**
 * Server Supabase clients.
 *
 * - `createPublicReadClient()` — cookie-free anon client for public-data
 *   fetchers wrapped in `unstable_cache`. Use this for any read that only
 *   surfaces published/public content. Safe inside cache scopes because it
 *   never touches cookies/headers/request-scoped state.
 * - `createAnonServerClient()` — RLS-respecting, cookie-driven. Use this
 *   from Server Components / Server Actions that need the signed-in user's
 *   context. NOT safe inside `unstable_cache`.
 * - `createServerClient()` — service-role. Bypasses RLS. ONLY use from
 *   admin server actions / trusted API routes. NEVER ship to the client.
 *
 * All three degrade gracefully to a mock when env vars are missing so that
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

/**
 * Cookie-free anon client. Safe inside `unstable_cache` scopes and inside
 * `generateStaticParams()` — neither can touch request-scoped state like
 * cookies or headers. Use this for any fetcher that only surfaces public
 * content (RLS still enforced by the anon key).
 */
export function createPublicReadClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return createMockClient<Database>();
  }

  return createSupabaseClient<Database>(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

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
