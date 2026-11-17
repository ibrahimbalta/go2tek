interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const current = buckets.get(identifier);

  if (!current || now > current.resetAt) {
    buckets.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      retryAfterSeconds: 0,
    };
  }

  if (current.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    retryAfterSeconds: 0,
  };
}
