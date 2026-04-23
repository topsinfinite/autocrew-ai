"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { CornerDownRight, X, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EnrichedContext } from "@/lib/contextual-ai";

export type ComposerDismissReason =
  | "escape"
  | "click_away"
  | "remove_quote"
  | "cancel";

interface SelectionComposerProps {
  ctx: EnrichedContext;
  rect: DOMRect;
  onSubmit: (userPrompt: string) => void;
  onDismiss: (reason: ComposerDismissReason) => void;
}

const GAP_PX = 12;
const EDGE_PADDING_PX = 12;
const ESTIMATED_HEIGHT_PX = 180;
const COMPOSER_WIDTH_PX = 420;
const MAX_TEXTAREA_PX = 160;
const MIN_TEXTAREA_PX = 56;

export function SelectionComposer({
  ctx,
  rect,
  onSubmit,
  onDismiss,
}: SelectionComposerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const quoteId = useId();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    setMounted(true);
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    return () => {
      const prev = previousFocusRef.current;
      if (prev && document.contains(prev)) {
        prev.focus({ preventScroll: true });
      }
    };
  }, []);

  useLayoutEffect(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const width = Math.min(
      COMPOSER_WIDTH_PX,
      viewportWidth - EDGE_PADDING_PX * 2,
    );

    const spaceBelow = viewportHeight - rect.bottom;
    const placeBelow = spaceBelow >= ESTIMATED_HEIGHT_PX + GAP_PX;
    const top = placeBelow
      ? rect.bottom + GAP_PX
      : Math.max(EDGE_PADDING_PX, rect.top - ESTIMATED_HEIGHT_PX - GAP_PX);

    const centeredLeft = rect.left + rect.width / 2 - width / 2;
    const left = Math.max(
      EDGE_PADDING_PX,
      Math.min(centeredLeft, viewportWidth - width - EDGE_PADDING_PX),
    );

    setPosition({ top, left, width });
  }, [rect]);

  useEffect(() => {
    if (!mounted) return;
    textareaRef.current?.focus({ preventScroll: true });
  }, [mounted]);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, MIN_TEXTAREA_PX), MAX_TEXTAREA_PX)}px`;
  }, []);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  const submit = useCallback(() => {
    onSubmit(value.trim());
  }, [onSubmit, value]);

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDismiss("escape");
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onDismiss]);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && root.contains(e.target)) return;
      onDismiss("click_away");
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onDismiss]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Ask Sarah about selected text"
      data-contextual-ai="off"
      className={cn(
        "fixed z-50 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl",
        "motion-safe:transition-[opacity,transform] motion-safe:duration-150 motion-safe:ease-out",
      )}
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        width: position?.width ?? COMPOSER_WIDTH_PX,
        opacity: position ? 1 : 0,
        transform: position ? "translateY(0)" : "translateY(6px)",
        visibility: position ? "visible" : "hidden",
        pointerEvents: position ? "auto" : "none",
      }}
    >
      <div className="flex items-start gap-2 px-3 pt-3">
        <CornerDownRight
          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <p
          id={quoteId}
          className="flex-1 text-sm text-foreground/90 leading-snug line-clamp-3"
        >
          <span aria-hidden="true">&ldquo;</span>
          {ctx.selection}
          <span aria-hidden="true">&rdquo;</span>
        </p>
        <button
          type="button"
          onClick={() => onDismiss("remove_quote")}
          aria-label="Remove quote and close"
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      <div className="px-3 pb-3 pt-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask Sarah about this…"
          aria-label="Your message"
          aria-describedby={quoteId}
          className={cn(
            "w-full resize-none bg-transparent text-sm leading-relaxed text-foreground",
            "rounded-md px-3 py-2.5 outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring",
            "placeholder:text-muted-foreground",
          )}
          style={{ maxHeight: MAX_TEXTAREA_PX, minHeight: MIN_TEXTAREA_PX }}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] font-space-mono uppercase tracking-wider text-muted-foreground">
            Enter to send · Shift+Enter newline
          </span>
          <button
            type="button"
            onClick={submit}
            aria-label="Send to Sarah"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <ArrowUp className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
