import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ArticleView from "./ArticleView";
import { ARTICLES, getArticle } from "@/components/journal/articles";

const article = getArticle("asthma-action-plan")!;

describe("ArticleView", () => {
  it("renders the title, meta, summary panel, and full body", () => {
    render(<ArticleView article={article} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(article.title);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(article.body.length);
    expect(screen.getByText(/the short version/i)).toBeInTheDocument();
    article.keyPoints.forEach((point) => {
      expect(screen.getByText(point)).toBeInTheDocument();
    });
  });

  it("renders every paragraph of the article", () => {
    const { container } = render(<ArticleView article={article} />);
    const expected = article.body.reduce((n, block) => n + block.paragraphs.length, 0);
    // Body paragraphs plus the back link, meta row and disclaimer.
    expect(container.querySelectorAll("p").length).toBeGreaterThanOrEqual(expected);
  });

  it("offers a way back to the journal index", () => {
    render(<ArticleView article={article} />);
    expect(screen.getByRole("link", { name: /all journal pieces/i })).toHaveAttribute(
      "href",
      "/journal",
    );
  });

  it("suggests related reading that is not the current article", () => {
    render(<ArticleView article={article} />);
    const related = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href") ?? "")
      .filter((href) => href.startsWith("/journal/"));
    expect(related.length).toBeGreaterThan(0);
    related.forEach((href) => {
      expect(href).not.toBe(`/journal/${article.slug}`);
      expect(getArticle(href.replace("/journal/", ""))).toBeDefined();
    });
  });

  it("carries the not-medical-advice note", () => {
    render(<ArticleView article={article} />);
    expect(screen.getByText(/general information, not advice about your own child/i)).toBeInTheDocument();
  });
});

describe("article content", () => {
  it("gives every article a slug, image, key points and a real body", () => {
    ARTICLES.forEach((a) => {
      expect(a.slug).toMatch(/^[a-z0-9-]+$/);
      expect(a.image).toMatch(/^\/images\//);
      expect(a.keyPoints.length).toBeGreaterThanOrEqual(3);
      expect(a.body.length).toBeGreaterThanOrEqual(4);
      a.body.forEach((block) => expect(block.paragraphs.length).toBeGreaterThanOrEqual(1));
    });
  });

  it("has unique slugs", () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
