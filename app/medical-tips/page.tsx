import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import TipsHero from "@/components/TipsHero";
import TickerBar from "@/components/TickerBar";
import TipsEmergency from "@/components/TipsEmergency";
import TipsIndex from "@/components/TipsIndex";
import TipsTopic from "@/components/TipsTopic";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import { TIP_TOPICS } from "@/components/tips/tips";

export const metadata: Metadata = pageMetadata({
  title: "Medical Tips for Families",
  description:
    "Practical guidance from a Los Angeles pediatric and family practice on fever, colds, stomach bugs, sleep, nutrition, cuts and burns, medicine safety, allergies and asthma, and when to get urgent care.",
  path: "/medical-tips",
});

export default function MedicalTipsPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <JsonLd data={breadcrumbJsonLd([{ name: "Medical tips", path: "/medical-tips" }])} />
      <Nav />
      <BookCta />
      <TipsHero />
      <TickerBar />
      <TipsEmergency />
      <TipsIndex />
      {TIP_TOPICS.map((topic, i) => (
        <TipsTopic key={topic.id} topic={topic} shaded={i % 2 === 0} />
      ))}
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
