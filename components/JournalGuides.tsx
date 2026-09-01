"use client";

import Link from "next/link";
import styles from "./JournalGuides.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getArticle } from "@/components/journal/articles";
import {
  VolunteerActivismIcon,
  SportsGymnasticsIcon,
  MenuBookIcon,
  MonitorHeartIcon,
} from "@/components/icons";

/**
 * Curated reading paths by life stage. This replaces the newsletter signup:
 * it sends people further into the writing instead of asking them for an
 * address, and every entry is a real article rather than a promise of one.
 */
const GUIDES = [
  {
    id: "newborn",
    icon: VolunteerActivismIcon,
    stage: "Newborn and baby",
    blurb: "The first year, where sleep and feeding take up most of the oxygen.",
    slugs: ["sleep-regressions", "fever-without-fear", "reading-a-growth-chart"],
  },
  {
    id: "toddler",
    icon: SportsGymnasticsIcon,
    stage: "Toddler and preschool",
    blurb: "Two to five, when eating becomes a negotiation and everything is a phase.",
    slugs: ["picky-eating", "reading-a-growth-chart", "screens-and-schedules"],
  },
  {
    id: "school",
    icon: MenuBookIcon,
    stage: "School age",
    blurb: "Lunchboxes, sick days, and keeping the year on schedule.",
    slugs: ["lunchboxes-that-get-eaten", "flu-season-plan", "screens-and-schedules"],
  },
  {
    id: "ongoing",
    icon: MonitorHeartIcon,
    stage: "Living with a condition",
    blurb: "For families managing something long-term alongside everything else.",
    slugs: ["asthma-action-plan", "one-chart-three-offices", "10-essential-habits"],
  },
];

export default function JournalGuides() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="guides"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Where to start.</h2>
        <p className={styles.subtext}>
          Four short reading paths, depending on which stage your family is in right now. Each
          one is three pieces, in the order we would hand them to you.
        </p>
      </div>

      <div className={styles.grid}>
        {GUIDES.map(({ id, icon: GuideIcon, stage, blurb, slugs }, i) => (
          <article
            key={id}
            id={id}
            className={styles.card}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <span className={styles.iconWrap}>
              <GuideIcon size={26} />
            </span>
            <h3 className={styles.stage}>{stage}</h3>
            <p className={styles.blurb}>{blurb}</p>
            <ol className={styles.list}>
              {slugs.map((slug, index) => {
                const article = getArticle(slug);
                if (!article) return null;
                return (
                  <li key={slug} className={styles.item}>
                    <span className={styles.step}>{index + 1}</span>
                    <Link href={`/journal/${slug}`} className={styles.link}>
                      {article.title}
                    </Link>
                    <span className={styles.time}>{article.readTime}</span>
                  </li>
                );
              })}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
}
