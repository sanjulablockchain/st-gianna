import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import ServicesHero from "@/components/ServicesHero";
import TickerBar from "@/components/TickerBar";
import CorePillars from "@/components/CorePillars";
import ServiceCatalog from "@/components/ServiceCatalog";
import ServiceConditions from "@/components/ServiceConditions";
import ServicesInsurance from "@/components/ServicesInsurance";
import VisitSteps from "@/components/VisitSteps";
import ServicesFaq from "@/components/ServicesFaq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Services | St. Gianna Medical Group",
  description:
    "Sick visits, chronic condition management, preventative care and more across our Los Angeles clinics.",
};

export default function ServicesPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <ServicesHero />
      <TickerBar />
      <CorePillars />
      <ServiceCatalog />
      <ServiceConditions />
      <ServicesInsurance />
      <VisitSteps />
      <ServicesFaq />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
