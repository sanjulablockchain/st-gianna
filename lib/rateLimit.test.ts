import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRateLimiter } from "./rateLimit";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createRateLimiter", () => {
  it("allows requests up to the limit", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 60_000 });

    expect(limiter.check("1.2.3.4").allowed).toBe(true);
    expect(limiter.check("1.2.3.4").allowed).toBe(true);
    expect(limiter.check("1.2.3.4").allowed).toBe(true);
  });

  it("blocks the request after the limit is used up", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 });
    limiter.check("1.2.3.4");
    limiter.check("1.2.3.4");

    expect(limiter.check("1.2.3.4").allowed).toBe(false);
  });

  it("reports how long to wait when blocked", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    limiter.check("1.2.3.4");

    vi.advanceTimersByTime(20_000);

    expect(limiter.check("1.2.3.4").retryAfterSeconds).toBe(40);
  });

  it("tracks each key separately so one sender cannot block another", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    limiter.check("1.2.3.4");

    expect(limiter.check("5.6.7.8").allowed).toBe(true);
  });

  it("allows again once the window has passed", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    limiter.check("1.2.3.4");

    vi.advanceTimersByTime(60_001);

    expect(limiter.check("1.2.3.4").allowed).toBe(true);
  });

  // Without this an unbounded map is a slow memory leak on a long-lived server.
  it("forgets keys whose window has expired", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    limiter.check("1.2.3.4");
    expect(limiter.size()).toBe(1);

    vi.advanceTimersByTime(60_001);
    limiter.check("5.6.7.8");

    expect(limiter.size()).toBe(1);
  });
});
