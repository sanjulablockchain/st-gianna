// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn();

vi.mock("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail }) },
  createTransport: () => ({ sendMail }),
}));

const VALID = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "310-555-0142",
  office: "Santa Monica",
  topic: "Billing",
  message: "I have a question about a statement.",
  consent: true,
  company: "", // honeypot
};

let ip = 0;

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${ip}`, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
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
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/contact", () => {
  it("accepts a valid submission", async () => {
    const { POST } = await importRoute();

    const response = await POST(post(VALID));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("sends the mail to the configured inbox with the sender as reply-to", async () => {
    const { POST } = await importRoute();

    await POST(post(VALID));

    expect(sendMail).toHaveBeenCalledTimes(1);
    const envelope = sendMail.mock.calls[0][0];
    expect(envelope.to).toBe("inbox@example.com");
    expect(envelope.from).toContain("sender@example.com");
    expect(envelope.replyTo).toBe("ada@example.com");
    expect(envelope.subject).toBe("St. Gianna — Billing enquiry from Ada Lovelace");
    expect(envelope.html).toContain("I have a question about a statement.");
    expect(envelope.text).toContain("I have a question about a statement.");
  });

  it("rejects an invalid submission with per-field errors and sends nothing", async () => {
    const { POST } = await importRoute();

    const response = await POST(post({ ...VALID, email: "nope", message: "" }));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.errors.email).toBe("Enter a valid email address.");
    expect(body.errors.message).toBe("Let us know what you need.");
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("re-checks values the form constrains, because a POST need not come from the form", async () => {
    const { POST } = await importRoute();

    const response = await POST(post({ ...VALID, office: "Atlantis" }));

    expect(response.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  // Telling a bot it was caught just teaches it to fill the field correctly.
  it("looks successful but sends nothing when the honeypot is filled", async () => {
    const { POST } = await importRoute();

    const response = await POST(post({ ...VALID, company: "Acme Ltd" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rejects a body that is not JSON", async () => {
    const { POST } = await importRoute();

    const response = await POST(post("not json at all"));

    expect(response.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rate-limits repeated submissions from one address", async () => {
    const { POST } = await importRoute();
    const from = { "x-forwarded-for": "203.0.113.9" };

    for (let i = 0; i < 5; i++) {
      expect((await POST(post(VALID, from))).status).toBe(200);
    }
    const blocked = await POST(post(VALID, from));

    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(sendMail).toHaveBeenCalledTimes(5);
  });

  it("reports a send failure without leaking the SMTP error to the browser", async () => {
    const { POST } = await importRoute();
    sendMail.mockRejectedValue(new Error("535 5.7.139 Authentication unsuccessful"));

    const response = await POST(post(VALID));

    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(JSON.stringify(body)).not.toContain("535");
  });

  it("fails clearly when the mailbox is not configured", async () => {
    vi.stubEnv("SMTP_PASS", "");
    const { POST } = await importRoute();

    const response = await POST(post(VALID));

    expect(response.status).toBe(500);
    expect(sendMail).not.toHaveBeenCalled();
  });
});
