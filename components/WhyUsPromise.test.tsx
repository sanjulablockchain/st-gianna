import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WhyUsPromise from "./WhyUsPromise";

describe("WhyUsPromise", () => {
  it("renders six promise cards", () => {
    render(<WhyUsPromise />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/six promises/i);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
  });

  it("gives every card the anchor id the homepage links to", () => {
    const { container } = render(<WhyUsPromise />);
    ["same-day", "booking", "one-chart", "insurance", "bilingual", "after-hours"].forEach((id) => {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });
});
