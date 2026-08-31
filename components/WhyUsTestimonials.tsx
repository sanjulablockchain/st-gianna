"use client";

import styles from "./WhyUsTestimonials.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const QUOTES = [
  {
    quote:
      "My son spiked a fever on a Sunday night. I booked online at 11pm and we were seen before lunch on Monday. Nobody made me explain his asthma history twice, because it was already on the screen.",
    name: "Marisol R.",
    office: "Hollywood",
  },
  {
    quote:
      "We moved from a practice where every visit meant a new doctor. Here the same clinician has followed both girls for four years, and she remembers things I have forgotten.",
    name: "Dana K.",
    office: "Santa Monica",
  },
  {
    quote:
      "The part I did not expect was the billing. They told me what my plan covered before the appointment, and the statement afterwards matched what they said. That has never happened to me before.",
    name: "Anthony P.",
    office: "La Mirada",
  },
];

export default function WhyUsTestimonials() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="voices"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>In their words.</h2>
      <div className={styles.grid}>
        {QUOTES.map((entry, i) => (
          <blockquote
            key={entry.name}
            className={styles.quote}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <p className={styles.quoteText}>{entry.quote}</p>
            <footer className={styles.who}>
              <span className={styles.name}>{entry.name}</span>
              <span>{entry.office}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
