"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTriggerEvents } from "@/lib/widget/use-trigger-events";

interface LiveEventLogProps {
  className?: string;
  /** Max entries to keep in the log before older ones roll off. */
  max?: number;
  /** Optional title shown in the log header. */
  title?: string;
}

const SOURCE_COLOR: Record<string, string> = {
  declarative: "text-[#FF6B35]",
  url: "text-emerald-300",
  api: "text-sky-300",
};

/**
 * Persistent live readout of `autocrew:triggered` events. Drop into any
 * widget-landing surface to make the page feel alive — the visitor sees
 * their own activity stream as they fire triggers across the page.
 */
export function LiveEventLog({
  className,
  max = 8,
  title = "Live triggers",
}: LiveEventLogProps) {
  const events = useTriggerEvents(max);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest entry.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [events.length]);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[#06070b]/95",
        className,
      )}
      aria-label="Live trigger event log"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-white/[0.015] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B35]/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
          </span>
          <span>{title}</span>
        </div>
        <span className="text-foreground/40">
          {events.length}/{max}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="custom-scrollbar flex-1 overflow-y-auto px-3 py-2 font-mono text-[11px] leading-relaxed"
      >
        {events.length === 0 ? (
          <div className="select-none text-foreground/35">
            <span className="text-foreground/55">$</span> waiting for triggers&hellip;
          </div>
        ) : (
          <ul className="space-y-1">
            {events.map((e) => (
              <li key={e.id} className="flex items-baseline gap-2">
                <span className="shrink-0 text-foreground/35">{e.ts}</span>
                <span
                  className={cn(
                    "shrink-0 uppercase tracking-[0.12em]",
                    SOURCE_COLOR[e.source] ?? "text-foreground/65",
                  )}
                >
                  {e.source}
                </span>
                <span className="text-foreground/55">&middot;</span>
                <span className="text-foreground/65">{e.mode}</span>
                {e.hasMessage ? (
                  <span className="text-foreground/40">&middot; sent</span>
                ) : (
                  <span className="text-foreground/40">&middot; opened</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
