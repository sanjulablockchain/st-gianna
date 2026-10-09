import { ARTICLES } from "@/components/journal/articles";
import { SERVICE_FAQS } from "@/components/services/faqs";
import {
  BOOKING_URL,
  OFFICES,
  PAGES,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_NAME,
  absoluteUrl,
  officeAddress,
} from "./site";

// llms.txt (https://llmstxt.org): a plain Markdown brief for AI answer
// engines, so they quote our hours, addresses and services accurately.
// Built from the same data as the pages, so it never drifts from the site.
export function buildLlmsTxt() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "St. Gianna Medical Group is a pediatric and family practice serving Los Angeles. One shared medical chart follows each patient across all three offices. Families can book online, by phone, or by video visit, and a clinician answers after hours.",
    "",
    "This site gives general health information, not medical advice. In an emergency, call 911.",
    "",
    "## Offices",
    "",
    ...OFFICES.map(
      (office) =>
        `- ${office.name}: ${officeAddress(office)}. Phone ${office.phone}. Open ${office.hoursLabel}.`,
    ),
    "",
    "## Contact and booking",
    "",
    `- Book online: ${BOOKING_URL}`,
    `- Email: ${SITE_EMAIL}`,
    `- Contact page: ${absoluteUrl("/contact")}`,
    "",
    "## Pages",
    "",
    ...PAGES.map((page) => `- [${page.title}](${absoluteUrl(page.path)}): ${page.summary}`),
    "",
    "## Common questions",
    "",
    ...SERVICE_FAQS.flatMap((faq) => [`### ${faq.q}`, "", faq.a, ""]),
    "## Journal",
    "",
    ...ARTICLES.map(
      (article) =>
        `- [${article.title}](${absoluteUrl(`/journal/${article.slug}`)}): ${article.excerpt}`,
    ),
    "",
  ];
  return lines.join("\n");
}
