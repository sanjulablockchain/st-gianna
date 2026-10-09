import { describe, expect, it } from "vitest";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  serializeJsonLd,
} from "./structuredData";
import { OFFICES, SITE_URL } from "./site";
import { ARTICLES } from "@/components/journal/articles";

describe("structured data", () => {
  it("describes the organization with one clinic per office", () => {
    const data = organizationJsonLd() as { "@graph": Array<Record<string, unknown>> };
    const org = data["@graph"][0];
    expect(org["@type"]).toBe("MedicalOrganization");
    const clinics = org.department as Array<Record<string, unknown>>;
    expect(clinics).toHaveLength(OFFICES.length);
    expect(clinics[0]).toMatchObject({
      "@type": "MedicalClinic",
      telephone: OFFICES[0].phoneE164,
      openingHoursSpecification: { opens: OFFICES[0].opens, closes: OFFICES[0].closes },
    });
  });

  it("builds a breadcrumb trail starting at home", () => {
    const data = breadcrumbJsonLd([{ name: "Journal", path: "/journal" }]) as {
      itemListElement: Array<Record<string, unknown>>;
    };
    expect(data.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/journal` },
    ]);
  });

  it("maps questions to an FAQPage", () => {
    const data = faqJsonLd([{ q: "Q?", a: "A." }]) as { mainEntity: unknown[] };
    expect(data.mainEntity).toEqual([
      { "@type": "Question", name: "Q?", acceptedAnswer: { "@type": "Answer", text: "A." } },
    ]);
  });

  it("describes an article with an ISO publish date", () => {
    const article = ARTICLES[0];
    expect(articleJsonLd(article)).toMatchObject({
      "@type": "BlogPosting",
      headline: article.title,
      datePublished: "2026-08-24",
      url: `${SITE_URL}/journal/${article.slug}`,
    });
  });

  it("escapes angle brackets when serializing", () => {
    const out = serializeJsonLd({ a: "<x>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out)).toEqual({ a: "<x>" });
  });
});
