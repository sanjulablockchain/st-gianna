"use client";

import { useEffect, useState } from "react";
import styles from "./BackToTop.module.css";
import { ArrowUpwardIcon } from "@/components/icons";

const SHOW_AFTER_PX = 480;

export function getBackToTopVisibility(scrollY: number): boolean {
  return scrollY > SHOW_AFTER_PX;
}

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(getBackToTopVisibility(window.scrollY));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      className={`${styles.button} ${visible ? styles.visible : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUpwardIcon size={22} />
    </button>
  );
}
