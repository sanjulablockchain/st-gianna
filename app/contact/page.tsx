import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import ContactHero from "@/components/ContactHero";
import TickerBar from "@/components/TickerBar";
import ContactChannels from "@/components/ContactChannels";
import ContactForm from "@/components/ContactForm";
import ContactOffices from "@/components/ContactOffices";
import ContactNotes from "@/components/ContactNotes";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Contact | St. Gianna Medical Group",
  description:
    "Call, book online, email, or send us a message. Addresses, phone numbers, and opening hours for our Hollywood, Santa Monica, and La Mirada offices.",
};

export default function ContactPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <ContactHero />
      <TickerBar />
      <ContactChannels />
      <ContactForm />
      <ContactOffices />
      <ContactNotes />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
