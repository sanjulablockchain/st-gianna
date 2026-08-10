import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Cta from "./Cta";

describe("Cta", () => {
  it("renders the closing headline and both call-to-action links", () => {
    render(<Cta />);
    expect(screen.getByRole("heading", { name: /ready when your family is/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book online/i })).toHaveAttribute(
      "href",
      "https://app.nexhealth.com/appt/ktdoctor?atid=275899,275901,275900,275904,275905,275903",
    );
    expect(screen.getByRole("link", { name: /818-308-4100/i })).toHaveAttribute(
      "href",
      "tel:8183084100",
    );
  });
});
