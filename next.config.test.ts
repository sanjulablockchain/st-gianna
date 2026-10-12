import { describe, expect, it } from "vitest";
import nextConfig from "./next.config";

async function destinationOf(path: string) {
  const redirects = (await nextConfig.redirects?.()) ?? [];
  // Next matches path-to-regexp patterns; these tests only need literal
  // sources and the one trailing :slug* wildcard.
  const match = redirects.find((r) =>
    r.source.endsWith("/:slug*") ? path.startsWith(r.source.slice(0, -"/:slug*".length)) : r.source === path,
  );
  return match && { destination: match.destination, permanent: match.permanent };
}

describe("next.config", () => {
  it("builds a standalone server for the Docker image", () => {
    expect(nextConfig.output).toBe("standalone");
  });

  it.each([
    ["/about-us", "/about"],
    ["/terms-conditions", "/terms"],
    ["/privacy-policy", "/privacy"],
    ["/advanced-wound-care-services", "/services"],
    ["/thank-you-for-applying", "/careers"],
    ["/under-development", "/"],
    ["/10-healthy-medical-tips-for-a-healthier-life", "/journal/10-essential-habits"],
    ["/category/uncategorized", "/journal"],
    ["/feed", "/journal"],
    ["/comments/feed", "/journal"],
    ["/page-sitemap.xml", "/sitemap.xml"],
    ["/post-sitemap.xml", "/sitemap.xml"],
    ["/sitemap_index.xml", "/sitemap.xml"],
  ])("permanently redirects the old WordPress URL %s to %s", async (from, to) => {
    expect(await destinationOf(from)).toEqual({ destination: to, permanent: true });
  });

  it.each(["/careers", "/contact", "/services", "/locations", "/wp-admin", "/wp-login.php"])(
    "leaves %s alone",
    async (path) => {
      expect(await destinationOf(path)).toBeUndefined();
    },
  );
});
