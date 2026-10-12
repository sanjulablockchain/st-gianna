import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CareersFaq from "./CareersFaq";
import { CAREERS_FAQS } from "@/components/careers/content";

describe("CareersFaq", () => {
  it("renders every applicant question", () => {
    render(<CareersFaq />);
    expect(
      screen.getByRole("heading", { name: "Questions from applicants" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(CAREERS_FAQS.length);
    expect(screen.getByText("What should I leave out of my email?")).toBeInTheDocument();
  });

  it("opens the first answer by default and collapses it on click", async () => {
    const user = userEvent.setup();
    render(<CareersFaq />);
    const firstToggle = screen.getByRole("button", { name: CAREERS_FAQS[0].q });
    expect(firstToggle).toHaveAttribute("aria-expanded", "true");

    await user.click(firstToggle);
    expect(firstToggle).toHaveAttribute("aria-expanded", "false");
  });
});
