import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CareersProcess from "./CareersProcess";
import { HIRING_STEPS } from "@/components/careers/content";

describe("CareersProcess", () => {
  it("renders the hiring steps in order", () => {
    render(<CareersProcess />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/how hiring works/i);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(HIRING_STEPS.length);
    expect(items[0]).toHaveTextContent(HIRING_STEPS[0].title);
  });
});
