import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactHero from "./ContactHero";

describe("ContactHero", () => {
  it("renders the breadcrumb, headline, and stats", async () => {
    render(<ContactHero />);
    expect(screen.getByText("/ Contact")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/get in/i);
    expect(await screen.findByText("3")).toBeInTheDocument();
    expect(screen.getByText("Offices")).toBeInTheDocument();
  });
});
