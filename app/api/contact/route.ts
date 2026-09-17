import { renderContactEmail } from "@/lib/email/contactEmail";
import { getTransport, readSmtpConfig } from "@/lib/email/transport";
import { createRateLimiter } from "@/lib/rateLimit";
import { validateContact, type ContactSubmission } from "@/lib/validation";

// Nodemailer opens a TCP socket, so this route cannot run on the edge runtime.
export const runtime = "nodejs";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  // Left-most entry is the original client; the rest are proxies.
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    payload = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Bots fill every field they find, including the one no human can see. Answer
  // as though it worked so they have nothing to learn from.
  if (asString(payload.company).trim()) {
    return Response.json({ ok: true });
  }

  const verdict = limiter.check(clientIp(request));
  if (!verdict.allowed) {
    return Response.json(
      { ok: false, error: "Too many messages from this connection. Please try again shortly." },
      { status: 429, headers: { "retry-after": String(verdict.retryAfterSeconds) } },
    );
  }

  const submission: ContactSubmission = {
    name: asString(payload.name),
    email: asString(payload.email),
    phone: asString(payload.phone),
    office: asString(payload.office),
    topic: asString(payload.topic),
    message: asString(payload.message),
    consent: payload.consent === true,
  };

  const errors = validateContact(submission);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 400 });
  }

  let config;
  try {
    config = readSmtpConfig();
  } catch (error) {
    console.error("[contact] mailbox is not configured:", error);
    return Response.json(
      { ok: false, error: "The contact form is not set up yet. Please call us instead." },
      { status: 500 },
    );
  }

  const { subject, html, text, replyTo } = renderContactEmail(submission);

  try {
    await getTransport(config).sendMail({
      // Office 365 rejects a From it does not own, so send as the SMTP account
      // and let Reply-To carry the sender.
      from: `"St. Gianna website" <${config.user}>`,
      to: config.to,
      replyTo,
      subject,
      html,
      text,
    });
  } catch (error) {
    // The SMTP reason belongs in the server log, not in a stranger's browser.
    console.error("[contact] send failed:", error);
    return Response.json(
      { ok: false, error: "We could not send that just now. Please call us instead." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
