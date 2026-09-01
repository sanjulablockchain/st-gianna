"use client";

import Image from "next/image";
import styles from "./WhyUsNumbers.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";
import CountUp from "./CountUp";

const FIGURES = [
  { n: "18,000+", l: "Visits a year" },
  { n: "12", l: "Years in Los Angeles" },
  { n: "4", l: "Languages at the front desk" },
  { n: "94%", l: "Seen within 15 minutes of arrival" },
];

export default function WhyUsNumbers() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: parallaxRef, offset } = useParallax<HTMLSpanElement>(0.06, 20);

  return (
    <section
      id="numbers"
      data-dark="1"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <span className={styles.backdrop} aria-hidden="true" ref={parallaxRef}>
        <span className={styles.imageLayer} style={{ transform: `translateY(${offset}px)` }}>
          <Image src="/images/why-us-band.jpg" alt="" fill className={styles.image} />
        </span>
        <span className={styles.overlay} />
      </span>
      <div className={styles.content}>
        <h2 className={styles.heading}>Twelve years of turning up.</h2>
        <div className={styles.grid}>
          {FIGURES.map((figure, i) => (
            <span
              key={figure.l}
              className={styles.figure}
              style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
            >
              <CountUp value={figure.n} active={revealed} className={styles.figureNumber} />
              <span className={styles.figureLabel}>{figure.l}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
