import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactNotes from "./ContactNotes";

describe("ContactNotes", () => {
  it("leads with the emergency notice", () => {
    render(<ContactNotes />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings[0]).toHaveTextContent(/emergency/i);
    expect(screen.getByText(/call 911/i)).toBeInTheDocument();
  });

  it("keeps the careers note and points it at the careers page", () => {
    const { container } = render(<ContactNotes />);
    expect(container.querySelector("#careers")).not.toBeNull();
    expect(screen.getByText("Careers")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /see the roles/i })).toHaveAttribute(
      "href",
      "/careers",
    );
  });

  it("covers refills, records, and billing", () => {
    render(<ContactNotes />);
    expect(screen.getByText("Prescription refills")).toBeInTheDocument();
    expect(screen.getByText("Medical records")).toBeInTheDocument();
    expect(screen.getByText("Billing and insurance")).toBeInTheDocument();
  });
});
