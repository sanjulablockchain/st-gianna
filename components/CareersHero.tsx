import PageHero from "./PageHero";
import { ROLES } from "@/components/careers/content";
import { OFFICES } from "@/lib/site";

const STATS = [
  { n: String(OFFICES.length), l: "Offices hiring" },
  { n: String(ROLES.length), l: "Teams to join" },
  { n: "1", l: "Shared chart" },
];

export default function CareersHero() {
  return (
    <PageHero
      breadcrumb="Careers"
      headline="Work where"
      italic="families come back."
      subcopy="We are a pediatric and family practice with offices in Hollywood, Santa Monica and La Mirada. We hire clinicians, medical assistants and front office staff who want to know their patients by name, work in a team that has their back, and leave at the end of the day knowing the care was good."
      stats={STATS}
      image="/images/photo-hospital-hallway.jpg"
      imageAlt=""
    />
  );
}
