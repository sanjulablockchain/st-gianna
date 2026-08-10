import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutLocations from "./AboutLocations";

describe("AboutLocations", () => {
  it("renders all three offices with address and a tel link", () => {
    render(<AboutLocations />);
    expect(screen.getByText("Hollywood")).toBeInTheDocument();
    expect(screen.getByText("Santa Monica")).toBeInTheDocument();
    expect(screen.getByText("La Mirada")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /818-308-4100/ })).toHaveAttribute(
      "href",
      "tel:8183084100",
    );
    expect(screen.getByRole("link", { name: /562-941-9853/ })).toHaveAttribute(
      "href",
      "tel:5629419853",
    );
  });
});
