"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnrichedContext } from "@/lib/contextual-ai";

interface StubDebugCardProps {
  payload: EnrichedContext;
  onClose: () => void;
}

export function StubDebugCard({ payload, onClose }: StubDebugCardProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard unavailable; silent fail in dev tool.
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      data-contextual-ai="off"
      className={cn(
        "fixed bottom-4 right-4 z-[85] w-[360px] max-w-[calc(100vw-2rem)]",
        "rounded-xl border border-primary/40 bg-card/95 backdrop-blur-xl p-4 shadow-xl",
        "motion-safe:animate-in motion-safe:slide-in-from-bottom-2 motion-safe:fade-in motion-safe:duration-200",
      )}
      role="dialog"
      aria-label="Contextual AI stub debug card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-space-mono uppercase tracking-wider text-primary">
            Contextual AI — stub mode
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            This is what the widget would receive.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={copy}
            aria-label="Copy payload"
            className="rounded p-1 hover:bg-muted"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 hover:bg-muted"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <dl className="mt-3 space-y-2 text-xs">
        <Field label="Selection" value={payload.selection} />
        {payload.sectionLabel && (
          <Field label="Section" value={payload.sectionLabel} />
        )}
        <Field label="URL" value={payload.url} />
        {payload.surrounding && (
          <Field label="Surrounding" value={payload.surrounding} collapsed />
        )}
      </dl>
    </div>,
    document.body,
  );
}

function Field({
  label,
  value,
  collapsed = false,
}: {
  label: string;
  value: string;
  collapsed?: boolean;
}) {
  return (
    <div>
      <dt className="font-space-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-0.5 font-geist text-foreground",
          collapsed && "line-clamp-3",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
