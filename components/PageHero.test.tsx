import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageHero from "./PageHero";

describe("PageHero", () => {
  it("renders breadcrumb, split headline, subcopy, and stats", async () => {
    render(
      <PageHero
        breadcrumb="Partners"
        headline="One"
        italic="network."
        subcopy="A network of clinics and specialists behind every visit."
        stats={[{ n: "9", l: "Organizations" }]}
      />,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#top");
    expect(screen.getByText("/ Partners")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("One");
    expect(heading).toHaveTextContent("network.");
    expect(screen.getByText(/a network of clinics and specialists/i)).toBeInTheDocument();
    expect(await screen.findByText("9")).toBeInTheDocument();
    expect(screen.getByText("Organizations")).toBeInTheDocument();
  });

  it("omits the stat row when no stats are given", async () => {
    const { container } = render(
      <PageHero breadcrumb="Terms" headline="Terms &" italic="conditions." subcopy="The rules." />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(container.querySelectorAll("[class*='statNumber']")).toHaveLength(0);
  });

  it("renders an image layer only when an image is given", async () => {
    const { container, rerender } = render(
      <PageHero breadcrumb="A" headline="A" italic="b." subcopy="c" />,
    );
    expect(container.querySelector("img")).toBeNull();
    rerender(
      <PageHero
        breadcrumb="A"
        headline="A"
        italic="b."
        subcopy="c"
        image="/images/x.jpg"
        imageAlt="X"
      />,
    );
    expect(container.querySelector("img")).not.toBeNull();
  });
});
