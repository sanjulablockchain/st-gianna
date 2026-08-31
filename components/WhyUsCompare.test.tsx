import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import WhyUsCompare from "./WhyUsCompare";

describe("WhyUsCompare", () => {
  it("renders a comparison table with five rows and both column headers", () => {
    render(<WhyUsCompare />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/side by side/i);
    const table = screen.getByRole("table");
    expect(within(table).getByText("A typical clinic")).toBeInTheDocument();
    expect(within(table).getByText("St. Gianna")).toBeInTheDocument();
    expect(within(table).getAllByRole("row")).toHaveLength(6);
  });

  it("labels every comparison row", () => {
    render(<WhyUsCompare />);
    [
      "Time to appointment",
      "Records between offices",
      "After hours",
      "Benefits check",
      "Follow-up",
    ].forEach((label) => expect(screen.getByText(label)).toBeInTheDocument());
  });
});
