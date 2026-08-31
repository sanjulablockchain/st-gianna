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

  it("links each reason card to its section on the why-us page", () => {
    render(<WhyUs />);
    expect(screen.getByRole("link", { name: /same-day slots/i })).toHaveAttribute(
      "href",
      "/why-us#same-day",
    );
    expect(screen.getByRole("link", { name: /book at 2am/i })).toHaveAttribute(
      "href",
      "/why-us#booking",
    );
    expect(screen.getByRole("link", { name: /one chart, everywhere/i })).toHaveAttribute(
      "href",
      "/why-us#one-chart",
    );
    expect(screen.getByRole("link", { name: /insurance handled/i })).toHaveAttribute(
      "href",
      "/why-us#insurance",
    );
  });
});
