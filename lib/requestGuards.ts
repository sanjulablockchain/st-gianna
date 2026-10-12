import { SITE_URL } from "@/lib/site";

type Env = Record<string, string | undefined>;

/**
 * How many proxies we trust in front of the app (the Lightsail load balancer,
 * nginx, or both). Each one appends the address it saw to X-Forwarded-For, so
 * the client's real address is that many entries from the right. Anything to
 * its left was sent by the client and can be forged.
 */
function trustedHops(env: Env): number {
  const hops = Number(env.TRUSTED_PROXY_HOPS ?? "1");
  return Number.isInteger(hops) && hops >= 1 ? hops : 1;
}

/** The caller's address, for rate limiting. */
export function clientIp(request: Request, env: Env = process.env): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const entries = forwarded
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    const index = Math.max(0, entries.length - trustedHops(env));
    if (entries[index]) return entries[index];
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function hostOf(origin: string): string | null {
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}

/**
 * True when the POST came from a page on this site. Browsers always send
 * Origin on a fetch POST, so a missing one means a script, and a foreign one
 * means another website is submitting our form.
 */
export function isSameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;

  const origin = request.headers.get("origin");
  if (!origin) return false;
  const originHost = hostOf(origin);
  if (!originHost) return false;

  // The canonical domain always passes; otherwise the page and the API must
  // share a host, which covers localhost and preview addresses.
  if (originHost === hostOf(SITE_URL)) return true;
  const host = request.headers.get("host");
  return Boolean(host) && originHost === host;
}

export function forbidden() {
  return Response.json(
    { ok: false, error: "This form can only be sent from our website." },
    { status: 403 },
  );
}
