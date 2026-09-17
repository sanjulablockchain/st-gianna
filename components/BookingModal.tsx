"use client";

import { useEffect, useRef } from "react";
import styles from "./BookingModal.module.css";
import { useScrollLock } from "@/hooks/useScrollLock";
import { CloseIcon, ArrowOutwardIcon, CallIcon, ScheduleIcon } from "@/components/icons";

const HEALOW_URL =
  "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=a8gDE7vnNqvjwXe2";
const PHONE = "818-308-4100";
const PHONE_TEL = "tel:+18183084100";

const FOCUSABLE_SELECTOR = "a[href], button:not([disabled])";

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function BookingModal({ open, onClose }: BookingModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    // Closes only from the close button - not Escape, not an outside click -
    // so it never disappears by accident (matches WelcomePopup's convention).
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
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} data-testid="booking-modal-backdrop">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-heading"
        ref={dialogRef}
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Close"
          ref={closeButtonRef}
          onClick={onClose}
        >
          <CloseIcon size={22} />
        </button>

        <span className={styles.badge}>
          <ScheduleIcon size={22} />
        </span>

        <h2 id="booking-modal-heading" className={styles.heading}>
          Let&apos;s get you booked in
        </h2>
        <p className={styles.subtext}>Pick whichever&apos;s easiest, our team&apos;s ready either way.</p>

        <div className={styles.options}>
          <a
            href={HEALOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.option}
          >
            <span className={styles.optionIcon}>
              <ArrowOutwardIcon size={22} />
            </span>
            <span className={styles.optionText}>
              <span className={styles.optionTitleRow}>
                <span className={styles.optionTitle}>Book online</span>
                <span className={styles.optionTag}>Fastest</span>
              </span>
              <span className={styles.optionDetail}>
                See real openings &amp; pick your own time
              </span>
            </span>
          </a>

          <a href={PHONE_TEL} className={styles.option}>
            <span className={styles.optionIcon}>
              <CallIcon size={22} />
            </span>
            <span className={styles.optionText}>
              <span className={styles.optionTitleRow}>
                <span className={styles.optionTitle}>Call us</span>
              </span>
              <span className={styles.optionDetail}>
                Talk to our front desk, we&apos;ll find a time together
              </span>
              <span className={styles.optionPhone}>{PHONE}</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
