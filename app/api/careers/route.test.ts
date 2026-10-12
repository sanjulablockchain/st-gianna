// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn();

vi.mock("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail }) },
  createTransport: () => ({ sendMail }),
}));

const VALID: Record<string, string> = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "310-555-0142",
  role: "Medical assistant",
  office: "Hollywood",
  hours: "Part time",
  start: "Within a month",
  languages: "Spanish",
  note: "I have three years in pediatrics.",
  consent: "true",
  company: "", // honeypot
};

const PDF = new TextEncoder().encode("%PDF-1.7\n% test file\n");

function cvFile(bytes: Uint8Array<ArrayBuffer> = PDF, name = "my resume.pdf", type = "application/pdf") {
  return new File([bytes], name, { type });
}

let ip = 0;

function post(
  fields: Record<string, string> = VALID,
  cv: File | null = cvFile(),
  headers: Record<string, string> = {},
) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  if (cv) form.set("cv", cv);
  return new Request("http://localhost/api/careers", {
    method: "POST",
    headers: { origin: "http://localhost", host: "localhost", "x-forwarded-for": `10.1.0.${ip}`, ...headers },
    body: form,
  });
}

async function importRoute() {
  return import("./route");
}

beforeEach(() => {
  // A fresh IP per test so the shared module-level limiter cannot bleed across.
  ip += 1;
  sendMail.mockReset();
  sendMail.mockResolvedValue({ messageId: "<test>" });
  vi.stubEnv("SMTP_HOST", "smtp.office365.com");
  vi.stubEnv("SMTP_PORT", "587");
  vi.stubEnv("SMTP_SECURE", "false");
  vi.stubEnv("SMTP_USER", "sender@example.com");
  vi.stubEnv("SMTP_PASS", "hunter2");
  vi.stubEnv("CONTACT_TO", "inbox@example.com");
  vi.stubEnv("CAREERS_TO", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/careers", () => {
  it("accepts a valid application and emails the CV as an attachment", async () => {
    const { POST } = await importRoute();

    const response = await POST(post());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(sendMail).toHaveBeenCalledTimes(1);
    const envelope = sendMail.mock.calls[0][0];
    expect(envelope.to).toBe("inbox@example.com");
    expect(envelope.replyTo).toBe("ada@example.com");
    expect(envelope.subject).toContain("Medical assistant application from Ada Lovelace");
    expect(envelope.attachments).toHaveLength(1);
    expect(envelope.attachments[0].filename).toBe("CV_Ada_Lovelace.pdf");
    expect(envelope.attachments[0].contentType).toBe("application/pdf");
    expect(Buffer.compare(envelope.attachments[0].content, Buffer.from(PDF))).toBe(0);
  });

  it("delivers to CAREERS_TO when it is set", async () => {
    vi.stubEnv("CAREERS_TO", "hiring@example.com");
    const { POST } = await importRoute();

    await POST(post());

    expect(sendMail.mock.calls[0][0].to).toBe("hiring@example.com");
  });

  it("rejects missing fields and a missing CV with per field errors", async () => {
    const { POST } = await importRoute();

    const response = await POST(post({ ...VALID, name: "", role: "" }, null));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.errors.name).toBeDefined();
    expect(body.errors.role).toBeDefined();
    expect(body.errors.cv).toBe("Attach your CV.");
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("re-checks dropdown values, because a POST need not come from the form", async () => {
    const { POST } = await importRoute();

    const response = await POST(post({ ...VALID, office: "Atlantis", hours: "Weekends" }));

    expect(response.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rejects a disallowed extension", async () => {
    const { POST } = await importRoute();

    const response = await POST(post(VALID, cvFile(PDF, "cv.html", "text/html")));

    expect(response.status).toBe(400);
    expect((await response.json()).errors.cv).toMatch(/pdf or word/i);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rejects a file whose bytes do not match its extension", async () => {
    const { POST } = await importRoute();
    const disguised = new TextEncoder().encode("<script>alert(1)</script>");

    const response = await POST(post(VALID, cvFile(disguised, "cv.pdf")));

    expect(response.status).toBe(400);
    expect((await response.json()).errors.cv).toMatch(/does not look like/i);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rejects a CV over 5 MB", async () => {
    const { POST } = await importRoute();
    const big = new Uint8Array(5 * 1024 * 1024 + 1);
    big.set(PDF);

    const response = await POST(post(VALID, cvFile(big)));

    expect(response.status).toBe(400);
    expect((await response.json()).errors.cv).toMatch(/5 MB/);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("stops reading a body that grows past the cap", async () => {
    const { POST } = await importRoute();
    const huge = new Uint8Array(8 * 1024 * 1024);
    huge.set(PDF);

    const response = await POST(post(VALID, cvFile(huge)));

    expect(response.status).toBe(413);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("refuses a declared body far over the limit before reading it", async () => {
    const { POST } = await importRoute();

    const response = await POST(post(VALID, cvFile(), { "content-length": String(50 * 1024 * 1024) }));

    expect(response.status).toBe(413);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rejects a body that is not multipart form data", async () => {
    const { POST } = await importRoute();

    const response = await POST(
      new Request("http://localhost/api/careers", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "http://localhost", host: "localhost" },
        body: JSON.stringify(VALID),
      }),
    );

    expect(response.status).toBe(415);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("refuses applications posted from another website or with no origin", async () => {
    const { POST } = await importRoute();

    const foreign = await POST(post(VALID, cvFile(), { origin: "https://evil.example" }));
    const bare = new Request("http://localhost/api/careers", { method: "POST", body: new FormData() });

    expect(foreign.status).toBe(403);
    expect((await POST(bare)).status).toBe(403);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rate limits by the address the proxy saw, so a forged one does not help", async () => {
    const { POST } = await importRoute();
    const attempt = (forged: string) =>
      POST(post(VALID, cvFile(), { "x-forwarded-for": `${forged}, 203.0.113.88` }));

    for (let i = 0; i < 3; i++) expect((await attempt(`198.51.100.${i}`)).status).toBe(200);
    expect((await attempt("198.51.100.99")).status).toBe(429);
  });

  // Telling a bot it was caught just teaches it to fill the field correctly.
  it("looks successful but sends nothing when the honeypot is filled", async () => {
    const { POST } = await importRoute();

    const response = await POST(post({ ...VALID, company: "Acme Ltd" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rate limits repeated applications from one address", async () => {
    const { POST } = await importRoute();
    const from = { "x-forwarded-for": "203.0.113.77" };

    for (let i = 0; i < 3; i++) {
      expect((await POST(post(VALID, cvFile(), from))).status).toBe(200);
    }
    const blocked = await POST(post(VALID, cvFile(), from));

    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(sendMail).toHaveBeenCalledTimes(3);
  });

  it("reports a send failure without leaking the SMTP error or applicant details", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    const { POST } = await importRoute();
    sendMail.mockRejectedValue(new Error("535 5.7.139 Authentication unsuccessful"));

    const response = await POST(post());

    expect(response.status).toBe(502);
    expect(JSON.stringify(await response.json())).not.toContain("535");
    const logged = JSON.stringify(errorLog.mock.calls);
    expect(logged).not.toContain("ada@example.com");
    expect(logged).not.toContain("310-555-0142");
    errorLog.mockRestore();
  });

  it("fails clearly when the mailbox is not configured", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("SMTP_PASS", "");
    const { POST } = await importRoute();

    const response = await POST(post());

    expect(response.status).toBe(500);
    expect(sendMail).not.toHaveBeenCalled();
  });
});
