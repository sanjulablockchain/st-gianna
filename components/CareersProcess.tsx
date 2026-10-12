"use client";

import styles from "./CareersProcess.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { HIRING_STEPS } from "@/components/careers/content";

export default function CareersProcess() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="process"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>How hiring works.</h2>
        <p className={styles.subtext}>
          Five steps, no personality tests and no automated screening. A person reads every
          application.
        </p>
      </div>
      <ol className={styles.steps}>
        {HIRING_STEPS.map((step, i) => (
          <li
            key={step.title}
            className={styles.step}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <span className={styles.number} aria-hidden="true">
              {i + 1}
            </span>
            <div className={styles.text}>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
