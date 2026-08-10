"use client";

import { useState } from "react";
import styles from "./LocationsDetails.module.css";
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

export default function LocationsDetails() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [hovered, setHovered] = useState(-1);

  return (
    <section
      id="details"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      onMouseLeave={() => setHovered(-1)}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Addresses and
          <br />
          phone numbers
        </h2>
        <span className={styles.kicker}>Get in touch</span>
      </div>
      <div className={styles.rows}>
        {OFFICES.map((office, i) => {
          const active = hovered === i;
          const dimmed = hovered >= 0 && !active;
          return (
            <div
              key={office.name}
              className={`${styles.row} ${active ? styles.rowActive : ""} ${
                dimmed ? styles.rowDimmed : ""
              }`}
              onMouseEnter={() => setHovered(i)}
            >
              <span className={styles.num}>{`0${i + 1}`}</span>
              <span className={styles.name}>{office.name}</span>
              <span className={styles.address}>{office.address}</span>
              <a href={office.tel} className={styles.phone}>
                <CallIcon size={19} />
                {office.phone}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
