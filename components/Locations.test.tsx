import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Locations from "./Locations";

describe("Locations", () => {
  it("renders all three clinics with address, phone, and hours", () => {
    render(<Locations />);
    expect(screen.getByText("Santa Monica")).toBeInTheDocument();
    expect(screen.getByText("1234 Wilshire Blvd, Santa Monica, CA 90403")).toBeInTheDocument();
    expect(screen.getByText("(310) 555-0123")).toBeInTheDocument();
    expect(screen.getByText("Hollywood")).toBeInTheDocument();
    expect(screen.getByText("La Mirada")).toBeInTheDocument();
    expect(screen.getByText("Opens 9am")).toBeInTheDocument();
  });
});
