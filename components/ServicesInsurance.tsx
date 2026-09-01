"use client";

import styles from "./ServicesInsurance.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CallIcon } from "@/components/icons";

const BLOCKS = [
  {
    title: "Accepted plans",
    body: "Most Los Angeles HMO and IPA plans, plus Medi-Cal managed care and the major PPO networks.",
    items: [
      "Blue Shield",
      "Health Net",
      "L.A. Care",
      "Molina",
      "Anthem",
      "Medi-Cal managed care",
    ],
    note: "Plan participation changes more often than anyone would like. Reception confirms yours when you book, before you travel.",
  },
  {
    title: "What to bring",
    body: "Five minutes of preparation saves a lot of time at the front desk.",
    items: [
      "Photo ID",
      "Your insurance card",
      "A list of current medications",
      "Immunization record, if transferring in",
      "For a child, a parent or legal guardian for consent",
    ],
    note: "If you are transferring from another practice, tell us and we will request the records for you.",
  },
  {
    title: "Paying without insurance",
    body: "Self-pay pricing is quoted before the visit, not after it.",
    items: [
      "Prices quoted up front",
      "Payment due at the time of service",
      "Payment plans for wound care courses",
      "Payment plans for chronic care programmes",
    ],
    note: "Nobody is turned away without first being told what it will cost. If the number is a problem, say so and we will talk about it.",
  },
];

export default function ServicesInsurance() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="insurance"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Insurance and billing, before the visit.</h2>
        <p className={styles.subtext}>
          We verify your benefits ahead of time and tell you what we find, so the cost of a visit
          is a conversation you have beforehand rather than a statement you open later.
        </p>
      </div>
      <div className={styles.grid}>
        {BLOCKS.map((block, i) => (
          <article
            key={block.title}
            className={styles.card}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <h3 className={styles.title}>{block.title}</h3>
            <p className={styles.body}>{block.body}</p>
            <ul className={styles.list}>
              {block.items.map((item) => (
                <li key={item} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
            <p className={styles.note}>{block.note}</p>
          </article>
        ))}
      </div>
      <a href="tel:+18183084100" className={styles.cta}>
        <CallIcon size={19} />
        Call us about billing &middot; 818-308-4100
      </a>
    </section>
  );
}
