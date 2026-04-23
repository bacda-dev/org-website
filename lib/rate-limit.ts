/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Keyed by an arbitrary string (typically the client IP). Each factory call
 * returns a closed-over limiter with its own window + max config. LRU-style
 * trim at 1,000 keys prevents unbounded memory growth.
 *
 * Single-process only. Counters reset on server restart. Acceptable for a
 * low-traffic non-profit site where the goal is to swat off casual abuse,
 * not to withstand a coordinated flood. Upgrade path: swap to Upstash Redis
 * if launch traffic necessitates it.
 */

const MAX_KEYS = 1000;

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  /** Epoch-ms when the oldest timestamp in the window drops off. */
  resetAt: number;
}

export interface RateLimitOptions {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Max events permitted per key per window. */
  max: number;
}

export function rateLimit(
  opts: RateLimitOptions,
): (key: string) => RateLimitResult {
  const { windowMs, max } = opts;
  // Map preserves insertion order — the first key is the oldest.
  const hits = new Map<string, number[]>();

  return function check(key: string): RateLimitResult {
    const now = Date.now();
    const cutoff = now - windowMs;

    const previous = hits.get(key) ?? [];
    // Drop stamps outside the window.
    const fresh: number[] = [];
    for (const t of previous) {
      if (t > cutoff) fresh.push(t);
    }

    if (fresh.length >= max) {
      // Over the limit — do NOT record this attempt.
      hits.set(key, fresh);
      touch(hits, key);
      const oldest = fresh[0] ?? now;
      return {
        ok: false,
        remaining: 0,
        resetAt: oldest + windowMs,
      };
    }

    fresh.push(now);
    hits.set(key, fresh);
    touch(hits, key);
    trimLru(hits);

    return {
      ok: true,
      remaining: Math.max(0, max - fresh.length),
      resetAt: (fresh[0] ?? now) + windowMs,
    };
  };
}

/** Move a key to the most-recently-used position (re-insert). */
function touch(map: Map<string, number[]>, key: string): void {
  const value = map.get(key);
  if (value === undefined) return;
  map.delete(key);
  map.set(key, value);
}

function trimLru(map: Map<string, number[]>): void {
  while (map.size > MAX_KEYS) {
    const oldestKey = map.keys().next().value;
    if (oldestKey === undefined) break;
    map.delete(oldestKey);
  }
}
