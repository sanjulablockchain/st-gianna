"use client";

import styles from "./LegalPage.module.css";
import PageHero from "./PageHero";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export type LegalSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalPageProps = {
  title: string;
  italic: string;
  breadcrumb: string;
  intro: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export default function LegalPage({
  title,
  italic,
  breadcrumb,
  intro,
  effectiveDate,
  sections,
}: LegalPageProps) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <>
      <PageHero breadcrumb={breadcrumb} headline={title} italic={italic} subcopy={intro} />
      <section
        id="document"
        className={`${styles.section} ${revealed ? styles.revealed : ""}`}
        ref={ref}
      >
        <div className={styles.layout}>
          <nav className={styles.index} aria-label="Sections">
            <span className={styles.indexHeading}>On this page</span>
            {/* Always open: a closed <details> hides its list no matter what CSS
                says, so desktop hides the summary instead and this reads as a
                plain sticky index. Below 1180px the summary appears and the
                reader can collapse it. */}
            <details className={styles.indexDetails} open>
              <summary className={styles.indexSummary}>Jump to a section</summary>
              <ol className={styles.indexList}>
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className={styles.indexLink}>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          </nav>

          <div className={styles.prose}>
            <p className={styles.stamp}>Last updated {effectiveDate}</p>
            <p className={styles.disclaimer}>
              This page is a plain statement of how we operate, written for a marketing site. It
              is not a substitute for a document reviewed by your own counsel.
            </p>
            {sections.map((section) => (
              <article key={section.id} id={section.id} className={styles.block}>
                <h2 className={styles.blockHeading}>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className={styles.bullets}>
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className={styles.bullet}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
