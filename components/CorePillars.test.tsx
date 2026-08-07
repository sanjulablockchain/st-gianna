import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CorePillars from "./CorePillars";

describe("CorePillars", () => {
  it("renders the heading, kicker, and all three pillar cards", () => {
    render(<CorePillars />);
    expect(
      screen.getByRole("heading", { name: /three ways we look after a family/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Core care")).toBeInTheDocument();
    ["Sick visits", "Chronic condition management", "Preventative care"].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
    ["Same-day", "Care plan", "Annual physicals"].forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("each card links to the full catalog", () => {
    render(<CorePillars />);
    expect(screen.getByRole("link", { name: /sick visits/i })).toHaveAttribute("href", "#catalog");
  });
});
