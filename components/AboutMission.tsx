"use client";

import styles from "./AboutMission.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STATEMENTS = [
  {
    label: "Our Mission",
    body: "Our mission at St. Gianna Medical Group is to provide exceptional, compassionate healthcare to adults through comprehensive services, advanced medical technology, and a patient-centered approach. We strive to enhance the well-being and quality of life for our community by delivering personalized and accessible healthcare solutions.",
  },
  {
    label: "Our Vision",
    body: "Our vision is to be a leading healthcare provider recognized for excellence in medical care, innovation, and patient satisfaction. We aim to foster a healthy community where everyone has access to the highest standards of medical treatment and preventive care, ensuring a healthier future for all.",
  },
];

export default function AboutMission() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="mission"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.grid}>
        {STATEMENTS.map((statement) => (
          <div key={statement.label} className={styles.column}>
            <span className={styles.kicker}>{statement.label}</span>
            <p className={styles.body}>{statement.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
