"use client";

import styles from "./WhyUsCompare.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ROWS = [
  {
    label: "Time to appointment",
    typical: "Next open slot, often a week or more out for anything that is not an emergency.",
    ours: "Same-day blocks held at all three offices, released the morning of.",
  },
  {
    label: "Records between offices",
    typical:
      "Each location keeps its own file. Moving between them means faxing and repeating yourself.",
    ours: "One chart, live everywhere. The clinician sees your full history wherever you walk in.",
  },
  {
    label: "After hours",
    typical: "A recording telling you to call back in the morning or go to the emergency room.",
    ours: "A clinician answers, with your chart open while you talk.",
  },
  {
    label: "Benefits check",
    typical: "Coverage sorted out after the visit, sometimes weeks later on a statement.",
    ours: "Plan verified before you arrive, with costs explained at check-in.",
  },
  {
    label: "Follow-up",
    typical: "You are told to call back if it gets worse.",
    ours: "Prescriptions, referrals, and the next appointment are set before you leave.",
  },
];

export default function WhyUsCompare() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="compare"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>The same visit, side by side.</h2>
        <p className={styles.subtext}>
          None of this is exotic. It is the ordinary stuff that decides whether a practice is
          worth staying with.
        </p>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.head}>
            <tr>
              <th scope="col" className={styles.rowHead}>
                <span className={styles.srOnly}>What we are comparing</span>
              </th>
              <th scope="col" className={styles.colTypical}>
                A typical clinic
              </th>
              <th scope="col" className={styles.colOurs}>
                St. Gianna
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.label}
                className={styles.row}
                style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
              >
                <th scope="row" className={styles.rowLabel}>
                  {row.label}
                </th>
                <td className={styles.typical} data-label="A typical clinic">
                  {row.typical}
                </td>
                <td className={styles.ours} data-label="St. Gianna">
                  {row.ours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
