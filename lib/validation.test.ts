import { describe, expect, it } from "vitest";
import { OFFICES, TOPICS, validateContact } from "./validation";

const VALID = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "",
  office: "Hollywood",
  topic: "Billing",
  message: "I have a question about a statement.",
  consent: true,
};

describe("validateContact", () => {
  it("returns no errors for a complete submission", () => {
    expect(validateContact(VALID)).toEqual({});
  });

  it("requires a name", () => {
    expect(validateContact({ ...VALID, name: "   " }).name).toBe("Tell us your name.");
  });

  it("requires an email address", () => {
    expect(validateContact({ ...VALID, email: "" }).email).toBe("Enter an email address.");
  });

  it("rejects a malformed email address", () => {
    expect(validateContact({ ...VALID, email: "ada@example" }).email).toBe(
      "Enter a valid email address.",
    );
  });

  it("accepts a blank phone number because it is optional", () => {
    expect(validateContact({ ...VALID, phone: "" }).phone).toBeUndefined();
  });

  it("rejects a phone number with too few digits to call back", () => {
    expect(validateContact({ ...VALID, phone: "555-1234" }).phone).toBe(
      "Enter a phone number we can reach you on, or leave it blank.",
    );
  });

  it("requires a message", () => {
    expect(validateContact({ ...VALID, message: "" }).message).toBe("Let us know what you need.");
  });

  it("requires consent", () => {
    expect(validateContact({ ...VALID, consent: false }).consent).toBe(
      "Please confirm we can reply to you.",
    );
  });

  // The server cannot trust the client's <select>; a crafted POST can carry
  // anything, and these values are echoed into an email we read.
  it("rejects an office that is not one we run", () => {
    expect(validateContact({ ...VALID, office: "Atlantis" }).office).toBe(
      "Choose one of the listed offices.",
    );
  });

  it("rejects a topic that is not on the list", () => {
    expect(validateContact({ ...VALID, topic: "<script>" }).topic).toBe(
      "Choose one of the listed topics.",
    );
  });

  it("accepts every office and topic the form offers", () => {
    for (const office of OFFICES) {
      expect(validateContact({ ...VALID, office }).office).toBeUndefined();
    }
    for (const topic of TOPICS) {
      expect(validateContact({ ...VALID, topic }).topic).toBeUndefined();
    }
  });

  it("rejects a message longer than the limit so one POST cannot mail a novel", () => {
    expect(validateContact({ ...VALID, message: "x".repeat(5001) }).message).toBe(
      "Please keep it under 5000 characters.",
    );
  });
});
