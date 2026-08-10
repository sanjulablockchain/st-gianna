import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the tagline, link columns, and contact details", () => {
    render(<Footer />);
    expect(screen.getByRole("img", { name: "St. Gianna Medical Group" })).toBeInTheDocument();
    expect(
      screen.getByText(/pediatric and family healthcare across los angeles/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About us" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: "Locations" })).toHaveAttribute("href", "/locations");
    expect(screen.getByRole("link", { name: "Book appointment" })).toHaveAttribute("href", "/#book");
    expect(screen.getByRole("link", { name: /santa monica/i })).toHaveAttribute(
      "href",
      "tel:+18183084100",
    );
    expect(screen.getByRole("link", { name: /hollywood/i })).toHaveAttribute(
      "href",
      "tel:+18182757006",
    );
    expect(screen.getByRole("link", { name: /la mirada/i })).toHaveAttribute(
      "href",
      "tel:+15629419853",
    );
    expect(screen.getByRole("link", { name: "contact@sgmdoctor.com" })).toHaveAttribute(
      "href",
      "mailto:contact@sgmdoctor.com",
    );
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });
});
