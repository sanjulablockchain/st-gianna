import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import TipsIndex from "./TipsIndex";
import { TIP_TOPICS } from "@/components/tips/tips";

describe("TipsIndex", () => {
  it("links to every topic anchor", () => {
    render(<TipsIndex />);
    const nav = screen.getByRole("navigation", { name: "Medical tip topics" });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(TIP_TOPICS.length);
    expect(links[0]).toHaveAttribute("href", `#${TIP_TOPICS[0].id}`);
  });

  it("says the tips are not a diagnosis", () => {
    render(<TipsIndex />);
    expect(screen.getByText(/not a diagnosis/i)).toBeInTheDocument();
  });
});
