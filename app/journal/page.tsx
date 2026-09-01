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

export const metadata: Metadata = {
  title: "Journal | St. Gianna Medical Group",
  description:
    "Plain writing from our clinicians on preventive care, parenting, nutrition, seasonal illness, and chronic conditions.",
};

export default function JournalPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
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
