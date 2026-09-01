import PageHero from "./PageHero";

const STATS = [
  { n: "3", l: "Offices" },
  { n: "24 hrs", l: "Assistance line" },
  { n: "1 day", l: "Typical reply to messages" },
];

export default function ContactHero() {
  return (
    <PageHero
      breadcrumb="Contact"
      headline="Get in"
      italic="touch."
      subcopy="We are here to help with all of it: questions, appointments, billing, records, or just working out whether you need to be seen at all. Pick whichever way of reaching us suits the hour you are reading this."
      stats={STATS}
      image="/images/photo-doctor-portrait.jpg"
      imageAlt=""
    />
  );
}
