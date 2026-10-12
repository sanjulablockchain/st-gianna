import { describe, expect, it } from "vitest";
import { isSameOrigin } from "./requestGuards";

function req(headers: Record<string, string>) {
  return new Request("http://localhost/api/contact", { method: "POST", headers });
}

describe("isSameOrigin", () => {
  it("accepts the canonical site, bare or www, whatever Host the proxy sends", () => {
    expect(isSameOrigin(req({ origin: "https://sgmdoctor.com", host: "127.0.0.1:8210" }))).toBe(true);
    expect(isSameOrigin(req({ origin: "https://www.sgmdoctor.com", host: "127.0.0.1:8210" }))).toBe(true);
  });

  it("accepts same host requests such as local development", () => {
    expect(isSameOrigin(req({ origin: "http://localhost:3000", host: "localhost:3000" }))).toBe(true);
  });

  it("rejects other websites, missing origins and cross site fetches", () => {
    expect(isSameOrigin(req({ origin: "https://evil.example", host: "sgmdoctor.com" }))).toBe(false);
    expect(isSameOrigin(req({ origin: "https://sgmdoctor.com.evil.example", host: "x" }))).toBe(false);
    expect(isSameOrigin(req({ host: "sgmdoctor.com" }))).toBe(false);
    expect(isSameOrigin(req({ origin: "null", host: "sgmdoctor.com" }))).toBe(false);
    expect(
      isSameOrigin(
        req({ origin: "https://sgmdoctor.com", host: "sgmdoctor.com", "sec-fetch-site": "cross-site" }),
      ),
    ).toBe(false);
  });
});
