"use client";

import Link from "next/link";
import styles from "./AboutHero.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STATS = [
  { n: "3", l: "LA offices" },
  { n: "24/7", l: "Booking" },
  { n: "All ages", l: "Adults & children" },
];

export default function AboutHero() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="top"
      data-dark="1"
      className={`${styles.hero} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <span className={styles.gradient} />
      <span className={styles.scanlines} />

      <Link href="/#top" className={styles.logo} aria-label="St. Gianna Medical Group" />

      <div className={styles.content}>
        <span className={styles.breadcrumb}>
          <span className={styles.liveDot} />
          <Link href="/#top" className={styles.breadcrumbLink}>
            Home
          </Link>{" "}
          / About us
        </span>
        <h1 className={styles.headline}>
          Who
          <br />
          <span className={styles.headlineItalic}>are we?</span>
        </h1>
        <div className={styles.subrow}>
          <p className={styles.subcopy}>
            At St. Gianna Medical Group, we are dedicated to providing exceptional healthcare
            services for adults and children.
          </p>
          <div className={styles.stats}>
            {STATS.map((stat) => (
              <span key={stat.l} className={styles.stat}>
                <span className={styles.statNumber}>{stat.n}</span>
                <span className={styles.statLabel}>{stat.l}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
