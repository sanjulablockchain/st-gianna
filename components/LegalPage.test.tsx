import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LegalPage from "./LegalPage";

const SECTIONS = [
  { id: "one", heading: "First section", paragraphs: ["Body of the first section."] },
  {
    id: "two",
    heading: "Second section",
    paragraphs: ["Body of the second section."],
    bullets: ["A listed item"],
  },
];

function renderPage() {
  return render(
    <LegalPage
      title="Privacy"
      italic="policy."
      breadcrumb="Privacy Policy"
      intro="How we handle your information."
      effectiveDate="1 September 2026"
      sections={SECTIONS}
    />,
  );
}

describe("LegalPage", () => {
  it("renders the hero, the effective date, and the intro", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/privacy/i);
    expect(screen.getByText(/Last updated 1 September 2026/i)).toBeInTheDocument();
    expect(screen.getByText("How we handle your information.")).toBeInTheDocument();
  });

  it("gives every section an anchor id and an index link", () => {
    const { container } = renderPage();
    expect(container.querySelector("#one")).not.toBeNull();
    expect(container.querySelector("#two")).not.toBeNull();
    expect(screen.getByRole("link", { name: "First section" })).toHaveAttribute("href", "#one");
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
  });

  it("renders bullets when a section has them", () => {
    renderPage();
    const bullet = screen.getByText("A listed item");
    expect(bullet).toBeInTheDocument();
    expect(bullet.tagName).toBe("LI");
  });
});
