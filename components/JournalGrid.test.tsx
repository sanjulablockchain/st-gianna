import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JournalGrid from "./JournalGrid";

describe("JournalGrid", () => {
  it("renders all nine articles by default", () => {
    render(<JournalGrid />);
    expect(screen.getAllByRole("article")).toHaveLength(9);
  });

  it("narrows the grid when a category chip is selected", async () => {
    const user = userEvent.setup();
    render(<JournalGrid />);
    await user.click(screen.getByRole("button", { name: "Nutrition" }));
    const shown = screen.getAllByRole("article");
    expect(shown.length).toBeLessThan(9);
    expect(shown.length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Nutrition" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("restores every article when All is selected", async () => {
    const user = userEvent.setup();
    render(<JournalGrid />);
    await user.click(screen.getByRole("button", { name: "Nutrition" }));
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("article")).toHaveLength(9);
  });

  it("gives every article a distinct image", () => {
    const { container } = render(<JournalGrid />);
    const sources = [...container.querySelectorAll("img")].map((img) => img.getAttribute("src"));
    expect(sources).toHaveLength(9);
    expect(new Set(sources).size).toBe(9);
  });
});
