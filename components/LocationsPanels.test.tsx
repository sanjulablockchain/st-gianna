import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationsPanels from "./LocationsPanels";

describe("LocationsPanels", () => {
  it("renders all three offices with address and working call/directions links", () => {
    render(<LocationsPanels />);
    expect(screen.getByText("Hollywood")).toBeInTheDocument();
    expect(screen.getByText("Santa Monica")).toBeInTheDocument();
    expect(screen.getByText("La Mirada")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /818-275-7006/ })).toHaveAttribute(
      "href",
      "tel:+18182757006",
    );
    expect(screen.getAllByRole("link", { name: /directions/i })[0]).toHaveAttribute(
      "href",
      "https://maps.google.com/?q=5255+W+Sunset+Blvd,+Los+Angeles,+CA+90027",
    );
    expect(screen.getAllByText("Open now")).toHaveLength(3);
  });
});
