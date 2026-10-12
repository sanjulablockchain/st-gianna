import { EMAIL_PATTERN } from "@/lib/validation";

export const APPLICATION_ROLES = [
  "Pediatrician",
  "Family medicine physician",
  "Nurse practitioner",
  "Physician assistant",
  "Medical assistant",
  "Front office",
  "Other",
] as const;

export const APPLICATION_OFFICES = ["No preference", "Hollywood", "Santa Monica", "La Mirada"] as const;

export const APPLICATION_HOURS = ["Full time", "Part time", "Per diem", "Open to any"] as const;

export const APPLICATION_START = [
  "Immediately",
  "Within two weeks",
  "Within a month",
  "Later",
] as const;

export const NAME_MAX = 120;
export const LANGUAGES_MAX = 200;
export const NOTE_MAX = 3000;

/** 5 MB. The route also caps the whole request a little above this. */
export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_EXTENSIONS = ["pdf", "doc", "docx"] as const;
export type CvExtension = (typeof CV_EXTENSIONS)[number];

export type ApplicationSubmission = {
  name: string;
  email: string;
  phone: string;
  role: string;
  office: string;
  hours: string;
  start: string;
  languages: string;
  note: string;
  consent: boolean;
};

/** What validation needs to know about the CV, client or server side. */
export type CvMeta = { name: string; size: number } | null;

export type ApplicationErrors = Partial<Record<keyof ApplicationSubmission | "cv", string>>;

export function cvExtension(filename: string): CvExtension | null {
  const match = /\.([a-z0-9]+)$/i.exec(filename.trim());
  const ext = match?.[1].toLowerCase();
  return CV_EXTENSIONS.includes(ext as CvExtension) ? (ext as CvExtension) : null;
}

function oneOf(list: readonly string[], value: string) {
  return list.includes(value);
}

/**
 * Runs on both sides: the form for instant feedback, the route handler because
 * a POST can carry anything regardless of what the form allowed. The route
 * additionally checks the CV's bytes, which the browser cannot be trusted to.
 */
export function validateApplication(
  values: ApplicationSubmission,
  cv: CvMeta,
): ApplicationErrors {
  const errors: ApplicationErrors = {};

  if (!values.name.trim()) {
    errors.name = "Tell us your name.";
  } else if (values.name.length > NAME_MAX) {
    errors.name = `Please keep your name under ${NAME_MAX} characters.`;
  }

  if (!values.email.trim()) {
    errors.email = "Enter an email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim()) || values.email.length > 254) {
    errors.email = "Enter a valid email address.";
  }

  const digits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) {
    errors.phone = "Enter a phone number we can reach you on.";
  } else if (digits.length < 10 || digits.length > 15) {
    errors.phone = "Enter a full phone number, including the area code.";
  }

  if (!oneOf(APPLICATION_ROLES, values.role)) errors.role = "Choose the role you are applying for.";
  if (!oneOf(APPLICATION_OFFICES, values.office)) errors.office = "Choose one of the listed offices.";
  if (!oneOf(APPLICATION_HOURS, values.hours)) errors.hours = "Choose the hours you are looking for.";
  if (!oneOf(APPLICATION_START, values.start)) errors.start = "Choose when you could start.";

  if (values.languages.length > LANGUAGES_MAX) {
    errors.languages = `Please keep this under ${LANGUAGES_MAX} characters.`;
  }

  if (values.note.length > NOTE_MAX) {
    errors.note = `Please keep your note under ${NOTE_MAX} characters.`;
  }

  if (!cv) {
    errors.cv = "Attach your CV.";
  } else if (!cvExtension(cv.name)) {
    errors.cv = "Attach your CV as a PDF or Word document.";
  } else if (cv.size === 0) {
    errors.cv = "That file is empty. Please attach your CV again.";
  } else if (cv.size > CV_MAX_BYTES) {
    errors.cv = "Your CV must be 5 MB or smaller.";
  }

  if (!values.consent) errors.consent = "Please confirm we can use these details to contact you.";

  return errors;
}

/**
 * Checks the file's first bytes against what its extension claims, so a
 * renamed executable or script cannot pass as a CV. Server side only.
 */
export function cvBytesMatch(ext: CvExtension, bytes: Uint8Array): boolean {
  const starts = (signature: number[]) => signature.every((byte, i) => bytes[i] === byte);
  switch (ext) {
    case "pdf":
      // %PDF-
      return starts([0x25, 0x50, 0x44, 0x46, 0x2d]);
    case "docx":
      // A .docx is a zip archive: PK\x03\x04
      return starts([0x50, 0x4b, 0x03, 0x04]);
    case "doc":
      // Legacy Office files use the OLE compound document header.
      return starts([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
  }
}

export const CV_CONTENT_TYPES: Record<CvExtension, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** A safe attachment name built from the applicant's name, never from the upload. */
export function cvFilename(applicantName: string, ext: CvExtension): string {
  const slug = applicantName
    .normalize("NFKD")
    .replace(/[^\w\s]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .slice(0, 60);
  return `CV_${slug || "applicant"}.${ext}`;
}
