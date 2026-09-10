import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WelcomePopup from "./WelcomePopup";

const STORAGE_KEY = "sgm-welcome-popup-seen";

describe("WelcomePopup", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("opens on mount for a first-time visitor", async () => {
    render(<WelcomePopup />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("does not open for a visitor who already dismissed it", async () => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    render(<WelcomePopup />);
    // Give any (incorrect) open effect a tick to fire before asserting absence.
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows each clinic's phone number as a dial link", async () => {
    render(<WelcomePopup />);
    await screen.findByRole("dialog");

    expect(screen.getByRole("link", { name: /818-308-4100/ })).toHaveAttribute(
      "href",
      "tel:+18183084100",
    );
    expect(screen.getByRole("link", { name: /818-275-7006/ })).toHaveAttribute(
      "href",
      "tel:+18182757006",
    );
    expect(screen.getByRole("link", { name: /562-941-9853/ })).toHaveAttribute(
      "href",
      "tel:+15629419853",
    );
  });

  it("links each clinic to Google Maps and Apple Maps", async () => {
    render(<WelcomePopup />);
    await screen.findByRole("dialog");

    const googleLink = screen.getByRole("link", { name: /santa monica.*google maps/i });
    expect(googleLink.getAttribute("href")).toContain("google.com/maps/search");
    expect(googleLink.getAttribute("href")).toContain(encodeURIComponent("Santa Monica"));

    const appleLink = screen.getByRole("link", { name: /santa monica.*apple maps/i });
    expect(appleLink.getAttribute("href")).toContain("maps.apple.com");
  });

  it("closes and remembers the dismissal when the close button is clicked", async () => {
    const user = userEvent.setup();
    render(<WelcomePopup />);
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("1");
  });

  it("does not close on Escape", async () => {
    const user = userEvent.setup();
    render(<WelcomePopup />);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("does not close on an outside click", async () => {
    const user = userEvent.setup();
    render(<WelcomePopup />);
    const dialog = await screen.findByRole("dialog");

    await user.click(dialog);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("moves focus to the close button when it opens", async () => {
    render(<WelcomePopup />);
    const closeButton = await screen.findByRole("button", { name: /close/i });
    await waitFor(() => expect(closeButton).toHaveFocus());
  });

  it("keeps Tab focus inside the dialog instead of escaping to the page", async () => {
    const user = userEvent.setup();
    render(<WelcomePopup />);
    await screen.findByRole("dialog");

    const focusable = screen.getAllByRole("link").concat(screen.getAllByRole("button"));
    const last = focusable[focusable.length - 1];
    last.focus();

    await user.tab();

    expect(focusable).toContain(document.activeElement);
  });
});
