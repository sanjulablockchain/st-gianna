// schema.org JSON-LD builders. Rendered by components/JsonLd.tsx.
// Search engines use these for rich results and local listings, and AI answer
// engines use them to quote facts (hours, addresses, phone numbers) correctly.
import {
  BOOKING_URL,
  DEFAULT_OG_IMAGE,
  LOGO_IMAGE,
  OFFICES,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  isoDate,
  type Office,
} from "./site";
import type { Article } from "@/components/journal/articles";

export type JsonLdObject = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const MEDICAL_SPECIALTIES = ["Pediatric", "PrimaryCare"];

function postalAddress(office: Office) {
  return {
    "@type": "PostalAddress",
    streetAddress: office.street,
    addressLocality: office.city,
    addressRegion: office.region,
    postalCode: office.postalCode,
    addressCountry: "US",
  };
}

export function clinicJsonLd(office: Office): JsonLdObject {
  return {
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/locations#${office.id}`,
    name: `${SITE_NAME}, ${office.name}`,
    url: absoluteUrl("/locations"),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    telephone: office.phoneE164,
    email: SITE_EMAIL,
    address: postalAddress(office),
    geo: { "@type": "GeoCoordinates", latitude: office.lat, longitude: office.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${office.lat},${office.lng}`,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: office.days,
      opens: office.opens,
      closes: office.closes,
    },
    medicalSpecialty: MEDICAL_SPECIALTIES,
    parentOrganization: { "@id": ORG_ID },
  };
}

export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalOrganization",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: absoluteUrl(LOGO_IMAGE),
        image: absoluteUrl(DEFAULT_OG_IMAGE),
        description: SITE_DESCRIPTION,
        email: SITE_EMAIL,
        telephone: OFFICES[0].phoneE164,
        medicalSpecialty: MEDICAL_SPECIALTIES,
        areaServed: { "@type": "City", name: "Los Angeles" },
        contactPoint: OFFICES.map((office) => ({
          "@type": "ContactPoint",
          contactType: "customer service",
          areaServed: "US",
          name: office.name,
          telephone: office.phoneE164,
        })),
        potentialAction: {
          "@type": "ReserveAction",
          target: BOOKING_URL,
          name: "Book an appointment",
        },
        department: OFFICES.map(clinicJsonLd),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en-US",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLdObject {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export type Faq = { q: string; a: string };

export function faqJsonLd(faqs: Faq[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function articleJsonLd(article: Article): JsonLdObject {
  const url = absoluteUrl(`/journal/${article.slug}`);
  const published = isoDate(article.date);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: article.title,
    description: article.excerpt,
    abstract: article.keyPoints.join(". "),
    articleSection: article.category,
    image: absoluteUrl(article.image),
    datePublished: published,
    dateModified: published,
    inLanguage: "en-US",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** Serialized for a <script type="application/ld+json"> child. */
export function serializeJsonLd(data: JsonLdObject) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
