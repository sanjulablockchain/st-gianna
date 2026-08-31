import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WhyUsNumbers from "./WhyUsNumbers";

describe("WhyUsNumbers", () => {
  it("renders four figures with their labels", () => {
    render(<WhyUsNumbers />);
    expect(screen.getByText("18,000+")).toBeInTheDocument();
    expect(screen.getByText("Visits a year")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Years in Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Languages at the front desk")).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByText("Seen within 15 minutes of arrival")).toBeInTheDocument();
  });
});
