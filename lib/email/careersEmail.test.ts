import { describe, expect, it } from "vitest";
import { renderCareersEmail } from "./careersEmail";
import type { ApplicationSubmission } from "@/lib/careersValidation";

const APPLICATION: ApplicationSubmission = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "310-555-0142",
  role: "Medical assistant",
  office: "Hollywood",
  hours: "Part time",
  start: "Within a month",
  languages: "Spanish",
  note: "Line one\nLine two",
  consent: true,
};

describe("renderCareersEmail", () => {
  it("builds the subject and reply address from the application", () => {
    const email = renderCareersEmail(APPLICATION, "CV_Ada_Lovelace.pdf");
    expect(email.subject).toBe("St. Gianna careers: Medical assistant application from Ada Lovelace");
    expect(email.replyTo).toBe("ada@example.com");
  });

  it("includes every field in both the html and text parts", () => {
    const email = renderCareersEmail(APPLICATION, "CV_Ada_Lovelace.pdf");
    for (const value of ["310-555-0142", "Hollywood", "Part time", "Within a month", "Spanish", "CV_Ada_Lovelace.pdf"]) {
      expect(email.html).toContain(value);
      expect(email.text).toContain(value);
    }
    expect(email.html).toContain("Line one<br />Line two");
  });

  it("escapes anything the applicant typed", () => {
    const email = renderCareersEmail(
      { ...APPLICATION, name: "<script>alert(1)</script>", note: "<img src=x onerror=alert(1)>" },
      "CV_applicant.pdf",
    );
    expect(email.html).not.toContain("<script>");
    expect(email.html).not.toContain("<img");
    expect(email.html).toContain("&lt;script&gt;");
  });

  it("keeps line breaks in the name out of the subject header", () => {
    const email = renderCareersEmail(
      { ...APPLICATION, name: "Ada\nBcc: victim@example.com\u0000" },
      "CV_applicant.pdf",
    );
    expect(email.subject).not.toMatch(/[\r\n\u0000]/);
    expect(email.subject).toContain("from Ada Bcc: victim@example.com");
  });

  it("leaves the note block out when there is no note", () => {
    const email = renderCareersEmail({ ...APPLICATION, note: "  " }, "CV_Ada_Lovelace.pdf");
    expect(email.html).not.toContain("Note from the applicant");
    expect(email.text).not.toContain("NOTE FROM THE APPLICANT");
  });
});
