"use client";

import styles from "./PartnersValue.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  SyncAltIcon,
  NightlightIcon,
  VerifiedUserIcon,
  HubIcon,
} from "@/components/icons";

const VALUES = [
  {
    icon: SyncAltIcon,
    title: "Referrals that carry your chart",
    body: "When we send you to a therapist, a subspecialist, or an imaging centre inside the network, your history goes with the referral. You do not spend the first appointment repeating yourself.",
  },
  {
    icon: NightlightIcon,
    title: "Cover when our doors are shut",
    body: "Nights, weekends, and holidays are handled by after-hours pediatric urgent care rather than by an answering machine pointing you at the emergency room.",
  },
  {
    icon: VerifiedUserIcon,
    title: "Coverage that already knows us",
    body: "Our HMO and IPA relationships are built through the same network, which is why benefits can usually be verified before you arrive instead of argued about afterwards.",
  },
  {
    icon: HubIcon,
    title: "One standard of care, several doors",
    body: "The clinics in this network share protocols and training. Care does not get better or worse depending on which door you happened to walk through.",
  },
];

export default function PartnersValue() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="value"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>What a network actually buys you.</h2>
      <div className={styles.grid}>
        {VALUES.map(({ icon: ValueIcon, title, body }, i) => (
          <article
            key={title}
            className={styles.card}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <span className={styles.iconWrap}>
              <ValueIcon size={26} />
            </span>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.body}>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
