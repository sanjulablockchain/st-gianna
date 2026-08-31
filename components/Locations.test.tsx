import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Locations from "./Locations";

describe("Locations", () => {
  it("renders all three clinics with address, phone, and hours", () => {
    render(<Locations />);
    expect(screen.getByText("Santa Monica")).toBeInTheDocument();
    expect(screen.getByText("2221 Lincoln Blvd, Santa Monica, CA 90405")).toBeInTheDocument();
    expect(screen.getByText("818-308-4100")).toBeInTheDocument();
    expect(screen.getByText("Hollywood")).toBeInTheDocument();
    expect(screen.getByText("5255 W Sunset Blvd, Los Angeles, CA 90027")).toBeInTheDocument();
    expect(screen.getByText("La Mirada")).toBeInTheDocument();
    expect(screen.getByText("12675 La Mirada Blvd, #200, La Mirada, CA 90638")).toBeInTheDocument();
    expect(screen.getByText("Opens 9am")).toBeInTheDocument();
  });

  it("makes each clinic panel a link to the locations page", () => {
    render(<Locations />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    links.forEach((link) => expect(link).toHaveAttribute("href", "/locations"));
  });
});
