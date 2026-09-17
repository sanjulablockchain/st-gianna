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
      // A tall portrait in a band that is wide on desktop and narrow on phones,
      // so each axis matters at a different size. Centring cropped the head off
      // at the eyes on desktop, where the crop is vertical, and pushed the face
      // half off the right edge on phones, where it is horizontal.
      imagePosition="62% 18%"
    />
  );
}
