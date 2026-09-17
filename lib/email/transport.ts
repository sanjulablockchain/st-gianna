import nodemailer, { type Transporter } from "nodemailer";

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
};

type Env = Record<string, string | undefined>;

function required(env: Env, key: string): string {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`${key} is not set. Copy .env.example to .env.local and fill it in.`);
  }
  return value;
}

export function readSmtpConfig(env: Env = process.env): SmtpConfig {
  const port = Number(required(env, "SMTP_PORT"));
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`SMTP_PORT must be a port number, got "${env.SMTP_PORT}".`);
  }

  return {
    host: required(env, "SMTP_HOST"),
    port,
    // Anything but an explicit "true" means STARTTLS on 587, which is what
    // Office 365 wants.
    secure: required(env, "SMTP_SECURE").toLowerCase() === "true",
    user: required(env, "SMTP_USER"),
    pass: required(env, "SMTP_PASS"),
    to: required(env, "CONTACT_TO"),
  };
}

let cached: Transporter | null = null;

/** Memoised so we reuse one connection pool instead of dialling per request. */
export function getTransport(config: SmtpConfig): Transporter {
  if (!cached) {
    cached = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
  }
  return cached;
}

/** Test seam: drops the memoised transporter so config changes take effect. */
export function resetTransport(): void {
  cached = null;
}
