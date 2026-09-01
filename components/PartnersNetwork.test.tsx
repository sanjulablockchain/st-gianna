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

  it("gives every organization a monogram mark", () => {
    render(<PartnersNetwork />);
    expect(screen.getAllByRole("img", { name: /monogram$/ })).toHaveLength(9);
    expect(screen.getByRole("img", { name: "Kids & Teens Medical Group monogram" })).toBeInTheDocument();
    expect(screen.getByText("KT")).toBeInTheDocument();
    expect(screen.getByText("BB")).toBeInTheDocument();
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
