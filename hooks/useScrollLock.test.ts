import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollLock } from "./useScrollLock";

let scrollTo: ReturnType<typeof vi.fn>;

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", { value, writable: true, configurable: true });
}

beforeEach(() => {
  scrollTo = vi.fn();
  vi.stubGlobal("scrollTo", scrollTo);
  setScrollY(0);
  document.body.style.cssText = "";
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.style.cssText = "";
});

describe("useScrollLock", () => {
  it("leaves the page alone when inactive", () => {
    renderHook(() => useScrollLock(false));

    expect(document.body.style.position).toBe("");
  });

  it("pins the body so the page cannot be scrolled", () => {
    renderHook(() => useScrollLock(true));

    expect(document.body.style.position).toBe("fixed");
  });

  // Pinning the body sends it to the top; offsetting it by the current scroll
  // keeps the same part of the page under the reader.
  it("holds the page at the offset it was scrolled to", () => {
    setScrollY(420);

    renderHook(() => useScrollLock(true));

    expect(document.body.style.top).toBe("-420px");
  });

  it("stretches the body across the viewport so it keeps its width", () => {
    renderHook(() => useScrollLock(true));

    expect(document.body.style.left).toBe("0px");
    expect(document.body.style.right).toBe("0px");
  });

  it("puts every style back when it unlocks", () => {
    const { unmount } = renderHook(() => useScrollLock(true));

    unmount();

    expect(document.body.style.position).toBe("");
    expect(document.body.style.top).toBe("");
    expect(document.body.style.left).toBe("");
    expect(document.body.style.right).toBe("");
  });

  it("returns the reader to where they were", () => {
    setScrollY(420);
    const { unmount } = renderHook(() => useScrollLock(true));

    unmount();

    expect(scrollTo).toHaveBeenCalledWith(0, 420);
  });

  it("restores the scroll position when it merely stops being active", () => {
    setScrollY(260);
    const { rerender } = renderHook(({ on }) => useScrollLock(on), {
      initialProps: { on: true },
    });

    rerender({ on: false });

    expect(document.body.style.position).toBe("");
    expect(scrollTo).toHaveBeenCalledWith(0, 260);
  });

  // Two overlays open at once must not leave the body pinned forever.
  it("does not strand the page when a second lock unmounts first", () => {
    setScrollY(100);
    const a = renderHook(() => useScrollLock(true));
    const b = renderHook(() => useScrollLock(true));

    b.unmount();
    a.unmount();

    expect(document.body.style.position).toBe("");
  });
});
