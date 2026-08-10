import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutCommitment from "./AboutCommitment";

describe("AboutCommitment", () => {
  it("renders the heading, kicker, commitment copy, and portrait", () => {
    render(<AboutCommitment />);
    expect(
      screen.getByRole("heading", { name: /our commitment to your health/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Who are we")).toBeInTheDocument();
    expect(
      screen.getByText(
        /dedicated to providing exceptional healthcare services for adults and children/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByAltText(/st\. gianna medical group clinician/i)).toBeInTheDocument();
  });
});
