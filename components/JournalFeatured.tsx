"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./JournalFeatured.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";
import { ArrowOutwardIcon } from "@/components/icons";
import { FEATURED } from "@/components/journal/articles";

export default function JournalFeatured() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: parallaxRef, offset } = useParallax<HTMLSpanElement>(0.08, 28);

  return (
    <section
      id="featured"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <p className={styles.meta}>
        <span className={styles.metaTag}>Featured</span>
        <span>{FEATURED.category}</span>
        <span>{FEATURED.readTime}</span>
        <span>{FEATURED.date}</span>
      </p>
      <h2 className={styles.title}>{FEATURED.title}</h2>
      <p className={styles.standfirst}>{FEATURED.standfirst}</p>

      <span className={styles.imageWrap} ref={parallaxRef}>
        <span className={styles.imageLayer} style={{ transform: `translateY(${offset}px)` }}>
          <Image
            src={FEATURED.image}
            alt="A family at home together"
            fill
            className={styles.image}
          />
        </span>
      </span>

      <ul className={styles.points}>
        {FEATURED.keyPoints.map((point) => (
          <li key={point} className={styles.point}>
            {point}
          </li>
        ))}
      </ul>

      <Link href={`/journal/${FEATURED.slug}`} className={styles.cta}>
        Read the piece
        <ArrowOutwardIcon size={19} />
      </Link>
    </section>
  );
}
