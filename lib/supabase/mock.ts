/**
 * Inert mock Supabase client used when env vars aren't set (build-time in
 * CI, or local dev before `supabase start`). Every query terminates in an
 * empty-data / null result so that fetchers don't throw.
 *
 * The mock is intentionally minimal: it satisfies the parts of the
 * supabase-js fluent API we actually call in `lib/fetchers/**`. Any other
 * method returns a benign no-op promise. If you need a new surface, extend
 * `makeQueryBuilder()` below rather than adding new branches at call sites.
 */

// Note: this mock intentionally uses `any` in several places to satisfy the
// generic Supabase client surface without depending on the full Database
// types. The @typescript-eslint/no-explicit-any rule is not enabled in this
// project, so no eslint-disable directive is required.

import type { SupabaseClient } from '@supabase/supabase-js';

type PostgrestResult = {
  data: any;
  error: null;
  count?: number | null;
  status?: number;
  statusText?: string;
};

function resolvedEmpty(): Promise<PostgrestResult> {
  return Promise.resolve({ data: null, error: null, count: 0 });
}

function resolvedArray(): Promise<PostgrestResult> {
  return Promise.resolve({ data: [], error: null, count: 0 });
}

function makeQueryBuilder(): any {
  const chain: any = {
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    upsert: () => chain,
    delete: () => chain,
    eq: () => chain,
    neq: () => chain,
    in: () => chain,
    is: () => chain,
    gt: () => chain,
    gte: () => chain,
    lt: () => chain,
    lte: () => chain,
    like: () => chain,
    ilike: () => chain,
    match: () => chain,
    not: () => chain,
    or: () => chain,
    filter: () => chain,
    order: () => chain,
    limit: () => chain,
    range: () => chain,
    single: () => resolvedEmpty(),
    maybeSingle: () => resolvedEmpty(),
    throwOnError: () => chain,
    then: (resolve: (v: PostgrestResult) => unknown) => resolvedArray().then(resolve),
  };
  return chain;
}

const authApi = {
  getUser: () =>
    Promise.resolve({ data: { user: null }, error: null }),
  getSession: () =>
    Promise.resolve({ data: { session: null }, error: null }),
  signInWithPassword: () =>
    Promise.resolve({ data: { user: null, session: null }, error: null }),
  signOut: () => Promise.resolve({ error: null }),
  onAuthStateChange: () => ({
    data: { subscription: { unsubscribe: () => undefined } },
  }),
};

const storageBucket = {
  upload: () => Promise.resolve({ data: null, error: null }),
  download: () => Promise.resolve({ data: null, error: null }),
  remove: () => Promise.resolve({ data: null, error: null }),
  list: () => Promise.resolve({ data: [], error: null }),
  getPublicUrl: (path: string) => ({
    data: { publicUrl: `/${path}` },
  }),
  createSignedUrl: () =>
    Promise.resolve({ data: { signedUrl: '' }, error: null }),
};

const storageApi = {
  from: () => storageBucket,
};

export function createMockClient<T>(): SupabaseClient<T> {
  const client: any = {
    from: () => makeQueryBuilder(),
    rpc: () => resolvedEmpty(),
    auth: authApi,
    storage: storageApi,
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => undefined }) }),
      subscribe: () => ({ unsubscribe: () => undefined }),
    }),
    removeChannel: () => Promise.resolve('ok'),
  };
  return client as SupabaseClient<T>;
}
