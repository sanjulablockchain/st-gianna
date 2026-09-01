import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JournalGrid from "./JournalGrid";
import { ARCHIVE } from "@/components/journal/articles";

describe("JournalGrid", () => {
  it("renders every archive article by default", () => {
    render(<JournalGrid />);
    expect(screen.getAllByRole("link")).toHaveLength(ARCHIVE.length);
  });

  it("narrows the grid when a category chip is selected", async () => {
    const user = userEvent.setup();
    render(<JournalGrid />);
    await user.click(screen.getByRole("button", { name: "Nutrition" }));
    const shown = screen.getAllByRole("link");
    expect(shown.length).toBeLessThan(ARCHIVE.length);
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
    expect(screen.getAllByRole("link")).toHaveLength(ARCHIVE.length);
  });

  it("links every card to its own article page", () => {
    render(<JournalGrid />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(ARCHIVE.map((a) => `/journal/${a.slug}`));
    hrefs.forEach((href) => expect(href).toMatch(/^\/journal\/[a-z0-9-]+$/));
  });

  it("gives every article a distinct image", () => {
    const { container } = render(<JournalGrid />);
    const sources = [...container.querySelectorAll("img")].map((img) => img.getAttribute("src"));
    expect(sources).toHaveLength(ARCHIVE.length);
    expect(new Set(sources).size).toBe(ARCHIVE.length);
  });
});
