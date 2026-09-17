type Options = {
  limit: number;
  windowMs: number;
};

type Verdict = {
  allowed: boolean;
  retryAfterSeconds: number;
};

type Window = {
  count: number;
  expiresAt: number;
};

/**
 * Fixed-window counter held in memory. Good enough to stop a script hammering
 * the contact endpoint on a single server; it resets on deploy and does not
 * span instances, so swap in a shared store if this ever runs on more than one.
 */
export function createRateLimiter({ limit, windowMs }: Options) {
  const windows = new Map<string, Window>();

  function sweep(now: number) {
    for (const [key, window] of windows) {
      if (window.expiresAt <= now) windows.delete(key);
    }
  }

  return {
    check(key: string): Verdict {
      const now = Date.now();
      sweep(now);

      const window = windows.get(key);

      if (!window) {
        windows.set(key, { count: 1, expiresAt: now + windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
      }

      if (window.count < limit) {
        window.count += 1;
        return { allowed: true, retryAfterSeconds: 0 };
      }

      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((window.expiresAt - now) / 1000),
      };
    },

    size() {
      return windows.size;
    },
  };
}
