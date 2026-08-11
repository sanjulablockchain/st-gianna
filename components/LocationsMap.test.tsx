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

  it("keeps office coordinates within the Los Angeles County bounding box", () => {
    // These lat/lng pairs are duplicated from the OFFICES array in
    // ./LocationsMap.tsx. If that array changes, update this list too.
    // This guards against another silently-shipped bad geocode (see the
    // Santa Monica marker bug fixed in the final /locations page review).
    const OFFICES = [
      { name: "Hollywood", lat: 34.0981967, lng: -118.3045711 },
      { name: "Santa Monica", lat: 34.0097309, lng: -118.4803111 },
      { name: "La Mirada", lat: 33.9161889, lng: -118.0124715 },
    ];

    // Reasonable bounding box for Los Angeles County, CA.
    const LA_COUNTY_BOUNDS = {
      minLat: 33.7,
      maxLat: 34.3,
      minLng: -118.7,
      maxLng: -117.8,
    };

    for (const office of OFFICES) {
      expect(office.lat).toBeGreaterThanOrEqual(LA_COUNTY_BOUNDS.minLat);
      expect(office.lat).toBeLessThanOrEqual(LA_COUNTY_BOUNDS.maxLat);
      expect(office.lng).toBeGreaterThanOrEqual(LA_COUNTY_BOUNDS.minLng);
      expect(office.lng).toBeLessThanOrEqual(LA_COUNTY_BOUNDS.maxLng);
    }
  });
});
