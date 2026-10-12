"use client";

import styles from "./CareersRoles.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CAREERS_MAILTO, ROLES } from "@/components/careers/content";
import { ArrowOutwardIcon } from "@/components/icons";

export default function CareersRoles() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="roles"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>The teams we hire for.</h2>
        <p className={styles.subtext}>
          We do not post every opening, so these are the roles we hire for through the year. If
          one of them sounds like you, send us your CV even if nothing is listed right now.
        </p>
      </div>

      <div className={styles.list}>
        {ROLES.map((role, i) => (
          <article
            key={role.id}
            id={role.id}
            className={styles.card}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <div className={styles.intro}>
              <h3 className={styles.title}>{role.title}</h3>
              <p className={styles.summary}>{role.summary}</p>
              <ul className={styles.chips} aria-label={`${role.title} job titles`}>
                {role.titles.map((title) => (
                  <li key={title} className={styles.chip}>
                    {title}
                  </li>
                ))}
              </ul>
              <a href={CAREERS_MAILTO} className={styles.apply}>
                Apply by email
                <ArrowOutwardIcon size={18} />
              </a>
            </div>
            <div className={styles.columns}>
              <div>
                <h4 className={styles.listHeading}>A typical day</h4>
                <ul className={styles.points}>
                  {role.day.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className={styles.listHeading}>What we look for</h4>
                <ul className={styles.points}>
                  {role.lookFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
