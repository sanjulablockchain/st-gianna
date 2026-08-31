import PageHero from "./PageHero";

const STATS = [
  { n: "9", l: "Organizations" },
  { n: "25+", l: "Clinics in Greater LA" },
  { n: "2", l: "Countries" },
];

export default function PartnersHero() {
  return (
    <PageHero
      breadcrumb="Partners"
      headline="One"
      italic="network."
      subcopy="You feel one clinic. Behind it stands a network of sister companies and trusted partners covering family practice, pediatric therapy, hospital care in Sri Lanka, insurance, and the business support that keeps the lights on. When your care needs to travel beyond our three offices, it travels inside this network rather than starting over somewhere cold."
      stats={STATS}
      image="/images/partners-network.jpg"
      imageAlt=""
    />
  );
}
