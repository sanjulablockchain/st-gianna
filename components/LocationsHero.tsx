import PageHero from "./PageHero";

const STATS = [
  { n: "3", l: "LA offices" },
  { n: "24/7", l: "Booking" },
  { n: "Same-day", l: "Appointments" },
];

export default function LocationsHero() {
  return (
    <PageHero
      breadcrumb="Locations"
      headline="Three"
      italic="locations."
      subcopy="We are proud to offer our exceptional healthcare services at three convenient locations. Whether you are in Hollywood, Santa Monica, or La Mirada, you can count on St. Gianna Medical Group for top-quality medical care."
      stats={STATS}
    />
  );
}
