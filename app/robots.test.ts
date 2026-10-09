import robots from "./robots";
import { SITE_URL } from "@/lib/site";

describe("robots", () => {
  it("allows crawling, keeps the API closed and points at the sitemap", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(rules[0]).toMatchObject({ userAgent: "*", allow: "/", disallow: "/api/" });
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it("names AI answer engine crawlers explicitly", () => {
    const rules = robots().rules as Array<{ userAgent: string | string[] }>;
    const agents = rules.flatMap((rule) => rule.userAgent);
    expect(agents).toEqual(expect.arrayContaining(["GPTBot", "ClaudeBot", "PerplexityBot"]));
  });
});
