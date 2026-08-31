import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactOffices from "./ContactOffices";

describe("ContactOffices", () => {
  it("renders all three offices with their addresses", () => {
    render(<ContactOffices />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.getByText("5255 W Sunset Blvd, Los Angeles, CA 90027")).toBeInTheDocument();
    expect(screen.getByText("2221 Lincoln Blvd, Santa Monica, CA 90405")).toBeInTheDocument();
    expect(screen.getByText("12675 La Mirada Blvd, #200, La Mirada, CA 90638")).toBeInTheDocument();
  });

  it("links each office phone number and offers directions", () => {
    render(<ContactOffices />);
    expect(screen.getByRole("link", { name: "818-275-7006" })).toHaveAttribute(
      "href",
      "tel:+18182757006",
    );
    expect(screen.getByRole("link", { name: "818-308-4100" })).toHaveAttribute(
      "href",
      "tel:+18183084100",
    );
    expect(screen.getByRole("link", { name: "562-941-9853" })).toHaveAttribute(
      "href",
      "tel:+15629419853",
    );
    expect(screen.getAllByRole("link", { name: /directions/i })).toHaveLength(3);
  });
});
