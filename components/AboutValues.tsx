"use client";

import styles from "./AboutValues.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { VolunteerActivismIcon, BoltIcon, ScheduleIcon, VerifiedIcon } from "@/components/icons";

const VALUES = [
  {
    icon: VolunteerActivismIcon,
    title: "Compassionate care",
    body: "A team that listens first and treats the person, not just the chart.",
  },
  {
    icon: BoltIcon,
    title: "Same-day appointments",
    body: "Slots held daily so urgent problems are seen without a long wait.",
  },
  {
    icon: ScheduleIcon,
    title: "24/7 booking",
    body: "Online scheduling never closes, and confirmation lands instantly.",
  },
  {
    icon: VerifiedIcon,
    title: "Most insurances accepted",
    body: "Coverage is checked before your visit so costs are clear up front.",
  },
];

export default function AboutValues() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="values"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>What patients can count on, every visit.</h2>
      <div className={styles.grid}>
        {VALUES.map(({ icon: ValueIcon, title, body }) => (
          <div key={title} className={styles.card}>
            <ValueIcon size={30} className={styles.icon} />
            <span className={styles.title}>{title}</span>
            <span className={styles.body}>{body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
