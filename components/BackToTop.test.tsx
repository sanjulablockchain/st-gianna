import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BackToTop, { getBackToTopVisibility } from "./BackToTop";

describe("getBackToTopVisibility", () => {
  it("is false near the top of the page", () => {
    expect(getBackToTopVisibility(0)).toBe(false);
    expect(getBackToTopVisibility(200)).toBe(false);
  });

  it("is true once scrolled past the threshold", () => {
    expect(getBackToTopVisibility(500)).toBe(true);
  });
});

describe("BackToTop", () => {
  it("is hidden by default and scrolls to top when clicked", () => {
    window.scrollTo = vi.fn();
    render(<BackToTop />);
    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button.className).not.toMatch(/visible/i);

    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("becomes visible after a scroll event past the threshold", () => {
    window.scrollTo = vi.fn();
    Object.defineProperty(window, "scrollY", { value: 600, writable: true });
    render(<BackToTop />);
    fireEvent.scroll(window);
    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button.className).toMatch(/visible/i);
  });
});
