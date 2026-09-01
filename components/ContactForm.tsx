"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { EMAIL_PATTERN } from "@/lib/validation";

const OFFICES = ["No preference", "Hollywood", "Santa Monica", "La Mirada"];
const TOPICS = ["Appointment", "Billing", "Medical records", "Careers", "Something else"];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  office: OFFICES[0],
  topic: TOPICS[0],
  message: "",
  consent: false,
};

type Values = typeof EMPTY;
type Errors = Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Tell us your name.";
  if (!values.email.trim()) {
    errors.email = "Enter an email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  // Phone is optional, but a partial number is worse than none.
  if (values.phone.trim() && values.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Enter a phone number we can reach you on, or leave it blank.";
  }
  if (!values.message.trim()) errors.message = "Let us know what you need.";
  if (!values.consent) errors.consent = "Please confirm we can reply to you.";
  return errors;
}

export default function ContactForm() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    // TODO: POST `values` to the contact endpoint once a backend or mail
    // provider is wired up. Nothing leaves the browser today.
    setSent(true);
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
    setSent(false);
  }

  const describedBy = (field: keyof Errors) =>
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

            <button type="submit" className={styles.button}>
              Send message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
