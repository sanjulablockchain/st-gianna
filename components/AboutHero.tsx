import PageHero from "./PageHero";

const STATS = [
  { n: "3", l: "LA offices" },
  { n: "24/7", l: "Booking" },
  { n: "All ages", l: "Adults & children" },
];

export default function AboutHero() {
  return (
    <PageHero
      breadcrumb="About us"
      headline="Who"
      italic="are we?"
      subcopy="At St. Gianna Medical Group, we are dedicated to providing exceptional healthcare services for adults and children."
      stats={STATS}
      image="/images/why-us-band.jpg"
      imageAlt=""
    />
  );
}
