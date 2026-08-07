import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import JournalTeaser from "./JournalTeaser";

describe("JournalTeaser", () => {
  it("renders the article teaser copy", () => {
    render(<JournalTeaser />);
    expect(screen.getByText("5 min read")).toBeInTheDocument();
    expect(
      screen.getByText("10 essential habits for a healthier family year"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read the piece/i })).toHaveAttribute(
      "href",
      "#insight",
    );
  });
});
