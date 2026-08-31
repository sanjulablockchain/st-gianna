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

  it("sends billing questions to the contact form", () => {
    render(<ServicesInsurance />);
    expect(screen.getByRole("link", { name: /ask us about billing/i })).toHaveAttribute(
      "href",
      "/contact#message",
    );
  });
});
