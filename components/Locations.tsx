"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Locations.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";

const LOCATIONS = [
  {
    name: "Santa Monica",
    status: "Open now",
    address: "2221 Lincoln Blvd, Santa Monica, CA 90405",
    phone: "818-308-4100",
    hours: "Mon-Sat 8am-8pm",
    image: "/images/photo-hospital-hallway.jpg",
  },
  {
    name: "Hollywood",
    status: "Open now",
    address: "5255 W Sunset Blvd, Los Angeles, CA 90027",
    phone: "818-275-7006",
    hours: "Mon-Sun 8am-9pm",
    image: "/images/photo-counseling-session.jpg",
  },
  {
    name: "La Mirada",
    status: "Opens 9am",
    address: "12675 La Mirada Blvd, #200, La Mirada, CA 90638",
    phone: "562-941-9853",
    hours: "Mon-Fri 9am-6pm",
    image: "/images/photo-pediatric-checkup.jpg",
  },
];

export default function Locations() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: parallaxRef, offset } = useParallax<HTMLDivElement>(0.08, 24);
  const [active, setActive] = useState(0);

  return (
    <section
      id="locations"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Three doors
          <br />
          across the city
        </h2>
        <p className={styles.subtext}>
          Hover a panel. Your child&apos;s chart is already there before you arrive.
        </p>
      </div>
      <div className={styles.panels} ref={parallaxRef} onMouseLeave={() => setActive(0)}>
        {LOCATIONS.map((location, i) => (
          <Link
            key={location.name}
            href="/locations"
            aria-label={`${location.name} clinic, see all locations`}
            className={`${styles.panel} ${active === i ? styles.panelActive : ""}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <div className={styles.imageLayer} style={{ transform: `translateY(${offset}px)` }}>
              <Image
                src={location.image}
                alt={`${location.name} clinic`}
                fill
                className={styles.image}
              />
            </div>
            <span className={styles.overlay} />
            <span className={styles.status}>
              <span className={styles.statusDot} />
              {location.status}
            </span>
            <span className={styles.body}>
              <span className={styles.name}>{location.name}</span>
              <span
                className={`${styles.detail} ${active === i ? styles.detailVisible : ""}`}
              >
                <span className={styles.address}>{location.address}</span>
                <span className={styles.phone}>{location.phone}</span>
                <span className={styles.hours}>{location.hours}</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
