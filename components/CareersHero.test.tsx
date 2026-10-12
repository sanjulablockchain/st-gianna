import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CareersHero from "./CareersHero";

describe("CareersHero", () => {
  it("renders the breadcrumb, headline, and stats", async () => {
    render(<CareersHero />);
    expect(screen.getByText("/ Careers")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/work where/i);
    expect(screen.getByText("Offices hiring")).toBeInTheDocument();
    expect(screen.getByText("Teams to join")).toBeInTheDocument();
  });
});
