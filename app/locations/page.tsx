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
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = pageMetadata({
  title: "Locations in Hollywood, Santa Monica and La Mirada",
  description:
    "Addresses, phone numbers, opening hours and directions for St. Gianna Medical Group's three offices in Hollywood, Santa Monica and La Mirada, California.",
  path: "/locations",
});

export default function LocationsPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <JsonLd data={breadcrumbJsonLd([{ name: "Locations", path: "/locations" }])} />
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
