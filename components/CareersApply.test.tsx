import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CareersApply from "./CareersApply";

describe("CareersApply", () => {
  it("links to the careers email with a prefilled subject", () => {
    render(<CareersApply />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/how to apply/i);
    const cta = screen.getByRole("link", { name: /email your cv/i });
    expect(cta.getAttribute("href")).toMatch(/^mailto:contact@sgmdoctor\.com\?subject=Application/);
  });

  it("warns applicants not to send sensitive details", () => {
    render(<CareersApply />);
    expect(screen.getByRole("heading", { name: "Never send us" })).toBeInTheDocument();
    expect(screen.getByText("Your Social Security number")).toBeInTheDocument();
  });
});
