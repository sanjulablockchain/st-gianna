import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingModal from "./BookingModal";

const HEALOW_URL =
  "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2&f=a8gDE7vnNqvjwXe2";

describe("BookingModal", () => {
  it("renders nothing when closed", () => {
    render(<BookingModal open={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the dialog when open", () => {
    render(<BookingModal open onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows a warm heading and per-option benefit copy", () => {
    render(<BookingModal open onClose={() => {}} />);
    expect(screen.getByText(/let's get you booked in/i)).toBeInTheDocument();
    expect(screen.getByText(/see real openings & pick your own time/i)).toBeInTheDocument();
    expect(screen.getByText(/talk to our front desk/i)).toBeInTheDocument();
  });

  it("links the online booking option to the healow URL", () => {
    render(<BookingModal open onClose={() => {}} />);
    expect(screen.getByRole("link", { name: /book online/i })).toHaveAttribute(
      "href",
      HEALOW_URL,
    );
  });

  it("links the phone option to the Santa Monica tel link", () => {
    render(<BookingModal open onClose={() => {}} />);
    expect(screen.getByRole("link", { name: /818-308-4100/ })).toHaveAttribute(
      "href",
      "tel:+18183084100",
    );
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<BookingModal open onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<BookingModal open onClose={onClose} />);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close on an outside click", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<BookingModal open onClose={onClose} />);

    await user.click(screen.getByTestId("booking-modal-backdrop"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close when the dialog itself is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<BookingModal open onClose={onClose} />);

    await user.click(screen.getByRole("dialog"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("moves focus to the close button when it opens", async () => {
    render(<BookingModal open onClose={() => {}} />);
    const closeButton = await screen.findByRole("button", { name: /close/i });
    await waitFor(() => expect(closeButton).toHaveFocus());
  });

  it("keeps Tab focus inside the dialog", async () => {
    const user = userEvent.setup();
    render(<BookingModal open onClose={() => {}} />);
    await screen.findByRole("dialog");

    const focusable = screen.getAllByRole("link").concat(screen.getAllByRole("button"));
    const last = focusable[focusable.length - 1];
    last.focus();

    await user.tab();

    expect(focusable).toContain(document.activeElement);
  });
});
