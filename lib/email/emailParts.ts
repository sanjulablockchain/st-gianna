// Shared building blocks for the HTML emails the site sends.

/**
 * The one place in the codebase where literal colours are correct: mail clients
 * do not support CSS custom properties (or external stylesheets, or most of
 * modern CSS), so the theme tokens from app/globals.css are inlined here by
 * hand. Keep these in step with the `:root` block if the palette ever moves.
 */
export const C = {
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

export const FONT =
  "'Hanken Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/**
 * Collapses line breaks and other control characters to single spaces, for
 * any visitor text that lands in a header (subject) or a one line field. A
 * newline in a header is how header injection starts.
 */
export function oneLine(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function row(label: string, value: string): string {
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
