"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./PageHero.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";

export type HeroStat = { n: string; l: string };

type PageHeroProps = {
  breadcrumb: string;
  headline: string;
  italic: string;
  subcopy: string;
  stats?: HeroStat[];
  image?: string;
  imageAlt?: string;
};

export default function PageHero({
  breadcrumb,
  headline,
  italic,
  subcopy,
  stats,
  image,
  imageAlt,
}: PageHeroProps) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: layersRef, offset } = useParallax<HTMLSpanElement>(0.05, 18);

  return (
    <section
      id="top"
      data-dark="1"
      className={`${styles.hero} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <span className={styles.layers} aria-hidden="true" ref={layersRef}>
        {image ? (
          <span className={styles.imageLayer} style={{ transform: `translateY(${offset}px)` }}>
            <Image src={image} alt={imageAlt ?? ""} fill className={styles.image} priority />
          </span>
        ) : null}
        <span
          className={styles.gradient}
          style={{ transform: `translateY(${offset * 0.4}px)` }}
        />
        <span className={styles.scanlines} />
      </span>

      <Link href="/#top" className={styles.logo} aria-label="St. Gianna Medical Group" />

      <div className={styles.content}>
        <span className={styles.breadcrumb}>
          <span className={styles.liveDot} />
          <Link href="/#top" className={styles.breadcrumbLink}>
            Home
          </Link>{" "}
          <span>/ {breadcrumb}</span>
        </span>
        <h1 className={styles.headline}>
          {headline}
          <br />
          <span className={styles.headlineItalic}>{italic}</span>
        </h1>
        <div className={styles.subrow}>
          <p className={styles.subcopy}>{subcopy}</p>
          {stats && stats.length > 0 ? (
            <div className={styles.stats}>
              {stats.map((stat) => (
                <span key={stat.l} className={styles.stat}>
                  <span className={styles.statNumber}>{stat.n}</span>
                  <span className={styles.statLabel}>{stat.l}</span>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
