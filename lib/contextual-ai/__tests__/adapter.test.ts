import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { resolveAdapter } from "../adapter";

type AskFn = (
  message: string,
  options?: { mode?: "chat" | "voice"; autoSend?: boolean; focus?: boolean },
) => void;

function installAutoCrew(ask: AskFn | unknown) {
  (window as unknown as { AutoCrew: { ask: unknown } }).AutoCrew = {
    ask,
  };
}

describe("resolveAdapter", () => {
  beforeEach(() => {
    delete (window as unknown as { AutoCrew?: unknown }).AutoCrew;
  });

  afterEach(() => {
    delete (window as unknown as { AutoCrew?: unknown }).AutoCrew;
  });

  it("returns null when window.AutoCrew is undefined", () => {
    expect(resolveAdapter()).toBeNull();
  });

  it("returns null when window.AutoCrew.ask is not a function", () => {
    installAutoCrew("not a function");
    expect(resolveAdapter()).toBeNull();
  });

  it("returns a working adapter when AutoCrew.ask is a function", () => {
    installAutoCrew(vi.fn());
    const adapter = resolveAdapter();
    expect(adapter).not.toBeNull();
    expect(typeof adapter!.send).toBe("function");
  });

  describe("send() message composition", () => {
    let ask: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      ask = vi.fn();
      installAutoCrew(ask);
    });

    it("composes Format B with section label when present", () => {
      const adapter = resolveAdapter()!;
      adapter.send({
        selection: "HIPAA-aware patient engagement",
        sectionLabel: "Healthcare features",
        url: "/industry/healthcare",
        userPrompt: "Does this handle Spanish-speaking patients?",
      });

      expect(ask).toHaveBeenCalledWith(
        'On Healthcare features:\n> "HIPAA-aware patient engagement"\n\nDoes this handle Spanish-speaking patients?',
        { autoSend: true, mode: "chat" },
      );
    });

    it("omits section prefix when sectionLabel is absent", () => {
      const adapter = resolveAdapter()!;
      adapter.send({
        selection: "automated lead qualification",
        url: "/features",
        userPrompt: "How fast is it?",
      });

      expect(ask).toHaveBeenCalledWith(
        '> "automated lead qualification"\n\nHow fast is it?',
        { autoSend: true, mode: "chat" },
      );
    });

    it("uses 'Can you explain this?' when userPrompt is missing", () => {
      const adapter = resolveAdapter()!;
      adapter.send({
        selection: "agentic crew",
        sectionLabel: "Overview",
        url: "/",
      });

      expect(ask).toHaveBeenCalledWith(
        'On Overview:\n> "agentic crew"\n\nCan you explain this?',
        { autoSend: true, mode: "chat" },
      );
    });

    it("uses fallback prompt when userPrompt is whitespace-only", () => {
      const adapter = resolveAdapter()!;
      adapter.send({
        selection: "voice agent",
        url: "/",
        userPrompt: "   \n  ",
      });

      expect(ask).toHaveBeenCalledWith(
        '> "voice agent"\n\nCan you explain this?',
        { autoSend: true, mode: "chat" },
      );
    });
  });
});
