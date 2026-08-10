import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutMission from "./AboutMission";

describe("AboutMission", () => {
  it("renders the mission and vision statements", () => {
    render(<AboutMission />);
    expect(screen.getByText("Our Mission")).toBeInTheDocument();
    expect(screen.getByText("Our Vision")).toBeInTheDocument();
    expect(
      screen.getByText(/provide exceptional, compassionate healthcare to adults/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/leading healthcare provider recognized for excellence/i),
    ).toBeInTheDocument();
  });
});
