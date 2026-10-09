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
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structuredData";
import { SERVICE_FAQS } from "@/components/services/faqs";

export const metadata: Metadata = pageMetadata({
  title: "Pediatric and Family Care Services",
  description:
    "Same day sick visits, well child checks, immunizations, chronic condition care, wound care and telehealth at our Hollywood, Santa Monica and La Mirada offices. Most Los Angeles HMO and IPA plans accepted.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <JsonLd data={breadcrumbJsonLd([{ name: "Services", path: "/services" }])} />
      <JsonLd data={faqJsonLd(SERVICE_FAQS)} />
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
