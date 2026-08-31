import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactChannels from "./ContactChannels";

describe("ContactChannels", () => {
  it("renders four channels with working targets", () => {
    render(<ContactChannels />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getByRole("link", { name: /call the office/i })).toHaveAttribute(
      "href",
      "tel:+18183084100",
    );
    expect(screen.getByRole("link", { name: /email us/i })).toHaveAttribute(
      "href",
      "mailto:contact@sgmdoctor.com",
    );
    expect(
      screen.getByRole("link", { name: /book online/i }).getAttribute("href"),
    ).toContain("nexhealth.com");
    expect(screen.getByRole("link", { name: /see telehealth/i })).toHaveAttribute(
      "href",
      "/services#catalog",
    );
  });

  it("carries the after-hours notice and the emergency instruction", () => {
    render(<ContactChannels />);
    expect(screen.getByText(/24-hour assistance line/i)).toBeInTheDocument();
    expect(screen.getByText(/call 911/i)).toBeInTheDocument();
  });
});
