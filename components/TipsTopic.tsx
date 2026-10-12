"use client";

import Link from "next/link";
import styles from "./TipsTopic.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getArticle } from "@/components/journal/articles";
import type { TipTopic } from "@/components/tips/tips";
import { ArrowOutwardIcon } from "@/components/icons";

type TipsTopicProps = {
  topic: TipTopic;
  /** Alternates the band colour so long runs of topics stay easy to scan. */
  shaded?: boolean;
};

/**
 * One topic per section, each with its own scroll reveal. A single reveal
 * around every topic would be thousands of pixels tall on a phone and never
 * reach the observer threshold.
 */
export default function TipsTopic({ topic, shaded = false }: TipsTopicProps) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const article = topic.articleSlug ? getArticle(topic.articleSlug) : undefined;
  const headingId = `${topic.id}-heading`;

  return (
    <section
      id={topic.id}
      aria-labelledby={headingId}
      className={`${styles.section} ${shaded ? styles.shaded : ""} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 id={headingId} className={styles.heading}>
          {topic.title}
        </h2>
        <p className={styles.intro}>{topic.intro}</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.tips}>
          {topic.tips.map((tip, i) => (
            <article
              key={tip.title}
              className={styles.tip}
              style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
            >
              <h3 className={styles.tipTitle}>{tip.title}</h3>
              <p className={styles.tipBody}>{tip.body}</p>
            </article>
          ))}
        </div>

        <aside className={styles.aside}>
          <div className={styles.callUs}>
            <h3 className={styles.callUsHeading}>Call us if</h3>
            <ul className={styles.callUsList}>
              {topic.callUs.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
          {article ? (
            <Link href={`/journal/${article.slug}`} className={styles.article}>
              <span className={styles.articleLabel}>Read more in the journal</span>
              <span className={styles.articleTitle}>
                {article.title}
                <ArrowOutwardIcon size={17} />
              </span>
            </Link>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
