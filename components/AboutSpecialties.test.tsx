import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutSpecialties from "./AboutSpecialties";

describe("AboutSpecialties", () => {
  it("renders the heading, kicker, and all five specialty rows", () => {
    render(<AboutSpecialties />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/care across/i);
    expect(screen.getByText("Adults & children")).toBeInTheDocument();
    ["Cardiology", "Orthopedics", "Neurology", "Primary care", "Preventive care"].forEach(
      (title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      },
    );
  });
});
