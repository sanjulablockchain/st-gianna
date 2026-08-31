import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactHero from "./ContactHero";

describe("ContactHero", () => {
  it("renders the breadcrumb, headline, and stats", () => {
    render(<ContactHero />);
    expect(screen.getByText("/ Contact")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/get in/i);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Offices")).toBeInTheDocument();
  });
});
