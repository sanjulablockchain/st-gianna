import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServiceCatalog from "./ServiceCatalog";

describe("ServiceCatalog", () => {
  it("renders the heading, count kicker, and all eight service rows", () => {
    render(<ServiceCatalog />);
    expect(screen.getByRole("heading", { name: "The full list" })).toBeInTheDocument();
    expect(screen.getByText("8 services")).toBeInTheDocument();
    [
      "Same-day sick visits",
      "Chronic condition management",
      "Preventative care",
      "Well-child & physicals",
      "Immunizations",
      "Telehealth",
      "Advanced wound care",
      "Women's health",
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("each row links to #book", () => {
    render(<ServiceCatalog />);
    expect(screen.getByRole("link", { name: /same-day sick visits/i })).toHaveAttribute(
      "href",
      "#book",
    );
  });
});
