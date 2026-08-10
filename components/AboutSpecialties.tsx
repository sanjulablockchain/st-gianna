"use client";

import { useState } from "react";
import styles from "./AboutSpecialties.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SPECIALTIES = [
  { title: "Cardiology", body: "Heart health assessment, monitoring and ongoing management." },
  { title: "Orthopedics", body: "Joint, bone and mobility care from injury through recovery." },
  { title: "Neurology", body: "Assessment and management of neurological conditions." },
  {
    title: "Primary care",
    body: "Everyday medicine for adults and children, one continuous chart.",
  },
  {
    title: "Preventive care",
    body: "Physicals, screenings and immunizations that catch problems early.",
  },
];

export default function AboutSpecialties() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [hovered, setHovered] = useState(-1);

  return (
    <section
      id="specialties"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      onMouseLeave={() => setHovered(-1)}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Care across
          <br />
          specialties
        </h2>
        <span className={styles.kicker}>Adults &amp; children</span>
      </div>
      <div className={styles.rows}>
        {SPECIALTIES.map((specialty, i) => {
          const active = hovered === i;
          const dimmed = hovered >= 0 && !active;
          return (
            <div
              key={specialty.title}
              className={`${styles.row} ${active ? styles.rowActive : ""} ${
                dimmed ? styles.rowDimmed : ""
              }`}
              onMouseEnter={() => setHovered(i)}
            >
              <span className={styles.num}>{`0${i + 1}`}</span>
              <span className={styles.title}>{specialty.title}</span>
              <span className={styles.body}>{specialty.body}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
