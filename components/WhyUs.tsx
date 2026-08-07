"use client";

import styles from "./WhyUs.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { BoltIcon, ScheduleIcon, SyncAltIcon, VerifiedIcon } from "@/components/icons";

const REASONS = [
  {
    icon: BoltIcon,
    title: "Same-day slots",
    body: "Held daily for sick visits, so you are not waiting a week with a feverish child.",
  },
  {
    icon: ScheduleIcon,
    title: "Book at 2am",
    body: "Online scheduling never closes, and confirmation lands instantly.",
  },
  {
    icon: SyncAltIcon,
    title: "One chart, everywhere",
    body: "Your child's record is live at whichever office you walk into.",
  },
  {
    icon: VerifiedIcon,
    title: "Insurance handled",
    body: "Most HMO and IPA plans, with benefits checked before the visit.",
  },
];

export default function WhyUs() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="why"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>Built around a parent&apos;s real day, not a clinic&apos;s schedule.</h2>
      <div className={styles.grid}>
        {REASONS.map(({ icon: ReasonIcon, title, body }) => (
          <div key={title} className={styles.card}>
            <ReasonIcon size={27} className={styles.icon} />
            <span className={styles.title}>{title}</span>
            <span className={styles.body}>{body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
