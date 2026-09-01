import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Nav from "./Nav";

// usePathname has no router provider in jsdom, so it is stubbed here.
vi.mock("next/navigation", () => ({ usePathname: () => "/services" }));

describe("Nav", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders all primary destinations as page-aware anchors", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /about us/i })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: /services/i })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: /locations/i })).toHaveAttribute("href", "/locations");
    expect(screen.getByRole("link", { name: /call us/i })).toHaveAttribute(
      "href",
      "tel:+18183084100",
    );
  });

  it("links the four secondary destinations to their own pages", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /why us/i })).toHaveAttribute("href", "/why-us");
    expect(screen.getByRole("link", { name: /journal/i })).toHaveAttribute("href", "/journal");
    expect(screen.getByRole("link", { name: /partners/i })).toHaveAttribute("href", "/partners");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "/contact");
  });

  it("marks the current route as the active page", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /services/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /home/i })).not.toHaveAttribute("aria-current");
  });

  it("shows the theme toggle as a button labeled for the current (dark) theme", () => {
    render(<Nav />);
    expect(screen.getByRole("button", { name: /light mode/i })).toBeInTheDocument();
  });

  // Every nav destination is a real page now, so none may be hidden at any
  // width. The old extraOnly class hid four of them below 859px.
  it("hides no destination behind the extraOnly class", () => {
    const { container } = render(<Nav />);
    expect(container.querySelectorAll('[class*="extraOnly"]')).toHaveLength(0);
  });

  it("renders every one of the eight page destinations plus call and theme", () => {
    render(<Nav />);
    const hrefs = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"))
      .sort();
    expect(hrefs).toEqual(
      [
        "/",
        "/about",
        "/contact",
        "/journal",
        "/locations",
        "/partners",
        "/services",
        "/why-us",
        "tel:+18183084100",
      ].sort(),
    );
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
