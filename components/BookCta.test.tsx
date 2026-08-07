import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BookCta from "./BookCta";

describe("BookCta", () => {
  it("renders a booking link pointing at the booking section", () => {
    render(<BookCta />);
    expect(screen.getByRole("link", { name: /book a visit/i })).toHaveAttribute("href", "#book");
  });
});
