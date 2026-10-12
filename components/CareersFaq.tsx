"use client";

import { useState } from "react";
import styles from "./CareersFaq.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AddIcon } from "@/components/icons";
import { CAREERS_FAQS as FAQS } from "@/components/careers/content";

export default function CareersFaq() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="careers-questions"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Questions from applicants</h2>
        <span className={styles.kicker}>Common questions</span>
      </div>
      <div className={styles.list}>
        {FAQS.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={faq.q} className={`${styles.item} ${open ? styles.itemOpen : ""}`}>
              <button
                type="button"
                className={styles.toggle}
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? -1 : i)}
              >
                <span className={styles.question}>{faq.q}</span>
                <AddIcon size={28} className={styles.icon} />
              </button>
              <div className={styles.answerWrap}>
                <p className={styles.answer}>{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
