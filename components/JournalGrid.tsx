"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./JournalGrid.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowOutwardIcon } from "@/components/icons";
import { ARCHIVE, CATEGORIES } from "@/components/journal/articles";

export default function JournalGrid() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [active, setActive] = useState("All");

  const shown = active === "All" ? ARCHIVE : ARCHIVE.filter((a) => a.category === active);

  return (
    <section
      id="archive"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Everything else we have written.</h2>
        <span className={styles.kicker}>{ARCHIVE.length} pieces</span>
      </div>

      <div className={styles.chips}>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`${styles.chip} ${active === category ? styles.chipActive : ""}`}
            aria-pressed={active === category}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className={styles.empty}>Nothing filed under that yet. Try another topic.</p>
      ) : (
        <div className={styles.grid}>
          {shown.map((article, i) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className={styles.card}
              style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
            >
              <span className={styles.imageWrap}>
                <Image src={article.image} alt="" fill className={styles.image} />
              </span>
              <span className={styles.cardMeta}>{article.category}</span>
              <h3 className={styles.cardTitle}>{article.title}</h3>
              <p className={styles.excerpt}>{article.excerpt}</p>
              <span className={styles.cardFoot}>
                <span>{article.readTime}</span>
                <span>{article.date}</span>
              </span>
              <span className={styles.cardCta}>
                Read the piece <ArrowOutwardIcon size={16} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
