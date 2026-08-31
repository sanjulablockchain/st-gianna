import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesHero from "./ServicesHero";

describe("ServicesHero", () => {
  it("renders the breadcrumb, headline, intro copy, and stats", () => {
    render(<ServicesHero />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#top");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/our/i);
    expect(
      screen.getByText(/committed to providing comprehensive, high-quality healthcare/i),
    ).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("LA clinics")).toBeInTheDocument();
    expect(screen.getByText("24/7")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Service lines")).toBeInTheDocument();
  });
});
