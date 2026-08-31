"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./JournalGrid.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CATEGORIES = [
  "All",
  "Preventive care",
  "Parenting",
  "Nutrition",
  "Seasonal",
  "Chronic care",
  "Clinic news",
];

const ARTICLES = [
  {
    slug: "reading-a-growth-chart",
    title: "How to read a growth chart without panicking",
    excerpt:
      "Percentiles are a position, not a grade. What the curve is doing over time matters far more than the number on any single visit.",
    category: "Preventive care",
    readTime: "6 min read",
    date: "18 August 2026",
    image: "/images/photo-pediatric-checkup.jpg",
  },
  {
    slug: "fever-without-fear",
    title: "Fever without fear: what the number does and does not tell you",
    excerpt:
      "How your child looks and behaves is a better guide than the thermometer. Here is what we actually assess, and the handful of situations that warrant a call today.",
    category: "Preventive care",
    readTime: "5 min read",
    date: "11 August 2026",
    image: "/images/journal-4.jpg",
  },
  {
    slug: "sleep-regressions",
    title: "Sleep regressions are developmental, not disciplinary",
    excerpt:
      "The four month, eight month, and eighteen month disruptions are your child's brain reorganising. Knowing that changes how you respond at 3am.",
    category: "Parenting",
    readTime: "7 min read",
    date: "4 August 2026",
    image: "/images/journal-2.jpg",
  },
  {
    slug: "screens-and-schedules",
    title: "Screens, schedules, and the things worth protecting",
    excerpt:
      "Counting minutes is the wrong question. Protect sleep, movement, and one device-free meal, and the rest mostly sorts itself out.",
    category: "Parenting",
    readTime: "6 min read",
    date: "28 July 2026",
    image: "/images/journal-3.jpg",
  },
  {
    slug: "picky-eating",
    title: "Picky eating is a phase you can shorten but not skip",
    excerpt:
      "Food neophobia peaks between two and six and it is entirely normal. What helps is repeated low-pressure exposure, not negotiation at the table.",
    category: "Nutrition",
    readTime: "6 min read",
    date: "21 July 2026",
    image: "/images/journal-1.jpg",
  },
  {
    slug: "lunchboxes-that-get-eaten",
    title: "Building a lunchbox that comes home empty",
    excerpt:
      "Protein, something crunchy, something familiar, and one thing they genuinely like. The nutritional ideal that returns uneaten is worth nothing.",
    category: "Nutrition",
    readTime: "4 min read",
    date: "14 July 2026",
    image: "/images/journal-7.jpg",
  },
  {
    slug: "flu-season-plan",
    title: "Your flu season plan, written in September",
    excerpt:
      "Vaccination timing, when to keep a child home, and how to stop one household infection becoming five.",
    category: "Seasonal",
    readTime: "5 min read",
    date: "7 July 2026",
    image: "/images/service-immunizations.jpg",
  },
  {
    slug: "asthma-action-plan",
    title: "What a good asthma action plan actually contains",
    excerpt:
      "Green, yellow, and red zones, written down, with doses. If your plan lives only in your memory, it is not a plan.",
    category: "Chronic care",
    readTime: "8 min read",
    date: "30 June 2026",
    image: "/images/journal-5.jpg",
  },
  {
    slug: "one-chart-three-offices",
    title: "Why we put one chart across all three offices",
    excerpt:
      "The change took a year and was worth every week of it. What it means in practice when you walk into a location you have never visited.",
    category: "Clinic news",
    readTime: "4 min read",
    date: "23 June 2026",
    image: "/images/journal-6.jpg",
  },
];

export default function JournalGrid() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [active, setActive] = useState("All");

  const shown = active === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === active);

  return (
    <section
      id="archive"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Everything else we have written.</h2>
        <span className={styles.kicker}>{ARTICLES.length} pieces</span>
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
            <article
              key={article.slug}
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
