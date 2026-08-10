"use client";

import Link from "next/link";
import styles from "./LocationsHero.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STATS = [
  { n: "3", l: "LA offices" },
  { n: "24/7", l: "Booking" },
  { n: "Same-day", l: "Appointments" },
];

export default function LocationsHero() {
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
          / Locations
        </span>
        <h1 className={styles.headline}>
          Three
          <br />
          <span className={styles.headlineItalic}>locations.</span>
        </h1>
        <div className={styles.subrow}>
          <p className={styles.subcopy}>
            We are proud to offer our exceptional healthcare services at three convenient
            locations. Whether you are in Hollywood, Santa Monica, or La Mirada, you can count on
            St. Gianna Medical Group for top-quality medical care.
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
