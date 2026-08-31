"use client";

import styles from "./ContactNotes.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const NOTES = [
  {
    id: "emergency",
    title: "If this is an emergency",
    body: "Call 911 or go to your nearest emergency department. Do not use this form, and do not wait for a reply. Trouble breathing, a seizure, a serious injury, or a baby under three months with a fever all belong in an emergency room, not an inbox.",
    urgent: true,
  },
  {
    id: "refills",
    title: "Prescription refills",
    body: "The fastest route is your pharmacy. Ask them to send the refill request to us and it lands directly in the chart. Refills for controlled medications need a visit first, so book one rather than writing in.",
  },
  {
    id: "records",
    title: "Medical records",
    body: "Email contact@sgmdoctor.com with the patient name, date of birth, and where the records should go. We will send a release form to sign. Standard requests take up to five business days.",
  },
  {
    id: "billing",
    title: "Billing and insurance",
    body: "Send us the statement date and the amount in question and we will trace it. If your plan changed, tell us before your next visit so benefits can be reverified ahead of time.",
  },
  {
    id: "careers",
    title: "Careers",
    body: "We hire clinicians, medical assistants, and front office staff across all three offices, and we are always glad to hear from bilingual candidates. Send a CV to contact@sgmdoctor.com with the role and location you are interested in.",
  },
];

export default function ContactNotes() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="notes"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>Before you write.</h2>
      <div className={styles.grid}>
        {NOTES.map((note, i) => (
          <article
            key={note.id}
            id={note.id}
            className={`${styles.card} ${note.urgent ? styles.urgent : ""}`}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <h3 className={styles.title}>{note.title}</h3>
            <p className={styles.body}>{note.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
