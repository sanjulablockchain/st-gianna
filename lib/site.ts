// Single source of truth for the facts search engines and AI answer engines
// read about the practice: name, canonical URL, offices, hours and contact.
// Metadata, the sitemap, robots, JSON-LD and llms.txt all build from this, so
// the name, address and phone stay identical everywhere they are published.

/** Canonical origin, no trailing slash. Override per environment. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sgmdoctor.com").replace(
  /\/+$/,
  "",
);

export const SITE_NAME = "St. Gianna Medical Group";

export const SITE_DESCRIPTION =
  "Pediatric and family healthcare across Los Angeles, with offices in Hollywood, Santa Monica and La Mirada. Same day sick visits, well child checks, immunizations, chronic care, telehealth and after hours support.";

export const SITE_EMAIL = "contact@sgmdoctor.com";

export const BOOKING_URL = "https://app.nexhealth.com/appt/ktdoctor";

/** 1200 x 630, used whenever a page has no image of its own. */
export const DEFAULT_OG_IMAGE = "/images/og-default.jpg";

export const LOGO_IMAGE = "/images/logo-light.png";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type Office = {
  /** Stable fragment id, used in JSON-LD @id values. */
  id: string;
  name: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  phone: string;
  /** E.164, for tel: links and structured data. */
  phoneE164: string;
  lat: number;
  lng: number;
  days: DayOfWeek[];
  opens: string;
  closes: string;
  /** Human readable hours, matching the copy on the site. */
  hoursLabel: string;
};

const WEEKDAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const OFFICES: Office[] = [
  {
    id: "hollywood",
    name: "Hollywood",
    street: "5255 W Sunset Blvd",
    city: "Los Angeles",
    region: "CA",
    postalCode: "90027",
    phone: "818-275-7006",
    phoneE164: "+18182757006",
    lat: 34.0981967,
    lng: -118.3045711,
    days: [...WEEKDAYS, "Saturday", "Sunday"],
    opens: "08:00",
    closes: "21:00",
    hoursLabel: "Monday to Sunday, 8am to 9pm",
  },
  {
    id: "santa-monica",
    name: "Santa Monica",
    street: "2221 Lincoln Blvd",
    city: "Santa Monica",
    region: "CA",
    postalCode: "90405",
    phone: "818-308-4100",
    phoneE164: "+18183084100",
    lat: 34.0097309,
    lng: -118.4803111,
    days: [...WEEKDAYS, "Saturday"],
    opens: "08:00",
    closes: "20:00",
    hoursLabel: "Monday to Saturday, 8am to 8pm",
  },
  {
    id: "la-mirada",
    name: "La Mirada",
    street: "11900 La Mirada Blvd, Ste 7",
    city: "La Mirada",
    region: "CA",
    postalCode: "90638",
    phone: "562-941-9853",
    phoneE164: "+15629419853",
    lat: 33.922361,
    lng: -118.011757,
    days: WEEKDAYS,
    opens: "09:00",
    closes: "18:00",
    hoursLabel: "Monday to Friday, 9am to 6pm",
  },
];

export function officeAddress(office: Office) {
  return `${office.street}, ${office.city}, ${office.region} ${office.postalCode}`;
}

/** Every public route, with how often it changes. Used by the sitemap and llms.txt. */
export const PAGES = [
  { path: "/", title: "Home", summary: "Overview of the practice, services and offices." },
  {
    path: "/services",
    title: "Services",
    summary:
      "Sick visits, well child checks, immunizations, chronic condition management, wound care, telehealth, accepted insurance and common questions.",
  },
  {
    path: "/locations",
    title: "Locations",
    summary: "Addresses, phone numbers, hours and directions for all three offices.",
  },
  {
    path: "/why-us",
    title: "Why us",
    summary:
      "Same day appointments, one shared chart across offices, benefits checked before the visit and a clinician on call after hours.",
  },
  {
    path: "/about",
    title: "About us",
    summary: "Mission, values and specialties of the practice.",
  },
  {
    path: "/journal",
    title: "Journal",
    summary: "Health guides from our clinicians on preventive care, parenting, nutrition and chronic care.",
  },
  {
    path: "/partners",
    title: "Partners",
    summary: "Sister companies and partners covering therapy, after hours care, hospital care and insurance.",
  },
  {
    path: "/contact",
    title: "Contact",
    summary: "Phone, email, online booking, a contact form and records requests.",
  },
  { path: "/privacy", title: "Privacy policy", summary: "How personal and health information is handled." },
  { path: "/terms", title: "Terms and conditions", summary: "Terms of use for this website." },
] as const;

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path === "/" ? "" : path.startsWith("/") ? path : `/${path}`}`;
}

/** Turns a display date such as "24 August 2026" into "2026-08-24". */
export function isoDate(display: string) {
  const parsed = new Date(`${display} 12:00 UTC`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}
