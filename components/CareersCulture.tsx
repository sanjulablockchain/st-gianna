"use client";

import styles from "./CareersCulture.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CULTURE } from "@/components/careers/content";

export default function CareersCulture() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="culture"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>What the work is like.</h2>
        <p className={styles.subtext}>
          Every practice says it cares about its people. Here is what that means in practice at
          ours, so you can decide whether it sounds like the place for you.
        </p>
      </div>
      <div className={styles.grid}>
        {CULTURE.map((note, i) => (
          <article
            key={note.title}
            className={styles.card}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={styles.title}>{note.title}</h3>
            <p className={styles.body}>{note.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
