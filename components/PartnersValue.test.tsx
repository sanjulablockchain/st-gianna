import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PartnersValue from "./PartnersValue";

describe("PartnersValue", () => {
  it("renders four benefit cards", () => {
    render(<PartnersValue />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/what a network/i);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getByText(/Referrals that carry your chart/i)).toBeInTheDocument();
  });
});
