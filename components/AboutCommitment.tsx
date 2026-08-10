"use client";

import Image from "next/image";
import styles from "./AboutCommitment.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function AboutCommitment() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="commitment"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Our Commitment to Your Health</h2>
        <span className={styles.kicker}>Who are we</span>
      </div>
      <div className={styles.wrap}>
        <p className={styles.body}>
          At St. Gianna Medical Group, we are dedicated to providing exceptional healthcare
          services for adults and children. Our experienced team of medical professionals offers
          comprehensive care across various specialties, including cardiology, orthopedics,
          neurology, and more. With state-of-the-art facilities and a patient-centered approach,
          we ensure personalized treatment plans tailored to each individual&apos;s needs. We
          pride ourselves on our compassionate care, same-day appointments, 24/7 booking
          availability, and acceptance of most insurances. Our commitment is to enhance the
          well-being and health of our community, making quality healthcare accessible to all.
          Trust St. Gianna Medical Group for your healthcare needs.
        </p>
        <span className={styles.imageWrap}>
          <Image
            src="/images/photo-doctor-portrait.jpg"
            alt="A St. Gianna Medical Group clinician"
            fill
            className={styles.image}
          />
        </span>
      </div>
    </section>
  );
}
