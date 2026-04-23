"use client";

interface AutoCrewAPI {
  ask?: (
    message: string,
    options?: { mode?: "chat" | "voice"; autoSend?: boolean },
  ) => void;
  open?: (options?: { mode?: "chat" | "voice" }) => void;
}

/** Fire a chat question at the widget. Pre-init queue stub buffers if needed. */
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
