import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TipsHero from "./TipsHero";

describe("TipsHero", () => {
  it("renders the breadcrumb, headline, and stats", () => {
    render(<TipsHero />);
    expect(screen.getByText("/ Medical tips")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/good to know/i);
    expect(screen.getByText("Practical tips")).toBeInTheDocument();
    expect(screen.getByText("Everyday topics")).toBeInTheDocument();
  });
});
