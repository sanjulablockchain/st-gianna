"use client";

import { useState } from "react";
import styles from "./JournalNewsletter.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/** Shared by ContactForm so the site validates addresses one way, not two. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function JournalNewsletter() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Enter an email address to subscribe.");
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    // TODO: POST the address to the mailing list provider once one is wired up.
    setDone(true);
  }

  return (
    <section
      id="subscribe"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.inner}>
        <h2 className={styles.heading}>A short note, once a month.</h2>
        <p className={styles.body}>
          One email, roughly monthly, with whatever we have written and anything seasonal worth
          knowing about. No sponsorships and no sharing your address. Unsubscribe in one click.
        </p>

        {done ? (
          <p className={styles.success}>
            You are on the list. Look out for the next one.
          </p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                className={`${styles.input} ${error ? styles.inputInvalid : ""}`}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "newsletter-email-error" : undefined}
              />
              {error ? (
                <p className={styles.error} id="newsletter-email-error" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
            <button type="submit" className={styles.button}>
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
