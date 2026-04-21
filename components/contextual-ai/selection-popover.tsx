"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectionPopoverProps {
  rect: DOMRect;
  onClick: () => void;
  onDismiss: () => void;
}

const POPOVER_HEIGHT_PX = 36;
const GAP_PX = 8;
const EDGE_PADDING_PX = 8;
const FLIP_THRESHOLD_PX = 48;

export function SelectionPopover({
  rect,
  onClick,
  onDismiss,
}: SelectionPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const popoverWidth = el.offsetWidth;
    const viewportWidth = window.innerWidth;

    const top =
      rect.top < FLIP_THRESHOLD_PX
        ? rect.bottom + GAP_PX
        : rect.top - POPOVER_HEIGHT_PX - GAP_PX;

    const centeredLeft = rect.left + rect.width / 2 - popoverWidth / 2;
    const left = Math.max(
      EDGE_PADDING_PX,
      Math.min(centeredLeft, viewportWidth - popoverWidth - EDGE_PADDING_PX),
    );

    setPosition({ top, left });
  }, [rect]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.getSelection()?.removeAllRanges();
        onDismiss();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [onDismiss]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label="Ask Sarah about selected text"
      data-contextual-ai="off"
      className={cn(
        "fixed z-50 flex items-center gap-1.5 rounded-full border border-border",
        "bg-card/95 backdrop-blur px-3 py-1.5 shadow-lg",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-150",
      )}
      style={{ top: position.top, left: position.left }}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex items-center gap-1.5 text-sm font-medium text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full",
        )}
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
        <span>Ask Sarah</span>
        <ArrowRight className="h-3.5 w-3.5 opacity-70" aria-hidden />
      </button>
    </div>,
    document.body,
  );
}
