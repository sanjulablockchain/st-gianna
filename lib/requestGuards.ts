import { SITE_URL } from "@/lib/site";

// Client addresses for rate limiting live in lib/clientIp.ts (X-Real-IP only).

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

  // The canonical domain, bare or www, always passes, whatever Host nginx
  // forwards. Otherwise the page and the API must share a host, which covers
  // localhost and preview addresses.
  const canonical = hostOf(SITE_URL);
  if (canonical && (originHost === canonical || originHost === `www.${canonical}`)) return true;
  const host = request.headers.get("host");
  return Boolean(host) && originHost === host;
}

export function forbidden() {
  return Response.json(
    { ok: false, error: "This form can only be sent from our website." },
    { status: 403 },
  );
}
