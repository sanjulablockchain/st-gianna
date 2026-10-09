import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import JournalHero from "@/components/JournalHero";
import TickerBar from "@/components/TickerBar";
import JournalFeatured from "@/components/JournalFeatured";
import JournalGrid from "@/components/JournalGrid";
import JournalGuides from "@/components/JournalGuides";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = pageMetadata({
  title: "Journal: Family Health Guides",
  description:
    "Plain writing from our pediatricians and family clinicians on preventive care, parenting, nutrition, seasonal illness and chronic conditions.",
  path: "/journal",
});

export default function JournalPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <JsonLd data={breadcrumbJsonLd([{ name: "Journal", path: "/journal" }])} />
      <Nav />
      <BookCta />
      <JournalHero />
      <TickerBar />
      <JournalFeatured />
      <JournalGrid />
      <JournalGuides />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
