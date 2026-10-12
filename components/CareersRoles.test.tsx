import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CareersRoles from "./CareersRoles";
import { ROLES } from "@/components/careers/content";

describe("CareersRoles", () => {
  it("renders a card for each role with its anchor", () => {
    const { container } = render(<CareersRoles />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/teams we hire for/i);
    for (const role of ROLES) {
      expect(screen.getByRole("heading", { level: 3, name: role.title })).toBeInTheDocument();
      expect(container.querySelector(`#${role.id}`)).not.toBeNull();
    }
    expect(screen.getAllByText("A typical day")).toHaveLength(ROLES.length);
    expect(screen.getAllByText("What we look for")).toHaveLength(ROLES.length);
  });

  it("sends every role to the application form", () => {
    render(<CareersRoles />);
    const links = screen.getAllByRole("link", { name: /apply now/i });
    expect(links).toHaveLength(ROLES.length);
    for (const link of links) expect(link).toHaveAttribute("href", "#apply");
  });
});
