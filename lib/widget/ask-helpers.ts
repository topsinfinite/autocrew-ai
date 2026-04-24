"use client";

/**
 * Thin fire-and-forget helpers for firing questions at the AutoCrew widget
 * from anywhere in the marketing site. All calls route through
 * `window.AutoCrew.ask` / `.open` — the pre-init queue stub in app/layout.tsx
 * buffers any calls made before `widget.js` finishes loading.
 *
 * For the richer highlight-to-chat pathway (structured EnrichedContext +
 * analytics events) use `lib/contextual-ai/adapter.ts` instead.
 */

interface AutoCrewAPI {
  ask?: (
    message: string,
    options?: { mode?: "chat" | "voice"; autoSend?: boolean },
  ) => void;
  open?: (options?: { mode?: "chat" | "voice" }) => void;
}

/** Fire a chat question at the widget. Auto-sends on submit. */
export function askSarah(question: string) {
  if (typeof window === "undefined") return;
  const api = (window as unknown as { AutoCrew?: AutoCrewAPI }).AutoCrew;
  api?.ask?.(question, { autoSend: true, mode: "chat" });
}

/** Open the widget in voice mode (no message). */
export function openVoice() {
  if (typeof window === "undefined") return;
  const api = (window as unknown as { AutoCrew?: AutoCrewAPI }).AutoCrew;
  api?.open?.({ mode: "voice" });
}
