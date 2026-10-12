import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CareersForm from "./CareersForm";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

type User = ReturnType<typeof userEvent.setup>;

function pdf(name = "resume.pdf", size = 2048) {
  return new File([new Uint8Array(size)], name, { type: "application/pdf" });
}

async function pick(user: User, label: RegExp, option: string) {
  await user.click(screen.getByRole("combobox", { name: label }));
  await user.click(screen.getByRole("option", { name: option }));
}

async function fillValid(user: User) {
  await user.type(screen.getByLabelText(/full name/i), "Ada Lovelace");
  await user.type(screen.getByLabelText(/email address/i), "ada@example.com");
  await user.type(screen.getByLabelText(/phone number/i), "310-555-0142");
  await pick(user, /^role$/i, "Medical assistant");
  await pick(user, /preferred office/i, "Santa Monica");
  await pick(user, /^hours$/i, "Part time");
  await pick(user, /available to start/i, "Within a month");
  await user.upload(screen.getByLabelText(/your cv/i), pdf());
  await user.click(screen.getByLabelText(/may use these details/i));
}

function send(user: User) {
  return user.click(screen.getByRole("button", { name: /send application/i }));
}

describe("CareersForm", () => {
  it("uses themed dropdowns and no native select", () => {
    const { container } = render(<CareersForm />);
    expect(container.querySelector("select")).toBeNull();
    expect(screen.getAllByRole("combobox")).toHaveLength(4);
    expect(screen.getByRole("combobox", { name: /^role$/i })).toHaveTextContent("Choose a role");
  });

  it("reports every required field on an empty submit and sends nothing", async () => {
    const user = userEvent.setup();
    render(<CareersForm />);
    await send(user);
    expect(screen.getByText("Tell us your name.")).toBeInTheDocument();
    expect(screen.getByText("Choose the role you are applying for.")).toBeInTheDocument();
    expect(screen.getByText("Attach your CV.")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /^role$/i })).toHaveAttribute("aria-invalid", "true");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("clears a field's error once it is fixed", async () => {
    const user = userEvent.setup();
    render(<CareersForm />);
    await send(user);
    expect(screen.getByText("Choose the role you are applying for.")).toBeInTheDocument();
    await pick(user, /^role$/i, "Front office");
    expect(screen.queryByText("Choose the role you are applying for.")).toBeNull();
    expect(screen.getByRole("combobox", { name: /^role$/i })).not.toHaveAttribute("aria-invalid");
  });

  it("shows the chosen file and lets the applicant remove it", async () => {
    const user = userEvent.setup();
    render(<CareersForm />);
    await user.upload(screen.getByLabelText(/your cv/i), pdf("Ada CV.pdf"));
    expect(screen.getByText("Ada CV.pdf")).toBeInTheDocument();
    expect(screen.getByText("2 KB")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.queryByText("Ada CV.pdf")).toBeNull();
  });

  it("flags a file over 5 MB as soon as it is chosen", async () => {
    const user = userEvent.setup();
    render(<CareersForm />);
    await user.upload(screen.getByLabelText(/your cv/i), pdf("big.pdf", 5 * 1024 * 1024 + 1));
    expect(screen.getByText("Your CV must be 5 MB or smaller.")).toBeInTheDocument();
  });

  it("posts multipart form data with the CV to the careers endpoint", async () => {
    const user = userEvent.setup();
    render(<CareersForm />);
    await fillValid(user);
    await send(user);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/careers");
    expect(init.method).toBe("POST");
    const body = init.body as FormData;
    expect(body.get("name")).toBe("Ada Lovelace");
    expect(body.get("role")).toBe("Medical assistant");
    expect(body.get("office")).toBe("Santa Monica");
    expect(body.get("hours")).toBe("Part time");
    expect(body.get("start")).toBe("Within a month");
    expect(body.get("consent")).toBe("true");
    expect((body.get("cv") as File).name).toBe("resume.pdf");
  });

  it("shows the thank you panel once the server accepts it", async () => {
    const user = userEvent.setup();
    render(<CareersForm />);
    await fillValid(user);
    await send(user);
    expect(await screen.findByText(/your application is with us/i)).toBeInTheDocument();
  });

  it("shows server field errors against the fields", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ ok: false, errors: { cv: "That file does not look like a PDF or Word document." } }),
    });
    const user = userEvent.setup();
    render(<CareersForm />);
    await fillValid(user);
    await send(user);
    expect(
      await screen.findByText("That file does not look like a PDF or Word document."),
    ).toBeInTheDocument();
    expect(screen.getByText("Please check the highlighted fields.")).toBeInTheDocument();
  });

  it("counts characters in the note", async () => {
    const user = userEvent.setup();
    render(<CareersForm />);
    await user.type(screen.getByLabelText(/a note to the team/i), "Hello");
    expect(screen.getByText("5 of 3000 characters")).toBeInTheDocument();
  });
});
