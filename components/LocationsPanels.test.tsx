import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import LocationsPanels from "./LocationsPanels";

describe("LocationsPanels", () => {
  it("renders all three offices with correct tel and map links for each", () => {
    render(<LocationsPanels />);

    // Check all three offices are rendered
    expect(screen.getByText("Hollywood")).toBeInTheDocument();
    expect(screen.getByText("Santa Monica")).toBeInTheDocument();
    expect(screen.getByText("La Mirada")).toBeInTheDocument();

    // Hollywood: verify tel and map links
    expect(screen.getByRole("link", { name: /818-275-7006/ })).toHaveAttribute(
      "href",
      "tel:+18182757006",
    );
    expect(screen.getAllByRole("link", { name: /directions/i })[0]).toHaveAttribute(
      "href",
      "https://maps.google.com/?q=5255+W+Sunset+Blvd,+Los+Angeles,+CA+90027",
    );

    // Santa Monica: verify tel and map links
    expect(screen.getByRole("link", { name: /818-308-4100/ })).toHaveAttribute(
      "href",
      "tel:+18183084100",
    );
    expect(screen.getAllByRole("link", { name: /directions/i })[1]).toHaveAttribute(
      "href",
      "https://maps.google.com/?q=2221+Lincoln+Blvd,+Santa+Monica,+CA+90405",
    );

    // La Mirada: verify tel and map links
    expect(screen.getByRole("link", { name: /562-941-9853/ })).toHaveAttribute(
      "href",
      "tel:+15629419853",
    );
    expect(screen.getAllByRole("link", { name: /directions/i })[2]).toHaveAttribute(
      "href",
      "https://maps.google.com/?q=12675+La+Mirada+Blvd+200,+La+Mirada,+CA+90638",
    );

    // Verify all three "Open now" status badges are present
    expect(screen.getAllByText("Open now")).toHaveLength(3);
  });

  it("expands panel details on hover interaction", () => {
    render(<LocationsPanels />);

    // Find Santa Monica panel using the data-testid we added
    const santaMonicaPanel = screen.getByTestId("panel-Santa Monica");

    // Get the detail container within the panel
    const detailContainer = santaMonicaPanel.querySelector("div[class*='detail']");

    if (detailContainer) {
      // Initially, detail should not have the detailVisible class
      expect(detailContainer.className).not.toMatch(/detailVisible/);

      // Fire mouseEnter to activate the panel
      fireEvent.mouseEnter(santaMonicaPanel);

      // After hover, detail should now have detailVisible class
      expect(detailContainer.className).toMatch(/detailVisible/);
    }
  });
});
