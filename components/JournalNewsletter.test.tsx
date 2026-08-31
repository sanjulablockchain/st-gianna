import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JournalNewsletter from "./JournalNewsletter";

describe("JournalNewsletter", () => {
  it("shows an error when the email is empty", async () => {
    const user = userEvent.setup();
    render(<JournalNewsletter />);
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(screen.getByText(/enter an email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("aria-invalid", "true");
  });

  it("shows an error when the email is malformed", async () => {
    const user = userEvent.setup();
    render(<JournalNewsletter />);
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
  });

  it("confirms the subscription on a valid submit", async () => {
    const user = userEvent.setup();
    render(<JournalNewsletter />);
    await user.type(screen.getByLabelText(/email/i), "parent@example.com");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(screen.getByText(/you are on the list/i)).toBeInTheDocument();
  });
});
