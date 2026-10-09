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
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Call, book online, email, or send us a message. Addresses, phone numbers, and opening hours for our Hollywood, Santa Monica, and La Mirada offices.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
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
