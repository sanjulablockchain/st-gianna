"use client";

import styles from "./TipsIndex.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { TIP_TOPICS } from "@/components/tips/tips";

export default function TipsIndex() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="topics"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Jump to a topic.</h2>
        <p className={styles.subtext}>
          These tips are general guidance for common situations, not a diagnosis. Every child is
          different. If something does not feel right, trust that instinct and call us.
        </p>
      </div>
      <nav aria-label="Medical tip topics">
        <ul className={styles.chips}>
          {TIP_TOPICS.map((topic) => (
            <li key={topic.id}>
              <a href={`#${topic.id}`} className={styles.chip}>
                {topic.title}
                <span className={styles.count} aria-hidden="true">{topic.tips.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
