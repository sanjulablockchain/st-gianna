import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutValues from "./AboutValues";

describe("AboutValues", () => {
  it("renders the heading and all four value cards", () => {
    render(<AboutValues />);
    expect(
      screen.getByRole("heading", { name: /what patients can count on, every visit/i }),
    ).toBeInTheDocument();
    [
      "Compassionate care",
      "Same-day appointments",
      "24/7 booking",
      "Most insurances accepted",
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});
