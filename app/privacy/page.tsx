import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import LegalPage from "@/components/LegalPage";
import { PRIVACY_INTRO, PRIVACY_SECTIONS } from "@/components/legal/privacyContent";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Privacy Policy | St. Gianna Medical Group",
  description:
    "What St. Gianna Medical Group collects, how it is used, how protected health information is handled under HIPAA, and the rights you can exercise.",
};

// No TickerBar here on purpose: a scrolling marquee above a legal document is
// noise the reader has to work around.
export default function PrivacyPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <LegalPage
        title="Privacy"
        italic="policy."
        breadcrumb="Privacy Policy"
        intro={PRIVACY_INTRO}
        effectiveDate="1 September 2026"
        sections={PRIVACY_SECTIONS}
      />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
