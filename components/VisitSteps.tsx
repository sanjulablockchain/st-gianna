"use client";

import styles from "./VisitSteps.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STEPS = [
  {
    step: "Step 01",
    title: "Tell us what's wrong",
    body: "Book online any hour or call the office. Sick visits get a same-day slot where one is open.",
  },
  {
    step: "Step 02",
    title: "Benefits checked first",
    body: "We verify your plan before you arrive, so coverage and cost are clear at check-in.",
  },
  {
    step: "Step 03",
    title: "Seen by your team",
    body: "In office or by video, with your full chart on screen no matter which location you chose.",
  },
  {
    step: "Step 04",
    title: "Follow-up that sticks",
    body: "Prescriptions, referrals and next appointments are set before you leave the visit.",
  },
];

export default function VisitSteps() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="visit"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>What happens from the moment you call.</h2>
      <div className={styles.grid}>
        {STEPS.map(({ step, title, body }) => (
          <div key={step} className={styles.card}>
            <span className={styles.step}>{step}</span>
            <span className={styles.title}>{title}</span>
            <span className={styles.body}>{body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
