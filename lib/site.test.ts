import { describe, expect, it } from "vitest";
import { absoluteUrl, isoDate, officeAddress, OFFICES, SITE_URL } from "./site";

describe("site helpers", () => {
  it("builds absolute URLs from paths", () => {
    expect(absoluteUrl("/")).toBe(SITE_URL);
    expect(absoluteUrl("/journal")).toBe(`${SITE_URL}/journal`);
    expect(absoluteUrl("about")).toBe(`${SITE_URL}/about`);
    expect(absoluteUrl("https://example.org/x")).toBe("https://example.org/x");
  });

  it("converts display dates to ISO dates", () => {
    expect(isoDate("24 August 2026")).toBe("2026-08-24");
    expect(isoDate("not a date")).toBeUndefined();
  });

  it("formats a full office address", () => {
    expect(officeAddress(OFFICES[0])).toBe("5255 W Sunset Blvd, Los Angeles, CA 90027");
  });

  it("uses E.164 phone numbers that match the display numbers", () => {
    for (const office of OFFICES) {
      expect(office.phoneE164).toBe(`+1${office.phone.replace(/\D/g, "")}`);
    }
  });
});
