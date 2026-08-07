import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ServicesFaq from "./ServicesFaq";

describe("ServicesFaq", () => {
  it("renders the heading, kicker, and all five questions", () => {
    render(<ServicesFaq />);
    expect(screen.getByRole("heading", { name: "Before you book" })).toBeInTheDocument();
    expect(screen.getByText("Common questions")).toBeInTheDocument();
    expect(screen.getByText("Do I need an appointment for a sick visit?")).toBeInTheDocument();
    expect(screen.getByText("Do my records follow me between offices?")).toBeInTheDocument();
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
