import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TickerBar from "./TickerBar";

describe("TickerBar", () => {
  it("renders each pill twice for a seamless loop", () => {
    render(<TickerBar />);
    expect(screen.getAllByText("Same-day appointments")).toHaveLength(2);
    expect(screen.getAllByText("24/7 online booking")).toHaveLength(2);
    expect(screen.getAllByText("Board-certified pediatricians")).toHaveLength(2);
  });
});
