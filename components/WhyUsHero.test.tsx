import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WhyUsHero from "./WhyUsHero";

describe("WhyUsHero", () => {
  it("renders the breadcrumb, headline, and stats", () => {
    render(<WhyUsHero />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#top");
    expect(screen.getByText("/ Why us")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/why families/i);
    expect(screen.getByText("2 hrs")).toBeInTheDocument();
    expect(screen.getByText("Median wait for a same-day slot")).toBeInTheDocument();
  });
});
