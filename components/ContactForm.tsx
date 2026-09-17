"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  OFFICES,
  TOPICS,
  validateContact,
  type ContactErrors,
  type ContactSubmission,
} from "@/lib/validation";

const EMPTY: ContactSubmission = {
  name: "",
  email: "",
  phone: "",
  office: OFFICES[0],
  topic: TOPICS[0],
  message: "",
  consent: false,
};

type Status = "idle" | "sending" | "sent";

const GENERIC_FAILURE = "We could not send that just now. Please call 818-308-4100 instead.";

export default function ContactForm() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [values, setValues] = useState<ContactSubmission>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  // Hidden from people, so anything in it came from a bot filling every input.
  const [company, setCompany] = useState("");

  const sent = status === "sent";
  const sending = status === "sending";

  function set<K extends keyof ContactSubmission>(key: K, value: ContactSubmission[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const found = validateContact(values);
    setErrors(found);
    setFailure("");
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, company }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        // A 400 means the server disagreed field by field; show those against
        // the fields rather than as one opaque banner.
        if (body?.errors) setErrors(body.errors as ContactErrors);
        setFailure(typeof body?.error === "string" ? body.error : GENERIC_FAILURE);
        setStatus("idle");
        return;
      }

      setStatus("sent");
    } catch {
      setFailure(GENERIC_FAILURE);
      setStatus("idle");
    }
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
    setFailure("");
    setCompany("");
    setStatus("idle");
  }

  const describedBy = (field: keyof ContactErrors) =>
    errors[field] ? `contact-${field}-error` : undefined;

  return (
    <section
      id="message"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.layout}>
        <div className={styles.intro}>
          <h2 className={styles.heading}>Send us a message.</h2>
          <p className={styles.introBody}>
            Anything that is not urgent is welcome here. We read every message and reply within
            one business day.
          </p>
          <p className={styles.introNote}>
            Please keep clinical detail out of this form. It is not a secure channel, and for
            anything medical we would rather talk to you directly.
          </p>
        </div>

        {sent ? (
          <div className={styles.success}>
            <h3 className={styles.successHeading}>Your message is with us.</h3>
            <p className={styles.successBody}>
              We reply within one business day. If it cannot wait that long, call 818-308-4100
              and someone will pick up.
            </p>
            <button type="button" className={styles.reset} onClick={reset}>
              Send another message
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-name">
                Your name
              </label>
              <input
                id="contact-name"
                className={`${styles.input} ${errors.name ? styles.invalid : ""}`}
                value={values.name}
                onChange={(event) => set("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy("name")}
              />
              {errors.name ? (
                <p className={styles.error} id="contact-name-error" role="alert">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-email">
                  Email address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.invalid : ""}`}
                  value={values.email}
                  onChange={(event) => set("email", event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                />
                {errors.email ? (
                  <p className={styles.error} id="contact-email-error" role="alert">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-phone">
                  Phone number (optional)
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  className={`${styles.input} ${errors.phone ? styles.invalid : ""}`}
                  value={values.phone}
                  onChange={(event) => set("phone", event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describedBy("phone")}
                />
                {errors.phone ? (
                  <p className={styles.error} id="contact-phone-error" role="alert">
                    {errors.phone}
                  </p>
                ) : null}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-office">
                  Preferred office
                </label>
                <select
                  id="contact-office"
                  className={styles.select}
                  value={values.office}
                  onChange={(event) => set("office", event.target.value)}
                >
                  {OFFICES.map((office) => (
                    <option key={office} value={office}>
                      {office}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-topic">
                  What is this about
                </label>
                <select
                  id="contact-topic"
                  className={styles.select}
                  value={values.topic}
                  onChange={(event) => set("topic", event.target.value)}
                >
                  {TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-message">
                How can we help?
              </label>
              <textarea
                id="contact-message"
                className={`${styles.textarea} ${errors.message ? styles.invalid : ""}`}
                value={values.message}
                onChange={(event) => set("message", event.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy("message")}
              />
              {errors.message ? (
                <p className={styles.error} id="contact-message-error" role="alert">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <div className={styles.consentRow}>
                <input
                  id="contact-consent"
                  type="checkbox"
                  className={styles.checkbox}
                  checked={values.consent}
                  onChange={(event) => set("consent", event.target.checked)}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={describedBy("consent")}
                />
                <label className={styles.consentLabel} htmlFor="contact-consent">
                  You can reply to me at the address above.
                </label>
              </div>
              {errors.consent ? (
                <p className={styles.error} id="contact-consent-error" role="alert">
                  {errors.consent}
                </p>
              ) : null}
            </div>

            {/* Off-screen rather than display:none, which some bots skip. */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="contact-company">Company</label>
              <input
                id="contact-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
            </div>

            {failure ? (
              <p className={styles.failure} role="alert">
                {failure}
              </p>
            ) : null}

            <button type="submit" className={styles.button} disabled={sending}>
              {sending ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
