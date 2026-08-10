"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./LocationsMap.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { MapOffice } from "./LocationsMapView";

const LocationsMapView = dynamic(() => import("./LocationsMapView"), { ssr: false });

const OFFICES: MapOffice[] = [
  {
    name: "Hollywood",
    address: "5255 W Sunset Blvd, Los Angeles, CA 90027",
    lat: 34.0981967,
    lng: -118.3045711,
  },
  {
    name: "Santa Monica",
    address: "2221 Lincoln Blvd, Santa Monica, CA 90405",
    lat: 34.0025873,
    lng: -118.4703697,
  },
  {
    name: "La Mirada",
    address: "12675 La Mirada Blvd, #200, La Mirada, CA 90638",
    lat: 33.9161889,
    lng: -118.0124715,
  },
];

export default function LocationsMap() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [focusedIndex, setFocusedIndex] = useState(0);

  return (
    <section
      id="map"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Find us on
          <br />
          the map
        </h2>
        <span className={styles.chips}>
          {OFFICES.map((office, i) => (
            <button
              key={office.name}
              type="button"
              className={`${styles.chip} ${i === focusedIndex ? styles.chipActive : ""}`}
              onClick={() => setFocusedIndex(i)}
            >
              {office.name}
            </button>
          ))}
        </span>
      </div>
      <div className={styles.mapFrame}>
        <LocationsMapView offices={OFFICES} focusedIndex={focusedIndex} />
      </div>
    </section>
  );
}
