"use client";

import styles from "./AboutLocations.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CallIcon } from "@/components/icons";

const OFFICES = [
  {
    name: "Hollywood",
    address: "5255 W Sunset Blvd,\nLos Angeles, CA 90027",
    phone: "818-275-7006",
    tel: "tel:+18182757006",
  },
  {
    name: "Santa Monica",
    address: "2221 Lincoln Blvd,\nSanta Monica, CA 90405",
    phone: "818-308-4100",
    tel: "tel:+18183084100",
  },
  {
    name: "La Mirada",
    address: "12675 La Mirada Blvd, #200,\nLa Mirada, CA 90638",
    phone: "562-941-9853",
    tel: "tel:+15629419853",
  },
];

export default function AboutLocations() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

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
        <span className={styles.kicker}>Get in touch</span>
      </div>
      <div className={styles.grid}>
        {OFFICES.map((office) => (
          <div key={office.name} className={styles.card}>
            <span className={styles.name}>{office.name}</span>
            <span className={styles.address}>{office.address}</span>
            <a href={office.tel} className={styles.phone}>
              <CallIcon size={19} />
              {office.phone}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
