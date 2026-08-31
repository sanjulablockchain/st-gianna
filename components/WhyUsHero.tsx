import PageHero from "./PageHero";

const STATS = [
  { n: "2 hrs", l: "Median wait for a same-day slot" },
  { n: "3", l: "Offices, one chart" },
  { n: "24/7", l: "Booking and nurse line" },
];

export default function WhyUsHero() {
  return (
    <PageHero
      breadcrumb="Why us"
      headline="Why families"
      italic="stay."
      subcopy="Plenty of clinics can treat a fever. What keeps a family with the same practice for years is everything around the visit: how fast you get in, whether anyone remembers you, and whether the billing surprises you afterwards. These are the six things we hold ourselves to."
      stats={STATS}
      image="/images/why-us-band.jpg"
      imageAlt=""
    />
  );
}
