import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/your name/i), "Marisol");
  await user.type(screen.getByLabelText(/email address/i), "marisol@example.com");
  await user.type(screen.getByLabelText(/how can we help/i), "Booking a school physical.");
  await user.click(screen.getByLabelText(/you can reply to me/i));
}

describe("ContactForm", () => {
  it("reports every required field on an empty submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText("Tell us your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter an email address.")).toBeInTheDocument();
    expect(screen.getByText("Let us know what you need.")).toBeInTheDocument();
    expect(screen.getByText("Please confirm we can reply to you.")).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toHaveAttribute("aria-invalid", "true");
  });

  it("rejects a malformed email", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/your name/i), "Marisol");
    await user.type(screen.getByLabelText(/email address/i), "marisol@@example");
    await user.type(screen.getByLabelText(/how can we help/i), "Booking a physical.");
    await user.click(screen.getByLabelText(/you can reply to me/i));
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("rejects a phone number that is too short", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.type(screen.getByLabelText(/phone number/i), "12345");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(
      screen.getByText(/phone number we can reach you on, or leave it blank/i),
    ).toBeInTheDocument();
  });

  it("accepts a blank phone number", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText(/message is with us/i)).toBeInTheDocument();
  });

  it("shows the success panel and hides the form on a valid submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText(/message is with us/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /send message/i })).toBeNull();
  });

  it("returns to a blank form from the success panel", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await user.click(screen.getByRole("button", { name: /send another/i }));
    expect(screen.getByLabelText(/your name/i)).toHaveValue("");
  });
});
