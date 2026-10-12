"use client";

import styles from "./TipsEmergency.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { EMERGENCY_SIGNS, POISON_CONTROL } from "@/components/tips/tips";
import { OFFICES } from "@/lib/site";
import { CallIcon } from "@/components/icons";

export default function TipsEmergency() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="emergency"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.inner}>
        <div className={styles.lead}>
          <span className={styles.kicker}>Read this first</span>
          <h2 className={styles.heading}>When to skip the tips and get help now.</h2>
          <p className={styles.body}>
            Call 911 or go to the nearest emergency department if you see any of these. Do not
            wait for a callback, and do not send a message.
          </p>
          <div className={styles.actions}>
            <a href="tel:911" className={styles.primary}>
              <CallIcon size={20} />
              Call 911
            </a>
            <a href={`tel:${POISON_CONTROL.tel}`} className={styles.secondary}>
              Poison Control {POISON_CONTROL.label}
            </a>
          </div>
        </div>
        <ul className={styles.signs}>
          {EMERGENCY_SIGNS.map((sign) => (
            <li key={sign} className={styles.sign}>
              {sign}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.offices}>
        <p className={styles.officesLead}>
          Not an emergency, but worried? Call your office. A clinician is on call after hours.
        </p>
        <ul className={styles.officeList}>
          {OFFICES.map((office) => (
            <li key={office.id}>
              <a href={`tel:${office.phoneE164}`} className={styles.officeLink}>
                <span className={styles.officeName}>{office.name}</span>
                <span className={styles.officePhone}>{office.phone}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
