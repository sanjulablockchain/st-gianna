import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CareersCulture from "./CareersCulture";
import { CULTURE } from "@/components/careers/content";

describe("CareersCulture", () => {
  it("renders the heading and every culture note", () => {
    render(<CareersCulture />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/what the work is like/i);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(CULTURE.length);
    expect(screen.getByText("One chart, three offices")).toBeInTheDocument();
  });
});
