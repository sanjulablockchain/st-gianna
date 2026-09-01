import "@testing-library/jest-dom/vitest";

// jsdom has no matchMedia. Default the suite to prefers-reduced-motion so
// scroll-reveal, parallax and count-up all resolve to their final state
// immediately, which keeps assertions deterministic instead of racing an
// animation. Tests that need the animated path override this locally.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
