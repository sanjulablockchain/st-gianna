import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { useParallax } from "./useParallax";

// The suite defaults to prefers-reduced-motion, under which this hook
// deliberately does nothing. These tests cover the animated path, so opt back
// into full motion.
function enableMotion() {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}


function Probe({ speed = 0.5, max = 40 }: { speed?: number; max?: number }) {
  const { ref, offset } = useParallax<HTMLDivElement>(speed, max);
  return <div ref={ref} data-testid="target">{offset}</div>;
}

describe("useParallax", () => {
  beforeEach(() => {
    enableMotion();
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is zero when the element's center matches the viewport center", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 350,
      height: 100,
      bottom: 450,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: 350,
      toJSON: () => ({}),
    } as DOMRect);

    const { getByTestId } = render(<Probe speed={0.5} max={40} />);
    expect(Number(getByTestId("target").textContent)).toBe(0);
  });

  it("clamps the offset to the configured max", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: -2000,
      height: 100,
      bottom: -1900,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: -2000,
      toJSON: () => ({}),
    } as DOMRect);

    const { getByTestId } = render(<Probe speed={0.5} max={40} />);
    expect(Number(getByTestId("target").textContent)).toBe(40);
  });
});
