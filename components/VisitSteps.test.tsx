import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import VisitSteps from "./VisitSteps";

describe("VisitSteps", () => {
  it("renders the heading and all four steps in order", () => {
    render(<VisitSteps />);
    expect(
      screen.getByRole("heading", { name: /what happens from the moment you call/i }),
    ).toBeInTheDocument();
    ["Step 01", "Step 02", "Step 03", "Step 04"].forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
    [
      "Tell us what's wrong",
      "Benefits checked first",
      "Seen by your team",
      "Follow-up that sticks",
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});
