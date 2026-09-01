import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesInsurance from "./ServicesInsurance";

describe("ServicesInsurance", () => {
  it("renders the three billing blocks", () => {
    render(<ServicesInsurance />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/insurance/i);
    expect(screen.getByText("Accepted plans")).toBeInTheDocument();
    expect(screen.getByText("What to bring")).toBeInTheDocument();
    expect(screen.getByText("Paying without insurance")).toBeInTheDocument();
  });

  it("dials the main line for billing questions", () => {
    render(<ServicesInsurance />);
    expect(screen.getByRole("link", { name: /call us about billing/i })).toHaveAttribute(
      "href",
      "tel:+18183084100",
    );
  });
});
