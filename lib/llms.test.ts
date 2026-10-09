import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "./llms";
import { OFFICES, SITE_NAME } from "./site";
import { SERVICE_FAQS } from "@/components/services/faqs";

describe("llms.txt", () => {
  const text = buildLlmsTxt();

  it("opens with the site name and a summary", () => {
    expect(text.startsWith(`# ${SITE_NAME}\n\n> `)).toBe(true);
  });

  it("lists every office with phone and hours", () => {
    for (const office of OFFICES) {
      expect(text).toContain(office.phone);
      expect(text).toContain(office.hoursLabel);
    }
  });

  it("includes the common questions", () => {
    expect(text).toContain(`### ${SERVICE_FAQS[0].q}`);
  });
});
