"use client";

import Image from "next/image";
import styles from "./ContactOffices.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";
import { ArrowOutwardIcon } from "@/components/icons";

// Photography matches what the homepage Locations section already associates
// with each office, so an office looks like itself on both pages.
const OFFICES = [
  {
    name: "Hollywood",
    address: "5255 W Sunset Blvd, Los Angeles, CA 90027",
    phone: "818-275-7006",
    tel: "tel:+18182757006",
    hours: "Mon to Sun, 8am to 9pm",
    note: "Our longest hours, including weekends. Street parking on Sunset, with a lot behind the building.",
    image: "/images/photo-counseling-session.jpg",
    maps: "https://www.google.com/maps/search/?api=1&query=5255+W+Sunset+Blvd+Los+Angeles+CA+90027",
  },
  {
    name: "Santa Monica",
    address: "2221 Lincoln Blvd, Santa Monica, CA 90405",
    phone: "818-308-4100",
    tel: "tel:+18183084100",
    hours: "Mon to Sat, 8am to 8pm",
    note: "Closest to the beach communities. Ask reception to validate parking when you check in.",
    image: "/images/photo-hospital-hallway.jpg",
    maps: "https://www.google.com/maps/search/?api=1&query=2221+Lincoln+Blvd+Santa+Monica+CA+90405",
  },
  {
    name: "La Mirada",
    address: "12675 La Mirada Blvd, #200, La Mirada, CA 90638",
    phone: "562-941-9853",
    tel: "tel:+15629419853",
    hours: "Mon to Fri, 9am to 6pm",
    note: "Suite 200, on the first floor at the rear of the courtyard. Step-free access from the car park.",
    image: "/images/photo-pediatric-checkup.jpg",
    maps: "https://www.google.com/maps/search/?api=1&query=12675+La+Mirada+Blvd+%23200+La+Mirada+CA+90638",
  },
];

export default function ContactOffices() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: parallaxRef, offset } = useParallax<HTMLDivElement>(0.06, 20);

  return (
    <section
      id="offices"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>Three doors, one chart.</h2>
      <div className={styles.grid} ref={parallaxRef}>
        {OFFICES.map((office, i) => (
          <article
            key={office.name}
            className={styles.card}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <span className={styles.imageWrap}>
              <span
                className={styles.imageLayer}
                style={{ transform: `translateY(${offset}px)` }}
              >
                <Image
                  src={office.image}
                  alt={`${office.name} office`}
                  fill
                  className={styles.image}
                />
              </span>
            </span>
            <div className={styles.cardBody}>
              <h3 className={styles.name}>{office.name}</h3>
              <p className={styles.address}>{office.address}</p>
              <a href={office.tel} className={styles.phone}>
                {office.phone}
              </a>
              <p className={styles.hours}>{office.hours}</p>
              <p className={styles.note}>{office.note}</p>
              <a
                href={office.maps}
                className={styles.directions}
                target="_blank"
                rel="noopener noreferrer"
              >
                Directions
                <ArrowOutwardIcon size={17} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
