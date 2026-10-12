import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TipsEmergency from "./TipsEmergency";
import { EMERGENCY_SIGNS } from "@/components/tips/tips";
import { OFFICES } from "@/lib/site";

describe("TipsEmergency", () => {
  it("lists every emergency sign and a 911 link", () => {
    render(<TipsEmergency />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/get help now/i);
    for (const sign of EMERGENCY_SIGNS) {
      expect(screen.getByText(sign)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /call 911/i })).toHaveAttribute("href", "tel:911");
    expect(screen.getByRole("link", { name: /poison control/i })).toHaveAttribute(
      "href",
      "tel:+18002221222",
    );
  });

  it("links to every office phone", () => {
    render(<TipsEmergency />);
    for (const office of OFFICES) {
      expect(screen.getByRole("link", { name: new RegExp(office.name) })).toHaveAttribute(
        "href",
        `tel:${office.phoneE164}`,
      );
    }
  });
});
