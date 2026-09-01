"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./ArticleView.module.css";
import PageHero from "./PageHero";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";
import { ArrowOutwardIcon } from "@/components/icons";
import { ARTICLES, type Article } from "@/components/journal/articles";

export default function ArticleView({ article }: { article: Article }) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: parallaxRef, offset } = useParallax<HTMLSpanElement>(0.08, 28);

  const more = ARTICLES.filter(
    (a) => a.slug !== article.slug && a.category === article.category,
  ).slice(0, 2);
  const fallback = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);
  const related = more.length > 0 ? more : fallback;

  return (
    <>
      <PageHero
        breadcrumb="Journal"
        headline={article.category}
        italic={article.readTime}
        subcopy={article.standfirst}
      />

      <article
        id="article"
        className={`${styles.section} ${revealed ? styles.revealed : ""}`}
        ref={ref}
      >
        <p className={styles.backRow}>
          <Link href="/journal" className={styles.back}>
            All journal pieces
          </Link>
        </p>

        <h2 className={styles.title}>{article.title}</h2>
        <p className={styles.meta}>
          <span>{article.category}</span>
          <span>{article.readTime}</span>
          <span>{article.date}</span>
        </p>

        <span className={styles.imageWrap} ref={parallaxRef}>
          <span className={styles.imageLayer} style={{ transform: `translateY(${offset}px)` }}>
            <Image src={article.image} alt="" fill className={styles.image} priority />
          </span>
        </span>

        <div className={styles.layout}>
          <aside className={styles.summary} aria-label="The short version">
            <span className={styles.summaryHeading}>The short version</span>
            <ul className={styles.summaryList}>
              {article.keyPoints.map((point) => (
                <li key={point} className={styles.summaryItem}>
                  {point}
                </li>
              ))}
            </ul>
          </aside>

          <div className={styles.body}>
            {article.body.map((block) => (
              <section key={block.heading} className={styles.block}>
                <h3 className={styles.blockHeading}>{block.heading}</h3>
                {block.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <p className={styles.disclaimer}>
              This is general information, not advice about your own child. If something here
              raises a question, ask us at your next visit or call the office. That conversation
              is what we are for.
            </p>
          </div>
        </div>

        <div className={styles.related}>
          <span className={styles.relatedHeading}>Read next</span>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <Link key={item.slug} href={`/journal/${item.slug}`} className={styles.relatedCard}>
                <span className={styles.relatedCategory}>{item.category}</span>
                <span className={styles.relatedTitle}>{item.title}</span>
                <span className={styles.relatedCta}>
                  Read <ArrowOutwardIcon size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
