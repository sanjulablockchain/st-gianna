"use client";

import { useEffect, useState } from "react";

/**
 * Counts from 0 to `target` once `active` turns true, easing out.
 *
 * Under prefers-reduced-motion the duration collapses to zero so the first
 * frame lands on the final value, which keeps the bail-out without ever
 * calling setState directly in the effect body.
 */
export function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const runFor = prefersReducedMotion ? 0 : duration;

    if (typeof requestAnimationFrame === "undefined") return;

    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const t = runFor === 0 ? 1 : Math.min(1, elapsed / runFor);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

export type ParsedStat = {
  target: number;
  suffix: string;
  grouped: boolean;
};

/**
 * Splits a stat label into a leading number and its trailing unit, so
 * "18,000+" animates to 18000 and keeps the "+".
 *
 * Returns null for anything that should not count: labels with no leading
 * number ("All ages"), and ratios like "24/7" where a rising first number
 * would read as nonsense mid-animation.
 */
export function parseStat(raw: string): ParsedStat | null {
  const match = /^(\d[\d,]*)(.*)$/.exec(raw.trim());
  if (!match) return null;
  const suffix = match[2];
  if (suffix.startsWith("/")) return null;
  const digits = match[1].replace(/,/g, "");
  const target = Number(digits);
  if (!Number.isFinite(target)) return null;
  return { target, suffix, grouped: match[1].includes(",") };
}

export function formatStat(value: number, parsed: ParsedStat) {
  const rounded = Math.round(value);
  const num = parsed.grouped ? rounded.toLocaleString("en-US") : String(rounded);
  return num + parsed.suffix;
}
