import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import JournalHero from "./JournalHero";

describe("JournalHero", () => {
  it("renders the breadcrumb, headline, and stats", () => {
    render(<JournalHero />);
    expect(screen.getByText("/ Journal")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/the/i);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Pieces published")).toBeInTheDocument();
  });
});
