import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PartnersHero from "./PartnersHero";

describe("PartnersHero", () => {
  it("renders the breadcrumb, headline, and stats", () => {
    render(<PartnersHero />);
    expect(screen.getByText("/ Partners")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/one/i);
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("Organizations")).toBeInTheDocument();
  });
});
