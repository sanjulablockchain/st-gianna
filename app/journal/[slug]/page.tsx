import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import ArticleView from "@/components/ArticleView";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import JsonLd from "@/components/JsonLd";
import { ARTICLES, getArticle } from "@/components/journal/articles";
import { pageMetadata } from "@/lib/seo";
import { isoDate } from "@/lib/site";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structuredData";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found", robots: { index: false } };
  return pageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/journal/${article.slug}`,
    image: article.image,
    imageAlt: article.title,
    type: "article",
    publishedTime: isoDate(article.date),
  });
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Journal", path: "/journal" },
          { name: article.title, path: `/journal/${article.slug}` },
        ])}
      />
      <Nav />
      <BookCta />
      <ArticleView article={article} />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
