import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import JournalFeatured from "./JournalFeatured";

describe("JournalFeatured", () => {
  it("renders the featured article title, meta, and standfirst", () => {
    render(<JournalFeatured />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /10 essential habits for a healthier family year/i,
    );
    expect(screen.getByText("5 min read")).toBeInTheDocument();
    // Exact match: the standfirst also opens with the words "Preventive care".
    expect(screen.getByText("Preventive care")).toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("renders the full article body inline rather than linking away", () => {
    const { container } = render(<JournalFeatured />);
    expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThanOrEqual(4);
    expect(container.querySelectorAll("p").length).toBeGreaterThanOrEqual(6);
    // No article routes exist in this scope, so the featured piece must not
    // pretend to link to one.
    expect(container.querySelector("a")).toBeNull();
  });
});
