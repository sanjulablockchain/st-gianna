"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Partners.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";
import {
  HubIcon,
  BiotechIcon,
  NightlightIcon,
  SportsGymnasticsIcon,
  VerifiedUserIcon,
  ArrowOutwardIcon,
} from "@/components/icons";

const PARTNERS = [
  {
    name: "KT Doctor",
    role: "Primary network",
    icon: HubIcon,
    body: "Shared charting and specialist referrals across the group.",
    image: "/images/photo-doctor-portrait.jpg",
  },
  {
    name: "Serendib Health",
    role: "Diagnostics",
    icon: BiotechIcon,
    body: "Same-week labs and imaging read by pediatric radiologists.",
    image: "/images/photo-counseling-session.jpg",
  },
  {
    name: "Pediatric After Hours",
    role: "Nights & weekends",
    icon: NightlightIcon,
    body: "A pediatric nurse answers every call, 24 hours a day.",
    image: "/images/photo-pediatric-checkup.jpg",
  },
  {
    name: "LAIPT",
    role: "Therapy",
    icon: SportsGymnasticsIcon,
    body: "Physical, occupational and speech therapy for growing kids.",
    image: "/images/photo-physical-therapy.jpg",
  },
  {
    name: "HMO & IPA plans",
    role: "Coverage",
    icon: VerifiedUserIcon,
    body: "Most Los Angeles plans accepted, benefits checked before the visit.",
    image: "/images/photo-hospital-hallway.jpg",
  },
];

export default function Partners() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: parallaxRef, offset } = useParallax<HTMLSpanElement>(0.06, 20);
  const [hovered, setHovered] = useState(-1);
  const previewIndex = hovered >= 0 ? hovered : 0;

  return (
    <section
      id="partners"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      onMouseLeave={() => setHovered(-1)}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>
          We never treat
          <br />
          your family alone
        </h2>
        <p className={styles.subtext}>
          Five partnerships carry the weight behind every visit. You feel one clinic; behind it
          stands a network.
        </p>
      </div>
      <div className={styles.rows}>
        {PARTNERS.map((partner, i) => {
          const PartnerIcon = partner.icon;
          return (
            <Link
              key={partner.name}
              href="/partners#network"
              className={styles.row}
              onMouseEnter={() => setHovered(i)}
            >
              <PartnerIcon size={25} className={styles.icon} />
              <span className={styles.name}>{partner.name}</span>
              <span className={styles.role}>{partner.role}</span>
              <span className={styles.body}>{partner.body}</span>
              <ArrowOutwardIcon size={23} className={styles.arrow} />
            </Link>
          );
        })}
        <span
          className={`${styles.previewWrap} ${hovered >= 0 ? styles.previewVisible : ""}`}
          ref={parallaxRef}
        >
          <span
            className={styles.previewImageLayer}
            style={{ transform: `translateY(${offset}px)` }}
          >
            <Image
              src={PARTNERS[previewIndex].image}
              alt={`${PARTNERS[previewIndex].name} preview`}
              fill
              className={styles.previewImage}
            />
          </span>
        </span>
      </div>
    </section>
  );
}
