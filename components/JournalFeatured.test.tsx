import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import JournalFeatured from "./JournalFeatured";
import { FEATURED } from "@/components/journal/articles";

describe("JournalFeatured", () => {
  it("renders the featured article title, meta, and standfirst", () => {
    render(<JournalFeatured />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(FEATURED.title);
    expect(screen.getByText(FEATURED.readTime)).toBeInTheDocument();
    // Exact match: the standfirst also opens with the category words.
    expect(screen.getByText(FEATURED.category)).toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("summarises the piece and links to its own page", () => {
    render(<JournalFeatured />);
    expect(screen.getAllByRole("listitem")).toHaveLength(FEATURED.keyPoints.length);
    expect(screen.getByRole("link", { name: /read the piece/i })).toHaveAttribute(
      "href",
      `/journal/${FEATURED.slug}`,
    );
  });
});
