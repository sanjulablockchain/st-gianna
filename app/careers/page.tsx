import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import CareersHero from "@/components/CareersHero";
import TickerBar from "@/components/TickerBar";
import CareersCulture from "@/components/CareersCulture";
import CareersRoles from "@/components/CareersRoles";
import CareersProcess from "@/components/CareersProcess";
import CareersApply from "@/components/CareersApply";
import CareersFaq from "@/components/CareersFaq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structuredData";
import { CAREERS_FAQS } from "@/components/careers/content";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Join St. Gianna Medical Group. We hire pediatricians, family clinicians, nurse practitioners, medical assistants and front office staff across our Hollywood, Santa Monica and La Mirada offices.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <JsonLd data={breadcrumbJsonLd([{ name: "Careers", path: "/careers" }])} />
      <JsonLd data={faqJsonLd(CAREERS_FAQS)} />
      <Nav />
      <BookCta />
      <CareersHero />
      <TickerBar />
      <CareersCulture />
      <CareersRoles />
      <CareersProcess />
      <CareersApply />
      <CareersFaq />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
