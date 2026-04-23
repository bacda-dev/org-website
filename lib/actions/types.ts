/**
 * Shared types + error helpers for server actions.
 *
 * Every action returns `ActionResult<T>` so admin UI code can render errors
 * uniformly. Throw-based paths are confined to action-local try/catch blocks.
 */

import { AuthError } from '@/lib/auth';
import type { ZodError } from 'zod';

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

/**
 * Translate an unknown thrown value into an `ActionResult` failure. Call from
 * the top-level catch of every action so the admin UI always receives the
 * consistent shape.
 */
export function actionError(err: unknown): { ok: false; error: string } {
  if (err instanceof AuthError) {
    return { ok: false, error: 'Not authenticated' };
  }
  if (err instanceof Error) {
    // Surface DB / network messages — the admin UI truncates client-side.
    return { ok: false, error: err.message };
  }
  return { ok: false, error: 'Server error' };
}

/**
 * Convert a Zod failure into an `ActionResult` failure with `fieldErrors`.
 */
export function validationError(zerr: ZodError): {
  ok: false;
  error: string;
  fieldErrors: Record<string, string[] | undefined>;
} {
  return {
    ok: false,
    error: 'Validation failed',
    fieldErrors: zerr.flatten().fieldErrors,
  };
}
