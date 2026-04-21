import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { resolveAdapter, stubAdapter } from "../adapter";

describe("resolveAdapter", () => {
  const originalStub = process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB;

  beforeEach(() => {
    delete (window as unknown as { AutoCrew?: unknown }).AutoCrew;
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB = originalStub;
  });

  afterEach(() => {
    delete (window as unknown as { AutoCrew?: unknown }).AutoCrew;
  });

  it("returns an adapter routing to window.AutoCrew.prefillWithContext when present", async () => {
    const spy = vi.fn();
    (window as unknown as { AutoCrew: unknown }).AutoCrew = {
      prefillWithContext: spy,
    };

    const adapter = resolveAdapter();
    expect(adapter).not.toBeNull();

    await adapter!.prefillWithContext({
      selection: "hi",
      url: "/",
    });
    expect(spy).toHaveBeenCalledWith({ selection: "hi", url: "/" });
  });

  it("returns stubAdapter when real API missing and stub flag is 'true'", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB = "true";
    const adapter = resolveAdapter();
    expect(adapter).toBe(stubAdapter);
  });

  it("returns null when API missing and stub flag not 'true'", () => {
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB = "false";
    expect(resolveAdapter()).toBeNull();

    delete process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB;
    expect(resolveAdapter()).toBeNull();
  });

  it("returns null when AutoCrew exists but prefillWithContext is not a function", () => {
    (window as unknown as { AutoCrew: unknown }).AutoCrew = {
      prefillWithContext: "nope",
    };
    process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB = undefined;
    expect(resolveAdapter()).toBeNull();
  });
});

describe("stubAdapter", () => {
  it("dispatches a CustomEvent with the payload", () => {
    const listener = vi.fn();
    document.addEventListener("contextual_ai_stub", listener as EventListener);
    stubAdapter.prefillWithContext({ selection: "hello", url: "/test" });
    expect(listener).toHaveBeenCalledTimes(1);
    const ev = listener.mock.calls[0][0] as CustomEvent;
    expect(ev.detail).toEqual({ selection: "hello", url: "/test" });
    document.removeEventListener("contextual_ai_stub", listener as EventListener);
  });
});
