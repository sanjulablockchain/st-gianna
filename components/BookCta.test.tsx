import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BookCta from "./BookCta";

describe("BookCta", () => {
  it("renders a booking link pointing at the booking URL", () => {
    render(<BookCta />);
    expect(screen.getByRole("link", { name: /book a visit/i })).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=a8gDE7vnNqvjwXe2"
    );
  });
});
