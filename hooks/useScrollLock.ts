"use client";

import { useEffect } from "react";

/**
 * Holds the page still behind an overlay without letting it shift sideways.
 *
 * The obvious lock, overflow:hidden on the body, takes the scrollbar away and
 * hands its width back to the layout, so the page and everything pinned to the
 * right edge jump as the overlay appears. Pinning the body instead leaves the
 * scrollbar's column reserved by the overflow-y:scroll on html in globals.css,
 * so nothing moves. That rule and this hook only work as a pair.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const { body } = document;
    const offset = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
    };

    // Pinning sends the body to the top, so shift it back by however far the
    // reader had scrolled and the view does not appear to move.
    body.style.position = "fixed";
    body.style.top = `-${offset}px`;
    body.style.left = "0px";
    body.style.right = "0px";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      window.scrollTo(0, offset);
    };
  }, [active]);
}
