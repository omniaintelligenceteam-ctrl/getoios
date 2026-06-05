/**
 * Simple in-memory sliding window rate limiter.
 *
 * Tracks request timestamps per IP in a Map. Old entries are pruned on each check.
 * This resets on server restart -- acceptable for a Next.js app with moderate traffic.
 */

const DEFAULT_LIMIT = 10;       // max requests
const DEFAULT_WINDOW_MS = 60_000; // per 1 minute

interface RateLimitConfig {
  limit?: number;
  windowMs?: number;
}

const ipRequests = new Map<string, number[]>();

/**
 * Returns true if the request should be ALLOWED, false if rate-limited.
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig = {}
): boolean {
  const limit = config.limit ?? DEFAULT_LIMIT;
  const windowMs = config.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();
  const cutoff = now - windowMs;

  // Get existing timestamps or initialize
  const timestamps = ipRequests.get(ip) ?? [];

  // Prune expired entries
  const valid = timestamps.filter((t) => t > cutoff);

  if (valid.length >= limit) {
    // Still over limit after pruning -- reject
    ipRequests.set(ip, valid);
    return false;
  }

  // Allow and record
  valid.push(now);
  ipRequests.set(ip, valid);
  return true;
}

/**
 * Extracts a client IP from the request headers.
 * Falls back to 'unknown' if no forwarding header is present.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}
