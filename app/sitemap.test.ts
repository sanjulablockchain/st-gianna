import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { ARTICLES } from "@/components/journal/articles";
import { PAGES, SITE_URL } from "@/lib/site";

describe("sitemap", () => {
  it("lists every page and every journal article", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toHaveLength(PAGES.length + ARTICLES.length);
    expect(urls).toContain(SITE_URL);
    expect(urls).toContain(`${SITE_URL}/services`);
    expect(urls).toContain(`${SITE_URL}/journal/${ARTICLES[0].slug}`);
  });

  it("dates articles by their publish date", () => {
    const entry = sitemap().find((e) => e.url.endsWith(ARTICLES[0].slug));
    expect(entry?.lastModified).toBe("2026-08-24");
  });
});
