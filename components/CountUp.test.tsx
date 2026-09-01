import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CountUp from "./CountUp";
import { parseStat, formatStat } from "@/hooks/useCountUp";

describe("parseStat", () => {
  it("splits a number from its trailing unit", () => {
    expect(parseStat("18,000+")).toEqual({ target: 18000, suffix: "+", grouped: true });
    expect(parseStat("94%")).toEqual({ target: 94, suffix: "%", grouped: false });
    expect(parseStat("2 hrs")).toEqual({ target: 2, suffix: " hrs", grouped: false });
    expect(parseStat("12")).toEqual({ target: 12, suffix: "", grouped: false });
  });

  it("refuses labels that should never count", () => {
    // No leading number at all.
    expect(parseStat("All ages")).toBeNull();
    expect(parseStat("Same-day")).toBeNull();
    expect(parseStat("Weekly")).toBeNull();
    // A rising first number would read as nonsense in a ratio.
    expect(parseStat("24/7")).toBeNull();
  });
});

describe("formatStat", () => {
  it("restores the thousands separator only where the original had one", () => {
    expect(formatStat(18000, { target: 18000, suffix: "+", grouped: true })).toBe("18,000+");
    expect(formatStat(94, { target: 94, suffix: "%", grouped: false })).toBe("94%");
  });
});

describe("CountUp", () => {
  it("actually animates, then lands on the final value", async () => {
    // The suite runs under prefers-reduced-motion by default, so opt this one
    // test back into real motion to prove the count genuinely runs.
    const original = window.matchMedia;
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

    try {
      const { container } = render(<CountUp value="18,000+" active />);
      // Mid-flight it must not already be the final value.
      await waitFor(() => {
        const text = container.textContent ?? "";
        expect(text).not.toBe("18,000+");
        expect(text).toMatch(/^[\d,]+\+$/);
      });
      // And it must land, given longer than the 1400ms animation.
      await waitFor(() => expect(screen.getByText("18,000+")).toBeInTheDocument(), {
        timeout: 3000,
      });
    } finally {
      window.matchMedia = original;
    }
  });

  it("lands immediately under prefers-reduced-motion", async () => {
    render(<CountUp value="94%" active />);
    await waitFor(() => expect(screen.getByText("94%")).toBeInTheDocument());
  });

  it("renders a non-counting label as plain text", () => {
    render(<CountUp value="All ages" active />);
    expect(screen.getByText("All ages")).toBeInTheDocument();
  });

  it("exposes the finished value to assistive tech while counting", () => {
    const { container } = render(<CountUp value="94%" active />);
    expect(container.querySelector('[aria-label="94%"]')).not.toBeNull();
  });

  it("stays at zero until activated", () => {
    render(<CountUp value="12" active={false} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
