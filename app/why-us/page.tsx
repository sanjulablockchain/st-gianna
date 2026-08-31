import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import WhyUsHero from "@/components/WhyUsHero";
import TickerBar from "@/components/TickerBar";
import WhyUsPromise from "@/components/WhyUsPromise";
import WhyUsCompare from "@/components/WhyUsCompare";
import WhyUsNumbers from "@/components/WhyUsNumbers";
import WhyUsTestimonials from "@/components/WhyUsTestimonials";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Why us | St. Gianna Medical Group",
  description:
    "Same-day slots, one chart across three Los Angeles offices, benefits checked before you arrive, and a clinician who answers after hours.",
};

export default function WhyUsPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <WhyUsHero />
      <TickerBar />
      <WhyUsPromise />
      <WhyUsCompare />
      <WhyUsNumbers />
      <WhyUsTestimonials />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
