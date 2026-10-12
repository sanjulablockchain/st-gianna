import { describe, expect, it } from "vitest";
import { clientIp, isSameOrigin } from "./requestGuards";

function req(headers: Record<string, string>) {
  return new Request("http://localhost/api/contact", { method: "POST", headers });
}

describe("clientIp", () => {
  it("takes the address the trusted proxy appended, not the one the client sent", () => {
    // The client forged 1.1.1.1; the load balancer appended the real 203.0.113.5.
    const request = req({ "x-forwarded-for": "1.1.1.1, 203.0.113.5" });
    expect(clientIp(request, {})).toBe("203.0.113.5");
  });

  it("honours more than one trusted hop", () => {
    const request = req({ "x-forwarded-for": "1.1.1.1, 203.0.113.5, 10.0.0.2" });
    expect(clientIp(request, { TRUSTED_PROXY_HOPS: "2" })).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip, then to a shared bucket", () => {
    expect(clientIp(req({ "x-real-ip": "198.51.100.7" }), {})).toBe("198.51.100.7");
    expect(clientIp(req({}), {})).toBe("unknown");
  });

  it("ignores a nonsense hop setting", () => {
    const request = req({ "x-forwarded-for": "1.1.1.1, 203.0.113.5" });
    expect(clientIp(request, { TRUSTED_PROXY_HOPS: "zero" })).toBe("203.0.113.5");
  });
});

describe("isSameOrigin", () => {
  it("accepts the canonical site and same host requests", () => {
    expect(isSameOrigin(req({ origin: "https://sgmdoctor.com", host: "internal:3000" }))).toBe(true);
    expect(isSameOrigin(req({ origin: "http://localhost:3000", host: "localhost:3000" }))).toBe(true);
  });

  it("rejects other websites, missing origins and cross site fetches", () => {
    expect(isSameOrigin(req({ origin: "https://evil.example", host: "sgmdoctor.com" }))).toBe(false);
    expect(isSameOrigin(req({ host: "sgmdoctor.com" }))).toBe(false);
    expect(isSameOrigin(req({ origin: "null", host: "sgmdoctor.com" }))).toBe(false);
    expect(
      isSameOrigin(
        req({ origin: "https://sgmdoctor.com", host: "sgmdoctor.com", "sec-fetch-site": "cross-site" }),
      ),
    ).toBe(false);
  });
});
