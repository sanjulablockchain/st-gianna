import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import JournalGuides from "./JournalGuides";
import { getArticle } from "@/components/journal/articles";

describe("JournalGuides", () => {
  it("renders four reading paths", () => {
    render(<JournalGuides />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/where to start/i);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getByText("Newborn and baby")).toBeInTheDocument();
    expect(screen.getByText("Living with a condition")).toBeInTheDocument();
  });

  it("links only to articles that actually exist", () => {
    render(<JournalGuides />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.length).toBe(12);
    hrefs.forEach((href) => {
      const slug = href.replace("/journal/", "");
      expect(getArticle(slug), `no article for ${slug}`).toBeDefined();
    });
  });
});
