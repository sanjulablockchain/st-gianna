"use client";

import styles from "./CareersApply.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import CareersForm from "./CareersForm";
import { CAREERS_MAILTO } from "@/components/careers/content";
import { SITE_EMAIL } from "@/lib/site";

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
          <h2 className={styles.heading}>Apply now.</h2>
          <p className={styles.body}>
            Tell us a little about yourself, choose the role and office, and attach your CV. It
            takes about three minutes, and the practice team reads every application.
          </p>
          <div className={`${styles.panel} ${styles.warning}`}>
            <h3 className={styles.panelHeading}>Never send us</h3>
            <ul className={styles.points}>
              {LEAVE_OUT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className={styles.alt}>
            Prefer email? Send your CV to{" "}
            <a href={CAREERS_MAILTO} className={styles.inlineLink}>
              {SITE_EMAIL}
            </a>{" "}
            with the role and office in the subject line.
          </p>
        </div>
        <div className={styles.formWrap}>
          <CareersForm />
        </div>
      </div>
    </section>
  );
}
