"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ServiceCatalog.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowOutwardIcon } from "@/components/icons";

const SERVICES = [
  {
    title: "Same-day sick visits",
    body: "Fevers, infections and acute illness, usually seen the day you call.",
    image: "/images/service-sick-visit.jpg",
  },
  {
    title: "Chronic condition management",
    body: "Asthma, allergy, diabetes and blood pressure with one consistent team.",
    image: "/images/service-chronic-care.jpg",
  },
  {
    title: "Preventative care",
    body: "Routine screenings, counselling and early detection for every age.",
    image: "/images/photo-pediatric-checkup.jpg",
  },
  {
    title: "Well-child & physicals",
    body: "Growth checks, school and sports physicals, developmental screening.",
    image: "/images/service-well-child.jpg",
  },
  {
    title: "Immunizations",
    body: "Full childhood schedule plus travel and seasonal vaccines, tracked across offices.",
    image: "/images/service-immunizations.jpg",
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
    title: "Women's health",
    body: "Well-woman exams, family planning and routine gynecologic care.",
    image: "/images/photo-counseling-session.jpg",
  },
];

export default function ServiceCatalog() {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const [hovered, setHovered] = useState(-1);
  const previewIndex = hovered >= 0 ? hovered : 0;

  return (
    <section
      id="catalog"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      onMouseLeave={() => setHovered(-1)}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>The full list</h2>
        <span className={styles.kicker}>{SERVICES.length} services</span>
      </div>
      <div className={styles.rows}>
        {SERVICES.map((service, i) => (
          <a
            key={service.title}
            href="#book"
            className={styles.row}
            onMouseEnter={() => setHovered(i)}
          >
            <span className={styles.num}>{`${i + 1 < 10 ? "0" : ""}${i + 1}`}</span>
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
