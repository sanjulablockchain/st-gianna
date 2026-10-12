"use client";

import styles from "./CareersApply.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CAREERS_MAILTO, CAREERS_SUBJECT } from "@/components/careers/content";
import { SITE_EMAIL } from "@/lib/site";
import { ArrowOutwardIcon } from "@/components/icons";

const INCLUDE = [
  "Your CV, as a PDF or Word document",
  "The role you are applying for",
  "Your preferred office: Hollywood, Santa Monica or La Mirada",
  "Whether you want full time, part time or per diem hours",
  "Any languages you speak besides English",
  "The best phone number to reach you",
];

const LEAVE_OUT = [
  "Your Social Security number",
  "Bank or payment details",
  "Any patient information, including from a previous job",
];

export default function CareersApply() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="apply"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.inner}>
        <div className={styles.lead}>
          <h2 className={styles.heading}>How to apply.</h2>
          <p className={styles.body}>
            Email your CV to{" "}
            <a href={CAREERS_MAILTO} className={styles.inlineLink}>
              {SITE_EMAIL}
            </a>{" "}
            with the subject line <strong className={styles.subject}>{CAREERS_SUBJECT}</strong>,
            filling in the role and the office. That is the whole application.
          </p>
          <a href={CAREERS_MAILTO} className={styles.cta}>
            Email your CV
            <ArrowOutwardIcon size={19} />
          </a>
        </div>
        <div className={styles.lists}>
          <div className={styles.panel}>
            <h3 className={styles.panelHeading}>Please include</h3>
            <ul className={styles.points}>
              {INCLUDE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={`${styles.panel} ${styles.warning}`}>
            <h3 className={styles.panelHeading}>Never send us</h3>
            <ul className={styles.points}>
              {LEAVE_OUT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
