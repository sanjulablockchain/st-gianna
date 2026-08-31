import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WhyUsTestimonials from "./WhyUsTestimonials";

describe("WhyUsTestimonials", () => {
  it("renders three quotes with attribution", () => {
    render(<WhyUsTestimonials />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/in their words/i);
    expect(screen.getAllByRole("blockquote")).toHaveLength(3);
    expect(screen.getByText(/Hollywood/)).toBeInTheDocument();
    expect(screen.getByText(/Santa Monica/)).toBeInTheDocument();
    expect(screen.getByText(/La Mirada/)).toBeInTheDocument();
  });
});
