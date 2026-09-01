"use client";

import styles from "./PartnersNetwork.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowOutwardIcon } from "@/components/icons";
import PartnerMark from "./PartnerMark";

const GROUPS = [
  {
    label: "Pediatric & family care",
    partners: [
      {
        name: "Kids & Teens Medical Group",
        initials: "KT",
        tagline: "The flagship pediatric network",
        body: "Board-certified pediatric care across 25 clinics in Greater LA, for ages 0 to 21. When a case needs a pediatric subspecialist, this is usually where the referral lands.",
        tags: ["Primary care", "Urgent care", "Telehealth", "Newborn care"],
        href: "https://www.ktdoctor.com",
        flagship: true,
      },
      {
        name: "St. Gianna Medical Group",
        initials: "SG",
        tagline: "Family practice for all ages",
        body: "Us. Comprehensive healthcare for adults and children, with same-day appointments and booking that never closes.",
        tags: ["Same-day", "24/7 booking", "Telehealth", "Advanced wound care"],
        href: "/",
      },
      {
        name: "LA Intensive Pediatric Therapy",
        initials: "LA",
        tagline: "Expert pediatric therapy since 2010",
        body: "Individual and center-based speech, occupational, and developmental therapy. Referrals go out with the chart attached, so the first session is not spent on history.",
        tags: ["Speech therapy", "Occupational therapy", "Sensory integration"],
        href: "https://www.laipt.com",
      },
      {
        name: "Serendib Healthways",
        initials: "SH",
        tagline: "Pediatric health plans across Greater LA",
        body: "A pediatric HMO and IPA network with more than 20 clinic locations and over 50 board-certified doctors, offering affordable children's health coverage.",
        tags: ["Pediatric HMO/IPA", "Same-day", "Telehealth", "After-hours urgent care"],
        href: "https://www.serendibhealthways.com",
      },
      {
        name: "After-Hours Pediatric Urgent Care",
        initials: "AH",
        tagline: "Out of hours, still covered",
        body: "24/7 pediatric urgent care across more than 20 California clinics, for ages 0 to 21, accepted by all major insurance plans. This is who picks up when our offices are dark.",
        tags: ["24/7 urgent care", "Ages 0 to 21", "All insurance accepted"],
        href: "https://www.afterhourspediatrics.com",
      },
    ],
  },
  {
    label: "Sri Lanka network",
    partners: [
      {
        name: "St. Joseph Hospital Negombo",
        initials: "SJ",
        tagline: "US-standard care in Negombo",
        body: "Operated by Kids & Teens Medical Group, USA, bringing American healthcare standards to affordable, accessible care for families in Sri Lanka.",
        tags: ["Emergency & outpatient", "Inpatient care", "Telemedicine", "Pharmacy & diagnostics"],
        href: "https://www.stjosephhospital.lk",
      },
      {
        name: "ACIG Asiacorp Insurance Brokers",
        initials: "AC",
        tagline: "Insurance solutions across Sri Lanka",
        body: "An insurance brokerage offering tailored motor, health, life, and corporate cover for individuals and businesses.",
        tags: ["Health insurance", "Life insurance", "Motor insurance", "Corporate"],
        href: "https://www.acig.lk",
      },
    ],
  },
  {
    label: "Business & support partners",
    partners: [
      {
        name: "Human Compass MSO",
        initials: "HC",
        tagline: "Guiding care, delivering human solutions",
        body: "A Southern California management services organization connecting patients with primary, specialty, and urgent care providers for over 25 years.",
        tags: ["Primary care network", "Specialty care", "Urgent care", "Provider management"],
        href: "https://www.humancompass.com",
      },
      {
        name: "Blockchain BPO",
        initials: "BB",
        tagline: "Offshore teams for US businesses",
        body: "Dedicated offshore teams in Sri Lanka and Mexico handling customer care, claims processing, and billing support.",
        tags: ["Customer care", "Claims processing", "Billing support", "Data entry"],
        href: "https://www.blockchainbpo.com",
      },
    ],
  },
];

export default function PartnersNetwork() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="network"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>More ways to care for your family.</h2>
        <p className={styles.subtext}>
          Nine organizations, three groups. Some we own, some we refer into, and some keep the
          administration running so the clinicians can stay clinical.
        </p>
      </div>

      {GROUPS.map((group) => (
        <div key={group.label} className={styles.group}>
          <p className={styles.groupName}>{group.label}</p>
          <div className={styles.grid}>
            {group.partners.map((partner, i) => {
              const external = partner.href.startsWith("http");
              return (
                <a
                  key={partner.name}
                  href={partner.href}
                  className={`${styles.card} ${partner.flagship ? styles.flagship : ""}`}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
                >
                  <span className={styles.markRow}>
                    <PartnerMark initials={partner.initials} name={partner.name} />
                    {partner.flagship ? <span className={styles.badge}>Flagship</span> : null}
                  </span>
                  <h3 className={styles.name}>{partner.name}</h3>
                  <span className={styles.tagline}>{partner.tagline}</span>
                  <span className={styles.body}>{partner.body}</span>
                  <span className={styles.tags}>
                    {partner.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </span>
                  <span className={styles.cta}>
                    {external ? "Visit site" : "Back to home"}
                    <ArrowOutwardIcon size={18} />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
