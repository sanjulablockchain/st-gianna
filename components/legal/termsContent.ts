import type { LegalSection } from "../LegalPage";

export const TERMS_INTRO =
  "These terms cover your use of this website. They are not the agreement that governs your care, which is set out in the documents you sign at the practice.";

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Acceptance of these terms",
    paragraphs: [
      "By using this website you accept these terms. If you do not accept them, please do not use the site. You can still reach us by phone or in person at any of our three offices.",
      "These terms take effect on 1 September 2026 and apply to every visitor, whether or not you are a patient of the practice.",
    ],
  },
  {
    id: "use-of-site",
    heading: "Use of the site",
    paragraphs: [
      "You may use this site for your own personal, non-commercial purposes: reading about our services, finding an office, booking an appointment, and getting in touch.",
      "You may not do any of the following.",
    ],
    bullets: [
      "Scrape, harvest, or bulk-download content from the site",
      "Interfere with the site's operation or attempt to bypass its security",
      "Attempt to access another person's information or an account that is not yours",
      "Misrepresent your identity when booking or contacting us",
      "Republish site content commercially without our written permission",
    ],
  },
  {
    id: "no-medical-advice",
    heading: "No medical advice",
    paragraphs: [
      "Everything on this site, the journal included, is general information. It is not medical advice for a specific person, and it cannot account for your history, your medications, or your circumstances.",
      "Reading this site does not create a clinician and patient relationship. That begins when you are seen, in the office or by video.",
      "Never delay seeking advice, or disregard advice you have been given, because of something you read here. Ask us about your own situation. That is what we are for.",
    ],
  },
  {
    id: "emergencies",
    heading: "Emergencies",
    paragraphs: [
      "If this is an emergency, call 911 or go to your nearest emergency department. Do not use the contact form, do not email, and do not wait for a reply.",
      "Go straight to emergency care for trouble breathing, a seizure, a serious injury, uncontrolled bleeding, sudden confusion, or any fever in a baby under three months old.",
    ],
  },
  {
    id: "appointments",
    heading: "Appointments and cancellations",
    paragraphs: [
      "Booking through this site sends us a request. Your appointment is confirmed when you receive our confirmation, which is usually immediate but is not guaranteed by the act of submitting the form.",
      "Please give us at least 24 hours notice to cancel or reschedule so the slot can go to someone else. Repeated missed appointments without notice may affect future scheduling.",
      "Same-day slots are held for acute illness and are released on the morning of each day. They cannot be reserved in advance.",
    ],
  },
  {
    id: "insurance-billing",
    heading: "Insurance and billing",
    paragraphs: [
      "We verify benefits before your visit wherever we can, and we tell you what we find. Verification is a good-faith check, not a guarantee that your plan will pay.",
      "You remain responsible for copays, deductibles, coinsurance, and any amount your plan does not cover. If your coverage changes, tell us before your next visit so we can reverify.",
      "Self-pay pricing is quoted before the visit and is due at the time of service. Payment plans are available for wound care and chronic care courses.",
    ],
  },
  {
    id: "telehealth",
    heading: "Telehealth terms",
    paragraphs: [
      "Telehealth suits follow-ups, medication reviews, many rashes, mental health check-ins, and plenty of sick visits. It does not suit anything needing hands, instruments, or in-person testing.",
      "The clinician may determine during the call that you need to be seen in person, and will tell you so. A telehealth visit that converts to an in-person visit is still a visit for billing purposes.",
      "Please join from somewhere private with a working connection. Because of state licensing rules, you generally need to be physically located in California at the time of the visit.",
    ],
  },
  {
    id: "intellectual-property",
    heading: "Intellectual property",
    paragraphs: [
      "The content, branding, layout, and photography on this site belong to St. Gianna Medical Group or to our licensors.",
      "Reading, printing, and sharing pages for your own personal use is fine and encouraged. Republishing, reselling, or presenting our content as your own is not.",
    ],
  },
  {
    id: "third-party-links",
    heading: "Third-party links",
    paragraphs: [
      "Our partners page and other pages link to organizations we work with. Those sites are not ours, we do not control what they publish, and their own terms and privacy policies apply once you arrive.",
      "A link is not an endorsement of everything on the destination site.",
    ],
  },
  {
    id: "disclaimers",
    heading: "Disclaimers",
    paragraphs: [
      "This site is provided as is. We aim for accuracy and keep it current, but we do not warrant that every detail is complete or error free.",
      "Opening hours, accepted insurance plans, and available services change. Call the office to confirm anything you are relying on before you travel.",
    ],
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    paragraphs: [
      "To the fullest extent the law allows, St. Gianna Medical Group is not liable for indirect, incidental, or consequential loss arising from your use of this website.",
      "Nothing in this section limits our responsibility for the care we actually provide to you, or for anything that cannot be limited by law. Clinical responsibility is not something a website notice can sign away.",
    ],
  },
  {
    id: "accessibility",
    heading: "Accessibility",
    paragraphs: [
      "We aim to meet WCAG 2.1 Level AA. The site supports full keyboard navigation, honours your operating system's reduced-motion setting, and offers both light and dark themes for contrast comfort.",
      "If any part of this site is a barrier for you, email contact@sgmdoctor.com and tell us what happened and which page. We will reply and work with you to get the information another way while we fix it.",
    ],
  },
  {
    id: "governing-law",
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of the State of California, without regard to its conflict of law rules. Any dispute will be heard in the state or federal courts located in Los Angeles County, California.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these terms. When we do, we change the last-updated date at the top of this page. Continuing to use the site after a change means you accept the revised terms.",
    ],
  },
  {
    id: "contact",
    heading: "Contact",
    paragraphs: [
      "Questions about these terms can go to contact@sgmdoctor.com, or to any office: Hollywood on 818-275-7006, Santa Monica on 818-308-4100, La Mirada on 562-941-9853.",
    ],
  },
];
