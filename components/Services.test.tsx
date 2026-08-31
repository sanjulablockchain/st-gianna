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

  it("points every row at the services catalog", () => {
    const { container } = render(<Services />);
    expect(screen.getByRole("link", { name: /well-child & physicals/i })).toHaveAttribute(
      "href",
      "/services#catalog",
    );
    expect(container.querySelectorAll('a[href="#book"]')).toHaveLength(0);
  });

  it("offers a see-all link to the services page", () => {
    render(<Services />);
    expect(screen.getByRole("link", { name: /see all services/i })).toHaveAttribute(
      "href",
      "/services",
    );
  });
});
