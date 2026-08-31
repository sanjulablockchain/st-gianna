import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PartnersJoin from "./PartnersJoin";

describe("PartnersJoin", () => {
  it("invites practices to partner and links to contact", () => {
    render(<PartnersJoin />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/work with us/i);
    expect(screen.getByRole("link", { name: /start a conversation/i })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
