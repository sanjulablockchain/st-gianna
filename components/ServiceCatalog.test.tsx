import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ServiceCatalog from "./ServiceCatalog";

describe("ServiceCatalog", () => {
  it("renders the heading, count kicker, and all ten service rows", () => {
    render(<ServiceCatalog />);
    expect(screen.getByRole("heading", { name: "The full list" })).toBeInTheDocument();
    expect(screen.getByText("10 services")).toBeInTheDocument();
    [
      "Same-day sick visits",
      "Chronic condition management",
      "Preventative care",
      "Well-child & physicals",
      "Immunizations",
      "Telehealth",
      "Advanced wound care",
      "Women's health",
      "Behavioral & mental health",
      "Senior & geriatric care",
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("starts with every panel closed", () => {
    render(<ServiceCatalog />);
    expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(10);
  });

  it("opens a detail panel when a row is activated", async () => {
    const user = userEvent.setup();
    const { container } = render(<ServiceCatalog />);
    const row = screen.getByRole("button", { name: /same-day sick visits/i });
    expect(row).toHaveAttribute("aria-expanded", "false");
    await user.click(row);
    expect(row).toHaveAttribute("aria-expanded", "true");

    // Panels stay mounted so the open/close height can animate, so scope the
    // content assertions to the item that is actually open.
    const open = container.querySelector('[class*="itemOpen"]') as HTMLElement;
    expect(open).not.toBeNull();
    expect(within(open).getByText("What is included")).toBeInTheDocument();
    expect(within(open).getByText("Typical visit")).toBeInTheDocument();
    expect(within(open).getByText("Conditions covered")).toBeInTheDocument();
    expect(within(open).getByText("20 minutes")).toBeInTheDocument();
    expect(within(open).getByText("Rapid strep and flu testing")).toBeInTheDocument();
  });

  it("keeps only one panel open at a time", async () => {
    const user = userEvent.setup();
    render(<ServiceCatalog />);
    const first = screen.getByRole("button", { name: /same-day sick visits/i });
    const second = screen.getByRole("button", { name: /^0?6? ?telehealth/i });
    await user.click(first);
    await user.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("closes an open panel when its row is activated again", async () => {
    const user = userEvent.setup();
    render(<ServiceCatalog />);
    const row = screen.getByRole("button", { name: /advanced wound care/i });
    await user.click(row);
    expect(row).toHaveAttribute("aria-expanded", "true");
    await user.click(row);
    expect(row).toHaveAttribute("aria-expanded", "false");
  });
});
