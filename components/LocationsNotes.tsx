"use client";

import styles from "./LocationsNotes.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SyncAltIcon, BoltIcon, SupportAgentIcon, VerifiedUserIcon } from "@/components/icons";

const NOTES = [
  {
    icon: SyncAltIcon,
    title: "One chart, everywhere",
    body: "Your record is live at whichever office you walk into, so any clinician can pick up where the last visit left off.",
  },
  {
    icon: BoltIcon,
    title: "Same-day appointments",
    body: "Each office holds slots daily for urgent problems, bookable online or by phone.",
  },
  {
    icon: SupportAgentIcon,
    title: "24-hour assistance",
    body: "Booking and help are available around the clock, not only during office hours.",
  },
  {
    icon: VerifiedUserIcon,
    title: "Most insurances accepted",
    body: "Coverage is verified before your visit so costs are clear at check-in.",
  },
];

export default function LocationsNotes() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="visit"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>The same care at whichever door you use.</h2>
      <div className={styles.grid}>
        {NOTES.map(({ icon: NoteIcon, title, body }) => (
          <div key={title} className={styles.card}>
            <NoteIcon size={30} className={styles.icon} />
            <span className={styles.title}>{title}</span>
            <span className={styles.body}>{body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
