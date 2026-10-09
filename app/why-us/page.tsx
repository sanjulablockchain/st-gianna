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
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = pageMetadata({
  title: "Why Families Choose Us",
  description:
    "Same-day slots, one chart across three Los Angeles offices, benefits checked before you arrive, and a clinician who answers after hours.",
  path: "/why-us",
});

export default function WhyUsPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <JsonLd data={breadcrumbJsonLd([{ name: "Why us", path: "/why-us" }])} />
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
