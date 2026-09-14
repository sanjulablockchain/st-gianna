import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookCta from "./BookCta";

describe("BookCta", () => {
  it("renders a button that opens the booking modal", async () => {
    const user = userEvent.setup();
    render(<BookCta />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /book a visit/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes the booking modal when its close button is clicked", async () => {
    const user = userEvent.setup();
    render(<BookCta />);

    await user.click(screen.getByRole("button", { name: /book a visit/i }));
    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
