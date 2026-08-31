import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import PartnersHero from "@/components/PartnersHero";
import TickerBar from "@/components/TickerBar";
import PartnersNetwork from "@/components/PartnersNetwork";
import PartnersValue from "@/components/PartnersValue";
import PartnersJoin from "@/components/PartnersJoin";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Partners | St. Gianna Medical Group",
  description:
    "The sister companies and trusted partners behind St. Gianna Medical Group, covering family practice, pediatric therapy, hospital care, insurance, and business support.",
};

export default function PartnersPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <PartnersHero />
      <TickerBar />
      <PartnersNetwork />
      <PartnersValue />
      <PartnersJoin />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
