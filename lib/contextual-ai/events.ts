import type { ContextualAIEvent } from "./types";
import { hasAnalyticsConsent } from "./flags";

interface GtagGlobal {
  (command: "event", eventName: string, params: Record<string, unknown>): void;
}

export function track(event: ContextualAIEvent): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  document.dispatchEvent(
    new CustomEvent("contextual_ai", { detail: event }),
  );

  const gtag = (window as unknown as { gtag?: GtagGlobal }).gtag;
  if (typeof gtag === "function" && hasAnalyticsConsent()) {
    const { name, ...params } = event;
    gtag("event", name, params);
  }
}
