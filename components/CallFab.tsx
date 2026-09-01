"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CallFab.module.css";
import { CallIcon } from "@/components/icons";

// Ordered and worded to match the homepage Locations section, so the three
// doors are named the same way wherever a visitor meets them.
const CLINICS = [
  {
    name: "Santa Monica",
    phone: "818-308-4100",
    tel: "tel:+18183084100",
    hours: "Mon-Sat 8am-8pm",
  },
  {
    name: "Hollywood",
    phone: "818-275-7006",
    tel: "tel:+18182757006",
    hours: "Mon-Sun 8am-9pm",
  },
  {
    name: "La Mirada",
    phone: "562-941-9853",
    tel: "tel:+15629419853",
    hours: "Mon-Fri 9am-6pm",
  },
];

export default function CallFab() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className={styles.root} ref={rootRef}>
      <div
        id="call-fab-panel"
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
      >
        <p className={styles.panelTitle}>Call a clinic</p>
        {CLINICS.map((clinic) => (
          <a key={clinic.name} href={clinic.tel} className={styles.option}>
            <span className={styles.optionName}>{clinic.name}</span>
            <span className={styles.optionPhone}>{clinic.phone}</span>
            <span className={styles.optionHours}>{clinic.hours}</span>
          </a>
        ))}
      </div>
      <button
        type="button"
        ref={buttonRef}
        className={`${styles.button} ${open ? styles.buttonOpen : ""}`}
        aria-expanded={open}
        aria-controls="call-fab-panel"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <CallIcon size={22} />
        <span className={styles.label}>Call a clinic</span>
      </button>
    </div>
  );
}
