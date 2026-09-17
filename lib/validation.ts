/** Shared so the site validates addresses one way, not several. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const OFFICES = ["No preference", "Hollywood", "Santa Monica", "La Mirada"] as const;
export const TOPICS = [
  "Appointment",
  "Billing",
  "Medical records",
  "Careers",
  "Something else",
] as const;

export const MESSAGE_MAX = 5000;

export type ContactSubmission = {
  name: string;
  email: string;
  phone: string;
  office: string;
  topic: string;
  message: string;
  consent: boolean;
};

export type ContactErrors = Partial<Record<keyof ContactSubmission, string>>;

/**
 * Runs on both sides: the form for instant feedback, the route handler because
 * a POST can carry anything regardless of what the form allowed.
 */
export function validateContact(values: ContactSubmission): ContactErrors {
  const errors: ContactErrors = {};

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

  if (!OFFICES.includes(values.office as (typeof OFFICES)[number])) {
    errors.office = "Choose one of the listed offices.";
  }

  if (!TOPICS.includes(values.topic as (typeof TOPICS)[number])) {
    errors.topic = "Choose one of the listed topics.";
  }

  if (!values.message.trim()) {
    errors.message = "Let us know what you need.";
  } else if (values.message.length > MESSAGE_MAX) {
    errors.message = `Please keep it under ${MESSAGE_MAX} characters.`;
  }

  if (!values.consent) errors.consent = "Please confirm we can reply to you.";

  return errors;
}
