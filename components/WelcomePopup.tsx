"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import styles from "./WelcomePopup.module.css";
import { CloseIcon, MapIcon, CompassIcon } from "@/components/icons";

const STORAGE_KEY = "sgm-welcome-popup-seen";

// Same three clinics as Locations.tsx / CallFab.tsx; this component only
// needs name, phone and address, so it keeps its own copy rather than
// importing a component that renders unrelated markup.
const CLINICS = [
  {
    name: "Santa Monica",
    phone: "818-308-4100",
    tel: "tel:+18183084100",
    address: "2221 Lincoln Blvd, Santa Monica, CA 90405",
  },
  {
    name: "Hollywood",
    phone: "818-275-7006",
    tel: "tel:+18182757006",
    address: "5255 W Sunset Blvd, Los Angeles, CA 90027",
  },
  {
    name: "La Mirada",
    phone: "562-941-9853",
    tel: "tel:+15629419853",
    address: "12675 La Mirada Blvd, #200, La Mirada, CA 90638",
  },
];

const googleMapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const appleMapsUrl = (address: string) => `https://maps.apple.com/?q=${encodeURIComponent(address)}`;

const FOCUSABLE_SELECTOR = "a[href], button:not([disabled])";

// No real external listener - this store never changes from outside a
// setDismissed call, so subscribe is a no-op. Same shape as useMediaQuery's
// useSyncExternalStore: a safe false on the server and on the first client
// render (nothing to correct after mount, so no flash of an open dialog),
// with the real client-only value read on the client from then on.
const subscribeNoop = () => () => {};
const getNotSeenSnapshot = () => window.localStorage.getItem(STORAGE_KEY) !== "1";
const getServerSnapshot = () => false;

export default function WelcomePopup() {
  const notSeen = useSyncExternalStore(subscribeNoop, getNotSeenSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const open = notSeen && !dismissed;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Closes only from the close button (see the click handler below) - not
    // Escape, not an outside click - so it never disappears by accident.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-popup-heading"
        ref={dialogRef}
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Close"
          ref={closeButtonRef}
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, "1");
            setDismissed(true);
          }}
        >
          <CloseIcon size={20} />
        </button>

        <div className={styles.content}>
          <h2 id="welcome-popup-heading" className={styles.heading}>
            We&apos;re here when you need us
          </h2>
          <p className={styles.subtext}>
            Call your nearest St. Gianna clinic or get directions in one tap.
          </p>

          <ul className={styles.clinics}>
            {CLINICS.map((clinic) => (
              <li key={clinic.name} className={styles.clinic}>
                <span className={styles.clinicName}>{clinic.name}</span>
                <a href={clinic.tel} className={styles.phone}>
                  {clinic.phone}
                </a>
                <span className={styles.mapLinks}>
                  <a
                    href={googleMapsUrl(clinic.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${clinic.name} in Google Maps`}
                    className={styles.mapLink}
                  >
                    <MapIcon size={18} />
                  </a>
                  <a
                    href={appleMapsUrl(clinic.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${clinic.name} in Apple Maps`}
                    className={styles.mapLink}
                  >
                    <CompassIcon size={18} />
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.imageWrap}>
          <Image
            src="/images/photo-pediatric-checkup.jpg"
            alt="A pediatric checkup at St. Gianna Medical Group"
            fill
            className={styles.image}
          />
        </div>
      </div>
    </div>
  );
}
