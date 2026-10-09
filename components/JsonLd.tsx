import { serializeJsonLd, type JsonLdObject } from "@/lib/structuredData";

/**
 * Renders schema.org structured data. React escapes the closing tag inside a
 * script child, and serializeJsonLd escapes every "<", so no raw HTML is ever
 * injected and dangerouslySetInnerHTML is not needed.
 */
export default function JsonLd({ data }: { data: JsonLdObject }) {
  return <script type="application/ld+json">{serializeJsonLd(data)}</script>;
}
