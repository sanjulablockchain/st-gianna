import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Services from "./Services";

describe("Services", () => {
  it("renders the section heading and all six service rows", () => {
    render(<Services />);
    expect(screen.getByRole("heading", { name: "What we do" })).toBeInTheDocument();
    [
      "Well-child & physicals",
      "Same-day sick visits",
      "Telehealth",
      "Advanced wound care",
      "Immunizations",
      "Chronic care",
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("each row links to #book", () => {
    render(<Services />);
    expect(screen.getByRole("link", { name: /well-child & physicals/i })).toHaveAttribute(
      "href",
      "#book",
    );
  });
});
