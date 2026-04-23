/**
 * Session helpers for server actions + route handlers.
 *
 * Single-admin-role model (per user directive): any authenticated Supabase
 * user has full CRUD. No custom claims, no per-row ownership checks.
 *
 * Usage:
 *
 *   export async function updateEvent(...) {
 *     const { userId } = await requireAuth();
 *     …
 *   }
 *
 * If the caller isn't signed in, `requireAuth()` throws `AuthError`. Action
 * wrappers catch it and return `{ ok: false, error: 'Not authenticated' }`.
 */

import { createAnonServerClient } from '@/lib/supabase/server';

export class AuthError extends Error {
  public readonly code = 'AUTH_REQUIRED';
  constructor(message = 'Not authenticated') {
    super(message);
    this.name = 'AuthError';
  }
}

export interface Session {
  user: {
    id: string;
    email: string | null;
  };
}

/**
 * Read the current Supabase session from cookies. Returns `null` if the user
 * isn't signed in or Supabase env vars aren't set (demo mode).
 */
export async function getSession(): Promise<Session | null> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  const user = data?.user;
  if (!user) return null;
  return {
    user: {
      id: user.id,
      email: user.email ?? null,
    },
  };
}

/**
 * Assert an authenticated caller. Returns `{ userId, email }`; throws
 * `AuthError` otherwise. Call at the top of every admin server action.
 */
export async function requireAuth(): Promise<{ userId: string; email: string | null }> {
  const session = await getSession();
  if (!session) {
    throw new AuthError('Not authenticated');
  }
  return { userId: session.user.id, email: session.user.email };
}
