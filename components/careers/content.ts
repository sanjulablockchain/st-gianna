import type { Faq } from "@/lib/structuredData";
import { SITE_EMAIL } from "@/lib/site";

// Shared by the /careers sections and its FAQPage structured data.

export const CAREERS_SUBJECT = "Application: [role] at [office]";

export const CAREERS_MAILTO = `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(CAREERS_SUBJECT)}`;

export type CultureNote = { title: string; body: string };

export const CULTURE: CultureNote[] = [
  {
    title: "One chart, three offices",
    body: "Hollywood, Santa Monica and La Mirada share a single medical record. Whichever office you work in, the history, the plan and the last conversation are already there, so nobody spends the first five minutes of a visit reconstructing what happened elsewhere.",
  },
  {
    title: "Families, not throughput",
    body: "We see newborns through grandparents, often in the same family. That continuity is the point of the job. Visits are booked so that a clinician can actually examine, explain and answer questions, and the support team is staffed so that the clinician is not also doing the paperwork.",
  },
  {
    title: "Benefits checked before anyone arrives",
    body: "The front office verifies insurance ahead of the visit. It means fewer awkward conversations at the desk, fewer surprise bills, and a clinical team that can focus on the patient in the room rather than on the plan behind them.",
  },
  {
    title: "Same day care is a team effort",
    body: "Every office holds slots for sick visits. Making that work takes medical assistants who room patients quickly and well, a front desk that triages calls with good judgment, and clinicians who trust both. You will be part of that loop from your first week.",
  },
  {
    title: "Bilingual care is valued",
    body: "Many of our families are more comfortable in a language other than English. If you speak Spanish, Armenian, Korean, Tagalog or another language our community uses, tell us. It is a real strength here, not a box on a form.",
  },
  {
    title: "Room to grow",
    body: "A medical assistant can grow into a lead role, and someone on the front desk can grow into practice operations. We would rather promote someone who already knows our families than hire around them, and we support continuing education and certification where we can.",
  },
];

export type Role = {
  id: string;
  title: string;
  summary: string;
  titles: string[];
  day: string[];
  lookFor: string[];
};

export const ROLES: Role[] = [
  {
    id: "clinicians",
    title: "Clinicians",
    summary:
      "Pediatricians, family physicians, nurse practitioners and physician assistants who want to know their patients over years rather than minutes.",
    titles: ["Pediatrician", "Family medicine physician", "Nurse practitioner", "Physician assistant"],
    day: [
      "Same day sick visits alongside scheduled well child checks and chronic care follow ups",
      "Immunizations, developmental screening and growth tracking for children of every age",
      "Telehealth visits for medication reviews and symptom checks that do not need an exam",
      "Taking a share of the after hours phone line, with a clear escalation path",
      "Coordinating with specialists, therapists and hospital partners through one shared chart",
    ],
    lookFor: [
      "An active California license, and a DEA registration where the role prescribes",
      "Board certification or eligibility for physicians, national certification for NPs and PAs",
      "Comfort caring for children, including newborns, and ideally adults too",
      "Clear, unhurried communication with worried parents",
      "New graduates are welcome to apply; we pair you with an experienced colleague",
    ],
  },
  {
    id: "medical-assistants",
    title: "Medical assistants",
    summary:
      "The people who make a busy clinic feel calm. You room patients, take vitals, give vaccines and keep each visit moving without making anyone feel rushed.",
    titles: ["Medical assistant", "Lead medical assistant", "Back office coordinator"],
    day: [
      "Rooming patients, taking vitals, height and weight, and updating the chart before the clinician walks in",
      "Giving immunizations and keeping vaccine records and inventory accurate",
      "Point of care tests such as strep, flu and urine dips, and vision and hearing screens",
      "Preparing rooms and supplies, and keeping exam spaces clean between visits",
      "Handling refill requests and prior authorization paperwork with the clinical team",
    ],
    lookFor: [
      "Completion of a medical assistant program; CCMA, CMA or RMA certification preferred",
      "Current BLS certification, or willingness to complete it before you start",
      "Confidence with children, including the ones who do not want their shot",
      "Accuracy with vitals, injections and documentation",
      "A steady temperament on the days when the waiting room fills up",
    ],
  },
  {
    id: "front-office",
    title: "Front office",
    summary:
      "The first voice and the first face a family meets. You schedule, check in, verify insurance and solve the small problems before they become big ones.",
    titles: ["Patient services representative", "Insurance verification specialist", "Office lead"],
    day: [
      "Answering calls, booking visits and holding same day slots for the families who need them most",
      "Checking in patients, collecting copays and updating demographic and insurance details",
      "Verifying benefits and eligibility ahead of each visit",
      "Routing messages to the right clinician and following up on referrals and records requests",
      "Keeping the waiting room welcoming, organized and on time",
    ],
    lookFor: [
      "Front desk or customer facing experience; healthcare experience is a plus, not a must",
      "Familiarity with HMO and IPA plans, or the patience to learn them properly",
      "Careful handling of private information, every time",
      "Warmth on the phone and calm at the desk",
      "Bilingual candidates are especially welcome",
    ],
  },
];

export type HiringStep = { title: string; body: string };

export const HIRING_STEPS: HiringStep[] = [
  {
    title: "Apply with your CV",
    body: "Fill in the short form below and attach your CV, or email it to us with the role and office. A short note about why you want to work in family medicine helps us more than a long cover letter.",
  },
  {
    title: "A short phone call",
    body: "If there is a fit, someone from the practice calls you for about twenty minutes to talk about the role, the office, the schedule and what you are looking for.",
  },
  {
    title: "Meet the team",
    body: "You visit the office, meet the people you would work with and see a normal day. Medical assistant and front office candidates may be asked to shadow for part of a shift.",
  },
  {
    title: "Offer and references",
    body: "We check references and, for clinical roles, licenses and certifications. Then we send a written offer that sets out pay, schedule and benefits.",
  },
  {
    title: "Onboarding",
    body: "Your first weeks are paired with an experienced colleague. You learn our chart, our workflows and our families before you are expected to work independently.",
  },
];

export const CAREERS_FAQS: Faq[] = [
  {
    q: "Do I need to see an open position before applying?",
    a: "No. We hire across all three offices through the year, and we keep strong applications on file. If there is no opening for your role right now, we will tell you and reach out when there is.",
  },
  {
    q: "Which office would I work at?",
    a: "Choose your preferred office on the form. Most roles are based at one office, though some team members split their week between two, and we always talk about location before an offer.",
  },
  {
    q: "Do you hire part time or per diem?",
    a: "Yes, for some roles. Our offices are open evenings and weekends, so part time and per diem schedules are often possible. Say what you are looking for when you apply.",
  },
  {
    q: "I am a new graduate. Should I still apply?",
    a: "Yes. We hire newly certified medical assistants and newly licensed clinicians, and onboarding is built around pairing you with someone experienced.",
  },
  {
    q: "What should I leave out of my application?",
    a: "Never include your Social Security number, bank details or any patient information. We only need your CV, the role, your preferred office and how to reach you.",
  },
  {
    q: "How will I hear back?",
    a: "By email or phone, using the details on your CV. Applications are read by the practice team, not an automated system.",
  },
];
