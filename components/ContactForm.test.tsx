import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/your name/i), "Marisol");
  await user.type(screen.getByLabelText(/email address/i), "marisol@example.com");
  await user.type(screen.getByLabelText(/how can we help/i), "Booking a school physical.");
  await user.click(screen.getByLabelText(/you can reply to me/i));
}

function send(user: ReturnType<typeof userEvent.setup>) {
  return user.click(screen.getByRole("button", { name: /send message/i }));
}

describe("ContactForm", () => {
  it("reports every required field on an empty submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await send(user);
    expect(screen.getByText("Tell us your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter an email address.")).toBeInTheDocument();
    expect(screen.getByText("Let us know what you need.")).toBeInTheDocument();
    expect(screen.getByText("Please confirm we can reply to you.")).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toHaveAttribute("aria-invalid", "true");
  });

  it("does not call the server when the form is invalid", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await send(user);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed email", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/your name/i), "Marisol");
    await user.type(screen.getByLabelText(/email address/i), "marisol@@example");
    await user.type(screen.getByLabelText(/how can we help/i), "Booking a physical.");
    await user.click(screen.getByLabelText(/you can reply to me/i));
    await send(user);
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("rejects a phone number that is too short", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.type(screen.getByLabelText(/phone number/i), "12345");
    await send(user);
    expect(
      screen.getByText(/phone number we can reach you on, or leave it blank/i),
    ).toBeInTheDocument();
  });

  it("accepts a blank phone number", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await send(user);
    expect(await screen.findByText(/message is with us/i)).toBeInTheDocument();
  });

  it("posts the submission to the contact endpoint", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await send(user);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toMatchObject({
      name: "Marisol",
      email: "marisol@example.com",
      message: "Booking a school physical.",
      office: "No preference",
      topic: "Appointment",
      consent: true,
    });
  });

  it("shows the success panel and hides the form once the server accepts it", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await send(user);
    expect(await screen.findByText(/message is with us/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /send message/i })).toBeNull();
  });

  it("returns to a blank form from the success panel", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await send(user);
    await user.click(await screen.findByRole("button", { name: /send another/i }));
    expect(screen.getByLabelText(/your name/i)).toHaveValue("");
  });

  it("keeps what the visitor typed when the send fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({ ok: false, error: "We could not send that just now." }),
    });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await send(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not send that just now/i);
    expect(screen.getByLabelText(/your name/i)).toHaveValue("Marisol");
  });

  it("surfaces a network failure instead of claiming the message was sent", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await send(user);

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText(/message is with us/i)).toBeNull();
  });

  it("shows field errors the server sends back", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ ok: false, errors: { email: "Enter a valid email address." } }),
    });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await send(user);

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("blocks a second submit while the first is still in flight", async () => {
    let release: (value: unknown) => void = () => {};
    fetchMock.mockReturnValue(new Promise((resolve) => (release = resolve)));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await send(user);

    expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();

    release({ ok: true, status: 200, json: async () => ({ ok: true }) });
    expect(await screen.findByText(/message is with us/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("carries a honeypot field that is hidden from people but visible to bots", async () => {
    const { container } = render(<ContactForm />);
    const honeypot = container.querySelector('input[name="company"]');

    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot?.closest("[aria-hidden='true']")).not.toBeNull();
  });
});
