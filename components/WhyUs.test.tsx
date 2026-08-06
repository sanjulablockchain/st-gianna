import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WhyUs from "./WhyUs";

describe("WhyUs", () => {
  it("renders the heading and all four reason cards", () => {
    render(<WhyUs />);
    expect(
      screen.getByRole("heading", {
        name: /built around a parent's real day, not a clinic's schedule/i,
      }),
    ).toBeInTheDocument();
    ["Same-day slots", "Book at 2am", "One chart, everywhere", "Insurance handled"].forEach(
      (title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      },
    );
  });
});
