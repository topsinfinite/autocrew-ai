import type { ContextualAIAdapter, EnrichedContext } from "./types";

interface AutoCrewGlobal {
  prefillWithContext?: (ctx: EnrichedContext) => void | Promise<void>;
}

export const stubAdapter: ContextualAIAdapter = {
  prefillWithContext(ctx: EnrichedContext) {
    document.dispatchEvent(
      new CustomEvent("contextual_ai_stub", { detail: ctx }),
    );
    console.info("[contextual-ai:stub]", ctx);
  },
};

export function resolveAdapter(): ContextualAIAdapter | null {
  if (typeof window === "undefined") return null;

  const api = (window as unknown as { AutoCrew?: AutoCrewGlobal }).AutoCrew;
  const fn = api?.prefillWithContext;
  if (typeof fn === "function") {
    return {
      prefillWithContext: (ctx) => fn(ctx),
    };
  }

  if (process.env.NEXT_PUBLIC_CONTEXTUAL_AI_STUB === "true") {
    return stubAdapter;
  }

  return null;
}
