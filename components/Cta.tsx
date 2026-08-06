"use client";

import styles from "./Cta.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowOutwardIcon, CallIcon } from "@/components/icons";

export default function Cta() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="book"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>Ready when your family is.</h2>
      <div className={styles.actions}>
        <a href="#book" className={styles.primary}>
          Book online <ArrowOutwardIcon size={20} />
        </a>
        <a href="tel:13105550123" className={styles.secondary}>
          <CallIcon size={20} />
          (310) 555-0123
        </a>
      </div>
    </section>
  );
}
