import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import LocationsHero from "@/components/LocationsHero";
import TickerBar from "@/components/TickerBar";
import LocationsPanels from "@/components/LocationsPanels";
import LocationsMap from "@/components/LocationsMap";
import LocationsDetails from "@/components/LocationsDetails";
import LocationsNotes from "@/components/LocationsNotes";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Locations | St. Gianna Medical Group",
  description:
    "Find St. Gianna Medical Group's three Los Angeles-area offices in Hollywood, Santa Monica, and La Mirada, with addresses, phone numbers, and directions.",
};

export default function LocationsPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <LocationsHero />
      <TickerBar />
      <LocationsPanels />
      <LocationsMap />
      <LocationsDetails />
      <LocationsNotes />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
