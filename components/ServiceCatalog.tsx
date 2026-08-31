"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ServiceCatalog.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AddIcon } from "@/components/icons";

const SERVICES = [
  {
    title: "Same-day sick visits",
    body: "Fevers, infections and acute illness, usually seen the day you call.",
    image: "/images/service-sick-visit.jpg",
    includes: [
      "Same-day assessment",
      "Rapid strep and flu testing",
      "Prescriptions sent to your pharmacy",
      "Work or school note",
    ],
    who: "Anyone in the family with an illness that started in the last few days.",
    duration: "20 minutes",
    conditions: ["Fever", "Sore throat", "Ear pain", "Cough", "Stomach upset", "Rashes", "Minor injuries"],
  },
  {
    title: "Chronic condition management",
    body: "Asthma, allergy, diabetes and blood pressure with one consistent team.",
    image: "/images/service-chronic-care.jpg",
    includes: [
      "A written care plan",
      "Medication review at every visit",
      "Coordinated specialist referrals",
      "Between-visit check-ins",
    ],
    who: "Adults and children living with a long-term condition.",
    duration: "30 to 40 minutes",
    conditions: [
      "Asthma",
      "Allergies",
      "Type 2 diabetes",
      "High blood pressure",
      "High cholesterol",
      "Thyroid disorders",
    ],
  },
  {
    title: "Preventative care",
    body: "Routine screenings, counselling and early detection for every age.",
    image: "/images/photo-pediatric-checkup.jpg",
    includes: [
      "Age-appropriate screening",
      "Bloodwork and results review",
      "Lifestyle and risk counselling",
      "A schedule for the year ahead",
    ],
    who: "Everyone, whether or not anything feels wrong.",
    duration: "30 minutes",
    conditions: [
      "Cardiovascular risk",
      "Diabetes screening",
      "Cancer screening",
      "Bone health",
      "Mental health screening",
    ],
  },
  {
    title: "Well-child & physicals",
    body: "Growth checks, school and sports physicals, developmental screening.",
    image: "/images/service-well-child.jpg",
    includes: [
      "Growth and development check",
      "Vision and hearing screening",
      "School, camp, and sports forms completed",
      "Immunizations brought up to date",
    ],
    who: "Newborns through age 21.",
    duration: "30 minutes",
    conditions: ["Growth concerns", "Developmental milestones", "Sports clearance", "School forms"],
  },
  {
    title: "Immunizations",
    body: "Full childhood schedule plus travel and seasonal vaccines, tracked across offices.",
    image: "/images/service-immunizations.jpg",
    includes: [
      "Full childhood schedule",
      "Catch-up schedules",
      "Travel vaccines",
      "Seasonal flu and COVID",
    ],
    who: "All ages, including adults who have lost track of their record.",
    duration: "15 minutes",
    conditions: [
      "Routine childhood schedule",
      "Travel protection",
      "Seasonal illness",
      "Occupational requirements",
    ],
  },
  {
    title: "Telehealth",
    body: "Virtual consults, diagnosis and prescriptions from home, evenings included.",
    image: "/images/service-telehealth.jpg",
    includes: [
      "Video consultation",
      "Diagnosis and prescriptions",
      "Follow-up and medication reviews",
      "Evening slots",
    ],
    who: "Anyone whose problem does not need hands or instruments.",
    duration: "15 to 20 minutes",
    conditions: [
      "Rashes",
      "Medication questions",
      "Follow-ups",
      "Minor infections",
      "Mental health check-ins",
    ],
  },
  {
    title: "Advanced wound care",
    body: "Specialist treatment for chronic and non-healing wounds.",
    image: "/images/service-wound-care.jpg",
    includes: [
      "Wound assessment and measurement",
      "Debridement where needed",
      "Advanced dressings",
      "Infection monitoring",
    ],
    who: "Patients with a wound that has not healed as expected.",
    duration: "30 to 45 minutes",
    conditions: [
      "Diabetic foot ulcers",
      "Pressure injuries",
      "Venous ulcers",
      "Post-surgical wounds",
      "Non-healing cuts",
    ],
  },
  {
    title: "Women's health",
    body: "Well-woman exams, family planning and routine gynecologic care.",
    image: "/images/photo-counseling-session.jpg",
    includes: [
      "Well-woman examination",
      "Cervical screening",
      "Contraception counselling",
      "Menopause support",
    ],
    who: "Women and girls at every stage.",
    duration: "30 minutes",
    conditions: [
      "Irregular periods",
      "Contraception",
      "Menopause symptoms",
      "Urinary symptoms",
      "Routine screening",
    ],
  },
  {
    title: "Behavioral & mental health",
    body: "Screening, first-line treatment and referral for anxiety, low mood and ADHD.",
    image: "/images/journal-2.jpg",
    includes: [
      "Structured screening",
      "Treatment plan and follow-up",
      "Medication management where appropriate",
      "Referral into therapy",
    ],
    who: "Children, teenagers, and adults.",
    duration: "40 minutes",
    conditions: ["Anxiety", "Low mood", "ADHD", "Sleep difficulty", "Behavioral concerns", "Stress"],
  },
  {
    title: "Senior & geriatric care",
    body: "Medication review, fall risk, memory concerns and coordination with specialists.",
    image: "/images/photo-doctor-portrait.jpg",
    includes: [
      "Full medication reconciliation",
      "Fall and mobility assessment",
      "Cognitive screening",
      "Coordination with specialists and family",
    ],
    who: "Adults from 65, and anyone managing several conditions at once.",
    duration: "40 minutes",
    conditions: [
      "Polypharmacy",
      "Falls",
      "Memory concerns",
      "Frailty",
      "Multiple chronic conditions",
    ],
  },
];

export default function ServiceCatalog() {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const [hovered, setHovered] = useState(-1);
  const [openIndex, setOpenIndex] = useState(-1);
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
        {SERVICES.map((service, i) => {
          const open = openIndex === i;
          return (
            <div key={service.title} className={`${styles.item} ${open ? styles.itemOpen : ""}`}>
              <button
                type="button"
                className={styles.row}
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? -1 : i)}
                onMouseEnter={() => setHovered(i)}
              >
                <span className={styles.num}>{`${i + 1 < 10 ? "0" : ""}${i + 1}`}</span>
                <span className={styles.title}>{service.title}</span>
                <span className={styles.body}>{service.body}</span>
                <AddIcon size={26} className={styles.icon} />
              </button>

              <div className={styles.panelWrap}>
                <div className={styles.panel}>
                  <div className={styles.panelCol}>
                    <span className={styles.panelLabel}>What is included</span>
                    <ul className={styles.panelList}>
                      {service.includes.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.panelCol}>
                    <span className={styles.panelLabel}>Who it is for</span>
                    <p className={styles.panelText}>{service.who}</p>
                    <span className={styles.panelLabel}>Typical visit</span>
                    <p className={styles.panelText}>{service.duration}</p>
                  </div>
                  <div className={styles.panelCol}>
                    <span className={styles.panelLabel}>Conditions covered</span>
                    <span className={styles.tags}>
                      {service.conditions.map((condition) => (
                        <span key={condition} className={styles.tag}>
                          {condition}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
