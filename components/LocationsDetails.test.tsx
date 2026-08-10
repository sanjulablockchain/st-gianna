import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationsDetails from "./LocationsDetails";

describe("LocationsDetails", () => {
  it("renders the heading and all three office rows with tel links", () => {
    render(<LocationsDetails />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/addresses and/i);
    expect(screen.getByText("Get in touch")).toBeInTheDocument();
    expect(screen.getByText("Hollywood")).toBeInTheDocument();
    expect(screen.getByText("Santa Monica")).toBeInTheDocument();
    expect(screen.getByText("La Mirada")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /818-275-7006/ })).toHaveAttribute(
      "href",
      "tel:+18182757006",
    );
    expect(screen.getByRole("link", { name: /562-941-9853/ })).toHaveAttribute(
      "href",
      "tel:+15629419853",
    );
  });
});
