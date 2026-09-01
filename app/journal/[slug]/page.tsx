import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import ArticleView from "@/components/ArticleView";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { ARTICLES, getArticle } from "@/components/journal/articles";

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
  if (!article) return { title: "Article not found | St. Gianna Medical Group" };
  return {
    title: `${article.title} | St. Gianna Medical Group`,
    description: article.excerpt,
  };
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
      <Nav />
      <BookCta />
      <ArticleView article={article} />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
