"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drag-and-flick position tracker for the mobile nav wheel.
 *
 * `position` is a float index: 2.0 means item two is dead centre, 2.5 means
 * halfway between two and three. Release snaps to the nearest whole index,
 * carrying momentum from the flick.
 *
 * This is pointer-driven, not scroll-driven, so it does not belong to
 * useScrollReveal or useParallax. It still honours prefers-reduced-motion by
 * dropping momentum and easing and snapping straight to the target.
 */
export function useWheelPicker(count: number, spacing: number) {
  const [position, setPosition] = useState(0);
  const [dragging, setDragging] = useState(false);

  const frame = useRef(0);
  const drag = useRef<{ startX: number; startPos: number; lastX: number; velocity: number } | null>(
    null,
  );

  const clamp = useCallback((value: number) => Math.max(0, Math.min(count - 1, value)), [count]);

  const reduced = useCallback(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const cancelAnimation = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
  }, []);

  /** Eases to a whole index. Jumps straight there under reduced motion. */
  const settleTo = useCallback(
    (target: number) => {
      cancelAnimation();
      const destination = clamp(Math.round(target));
      if (reduced() || typeof requestAnimationFrame === "undefined") {
        setPosition(destination);
        return;
      }
      const step = () => {
        let done = false;
        setPosition((current) => {
          const delta = destination - current;
          if (Math.abs(delta) < 0.004) {
            done = true;
            return destination;
          }
          return current + delta * 0.22;
        });
        frame.current = done ? 0 : requestAnimationFrame(step);
      };
      frame.current = requestAnimationFrame(step);
    },
    [cancelAnimation, clamp, reduced],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      cancelAnimation();
      setDragging(true);
      drag.current = {
        startX: event.clientX,
        startPos: position,
        lastX: event.clientX,
        velocity: 0,
      };
      (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    },
    [cancelAnimation, position],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const state = drag.current;
      if (!state) return;
      const dx = event.clientX - state.startX;
      state.velocity = event.clientX - state.lastX;
      state.lastX = event.clientX;
      setPosition(clamp(state.startPos - dx / spacing));
    },
    [clamp, spacing],
  );

  const onPointerUp = useCallback(() => {
    const state = drag.current;
    drag.current = null;
    setDragging(false);
    if (!state) return;
    // A flick carries roughly one extra item per 12px of final-frame travel.
    const thrown = reduced() ? 0 : -state.velocity / 12;
    setPosition((current) => {
      settleTo(current + thrown);
      return current;
    });
  }, [reduced, settleTo]);

  useEffect(() => cancelAnimation, [cancelAnimation]);

  return {
    position,
    dragging,
    activeIndex: clamp(Math.round(position)),
    settleTo,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
