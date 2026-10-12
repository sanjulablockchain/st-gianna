"use client";

import { useRef, useState } from "react";
import styles from "./CareersForm.module.css";
import Select from "./Select";
import {
  APPLICATION_HOURS,
  APPLICATION_OFFICES,
  APPLICATION_ROLES,
  APPLICATION_START,
  NOTE_MAX,
  validateApplication,
  type ApplicationErrors,
  type ApplicationSubmission,
} from "@/lib/careersValidation";
import { SITE_EMAIL } from "@/lib/site";

const EMPTY: ApplicationSubmission = {
  name: "",
  email: "",
  phone: "",
  role: "",
  office: APPLICATION_OFFICES[0],
  hours: "",
  start: "",
  languages: "",
  note: "",
  consent: false,
};

type Status = "idle" | "sending" | "sent";

const GENERIC_FAILURE = `We could not send that just now. Please email your CV to ${SITE_EMAIL} instead.`;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CareersForm() {
  const [values, setValues] = useState<ApplicationSubmission>(EMPTY);
  const [cv, setCv] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  // Hidden from people, so anything in it came from a bot filling every input.
  const [company, setCompany] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const sending = status === "sending";

  function set<K extends keyof ApplicationSubmission>(key: K, value: ApplicationSubmission[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    // Editing a field clears its message; submit checks everything again.
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  }

  function chooseFile(file: File | null) {
    setCv(file);
    // Check the new file straight away rather than waiting for submit.
    const found = validateApplication(values, file ? { name: file.name, size: file.size } : null);
    setErrors((current) => ({ ...current, cv: file ? found.cv : undefined }));
  }

  function removeFile() {
    setCv(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const found = validateApplication(values, cv ? { name: cv.name, size: cv.size } : null);
    setErrors(found);
    setFailure("");
    if (Object.keys(found).length > 0 || !cv) return;

    const body = new FormData();
    for (const [key, value] of Object.entries(values)) body.set(key, String(value));
    body.set("cv", cv);
    body.set("company", company);

    setStatus("sending");
    try {
      // No content-type header: the browser sets the multipart boundary itself.
      const response = await fetch("/api/careers", { method: "POST", body });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (result?.errors) setErrors(result.errors as ApplicationErrors);
        setFailure(
          typeof result?.error === "string"
            ? result.error
            : result?.errors
              ? "Please check the highlighted fields."
              : GENERIC_FAILURE,
        );
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
    removeFile();
    setErrors({});
    setFailure("");
    setCompany("");
    setStatus("idle");
  }

  const describedBy = (field: keyof ApplicationErrors, hint?: string) =>
    [hint, errors[field] ? `careers-${field}-error` : undefined].filter(Boolean).join(" ") ||
    undefined;

  const errorText = (field: keyof ApplicationErrors) =>
    errors[field] ? (
      <p className={styles.error} id={`careers-${field}-error`} role="alert">
        {errors[field]}
      </p>
    ) : null;

  if (status === "sent") {
    return (
      <div className={styles.success}>
        <h3 className={styles.successHeading}>Thank you, your application is with us.</h3>
        <p className={styles.successBody}>
          The practice team reads every application. If there is a fit, someone will be in touch
          by phone or email. If there is no opening right now, we keep strong applications on
          file and reach out when one comes up.
        </p>
        <button type="button" className={styles.reset} onClick={reset}>
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="careers-name">
          Full name
        </label>
        <input
          id="careers-name"
          autoComplete="name"
          className={`${styles.input} ${errors.name ? styles.invalid : ""}`}
          value={values.name}
          onChange={(event) => set("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("name")}
        />
        {errorText("name")}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="careers-email">
            Email address
          </label>
          <input
            id="careers-email"
            type="email"
            autoComplete="email"
            className={`${styles.input} ${errors.email ? styles.invalid : ""}`}
            value={values.email}
            onChange={(event) => set("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
          />
          {errorText("email")}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="careers-phone">
            Phone number
          </label>
          <input
            id="careers-phone"
            type="tel"
            autoComplete="tel"
            className={`${styles.input} ${errors.phone ? styles.invalid : ""}`}
            value={values.phone}
            onChange={(event) => set("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
          />
          {errorText("phone")}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} id="careers-role-label" htmlFor="careers-role">
            Role
          </label>
          <Select
            id="careers-role"
            labelId="careers-role-label"
            value={values.role}
            options={APPLICATION_ROLES}
            placeholder="Choose a role"
            onChange={(role) => set("role", role)}
            invalid={Boolean(errors.role)}
            describedBy={describedBy("role")}
          />
          {errorText("role")}
        </div>

        <div className={styles.field}>
          <label className={styles.label} id="careers-office-label" htmlFor="careers-office">
            Preferred office
          </label>
          <Select
            id="careers-office"
            labelId="careers-office-label"
            value={values.office}
            options={APPLICATION_OFFICES}
            onChange={(office) => set("office", office)}
            invalid={Boolean(errors.office)}
            describedBy={describedBy("office")}
          />
          {errorText("office")}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} id="careers-hours-label" htmlFor="careers-hours">
            Hours
          </label>
          <Select
            id="careers-hours"
            labelId="careers-hours-label"
            value={values.hours}
            options={APPLICATION_HOURS}
            placeholder="Choose hours"
            onChange={(hours) => set("hours", hours)}
            invalid={Boolean(errors.hours)}
            describedBy={describedBy("hours")}
          />
          {errorText("hours")}
        </div>

        <div className={styles.field}>
          <label className={styles.label} id="careers-start-label" htmlFor="careers-start">
            Available to start
          </label>
          <Select
            id="careers-start"
            labelId="careers-start-label"
            value={values.start}
            options={APPLICATION_START}
            placeholder="Choose a start"
            onChange={(start) => set("start", start)}
            invalid={Boolean(errors.start)}
            describedBy={describedBy("start")}
          />
          {errorText("start")}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="careers-languages">
          Languages besides English (optional)
        </label>
        <input
          id="careers-languages"
          className={`${styles.input} ${errors.languages ? styles.invalid : ""}`}
          value={values.languages}
          placeholder="For example, Spanish"
          onChange={(event) => set("languages", event.target.value)}
          aria-invalid={Boolean(errors.languages)}
          aria-describedby={describedBy("languages")}
        />
        {errorText("languages")}
      </div>

      <div className={styles.field}>
        <span className={styles.label} id="careers-cv-label">
          Your CV
        </span>
        {cv ? (
          <div className={`${styles.fileCard} ${errors.cv ? styles.invalid : ""}`}>
            <span className={styles.fileIcon} aria-hidden="true">
              {cv.name.split(".").pop()?.toUpperCase().slice(0, 4)}
            </span>
            <span className={styles.fileMeta}>
              <span className={styles.fileName}>{cv.name}</span>
              <span className={styles.fileSize}>{formatSize(cv.size)}</span>
            </span>
            <button type="button" className={styles.fileRemove} onClick={removeFile}>
              Remove
            </button>
          </div>
        ) : null}
        <label
          htmlFor="careers-cv"
          className={`${styles.dropzone} ${dragging ? styles.dragging : ""} ${
            errors.cv && !cv ? styles.invalid : ""
          } ${cv ? styles.dropzoneCompact : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            chooseFile(event.dataTransfer.files?.[0] ?? null);
          }}
        >
          <span className={styles.dropTitle}>
            {cv ? "Choose a different file" : "Drop your CV here, or click to browse"}
          </span>
          {cv ? null : <span className={styles.dropHint}>PDF or Word document, up to 5 MB</span>}
        </label>
        <input
          ref={fileRef}
          id="careers-cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className={styles.fileInput}
          onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
          aria-labelledby="careers-cv-label"
          aria-invalid={Boolean(errors.cv)}
          aria-describedby={describedBy("cv", "careers-cv-hint")}
        />
        <span id="careers-cv-hint" className={styles.srOnly}>
          PDF or Word document, up to 5 MB
        </span>
        {errorText("cv")}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="careers-note">
          A note to the team (optional)
        </label>
        <textarea
          id="careers-note"
          className={`${styles.textarea} ${errors.note ? styles.invalid : ""}`}
          value={values.note}
          maxLength={NOTE_MAX}
          placeholder="Why family medicine, and why us? A few lines is plenty."
          onChange={(event) => set("note", event.target.value)}
          aria-invalid={Boolean(errors.note)}
          aria-describedby={describedBy("note", "careers-note-count")}
        />
        <span id="careers-note-count" className={styles.counter}>
          {values.note.length} of {NOTE_MAX} characters
        </span>
        {errorText("note")}
      </div>

      <div className={styles.field}>
        <div className={styles.consentRow}>
          <input
            id="careers-consent"
            type="checkbox"
            className={styles.checkbox}
            checked={values.consent}
            onChange={(event) => set("consent", event.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent")}
          />
          <label className={styles.consentLabel} htmlFor="careers-consent">
            St. Gianna Medical Group may use these details and my CV to consider me for roles and
            to contact me.
          </label>
        </div>
        {errorText("consent")}
      </div>

      {/* Off-screen rather than display:none, which some bots skip. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="careers-company">Company</label>
        <input
          id="careers-company"
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
        {sending ? "Sending…" : "Send application"}
      </button>
    </form>
  );
}
