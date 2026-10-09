import type { Faq } from "@/lib/structuredData";

// Shared by the /services FAQ section, its FAQPage structured data and llms.txt.
export const SERVICE_FAQS: Faq[] = [
  {
    q: "Do I need an appointment for a sick visit?",
    a: "No. We hold same-day slots at every office for acute illness, and you can claim one online or by phone. Walk-ins are seen as capacity allows.",
  },
  {
    q: "Which insurance plans do you accept?",
    a: "Most Los Angeles HMO and IPA plans. We verify your benefits before the visit so there are no surprises at check-in.",
  },
  {
    q: "Can a chronic condition be managed by telehealth?",
    a: "Follow-ups, medication reviews and symptom checks work well by video. We will bring you in when an exam, labs or a device check is needed.",
  },
  {
    q: "What should I bring to a first visit?",
    a: "Photo ID, your insurance card, a list of current medications, and any records or immunization history from a previous clinic.",
  },
  {
    q: "Do my records follow me between offices?",
    a: "Yes. One chart is live at whichever of our offices you walk into, so any of our clinicians can pick up where the last visit left off.",
  },
  {
    q: "How do I refill a prescription?",
    a: "Ask your pharmacy to send the request to us and it lands straight in your chart, which is faster than calling. Controlled medications need a visit before a refill, so book one rather than writing in.",
  },
  {
    q: "Can you refer me to see a specialist?",
    a: "Yes, and where the specialist sits inside our partner network your chart travels with the referral, so the first appointment is not spent repeating your history. If your plan needs authorization we start that for you.",
  },
  {
    q: "Do you see adults, or only children?",
    a: "Both. We are a family practice: newborns through to seniors, with the same chart following each person. Plenty of our families book a parent and a child back to back.",
  },
  {
    q: "How do I transfer records from a previous clinic?",
    a: "Email contact@sgmdoctor.com with the practice name and we will send you a release to sign. Most transfers land within five business days, and we will chase if they do not.",
  },
];
