import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PartnersNetwork from "./PartnersNetwork";

describe("PartnersNetwork", () => {
  it("renders the three network groups", () => {
    render(<PartnersNetwork />);
    expect(screen.getByText("Pediatric & family care")).toBeInTheDocument();
    expect(screen.getByText("Sri Lanka network")).toBeInTheDocument();
    expect(screen.getByText("Business & support partners")).toBeInTheDocument();
  });

  it("renders all nine organizations", () => {
    render(<PartnersNetwork />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(9);
    expect(screen.getByText("Kids & Teens Medical Group")).toBeInTheDocument();
    expect(screen.getByText("St. Joseph Hospital Negombo")).toBeInTheDocument();
    expect(screen.getByText("Blockchain BPO")).toBeInTheDocument();
  });

  it("shows a real logo for every organization", () => {
    render(<PartnersNetwork />);
    const logos = screen.getAllByRole("img", { name: /logo$/ });
    expect(logos).toHaveLength(9);
    expect(
      screen.getByRole("img", { name: "Kids & Teens Medical Group logo" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Blockchain BPO logo" })).toBeInTheDocument();
  });

  it("points each partner at its real domain", () => {
    const { container } = render(<PartnersNetwork />);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href")).sort();
    expect(hrefs).toEqual(
      [
        "/",
        "https://acig.lk",
        "https://humancompassmso.com",
        "https://pediatricafterhour.com",
        "https://www.ktdoctor.com",
        "https://www.laipt.org",
        "https://www.myblockchainbpo.com",
        "https://www.serendibhealthways.com",
        "https://www.sjhospital.lk",
      ].sort(),
    );
  });

  it("opens external partner links safely in a new tab", () => {
    render(<PartnersNetwork />);
    const link = screen.getByRole("link", { name: /LA Intensive Pediatric Therapy/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("keeps the internal link to our own site in the same tab", () => {
    render(<PartnersNetwork />);
    const ours = screen.getByRole("link", { name: /St\. Gianna Medical Group/i });
    expect(ours).toHaveAttribute("href", "/");
    expect(ours).not.toHaveAttribute("target");
  });
});
