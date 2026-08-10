import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import * as Icons from "./index";

describe("icon components", () => {
  it("renders every icon as an svg with a path", () => {
    Object.entries(Icons).forEach(([name, IconComponent]) => {
      const { container } = render(<IconComponent />);
      const svg = container.querySelector("svg");
      expect(svg, `${name} should render an svg`).toBeTruthy();
      expect(svg?.querySelector("path")).toBeTruthy();
    });
  });

  it("has exactly 28 icons", () => {
    expect(Object.keys(Icons)).toHaveLength(28);
  });
});
