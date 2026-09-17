import type { ContactSubmission } from "@/lib/validation";

/**
 * The one place in the codebase where literal colours are correct: mail clients
 * do not support CSS custom properties (or external stylesheets, or most of
 * modern CSS), so the theme tokens from app/globals.css are inlined here by
 * hand. Keep these in step with the `:root` block if the palette ever moves.
 */
const C = {
  bg: "#06161C", // --bg
  panel: "#0B2229", // --bg-2
  ink: "#EAF4F3", // --ink
  inkSoft: "#C6D9D9", // --ink-2
  muted: "#9FB6B8", // --muted
  dim: "#6E8F92", // --muted-2
  accent: "#0FA3A3", // --accent
  link: "#4FC3C2", // --link
  // --line/--line-2 are rgba over the page; flattened against --bg here because
  // alpha on borders is unreliable in Outlook.
  line: "#16323A",
  lineSoft: "#123039",
} as const;

const FONT =
  "'Hanken Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string): string {
  return `
      <tr>
        <td style="padding:0 0 4px;font:600 11px/1.4 ${FONT};letter-spacing:.09em;text-transform:uppercase;color:${C.dim};">${escapeHtml(label)}</td>
      </tr>
      <tr>
        <td style="padding:0 0 20px;font:400 16px/1.5 ${FONT};color:${C.ink};">${escapeHtml(value)}</td>
      </tr>`;
}

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
  replyTo: string;
};

export function renderContactEmail(submission: ContactSubmission): RenderedEmail {
  const name = submission.name.trim();
  const email = submission.email.trim();
  const phone = submission.phone.trim() || "Not given";
  const { office, topic } = submission;
  const message = submission.message.trim();

  const subject = `St. Gianna — ${topic} enquiry from ${name}`;

  const messageHtml = escapeHtml(message).replace(/\r?\n/g, "<br />");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<!-- Shown in the inbox preview line, then hidden in the body. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(topic)} — ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${C.panel};border:1px solid ${C.line};border-radius:16px;">

        <tr>
          <td style="padding:28px 32px 0;">
            <div style="font:600 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${C.accent};">St. Gianna Medical Group</div>
            <div style="height:1px;background:${C.line};margin:18px 0 0;line-height:1px;font-size:0;">&nbsp;</div>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 32px 4px;">
            <h1 style="margin:0;font:600 26px/1.25 ${FONT};color:${C.ink};">New message from the website</h1>
            <p style="margin:10px 0 0;font:400 15px/1.6 ${FONT};color:${C.muted};">Someone filled in the contact form. Reply to this email and it goes straight back to them.</p>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${row("From", name)}
              ${row("Email", email)}
              ${row("Phone", phone)}
              ${row("Preferred office", office)}
              ${row("What it is about", topic)}
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 32px 8px;">
            <div style="font:600 11px/1.4 ${FONT};letter-spacing:.09em;text-transform:uppercase;color:${C.dim};padding-bottom:10px;">Message</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};border:1px solid ${C.lineSoft};border-radius:12px;">
              <tr>
                <td style="padding:18px 20px;font:400 16px/1.65 ${FONT};color:${C.inkSoft};">${messageHtml}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 32px 30px;">
            <a href="mailto:${encodeURIComponent(email).replace(/%40/g, "@")}?subject=${encodeURIComponent(`Re: ${topic}`)}" style="display:inline-block;background:${C.accent};color:${C.bg};font:600 15px/1 ${FONT};text-decoration:none;padding:14px 26px;border-radius:999px;">Reply to ${escapeHtml(name)}</a>
          </td>
        </tr>

        <tr>
          <td style="padding:0 32px 28px;">
            <div style="height:1px;background:${C.line};line-height:1px;font-size:0;margin-bottom:16px;">&nbsp;</div>
            <p style="margin:0;font:400 13px/1.6 ${FONT};color:${C.dim};">Sent by the contact form at <span style="color:${C.link};">sgmdoctor.com</span>. The sender confirmed we may reply. This channel is not secure, so keep clinical detail out of the thread.</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = [
    "ST. GIANNA MEDICAL GROUP",
    "New message from the website",
    "",
    `From:             ${name}`,
    `Email:            ${email}`,
    `Phone:            ${phone}`,
    `Preferred office: ${office}`,
    `About:            ${topic}`,
    "",
    "Message",
    "-------",
    message,
    "",
    "--",
    "Sent by the contact form at sgmdoctor.com. Reply to this email to reach",
    "the sender. This channel is not secure, so keep clinical detail out of it.",
  ].join("\n");

  return { subject, html, text, replyTo: email };
}
