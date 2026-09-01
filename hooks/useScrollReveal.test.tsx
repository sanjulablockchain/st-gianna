import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { useScrollReveal } from "./useScrollReveal";

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


class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

function Probe() {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return <div ref={ref}>{revealed ? "revealed" : "hidden"}</div>;
}

describe("useScrollReveal", () => {
  beforeEach(() => {
    enableMotion();
    FakeIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    window.matchMedia =
      window.matchMedia ||
      ((query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      })) as typeof window.matchMedia;
  });

  it("starts hidden and reveals once the element intersects the viewport", async () => {
    const { getByText } = render(<Probe />);
    expect(getByText("hidden")).toBeInTheDocument();

    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger(true);

    await waitFor(() => {
      expect(getByText("revealed")).toBeInTheDocument();
    });
  });

  it("disconnects the observer after the first reveal", () => {
    render(<Probe />);
    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger(true);
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});
