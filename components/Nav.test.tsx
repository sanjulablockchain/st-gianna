import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Nav from "./Nav";

// usePathname has no router provider in jsdom, so it is stubbed here.
vi.mock("next/navigation", () => ({ usePathname: () => "/services" }));

/** The suite defaults to desktop; opt a test into the mobile wheel. */
function setViewport({ mobile }: { mobile: boolean }) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("prefers-reduced-motion")
      ? true
      : query.includes("max-width: 859px")
        ? mobile
        : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

const originalMatchMedia = window.matchMedia;

describe("Nav", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    setViewport({ mobile: false });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
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

describe("Nav mobile wheel", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    setViewport({ mobile: true });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("still exposes every destination as a real link", () => {
    render(<Nav />);
    expect(screen.getAllByRole("link")).toHaveLength(9);
    expect(screen.getByRole("link", { name: /partners/i })).toHaveAttribute("href", "/partners");
  });

  it("opens centred on the current route and names it", () => {
    const { container } = render(<Nav />);
    // The stubbed pathname is /services.
    expect(container.querySelector('[class*="readout"]')).toHaveTextContent("Services");
    expect(screen.getByRole("link", { name: /services/i }).className).toMatch(/centred/);
  });

  it("tracks position with one dot per destination", () => {
    const { container } = render(<Nav />);
    const dots = container.querySelectorAll('[class*="dot"]:not([class*="dots"])');
    expect(dots).toHaveLength(10);
    expect(container.querySelectorAll('[class*="dotActive"]')).toHaveLength(1);
  });

  // fireEvent.click returns false when the handler cancelled the event, which
  // is how the two-tap rule is enforced. userEvent is avoided here because a
  // native listener would run before React's delegated one and read
  // defaultPrevented too early.
  it("centres a nearby off-centre item on first tap instead of navigating", () => {
    const { container } = render(<Nav />);
    // Why us sits one step from the centred Services chip.
    const target = screen.getByRole("link", { name: /why us/i });
    expect(target.className).not.toMatch(/centred/);

    const notCancelled = fireEvent.click(target);
    expect(notCancelled).toBe(false);
    expect(screen.getByRole("link", { name: /why us/i }).className).toMatch(/centred/);
    expect(container.querySelector('[class*="readout"]')).toHaveTextContent("Why us");
  });

  it("commits on the second tap once the item is centred", () => {
    render(<Nav />);
    expect(fireEvent.click(screen.getByRole("link", { name: /why us/i }))).toBe(false);
    // Now centred, so the click is allowed through to navigate.
    expect(fireEvent.click(screen.getByRole("link", { name: /why us/i }))).toBe(true);
  });

  it("keeps far-off items out of reach until the wheel is turned to them", () => {
    render(<Nav />);
    // Partners is four steps from centre, so it is faded out and inert. The
    // wheel has to be flicked to it, which is the whole point of the control.
    const far = screen.getByRole("link", { name: /partners/i }).closest("li");
    expect(far).toHaveStyle({ pointerEvents: "none" });
    const near = screen.getByRole("link", { name: /why us/i }).closest("li");
    expect(near).toHaveStyle({ pointerEvents: "auto" });
  });

  it("centres a chip on keyboard focus, so the wheel is reachable without dragging", async () => {
    const user = userEvent.setup();
    const { container } = render(<Nav />);
    const toggle = screen.getByRole("button", { name: /light mode/i });

    // Focus alone centres it, which is how keyboard users turn the wheel.
    fireEvent.focus(toggle);
    expect(container.querySelector('[class*="readout"]')).toHaveTextContent("Light mode");

    await user.click(screen.getByRole("button", { name: /light mode/i }));
    expect(screen.getByRole("button", { name: /dark mode/i })).toBeInTheDocument();
  });
});
