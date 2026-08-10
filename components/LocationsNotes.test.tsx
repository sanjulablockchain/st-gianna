import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationsNotes from "./LocationsNotes";

describe("LocationsNotes", () => {
  it("renders the heading and all four notes", () => {
    render(<LocationsNotes />);
    expect(
      screen.getByRole("heading", { name: /the same care at whichever door you use/i }),
    ).toBeInTheDocument();
    [
      "One chart, everywhere",
      "Same-day appointments",
      "24-hour assistance",
      "Most insurances accepted",
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});
