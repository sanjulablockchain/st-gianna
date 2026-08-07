"use client";

import styles from "./CorePillars.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SickIcon, MonitorHeartIcon, HealthAndSafetyIcon } from "@/components/icons";

const PILLARS = [
  {
    icon: SickIcon,
    title: "Sick visits",
    body: "Fevers, coughs, infections and injuries seen quickly, usually the day you call, in office or by video.",
    tags: ["Same-day", "Walk-in friendly", "Telehealth"],
  },
  {
    icon: MonitorHeartIcon,
    title: "Chronic condition management",
    body: "Asthma, allergies, diabetes and blood pressure followed by one consistent care team with a shared plan.",
    tags: ["Care plan", "Medication reviews", "Specialist referrals"],
  },
  {
    icon: HealthAndSafetyIcon,
    title: "Preventative care",
    body: "Physicals, screenings and immunizations that catch problems early and keep the whole family on schedule.",
    tags: ["Annual physicals", "Screenings", "Vaccines"],
  },
];

export default function CorePillars() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="core"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Three ways we look after a family.</h2>
        <span className={styles.kicker}>Core care</span>
      </div>
      <div className={styles.grid}>
        {PILLARS.map(({ icon: PillarIcon, title, body, tags }) => (
          <a key={title} href="#catalog" className={styles.card}>
            <span className={styles.iconWrap}>
              <PillarIcon size={26} />
            </span>
            <span className={styles.title}>{title}</span>
            <span className={styles.body}>{body}</span>
            <span className={styles.tags}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
