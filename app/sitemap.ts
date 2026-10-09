import type { MetadataRoute } from "next";
import { ARTICLES } from "@/components/journal/articles";
import { PAGES, absoluteUrl, isoDate } from "@/lib/site";

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/services": 0.9,
  "/locations": 0.9,
  "/contact": 0.8,
  "/journal": 0.7,
  "/privacy": 0.2,
  "/terms": 0.2,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = PAGES.map((page) => ({
    url: absoluteUrl(page.path),
    changeFrequency: page.path === "/journal" ? "weekly" : "monthly",
    priority: PRIORITY[page.path] ?? 0.6,
  }));

  const articles: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: absoluteUrl(`/journal/${article.slug}`),
    lastModified: isoDate(article.date),
    changeFrequency: "yearly",
    priority: 0.6,
    images: [absoluteUrl(article.image)],
  }));

  return [...pages, ...articles];
}
