import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "./site";

type PageMetadataInput = {
  /** Short page title. The root layout template appends the site name. */
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/**
 * Per page metadata: canonical URL, Open Graph and Twitter card. Relative
 * URLs resolve against metadataBase, set once in app/layout.tsx.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt = SITE_NAME,
  type = "website",
  publishedTime,
}: PageMetadataInput): Metadata {
  const images = [{ url: image, alt: imageAlt }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      title: `${title} | ${SITE_NAME}`,
      description,
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}
