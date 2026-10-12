import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CareersApply from "./CareersApply";

describe("CareersApply", () => {
  it("holds the application form under the apply anchor", () => {
    const { container } = render(<CareersApply />);
    expect(container.querySelector("#apply")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/apply now/i);
    expect(screen.getByRole("button", { name: /send application/i })).toBeInTheDocument();
  });

  it("warns applicants not to send sensitive details", () => {
    render(<CareersApply />);
    expect(screen.getByRole("heading", { name: "Never send us" })).toBeInTheDocument();
    expect(screen.getByText("Your Social Security number")).toBeInTheDocument();
  });

  it("keeps email as a fallback with a prefilled subject", () => {
    render(<CareersApply />);
    const link = screen.getByRole("link", { name: "contact@sgmdoctor.com" });
    expect(link.getAttribute("href")).toMatch(/^mailto:contact@sgmdoctor\.com\?subject=Application/);
  });
});
