import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Nav from "./Nav";

describe("Nav", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders all primary destinations as page-aware anchors", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /services/i })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: /locations/i })).toHaveAttribute("href", "/#locations");
    expect(screen.getByRole("link", { name: /call us/i })).toHaveAttribute("href", "tel:13105550123");
  });

  it("shows the theme toggle labeled for the current (dark) theme", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /light mode/i })).toBeInTheDocument();
  });
});
