import { describe, it, expect, beforeEach } from "vitest";
import { isEnabled, hasAnalyticsConsent } from "../flags";

describe("isEnabled", () => {
  const originalEnv = process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED;

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, "", "/");
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = originalEnv;
  });

  it("returns true when env flag is unset (default on)", () => {
    delete process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED;
    expect(isEnabled()).toBe(true);
  });

  it("returns true when env flag is 'true'", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = "true";
    expect(isEnabled()).toBe(true);
  });

  it("returns false when env flag is 'false'", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = "false";
    expect(isEnabled()).toBe(false);
  });

  it("URL ?contextual-ai=off overrides env=true", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = "true";
    window.history.replaceState({}, "", "/?contextual-ai=off");
    expect(isEnabled()).toBe(false);
  });

  it("URL ?contextual-ai=on overrides env=false", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = "false";
    window.history.replaceState({}, "", "/?contextual-ai=on");
    expect(isEnabled()).toBe(true);
  });

  it("localStorage 'contextual-ai:disabled' overrides env=true", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED = "true";
    localStorage.setItem("contextual-ai:disabled", "1");
    expect(isEnabled()).toBe(false);
  });

  it("URL override beats localStorage", () => {
    localStorage.setItem("contextual-ai:disabled", "1");
    window.history.replaceState({}, "", "/?contextual-ai=on");
    expect(isEnabled()).toBe(true);
  });
});

describe("hasAnalyticsConsent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns false when no consent stored", () => {
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("returns false when consent JSON is malformed", () => {
    localStorage.setItem("cookie-consent", "not json");
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("returns false when analytics is denied", () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({ essential: true, analytics: false, preferences: false, marketing: false }),
    );
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("returns true when analytics is granted", () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({ essential: true, analytics: true, preferences: false, marketing: false }),
    );
    expect(hasAnalyticsConsent()).toBe(true);
  });
});
