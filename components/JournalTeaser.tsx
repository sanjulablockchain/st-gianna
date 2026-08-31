"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./JournalTeaser.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowOutwardIcon } from "@/components/icons";

export default function JournalTeaser() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="insight"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      data-dark="1"
      ref={ref}
    >
      <Link href="/journal" className={styles.link}>
        <Image
          src="/images/photo-physical-therapy.jpg"
          alt=""
          fill
          className={styles.image}
        />
        <span className={styles.overlay} />
        <span className={styles.content}>
          <span className={styles.kicker}>
            Journal <span className={styles.kickerRule} /> <span>5 min read</span>
          </span>
          <span className={styles.title}>10 essential habits for a healthier family year</span>
          <span className={styles.body}>
            Preventive care, sleep, screen time and nutrition: what our pediatricians actually
            recommend.
          </span>
          <span className={styles.cta}>
            Read the piece <ArrowOutwardIcon size={19} />
          </span>
        </span>
      </Link>
    </section>
  );
}
