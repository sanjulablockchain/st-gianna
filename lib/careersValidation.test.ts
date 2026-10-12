import { describe, expect, it } from "vitest";
import {
  CV_MAX_BYTES,
  NOTE_MAX,
  cvBytesMatch,
  cvExtension,
  cvFilename,
  validateApplication,
  type ApplicationSubmission,
} from "./careersValidation";

const VALID: ApplicationSubmission = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "310-555-0142",
  role: "Medical assistant",
  office: "Hollywood",
  hours: "Part time",
  start: "Within a month",
  languages: "Spanish",
  note: "",
  consent: true,
};

const CV = { name: "cv.pdf", size: 120_000 };

describe("validateApplication", () => {
  it("accepts a complete application", () => {
    expect(validateApplication(VALID, CV)).toEqual({});
  });

  it("reports every required field when empty", () => {
    const errors = validateApplication(
      { ...VALID, name: "", email: "", phone: "", role: "", office: "", hours: "", start: "", consent: false },
      null,
    );
    expect(Object.keys(errors).sort()).toEqual(
      ["consent", "cv", "email", "hours", "name", "office", "phone", "role", "start"].sort(),
    );
  });

  it("rejects values outside the dropdown lists", () => {
    const errors = validateApplication({ ...VALID, role: "CEO", office: "Paris" }, CV);
    expect(errors.role).toBeDefined();
    expect(errors.office).toBeDefined();
  });

  it("rejects short phone numbers and overlong notes", () => {
    const errors = validateApplication({ ...VALID, phone: "555", note: "x".repeat(NOTE_MAX + 1) }, CV);
    expect(errors.phone).toBeDefined();
    expect(errors.note).toBeDefined();
  });

  it("rejects the wrong file type, empty files and oversized files", () => {
    expect(validateApplication(VALID, { name: "cv.exe", size: 10 }).cv).toMatch(/pdf or a word/i);
    expect(validateApplication(VALID, { name: "cv.pdf", size: 0 }).cv).toMatch(/empty/i);
    expect(validateApplication(VALID, { name: "cv.pdf", size: CV_MAX_BYTES + 1 }).cv).toMatch(/5 MB/);
  });
});

describe("cv helpers", () => {
  it("reads the extension case insensitively", () => {
    expect(cvExtension("Resume.PDF")).toBe("pdf");
    expect(cvExtension("resume.docx")).toBe("docx");
    expect(cvExtension("resume.pdf.exe")).toBeNull();
    expect(cvExtension("resume")).toBeNull();
  });

  it("no longer accepts legacy .doc files, which can carry macros", () => {
    expect(cvExtension("resume.doc")).toBeNull();
  });

  // A zip local file header followed by the entry names a Word package would hold.
  const zipWith = (...entries: string[]) =>
    new Uint8Array([0x50, 0x4b, 0x03, 0x04, ...new TextEncoder().encode(entries.join("\u0000"))]);

  it("matches file signatures to their extension", () => {
    const pdf = new TextEncoder().encode("%PDF-1.7 rest");
    const docx = zipWith("[Content_Types].xml", "word/document.xml", "word/styles.xml");
    expect(cvBytesMatch("pdf", pdf)).toBe(true);
    expect(cvBytesMatch("docx", docx)).toBe(true);
    expect(cvBytesMatch("pdf", docx)).toBe(false);
    expect(cvBytesMatch("docx", new TextEncoder().encode("<script>"))).toBe(false);
  });

  it("refuses a zip that is not a Word document", () => {
    expect(cvBytesMatch("docx", zipWith("payload.exe"))).toBe(false);
  });

  it("refuses Word files carrying macros or ActiveX controls", () => {
    expect(cvBytesMatch("docx", zipWith("word/document.xml", "word/vbaProject.bin"))).toBe(false);
    expect(cvBytesMatch("docx", zipWith("word/document.xml", "word/activeX/activeX1.xml"))).toBe(false);
  });

  it("builds a safe attachment name from the applicant", () => {
    expect(cvFilename("José O'Brien", "pdf")).toBe("CV_Jose_OBrien.pdf");
    expect(cvFilename("../../etc/passwd", "pdf")).toBe("CV_etcpasswd.pdf");
    expect(cvFilename("<>", "docx")).toBe("CV_applicant.docx");
  });
});
