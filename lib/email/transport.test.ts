// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readSmtpConfig } from "./transport";

const FULL_ENV = {
  SMTP_HOST: "smtp.office365.com",
  SMTP_PORT: "587",
  SMTP_SECURE: "false",
  SMTP_USER: "sender@example.com",
  SMTP_PASS: "hunter2",
  CONTACT_TO: "inbox@example.com",
};

beforeEach(() => {
  vi.unstubAllEnvs();
});

describe("readSmtpConfig", () => {
  it("reads the connection details from the environment", () => {
    expect(readSmtpConfig(FULL_ENV)).toEqual({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      user: "sender@example.com",
      pass: "hunter2",
      to: "inbox@example.com",
    });
  });

  it("turns the port into a number so nodemailer does not get a string", () => {
    expect(readSmtpConfig(FULL_ENV).port).toBe(587);
  });

  it("treats SMTP_SECURE=true as a secure connection", () => {
    expect(readSmtpConfig({ ...FULL_ENV, SMTP_SECURE: "true" }).secure).toBe(true);
  });

  // A missing variable should fail loudly at send time, not send to undefined.
  it("names the variable that is missing", () => {
    expect(() => readSmtpConfig({ ...FULL_ENV, SMTP_PASS: undefined })).toThrow(/SMTP_PASS/);
  });

  it("rejects a blank variable the same as an absent one", () => {
    expect(() => readSmtpConfig({ ...FULL_ENV, SMTP_HOST: "   " })).toThrow(/SMTP_HOST/);
  });

  it("requires a destination address", () => {
    expect(() => readSmtpConfig({ ...FULL_ENV, CONTACT_TO: undefined })).toThrow(/CONTACT_TO/);
  });

  it("rejects a port that is not a number", () => {
    expect(() => readSmtpConfig({ ...FULL_ENV, SMTP_PORT: "not-a-port" })).toThrow(/SMTP_PORT/);
  });
});
