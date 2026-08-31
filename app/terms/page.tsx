import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import LegalPage from "@/components/LegalPage";
import { TERMS_INTRO, TERMS_SECTIONS } from "@/components/legal/termsContent";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Terms & Conditions | St. Gianna Medical Group",
  description:
    "The terms covering use of this website, including no medical advice, emergencies, appointments, telehealth, accessibility, and governing law.",
};

// No TickerBar here on purpose: a scrolling marquee above a legal document is
// noise the reader has to work around.
export default function TermsPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <LegalPage
        title="Terms &"
        italic="conditions."
        breadcrumb="Terms & Conditions"
        intro={TERMS_INTRO}
        effectiveDate="1 September 2026"
        sections={TERMS_SECTIONS}
      />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
