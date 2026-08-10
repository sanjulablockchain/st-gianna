import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import AboutHero from "@/components/AboutHero";
import TickerBar from "@/components/TickerBar";
import AboutCommitment from "@/components/AboutCommitment";
import AboutMission from "@/components/AboutMission";
import AboutSpecialties from "@/components/AboutSpecialties";
import AboutValues from "@/components/AboutValues";
import AboutLocations from "@/components/AboutLocations";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "About Us | St. Gianna Medical Group",
  description:
    "Dedicated to providing exceptional healthcare services for adults and children across our Los Angeles clinics.",
};

export default function AboutPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <AboutHero />
      <TickerBar />
      <AboutCommitment />
      <AboutMission />
      <AboutSpecialties />
      <AboutValues />
      <AboutLocations />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
