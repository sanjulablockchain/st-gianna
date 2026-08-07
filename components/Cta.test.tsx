import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Cta from "./Cta";

describe("Cta", () => {
  it("renders the closing headline and both call-to-action links", () => {
    render(<Cta />);
    expect(screen.getByRole("heading", { name: /ready when your family is/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book online/i })).toHaveAttribute("href", "#book");
    expect(screen.getByRole("link", { name: /555-0123/i })).toHaveAttribute(
      "href",
      "tel:13105550123",
    );
  });
});
