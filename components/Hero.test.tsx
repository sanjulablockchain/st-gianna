import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";

describe("Hero", () => {
  it("renders the headline, subcopy, and stats", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/care that/i);
    expect(
      screen.getByText(/same-day sick visits, round-the-clock booking/i),
    ).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("LA clinics")).toBeInTheDocument();
    expect(screen.getByText("24/7")).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
  });

  it("has a section with id=top for nav anchoring", () => {
    render(<Hero />);
    expect(document.getElementById("top")).toBeInTheDocument();
  });
});
