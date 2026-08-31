import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Partners from "./Partners";

describe("Partners", () => {
  it("renders the heading and all five partner rows", () => {
    render(<Partners />);
    expect(
      screen.getByRole("heading", { name: /we never treat.*your family alone/i }),
    ).toBeInTheDocument();
    ["KT Doctor", "Serendib Health", "Pediatric After Hours", "LAIPT", "HMO & IPA plans"].forEach(
      (name) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      },
    );
  });

  it("points every partner row at the partners page", () => {
    const { container } = render(<Partners />);
    expect(screen.getByRole("link", { name: /KT Doctor/i })).toHaveAttribute(
      "href",
      "/partners#network",
    );
    expect(container.querySelectorAll('a[href="#book"]')).toHaveLength(0);
  });
});
