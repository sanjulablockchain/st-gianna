import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CallFab from "./CallFab";

describe("CallFab", () => {
  it("starts closed", () => {
    render(<CallFab />);
    const toggle = screen.getByRole("button", { name: /call a clinic/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "call-fab-panel");
  });

  it("opens a dial link for each of the three clinics", async () => {
    const user = userEvent.setup();
    render(<CallFab />);
    await user.click(screen.getByRole("button", { name: /call a clinic/i }));

    expect(screen.getByRole("button", { name: /call a clinic/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("link", { name: /santa monica/i })).toHaveAttribute(
      "href",
      "tel:+18183084100",
    );
    expect(screen.getByRole("link", { name: /hollywood/i })).toHaveAttribute(
      "href",
      "tel:+18182757006",
    );
    expect(screen.getByRole("link", { name: /la mirada/i })).toHaveAttribute(
      "href",
      "tel:+15629419853",
    );
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("closes on a second click, on Escape, and on a click outside", async () => {
    const user = userEvent.setup();
    render(<CallFab />);
    const toggle = screen.getByRole("button", { name: /call a clinic/i });

    await user.click(toggle);
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();

    await user.click(toggle);
    await user.click(document.body);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
