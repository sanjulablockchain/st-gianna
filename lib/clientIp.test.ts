import { describe, expect, it } from "vitest";
import { clientIp } from "./clientIp";

function request(headers: Record<string, string>) {
  return new Request("http://localhost/api/contact", { headers });
}

describe("clientIp", () => {
  it("reads the address nginx sets in X-Real-IP", () => {
    expect(clientIp(request({ "x-real-ip": "203.0.113.5" }))).toBe("203.0.113.5");
  });

  it("trims whitespace around the address", () => {
    expect(clientIp(request({ "x-real-ip": "  203.0.113.5 " }))).toBe("203.0.113.5");
  });

  it("ignores X-Forwarded-For, which the visitor controls", () => {
    const spoofed = request({ "x-real-ip": "203.0.113.5", "x-forwarded-for": "1.2.3.4" });
    expect(clientIp(spoofed)).toBe("203.0.113.5");
    expect(clientIp(request({ "x-forwarded-for": "1.2.3.4" }))).toBe("unknown");
  });

  it("falls back to a shared bucket when no proxy set the header", () => {
    expect(clientIp(request({}))).toBe("unknown");
    expect(clientIp(request({ "x-real-ip": "   " }))).toBe("unknown");
  });
});
