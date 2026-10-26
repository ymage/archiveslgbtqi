const hits = new Map<string, { count: number; reset: number }>();

/** True when `key` has exceeded `limit` hits in the current `windowMs` window. */
// ponytail: in-memory fixed window, per container; use a shared store if scaled to several replicas
export function rateLimited(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): boolean {
  if (hits.size > 10_000) {
    for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
    if (hits.size > 10_000) hits.clear();
  }
  const hit = hits.get(key);
  if (!hit || hit.reset <= now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  return ++hit.count > limit;
}

/**
 * Client address as seen by the reverse proxy: the last X-Forwarded-For entry.
 * Assumes exactly one trusted proxy appends it; earlier entries are client-supplied.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",").pop()?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
