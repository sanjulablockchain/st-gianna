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
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "St. Gianna Medical Group is a pediatric and family practice caring for newborns through seniors across three Los Angeles offices, with one shared chart and a clinician who answers after hours.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <JsonLd data={breadcrumbJsonLd([{ name: "About us", path: "/about" }])} />
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
