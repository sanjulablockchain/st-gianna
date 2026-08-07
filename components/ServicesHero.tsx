"use client";

import Link from "next/link";
import styles from "./ServicesHero.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STATS = [
  { n: "3", l: "LA clinics" },
  { n: "24/7", l: "Booking" },
  { n: "8", l: "Service lines" },
];

export default function ServicesHero() {
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
          / Services
        </span>
        <h1 className={styles.headline}>
          Our
          <br />
          <span className={styles.headlineItalic}>services.</span>
        </h1>
        <div className={styles.subrow}>
          <p className={styles.subcopy}>
            At St. Gianna Medical Group, we are committed to providing comprehensive,
            high-quality healthcare services to meet the diverse needs of our patients. Our
            experienced team of medical professionals utilizes the latest medical technologies
            and treatment protocols to ensure the best possible care.
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
