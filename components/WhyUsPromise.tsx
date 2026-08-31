"use client";

import styles from "./WhyUsPromise.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  BoltIcon,
  ScheduleIcon,
  SyncAltIcon,
  VerifiedIcon,
  DiversityIcon,
  NightlightIcon,
} from "@/components/icons";

const PROMISES = [
  {
    id: "same-day",
    icon: BoltIcon,
    title: "Same-day slots, held back on purpose",
    body: "Every office keeps a block of appointments unbooked until the morning of. They exist so a child who wakes up with a fever is seen that day, not next Thursday.",
    detail: "If we cannot fit you at your usual office, reception checks the other two before you hang up.",
  },
  {
    id: "booking",
    icon: ScheduleIcon,
    title: "Book at 2am if that is when you are awake",
    body: "Online scheduling never closes. You pick the slot, you get an instant confirmation, and nobody has to call you back to make it real.",
    detail: "Rescheduling and cancelling work the same way, with no phone queue.",
  },
  {
    id: "one-chart",
    icon: SyncAltIcon,
    title: "One chart, live at all three offices",
    body: "Your record is not filed at a single location. Whichever office you walk into, the clinician in front of you sees the same history, the same allergies, and the same notes from the last visit.",
    detail: "That includes immunization records, so school forms do not turn into a scavenger hunt.",
  },
  {
    id: "insurance",
    icon: VerifiedIcon,
    title: "Benefits checked before you arrive",
    body: "We verify your plan ahead of the appointment and tell you what it covers. Most Los Angeles HMO and IPA plans are accepted.",
    detail: "If something is not covered, you hear it from us beforehand, not from a statement six weeks later.",
  },
  {
    id: "bilingual",
    icon: DiversityIcon,
    title: "Care in the language you think in",
    body: "Our clinicians and front desk staff work in English and Spanish, and we arrange interpretation for other languages ahead of the visit.",
    detail: "Discharge instructions and care plans go home in the language you asked for.",
  },
  {
    id: "after-hours",
    icon: NightlightIcon,
    title: "Someone answers after hours",
    body: "Nights, weekends, and holidays, the number on your discharge sheet reaches a clinician, not a recording telling you to go to the emergency room.",
    detail: "They can see your chart while you talk, so the advice is about your child, not a generic script.",
  },
];

export default function WhyUsPromise() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="promise"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Six promises we can actually be held to.</h2>
        <span className={styles.kicker}>What you can expect</span>
      </div>
      <div className={styles.grid}>
        {PROMISES.map(({ id, icon: PromiseIcon, title, body, detail }, i) => (
          <article
            key={id}
            id={id}
            className={styles.card}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <span className={styles.iconWrap}>
              <PromiseIcon size={26} />
            </span>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.body}>{body}</p>
            <p className={styles.detail}>{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
