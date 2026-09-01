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
import BookCta from "@/components/BookCta";
import CallFab from "@/components/CallFab";

export default function HomePage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
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
      <CallFab />
    </div>
  );
}
