import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ServicesFaq from "./ServicesFaq";

describe("ServicesFaq", () => {
  it("renders the heading, kicker, and all nine questions", () => {
    render(<ServicesFaq />);
    expect(screen.getByRole("heading", { name: "Before you book" })).toBeInTheDocument();
    expect(screen.getByText("Common questions")).toBeInTheDocument();
    expect(screen.getByText("Do I need an appointment for a sick visit?")).toBeInTheDocument();
    expect(screen.getByText("Do my records follow me between offices?")).toBeInTheDocument();
    expect(screen.getByText("How do I refill a prescription?")).toBeInTheDocument();
    expect(screen.getByText("Can you refer me to see a specialist?")).toBeInTheDocument();
    expect(screen.getByText("Do you see adults, or only children?")).toBeInTheDocument();
    expect(
      screen.getByText("How do I transfer records from a previous clinic?"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(9);
  });

  it("opens the first answer by default and collapses it on click", async () => {
    const user = userEvent.setup();
    render(<ServicesFaq />);
    const firstToggle = screen.getByRole("button", {
      name: "Do I need an appointment for a sick visit?",
    });
    expect(firstToggle).toHaveAttribute("aria-expanded", "true");

    await user.click(firstToggle);
    expect(firstToggle).toHaveAttribute("aria-expanded", "false");
  });
});
