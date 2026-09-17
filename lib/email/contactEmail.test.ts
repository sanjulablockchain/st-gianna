import { describe, expect, it } from "vitest";
import { renderContactEmail } from "./contactEmail";

const SUBMISSION = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "310-555-0142",
  office: "Santa Monica",
  topic: "Billing",
  message: "I have a question about a statement.",
  consent: true,
};

describe("renderContactEmail", () => {
  it("names the topic and sender in the subject so the inbox is scannable", () => {
    expect(renderContactEmail(SUBMISSION).subject).toBe(
      "St. Gianna: Billing enquiry from Ada Lovelace",
    );
  });

  it("puts every submitted field in the HTML body", () => {
    const { html } = renderContactEmail(SUBMISSION);

    expect(html).toContain("Ada Lovelace");
    expect(html).toContain("ada@example.com");
    expect(html).toContain("310-555-0142");
    expect(html).toContain("Santa Monica");
    expect(html).toContain("Billing");
    expect(html).toContain("I have a question about a statement.");
  });

  it("says so plainly when no phone number was given", () => {
    const { html } = renderContactEmail({ ...SUBMISSION, phone: "" });

    expect(html).toContain("Not given");
  });

  // The body is built by concatenation, so anything a stranger types must be
  // escaped or they choose the markup in an email we open.
  it("escapes HTML in submitted values", () => {
    const { html } = renderContactEmail({
      ...SUBMISSION,
      name: '<img src=x onerror="alert(1)">',
      message: "5 < 6 & 7 > 2",
    });

    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;img src=x");
    expect(html).toContain("5 &lt; 6 &amp; 7 &gt; 2");
  });

  it("escapes HTML in the subject too", () => {
    const { subject } = renderContactEmail({ ...SUBMISSION, name: "<b>Ada</b>" });

    expect(subject).toBe("St. Gianna: Billing enquiry from <b>Ada</b>");
  });

  it("keeps the shape of a multi-line message", () => {
    const { html } = renderContactEmail({ ...SUBMISSION, message: "First line\nSecond line" });

    expect(html).toContain("First line<br />Second line");
  });

  it("carries the site's dark palette so the email looks like the site", () => {
    const { html } = renderContactEmail(SUBMISSION);

    expect(html).toContain("#06161C");
    expect(html).toContain("#0FA3A3");
  });

  it("offers a plain-text alternative with no markup in it", () => {
    const { text } = renderContactEmail(SUBMISSION);

    expect(text).toContain("Ada Lovelace");
    expect(text).toContain("I have a question about a statement.");
    expect(text).not.toMatch(/<[a-z]/i);
  });

  it("leaves plain text unescaped so the reader sees what was typed", () => {
    const { text } = renderContactEmail({ ...SUBMISSION, message: "5 < 6 & 7" });

    expect(text).toContain("5 < 6 & 7");
  });

  it("uses the sender's address as the reply-to so replying reaches them", () => {
    expect(renderContactEmail(SUBMISSION).replyTo).toBe("ada@example.com");
  });

  it("writes no dashes of its own into anything the reader sees", () => {
    const { subject, html, text } = renderContactEmail(SUBMISSION);
    // Strip what the submitter typed and what HTML needs, then nothing
    // dash-like should be left in the wording we wrote.
    const ours = [subject, text, html.replace(/<[^>]*>/g, " ")]
      .join(" ")
      .replaceAll("310-555-0142", "")
      .replaceAll("Ada Lovelace", "");

    expect(ours).not.toMatch(/[—–]/);
    expect(ours).not.toMatch(/(^|\s)-{1,}(\s|$)/);
  });
});
