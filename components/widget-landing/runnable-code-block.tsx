"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface RunnableCodeBlockProps {
  /** Plain-text code shown to the visitor. */
  code: string;
  /** Optional caption rendered as a tab label above the code. */
  filename?: string;
  /** Called when the visitor clicks "Run". The displayed code is purely visual; this is what actually executes. */
  onRun: () => void;
  /** Override the run button label. */
  runLabel?: string;
  className?: string;
}

/**
 * Code snippet rendered with a tiny window-chrome and a "Run" pill that
 * fires a real action against the widget. The displayed `code` and the
 * `onRun` handler are decoupled by design — visitors see the snippet,
 * we control exactly what executes.
 */
export function RunnableCodeBlock({
  code,
  filename = "trigger.html",
  onRun,
  runLabel = "Run this",
  className,
}: RunnableCodeBlockProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[#06070b]/95",
        className,
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-white/[0.015] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-foreground/15" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-foreground/15" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-foreground/15" aria-hidden />
          <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
            {filename}
          </span>
        </div>
        <button
          type="button"
          onClick={onRun}
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-full",
            "border border-[#FF6B35]/40 bg-[#FF6B35]/10",
            "hover:border-[#FF6B35]/60 hover:bg-[#FF6B35]/20",
            "px-2.5 py-1 transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60",
          )}
        >
          <Play className="h-2.5 w-2.5 fill-[#FF6B35] text-[#FF6B35]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF6B35]">
            {runLabel}
          </span>
        </button>
      </div>

      {/* Code body */}
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed text-foreground/85">
        <code>{code}</code>
      </pre>
    </div>
  );
}
