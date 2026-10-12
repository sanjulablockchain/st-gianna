import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Next and the pre-paint theme script both emit inline scripts and styles, so
// 'unsafe-inline' stays until a nonce setup replaces it. 'unsafe-eval' is
// development only, because React's dev tooling needs it.
// The one external image host is OpenStreetMap, for the map tiles on
// /locations. Do not add another without asking.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://tile.openstreetmap.org",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

// URLs the old WordPress site at sgmdoctor.com had indexed (its All in One SEO
// sitemaps and REST API, October 2026), sent to their closest new page so
// links and search results keep working. Next already drops trailing slashes,
// so pages whose path did not change (/contact, /careers) need no entry.
// /wp-admin and /wp-login.php stay 404 on purpose.
const wordpressRedirects: Array<[source: string, destination: string]> = [
  ["/about-us", "/about"],
  ["/terms-conditions", "/terms"],
  ["/privacy-policy", "/privacy"],
  ["/advanced-wound-care-services", "/services"],
  ["/thank-you-for-applying", "/careers"],
  ["/under-development", "/"],
  ["/10-healthy-medical-tips-for-a-healthier-life", "/medical-tips"],
  ["/category/:slug*", "/journal"],
  ["/feed", "/journal"],
  ["/comments/feed", "/journal"],
  ["/page-sitemap.xml", "/sitemap.xml"],
  ["/post-sitemap.xml", "/sitemap.xml"],
  ["/sitemap_index.xml", "/sitemap.xml"],
];

const nextConfig: NextConfig = {
  // A self contained server in .next/standalone, which the Dockerfile ships.
  output: "standalone",
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return wordpressRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
