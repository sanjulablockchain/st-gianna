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
        <a
          href="https://app.nexhealth.com/appt/ktdoctor?atid=275899,275901,275900,275904,275905,275903"
          className={styles.primary}
        >
          Book online <ArrowOutwardIcon size={20} />
        </a>
        <a href="tel:8183084100" className={styles.secondary}>
          <CallIcon size={20} />
          818-308-4100
        </a>
      </div>
    </section>
  );
}
