import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WhyUsNumbers from "./WhyUsNumbers";

describe("WhyUsNumbers", () => {
  it("renders four figures with their labels", async () => {
    render(<WhyUsNumbers />);
    expect(await screen.findByText("18,000+")).toBeInTheDocument();
    expect(screen.getByText("Visits a year")).toBeInTheDocument();
    expect(await screen.findByText("12")).toBeInTheDocument();
    expect(screen.getByText("Years in Los Angeles")).toBeInTheDocument();
    expect(await screen.findByText("4")).toBeInTheDocument();
    expect(screen.getByText("Languages at the front desk")).toBeInTheDocument();
    expect(await screen.findByText("94%")).toBeInTheDocument();
    expect(screen.getByText("Seen within 15 minutes of arrival")).toBeInTheDocument();
  });
});
