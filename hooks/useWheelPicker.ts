"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Travel in px before a press counts as a drag rather than a tap. */
const DRAG_THRESHOLD = 6;

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
export function useWheelPicker(count: number, spacing: number, initial = 0) {
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);

  const frame = useRef(0);
  const drag = useRef<{
    startX: number;
    startPos: number;
    lastX: number;
    velocity: number;
    active: boolean;
  } | null>(null);

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
      drag.current = {
        startX: event.clientX,
        startPos: position,
        lastX: event.clientX,
        velocity: 0,
        active: false,
      };
      // Deliberately no setPointerCapture here. Capturing on press retargets
      // the resulting click to the list instead of the chip, which silently
      // broke tap-to-centre. Capture only once a real drag begins.
    },
    [cancelAnimation, position],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const state = drag.current;
      if (!state) return;
      const dx = event.clientX - state.startX;

      // A few pixels of travel is a tap with a shaky thumb, not a drag.
      if (!state.active) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        state.active = true;
        setDragging(true);
        (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
      }

      state.velocity = event.clientX - state.lastX;
      state.lastX = event.clientX;
      setPosition(clamp(state.startPos - dx / spacing));
    },
    [clamp, spacing],
  );

  const onPointerUp = useCallback(() => {
    const state = drag.current;
    drag.current = null;
    // A tap never became a drag, so leave the position alone and let the
    // chip's own click handler decide whether to centre or commit.
    if (!state?.active) return;
    setDragging(false);
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
