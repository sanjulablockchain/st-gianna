import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServiceConditions from "./ServiceConditions";

describe("ServiceConditions", () => {
  it("renders six condition groups", () => {
    render(<ServiceConditions />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/conditions we treat/i);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
    expect(screen.getByText("Respiratory")).toBeInTheDocument();
    expect(screen.getByText("Wound care")).toBeInTheDocument();
  });

  it("tells people what to do when their condition is not listed", () => {
    render(<ServiceConditions />);
    expect(screen.getByText(/not the whole list/i)).toBeInTheDocument();
  });
});
