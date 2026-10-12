import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TipsTopic from "./TipsTopic";
import { TIP_TOPICS } from "@/components/tips/tips";
import { getArticle } from "@/components/journal/articles";

const withArticle = TIP_TOPICS.find((topic) => topic.articleSlug)!;
const withoutArticle = TIP_TOPICS.find((topic) => !topic.articleSlug)!;

describe("TipsTopic", () => {
  it("renders the topic, its tips, and when to call", () => {
    const { container } = render(<TipsTopic topic={withArticle} />);
    expect(container.querySelector(`#${withArticle.id}`)).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(withArticle.title);
    for (const tip of withArticle.tips) {
      expect(screen.getByRole("heading", { level: 3, name: tip.title })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Call us if" })).toBeInTheDocument();
    expect(screen.getByText(withArticle.callUs[0])).toBeInTheDocument();
  });

  it("links to the related journal article", () => {
    render(<TipsTopic topic={withArticle} />);
    const article = getArticle(withArticle.articleSlug!)!;
    expect(screen.getByRole("link", { name: new RegExp(article.title) })).toHaveAttribute(
      "href",
      `/journal/${article.slug}`,
    );
  });

  it("omits the journal link when there is no related article", () => {
    render(<TipsTopic topic={withoutArticle} />);
    expect(screen.queryByText("Read more in the journal")).toBeNull();
  });

  it("only references journal articles that exist", () => {
    for (const topic of TIP_TOPICS) {
      if (topic.articleSlug) expect(getArticle(topic.articleSlug)).toBeDefined();
    }
  });
});
