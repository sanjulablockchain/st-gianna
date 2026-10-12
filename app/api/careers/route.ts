import { renderCareersEmail } from "@/lib/email/careersEmail";
import { getTransport, readSmtpConfig } from "@/lib/email/transport";
import { createRateLimiter } from "@/lib/rateLimit";
import {
  CV_CONTENT_TYPES,
  CV_MAX_BYTES,
  cvBytesMatch,
  cvExtension,
  cvFilename,
  validateApplication,
  type ApplicationSubmission,
} from "@/lib/careersValidation";

// Nodemailer opens a TCP socket, so this route cannot run on the edge runtime.
export const runtime = "nodejs";

/** The CV plus generous room for the text fields and multipart framing. */
const MAX_BODY_BYTES = CV_MAX_BYTES + 256 * 1024;

const limiter = createRateLimiter({ limit: 3, windowMs: 60 * 60 * 1000 });

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  // Left-most entry is the original client; the rest are proxies.
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function field(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Reads the body but stops as soon as it passes the limit, so a client that
 * lies about (or omits) content-length still cannot make us buffer more.
 */
async function readLimited(request: Request, limit: number): Promise<Uint8Array<ArrayBuffer> | null> {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

function tooLarge() {
  return Response.json(
    { ok: false, errors: { cv: "Your CV must be 5 MB or smaller." } },
    { status: 413 },
  );
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return Response.json({ ok: false, error: "Malformed request." }, { status: 415 });
  }

  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return tooLarge();

  // Checked before the body is read, so a flood of uploads costs us nothing.
  const verdict = limiter.check(clientIp(request));
  if (!verdict.allowed) {
    return Response.json(
      { ok: false, error: "Too many applications from this connection. Please try again later." },
      { status: 429, headers: { "retry-after": String(verdict.retryAfterSeconds) } },
    );
  }

  const body = await readLimited(request, MAX_BODY_BYTES);
  if (!body) return tooLarge();

  let form: FormData;
  try {
    form = await new Response(body, { headers: { "content-type": contentType } }).formData();
  } catch {
    return Response.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Bots fill every field they find, including the one no human can see. Answer
  // as though it worked so they have nothing to learn from.
  if (field(form, "company").trim()) {
    return Response.json({ ok: true });
  }

  const submission: ApplicationSubmission = {
    name: field(form, "name"),
    email: field(form, "email"),
    phone: field(form, "phone"),
    role: field(form, "role"),
    office: field(form, "office"),
    hours: field(form, "hours"),
    start: field(form, "start"),
    languages: field(form, "languages"),
    note: field(form, "note"),
    consent: field(form, "consent") === "true",
  };

  const upload = form.get("cv");
  const cv = upload instanceof File ? upload : null;

  const errors = validateApplication(submission, cv ? { name: cv.name, size: cv.size } : null);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 400 });
  }

  // validateApplication has confirmed both of these.
  const ext = cvExtension(cv!.name)!;
  const bytes = new Uint8Array(await cv!.arrayBuffer());
  if (!cvBytesMatch(ext, bytes)) {
    return Response.json(
      { ok: false, errors: { cv: "That file does not look like a PDF or Word document." } },
      { status: 400 },
    );
  }

  let config;
  try {
    config = readSmtpConfig();
  } catch (error) {
    console.error("[careers] mailbox is not configured:", error);
    return Response.json(
      { ok: false, error: "Applications are not set up yet. Please email us your CV instead." },
      { status: 500 },
    );
  }

  const attachmentName = cvFilename(submission.name, ext);
  const { subject, html, text, replyTo } = renderCareersEmail(submission, attachmentName);

  try {
    await getTransport(config).sendMail({
      // Office 365 rejects a From it does not own, so send as the SMTP account
      // and let Reply-To carry the applicant.
      from: `"St. Gianna website" <${config.user}>`,
      to: process.env.CAREERS_TO?.trim() || config.to,
      replyTo,
      subject,
      html,
      text,
      attachments: [
        { filename: attachmentName, content: Buffer.from(bytes), contentType: CV_CONTENT_TYPES[ext] },
      ],
    });
  } catch (error) {
    // The SMTP reason belongs in the server log; the applicant's details do not.
    console.error("[careers] send failed:", error);
    return Response.json(
      { ok: false, error: "We could not send that just now. Please email us your CV instead." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
