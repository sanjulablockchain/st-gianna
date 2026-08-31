"use client";

import Link from "next/link";
import styles from "./PartnersJoin.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowOutwardIcon } from "@/components/icons";

export default function PartnersJoin() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="join"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.inner}>
        <h2 className={styles.heading}>Work with us.</h2>
        <p className={styles.body}>
          We are always open to talking with practices, therapy groups, diagnostic labs, and plan
          administrators who want to look after the same families we do. Tell us what you do and
          who you serve, and we will tell you honestly whether there is a fit.
        </p>
        <Link href="/contact" className={styles.cta}>
          Start a conversation
          <ArrowOutwardIcon size={19} />
        </Link>
      </div>
    </section>
  );
}
