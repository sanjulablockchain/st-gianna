"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./LocationsPanels.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";
import { CallIcon, NearMeIcon } from "@/components/icons";

const OFFICES = [
  {
    name: "Hollywood",
    address: "5255 W Sunset Blvd,\nLos Angeles, CA 90027",
    phone: "818-275-7006",
    tel: "tel:+18182757006",
    map: "https://maps.google.com/?q=5255+W+Sunset+Blvd,+Los+Angeles,+CA+90027",
    image: "/images/photo-counseling-session.jpg",
  },
  {
    name: "Santa Monica",
    address: "2221 Lincoln Blvd,\nSanta Monica, CA 90405",
    phone: "818-308-4100",
    tel: "tel:+18183084100",
    map: "https://maps.google.com/?q=2221+Lincoln+Blvd,+Santa+Monica,+CA+90405",
    image: "/images/photo-hospital-hallway.jpg",
  },
  {
    name: "La Mirada",
    address: "12675 La Mirada Blvd, #200,\nLa Mirada, CA 90638",
    phone: "562-941-9853",
    tel: "tel:+15629419853",
    map: "https://maps.google.com/?q=12675+La+Mirada+Blvd+200,+La+Mirada,+CA+90638",
    image: "/images/photo-pediatric-checkup.jpg",
  },
];

export default function LocationsPanels() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: parallaxRef, offset } = useParallax<HTMLDivElement>(0.08, 24);
  const [active, setActive] = useState(0);

  return (
    <section
      id="offices"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Serving Hollywood, Santa Monica, and La Mirada</h2>
        <span className={styles.kicker}>Our offices</span>
      </div>
      <div className={styles.panels} ref={parallaxRef} onMouseLeave={() => setActive(0)}>
        {OFFICES.map((office, i) => (
          <div
            key={office.name}
            className={`${styles.panel} ${active === i ? styles.panelActive : ""}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <div className={styles.imageLayer} style={{ transform: `translateY(${offset}px)` }}>
              <Image
                src={office.image}
                alt={`${office.name} clinic`}
                fill
                className={styles.image}
              />
            </div>
            <span className={styles.overlay} />
            <span className={styles.status}>
              <span className={styles.statusDot} />
              Open now
            </span>
            <div className={styles.body}>
              <span className={styles.name}>{office.name}</span>
              <div className={`${styles.detail} ${active === i ? styles.detailVisible : ""}`}>
                <span className={styles.address}>{office.address}</span>
                <span className={styles.actions}>
                  <a href={office.tel} className={styles.callLink}>
                    <CallIcon size={18} />
                    {office.phone}
                  </a>
                  <a
                    href={office.map}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.directionsLink}
                  >
                    <NearMeIcon size={18} />
                    Directions
                  </a>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
