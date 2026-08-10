import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LocationsMap from "./LocationsMap";

vi.mock("./LocationsMapView", () => ({
  default: ({
    offices,
    focusedIndex,
  }: {
    offices: { name: string }[];
    focusedIndex: number;
  }) => <div>Focused: {offices[focusedIndex].name}</div>,
}));

describe("LocationsMap", () => {
  it("renders a chip per office and switches focus on click", async () => {
    render(<LocationsMap />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/find us on/i);
    expect(await screen.findByText("Focused: Hollywood")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Santa Monica" }));
    expect(await screen.findByText("Focused: Santa Monica")).toBeInTheDocument();
  });
});
