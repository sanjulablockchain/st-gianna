import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutHero from "./AboutHero";

describe("AboutHero", () => {
  it("renders the breadcrumb, headline, intro copy, and stats", async () => {
    render(<AboutHero />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#top");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/who/i);
    expect(
      screen.getByText(
        /dedicated to providing exceptional healthcare services for adults and children/i,
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText("3")).toBeInTheDocument();
    expect(screen.getByText("LA offices")).toBeInTheDocument();
    expect(screen.getByText("24/7")).toBeInTheDocument();
    expect(screen.getByText("Booking")).toBeInTheDocument();
    expect(screen.getByText("All ages")).toBeInTheDocument();
    expect(screen.getByText("Adults & children")).toBeInTheDocument();
  });
});
