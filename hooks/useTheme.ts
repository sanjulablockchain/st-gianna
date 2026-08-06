"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "sgm-theme";

let currentTheme: Theme = "dark";
let initialized = false;
const listeners = new Set<() => void>();

function readStoredTheme(): Theme {
  return window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
}

function notify() {
  listeners.forEach((listener) => listener());
}

function setSharedTheme(next: Theme) {
  currentTheme = next;
  document.documentElement.dataset.theme = next;
  window.localStorage.setItem(STORAGE_KEY, next);
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (initialized) return;
    initialized = true;
    const stored = readStoredTheme();
    if (stored !== currentTheme) {
      currentTheme = stored;
      notify();
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setSharedTheme(currentTheme === "dark" ? "light" : "dark");
  }, []);

  return { theme, toggleTheme };
}

export function __resetThemeForTests() {
  currentTheme = "dark";
  initialized = false;
  listeners.clear();
}
