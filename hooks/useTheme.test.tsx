import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme, __resetThemeForTests } from "./useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    __resetThemeForTests();
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to dark when nothing is stored", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("reads a previously stored light theme on mount", () => {
    window.localStorage.setItem("sgm-theme", "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  it("toggleTheme flips the theme, updates the DOM attribute, and persists it", () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("sgm-theme")).toBe("light");
  });

  it("toggleTheme flips back to dark on a second call", () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggleTheme();
    });
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("dark");
    expect(window.localStorage.getItem("sgm-theme")).toBe("dark");
  });

  it("synchronizes theme across two independent hook instances", () => {
    const a = renderHook(() => useTheme());
    const b = renderHook(() => useTheme());

    act(() => {
      a.result.current.toggleTheme();
    });

    expect(a.result.current.theme).toBe("light");
    expect(b.result.current.theme).toBe("light");
  });
});
