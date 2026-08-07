import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import GooFilter from "@/components/GooFilter";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "St. Gianna Medical Group",
  description:
    "Pediatric and family healthcare across Los Angeles. Same-day, telehealth, after hours.",
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
        <GooFilter />
        {children}
      </body>
    </html>
  );
}
