import type { ContextualAIAdapter, EnrichedContext } from "./types";

interface AutoCrewAskOptions {
  mode?: "chat" | "voice";
  autoSend?: boolean;
  focus?: boolean;
}

interface AutoCrewAPI {
  ask?: (message: string, options?: AutoCrewAskOptions) => void;
}

function composeMessage(ctx: EnrichedContext): string {
  const prompt = ctx.userPrompt?.trim() || "Can you explain this?";
  const prefix = ctx.sectionLabel ? `On ${ctx.sectionLabel}:\n` : "";
  return `${prefix}> "${ctx.selection}"\n\n${prompt}`;
}

export function resolveAdapter(): ContextualAIAdapter | null {
  if (typeof window === "undefined") return null;
  const api = (window as unknown as { AutoCrew?: AutoCrewAPI }).AutoCrew;
  const ask = api?.ask;
  if (typeof ask !== "function") return null;
  return {
    send: (ctx) => ask(composeMessage(ctx), { autoSend: true, mode: "chat" }),
  };
}
