import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import GooFilter from "@/components/GooFilter";
import JsonLd from "@/components/JsonLd";
import { organizationJsonLd } from "@/lib/structuredData";
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Pediatric and Family Care in Los Angeles`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "pediatrician Los Angeles",
    "family doctor Los Angeles",
    "pediatric clinic Hollywood",
    "pediatrician Santa Monica",
    "pediatrician La Mirada",
    "same day sick visit",
    "well child check",
    "childhood immunizations",
    "pediatric telehealth",
    "after hours pediatric care",
  ],
  category: "health",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    title: `${SITE_NAME} | Pediatric and Family Care in Los Angeles`,
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Pediatric and Family Care in Los Angeles`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

const THEME_BOOTSTRAP_SCRIPT = `
(function () {
  // Marks the document as JS-capable before first paint. Scroll-reveal CSS
  // hides sections only under html.js, so the page stays fully visible if
  // JS is disabled or fails to execute.
  document.documentElement.classList.add("js");
  try {
    var stored = localStorage.getItem("sgm-theme");
    document.documentElement.dataset.theme = stored === "light" ? "light" : "dark";
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={hankenGrotesk.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body style={{ fontFamily: "var(--font-hanken-grotesk), system-ui, sans-serif" }}>
        <JsonLd data={organizationJsonLd()} />
        <GooFilter />
        {children}
      </body>
    </html>
  );
}
