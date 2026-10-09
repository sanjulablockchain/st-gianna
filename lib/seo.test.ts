import { describe, expect, it } from "vitest";
import { pageMetadata } from "./seo";

describe("pageMetadata", () => {
  it("sets canonical, Open Graph and Twitter fields", () => {
    const meta = pageMetadata({ title: "Services", description: "D", path: "/services" });
    expect(meta.title).toBe("Services");
    expect(meta.alternates?.canonical).toBe("/services");
    expect(meta.openGraph).toMatchObject({ url: "/services", title: "Services | St. Gianna Medical Group" });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("passes article fields through", () => {
    const meta = pageMetadata({
      title: "T",
      description: "D",
      path: "/journal/t",
      type: "article",
      publishedTime: "2026-08-24",
    });
    expect(meta.openGraph).toMatchObject({ type: "article", publishedTime: "2026-08-24" });
  });
});
