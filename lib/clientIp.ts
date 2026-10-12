/**
 * The visitor's address, for rate limiting. In production nginx overwrites
 * X-Real-IP on every request with the address it trusts (Cloudflare's
 * CF-Connecting-IP, accepted only from Cloudflare's ranges). X-Forwarded-For is
 * ignored on purpose: its left-most entry is whatever the visitor sent, so
 * trusting it would let anyone dodge the limit with a made-up value.
 *
 * Without a proxy (local dev, tests) every request shares the "unknown" bucket.
 */
export function clientIp(request: Request): string {
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
