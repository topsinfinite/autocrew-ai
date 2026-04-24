"use client";

import { useEffect, useState } from "react";

export interface AutocrewTriggerDetail {
  source: "api" | "declarative" | "url";
  mode: "chat" | "voice";
  hasMessage: boolean;
}

export interface TriggerLogEntry extends AutocrewTriggerDetail {
  /** Time of trigger as `HH:MM:SS`. */
  ts: string;
  /** Auto-incremented id so React keys stay stable even with identical timestamps. */
  id: number;
}

let nextId = 0;

function formatTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * Subscribe to `autocrew:triggered` CustomEvents and return the most recent
 * `max` entries. Emitted by the widget every time a trigger surface fires.
 */
export function useTriggerEvents(max = 8): TriggerLogEntry[] {
  const [events, setEvents] = useState<TriggerLogEntry[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<AutocrewTriggerDetail>).detail;
      if (!detail) return;
      const entry: TriggerLogEntry = {
        id: ++nextId,
        ts: formatTime(new Date()),
        source: detail.source,
        mode: detail.mode,
        hasMessage: Boolean(detail.hasMessage),
      };
      setEvents((prev) => [...prev, entry].slice(-max));
    };

    document.addEventListener("autocrew:triggered", handler);
    return () => document.removeEventListener("autocrew:triggered", handler);
  }, [max]);

  return events;
}
