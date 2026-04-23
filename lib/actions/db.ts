/**
 * Loosely-typed service-role Supabase handle for admin server actions.
 *
 * Why this exists: `@supabase/ssr` (used by the cookie-driven anon client)
 * and `@supabase/supabase-js` disagree on the generic shape of `SupabaseClient`.
 * The installed combo resolves `from(...).insert(payload)` to a parameter of
 * type `never`, even when the `Database` type is fully specified. This is a
 * known upstream mismatch that `lib/supabase/client.ts` already calls out.
 *
 * Rather than sprinkle `as never` casts across every action, we confine the
 * widening here. Runtime safety is preserved: actions still pass Zod-validated
 * inputs, and the service-role client enforces RLS bypass identically at
 * runtime — only the compiler's view of Insert/Update param types loosens.
 *
 * If the upstream mismatch is ever resolved, swap this export back to the
 * concrete `createServerClient()` without touching call sites.
 */

import { createServerClient } from '@/lib/supabase/server';

export type DbResult<T = unknown> = Promise<{
  data: T;
  error: { message: string } | null;
}>;

/**
 * Explicit fluent-API surface covering every postgrest method we use in the
 * action layer. All builders return `QueryBuilder` so chaining continues to
 * work; all terminators return a `DbResult`.
 */
export interface QueryBuilder extends DbResult {
  select(columns?: string): QueryBuilder;
  insert(values: unknown): QueryBuilder;
  update(values: unknown): QueryBuilder;
  upsert(values: unknown): QueryBuilder;
  delete(): QueryBuilder;
  eq(column: string, value: unknown): QueryBuilder;
  neq(column: string, value: unknown): QueryBuilder;
  in(column: string, values: unknown[]): QueryBuilder;
  is(column: string, value: unknown): QueryBuilder;
  order(column: string, opts?: { ascending?: boolean }): QueryBuilder;
  limit(n: number): QueryBuilder;
  single(): DbResult;
  maybeSingle(): DbResult<unknown>;
}

export interface AdminDb {
  from(table: string): QueryBuilder;
  storage: ReturnType<typeof createServerClient>['storage'];
  auth: ReturnType<typeof createServerClient>['auth'];
}

export function adminDb(): AdminDb {
  return createServerClient() as unknown as AdminDb;
}
