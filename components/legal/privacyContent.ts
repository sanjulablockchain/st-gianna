import type { LegalSection } from "../LegalPage";

export const PRIVACY_INTRO =
  "This page explains what St. Gianna Medical Group collects, why we collect it, who sees it, and what you can ask us to do with it. Health information is held to a higher standard than the rest, and we treat it that way.";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    heading: "Introduction",
    paragraphs: [
      "St. Gianna Medical Group is a family medical practice with three offices in the Los Angeles area: Hollywood, Santa Monica, and La Mirada. We provide care for adults and children, and this policy covers both this website and the administrative side of the practice.",
      "It takes effect on 1 September 2026 and applies to everyone who visits this site, books an appointment through it, or contacts us using the details published here.",
    ],
  },
  {
    id: "information-we-collect",
    heading: "Information we collect",
    paragraphs: [
      "There are two kinds. The first is what you give us directly, either at the practice or through this site.",
    ],
    bullets: [
      "Name, date of birth, address, phone number, and email address",
      "Insurance carrier and member identification",
      "The reason for your visit and the clinical information recorded during care",
      "Anything you type into the contact form on this site",
      "Payment details, processed by our payment provider rather than stored by us",
    ],
  },
  {
    id: "automatic-information",
    heading: "Information collected automatically",
    paragraphs: [
      "The second kind is collected by your browser as you use the site. It is not tied to your medical record and we do not use it to identify you.",
    ],
    bullets: [
      "Browser type and version, and the device you are reading on",
      "Pages viewed and roughly how long you spent on them",
      "Approximate region, derived from your network address rather than precise location",
      "Your light or dark theme preference, stored in your own browser",
    ],
  },
  {
    id: "how-we-use-information",
    heading: "How we use your information",
    paragraphs: [
      "We use what we collect to provide and coordinate your care, to schedule and confirm appointments, to verify benefits and bill correctly, to meet our legal and regulatory obligations, and to understand which parts of this site are actually useful.",
      "We do not sell personal information. We do not use health information for advertising, and we do not build advertising profiles from anything collected here.",
    ],
  },
  {
    id: "hipaa",
    heading: "HIPAA and protected health information",
    paragraphs: [
      "Clinical information about you is protected health information under the Health Insurance Portability and Accountability Act. It is governed by the practice's Notice of Privacy Practices, which is the controlling document for anything in your medical record.",
      "This website policy covers website data. Where the two overlap, the Notice of Privacy Practices takes precedence. Ask at any front desk for a copy, or email us and we will send one.",
      "The contact form on this site is not a secure channel. Please keep clinical detail out of it and call us instead for anything medical.",
    ],
  },
  {
    id: "sharing",
    heading: "Sharing and disclosure",
    paragraphs: [
      "We share information only where it is necessary to look after you, to get paid for that care, or where the law requires it.",
    ],
    bullets: [
      "With clinicians and staff directly involved in your care",
      "With partner organizations in our network when your treatment or referral requires it",
      "With your health plan, for coverage verification, authorization, and payment",
      "With vendors under written contract, such as our scheduling and records systems, bound to protect the information",
      "Where required by law, including public health reporting and valid legal process",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies and analytics",
    paragraphs: [
      "This site stores a small amount of data in your own browser. The clearest example is your theme choice, saved under the key sgm-theme so the site does not flash the wrong colours the next time you visit.",
      "Any analytics we run are aggregate and are never joined to clinical records. We look at which pages are read, not at who read them.",
      "You can clear or block this storage in your browser settings at any time. The site continues to work, it simply forgets your theme preference.",
    ],
  },
  {
    id: "your-rights",
    heading: "Your rights",
    paragraphs: [
      "You have the right to see your records, to get a copy, to ask us to correct something that is wrong, to request an accounting of disclosures, and to ask us to restrict certain uses of your information.",
      "California residents have additional rights concerning personal information, including the right to know what is collected and to request deletion of information that is not part of a medical record we are required to keep.",
      "To exercise any of these, email contact@sgmdoctor.com or speak to any front desk. We will not treat you differently for asking.",
    ],
  },
  {
    id: "retention-security",
    heading: "Data retention and security",
    paragraphs: [
      "Medical records for adults are retained for at least seven years after the last visit. For patients who were minors, records are retained until at least one year after the patient turns eighteen, and never less than seven years.",
      "Information is encrypted in transit and at rest, and access is limited to staff who need it to do their jobs. Access is logged.",
      "No system is perfectly secure, and we will not pretend otherwise. If a breach affects your information, we will notify you as required by law.",
    ],
  },
  {
    id: "childrens-privacy",
    heading: "Children's privacy",
    paragraphs: [
      "A large share of our care is for children. Their records are handled under HIPAA, with parent or legal guardian access rights that vary by the child's age and by the type of care, as California law provides.",
      "This website is not directed at children for marketing purposes, and we do not knowingly collect information from children through it.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    paragraphs: [
      "When this policy changes we update this page and change the last-updated date at the top. Where a change materially affects how we handle your information, we will flag it clearly at the top of the page for a reasonable period.",
    ],
  },
  {
    id: "contact",
    heading: "How to reach us",
    paragraphs: [
      "Questions about this policy, or about your information, can go to contact@sgmdoctor.com. You can also call the office nearest you: Hollywood on 818-275-7006, Santa Monica on 818-308-4100, or La Mirada on 562-941-9853.",
      "Full addresses and opening hours are on our contact page.",
    ],
  },
];
