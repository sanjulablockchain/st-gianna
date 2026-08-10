import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationsHero from "./LocationsHero";

describe("LocationsHero", () => {
  it("renders the breadcrumb, headline, intro copy, and stats", () => {
    render(<LocationsHero />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#top");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/three/i);
    expect(
      screen.getByText(/we are proud to offer our exceptional healthcare services/i),
    ).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("LA offices")).toBeInTheDocument();
    expect(screen.getByText("24/7")).toBeInTheDocument();
    expect(screen.getByText("Booking")).toBeInTheDocument();
    expect(screen.getByText("Same-day")).toBeInTheDocument();
    expect(screen.getByText("Appointments")).toBeInTheDocument();
  });
});
