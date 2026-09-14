"use client";

import { useState } from "react";
import styles from "./BookCta.module.css";
import { ArrowOutwardIcon } from "@/components/icons";
import BookingModal from "@/components/BookingModal";

export default function BookCta() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={styles.pill} onClick={() => setOpen(true)}>
        Book a visit <ArrowOutwardIcon size={18} />
      </button>
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
