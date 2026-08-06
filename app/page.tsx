import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TickerBar from "@/components/TickerBar";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Locations from "@/components/Locations";
import Partners from "@/components/Partners";
import JournalTeaser from "@/components/JournalTeaser";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { ArrowOutwardIcon } from "@/components/icons";

export default function HomePage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <a
        href="#book"
        style={{
          position: "fixed",
          right: "26px",
          top: "26px",
          zIndex: 90,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 24px",
          borderRadius: "999px",
          background: "var(--ink)",
          color: "var(--bg)",
          fontWeight: 800,
          fontSize: "14.5px",
          letterSpacing: "-.01em",
          boxShadow: "0 18px 40px -18px rgba(0,0,0,.9)",
        }}
      >
        Book a visit <ArrowOutwardIcon size={18} />
      </a>
      <Hero />
      <TickerBar />
      <Services />
      <WhyUs />
      <Locations />
      <Partners />
      <JournalTeaser />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
