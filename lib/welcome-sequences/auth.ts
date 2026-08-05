import { createHmac, timingSafeEqual } from "node:crypto";

import { COOKIE_NAME } from "./types";

export { COOKIE_NAME };

export function isWelcomeComposerEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_WELCOME_COMPOSER_ENABLED;
  if (flag === "false") return false;
  return true;
}

export function getWelcomeComposerSecret(): string | null {
  const secret = process.env.WELCOME_COMPOSER_SECRET;
  if (!secret || secret.trim().length === 0) return null;
  return secret;
}

/** Stable cookie payload derived from secret — changes when secret rotates. */
export function expectedAuthCookieValue(secret: string): string {
  return createHmac("sha256", secret)
    .update("welcome-composer-v1")
    .digest("hex");
}

export function isValidUnlockPassword(
  password: string,
  secret: string,
): boolean {
  const a = Buffer.from(password);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isValidAuthCookie(
  cookieValue: string | undefined,
  secret: string,
): boolean {
  if (!cookieValue) return false;
  const expected = expectedAuthCookieValue(secret);
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
