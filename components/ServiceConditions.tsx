"use client";

import styles from "./ServiceConditions.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const GROUPS = [
  {
    name: "Respiratory",
    items: [
      "Asthma",
      "Bronchitis",
      "Croup",
      "Sinusitis",
      "Pneumonia",
      "Persistent cough",
      "Seasonal allergies",
    ],
  },
  {
    name: "Skin",
    items: ["Eczema", "Acne", "Impetigo", "Hives", "Fungal infections", "Insect bites", "Warts"],
  },
  {
    name: "Digestive",
    items: [
      "Reflux",
      "Constipation",
      "Gastroenteritis",
      "Food intolerance",
      "Abdominal pain",
      "Colic",
    ],
  },
  {
    name: "Chronic",
    items: [
      "Type 2 diabetes",
      "High blood pressure",
      "High cholesterol",
      "Thyroid disorders",
      "Obesity",
      "Chronic fatigue",
    ],
  },
  {
    name: "Women's health",
    items: [
      "Irregular periods",
      "Contraception",
      "Menopause symptoms",
      "Urinary tract infections",
      "Cervical screening",
    ],
  },
  {
    name: "Wound care",
    items: [
      "Diabetic foot ulcers",
      "Pressure injuries",
      "Venous ulcers",
      "Post-surgical wounds",
      "Non-healing cuts",
      "Burns",
    ],
  },
];

export default function ServiceConditions() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="conditions"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Conditions we treat.</h2>
        <span className={styles.kicker}>Commonly seen</span>
      </div>
      <div className={styles.grid}>
        {GROUPS.map((group, i) => (
          <article
            key={group.name}
            className={styles.card}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <h3 className={styles.groupName}>{group.name}</h3>
            <span className={styles.items}>
              {group.items.map((item) => (
                <span key={item} className={styles.item}>
                  {item}
                </span>
              ))}
            </span>
          </article>
        ))}
      </div>
      <p className={styles.footnote}>
        This is not the whole list. If what you are dealing with is not here, call and ask. If it
        is not something we should treat, we will say so and point you to who should.
      </p>
    </section>
  );
}
