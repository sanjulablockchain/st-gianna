import PageHero from "./PageHero";

const STATS = [
  { n: "3", l: "LA clinics" },
  { n: "24/7", l: "Booking" },
  // Bumped to 10 in the same change that grows the catalog to ten services.
  { n: "8", l: "Service lines" },
];

export default function ServicesHero() {
  return (
    <PageHero
      breadcrumb="Services"
      headline="Our"
      italic="services."
      subcopy="At St. Gianna Medical Group, we are committed to providing comprehensive, high-quality healthcare services to meet the diverse needs of our patients. Our experienced team of medical professionals utilizes the latest medical technologies and treatment protocols to ensure the best possible care."
      stats={STATS}
    />
  );
}
