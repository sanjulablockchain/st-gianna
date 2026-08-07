"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Services.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowOutwardIcon } from "@/components/icons";

const SERVICES = [
  {
    title: "Well-child & physicals",
    body: "Growth checks, school and sports physicals, immunizations, developmental screening.",
    image: "/images/service-well-child.jpg",
  },
  {
    title: "Same-day sick visits",
    body: "Fevers, infections and acute illness, usually seen the day you call.",
    image: "/images/service-sick-visit.jpg",
  },
  {
    title: "Telehealth",
    body: "Virtual consults, diagnosis and prescriptions from home, evenings included.",
    image: "/images/service-telehealth.jpg",
  },
  {
    title: "Advanced wound care",
    body: "Specialist treatment for chronic and non-healing wounds.",
    image: "/images/service-wound-care.jpg",
  },
  {
    title: "Immunizations",
    body: "Full childhood schedule plus travel and seasonal vaccines, tracked across offices.",
    image: "/images/service-immunizations.jpg",
  },
  {
    title: "Chronic care",
    body: "Asthma, allergy and ongoing conditions with one consistent care team.",
    image: "/images/service-chronic-care.jpg",
  },
];

export default function Services() {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const [hovered, setHovered] = useState(-1);
  const previewIndex = hovered >= 0 ? hovered : 0;

  return (
    <section
      id="services"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      onMouseLeave={() => setHovered(-1)}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>What we do</h2>
        <span className={styles.kicker}>Six lines of care</span>
      </div>
      <div className={styles.rows}>
        {SERVICES.map((service, i) => (
          <a
            key={service.title}
            href="#book"
            className={styles.row}
            onMouseEnter={() => setHovered(i)}
          >
            <span className={styles.num}>{`0${i + 1}`}</span>
            <span className={styles.title}>{service.title}</span>
            <span className={styles.body}>{service.body}</span>
            <ArrowOutwardIcon size={26} className={styles.arrow} />
          </a>
        ))}
        <span className={`${styles.previewWrap} ${hovered >= 0 ? styles.previewVisible : ""}`}>
          <Image
            src={SERVICES[previewIndex].image}
            alt={`${SERVICES[previewIndex].title} preview`}
            width={300}
            height={380}
            className={styles.previewImage}
          />
        </span>
      </div>
    </section>
  );
}
