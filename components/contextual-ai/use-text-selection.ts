"use client";

import { useEffect, useRef, useState } from "react";

export const MIN_CHARS = 15;
export const MAX_SELECTION_CHARS = 1000;
export const DEBOUNCE_MS = 250;

const EXCLUDED_SELECTORS = [
  "input",
  "textarea",
  '[contenteditable=""]',
  '[contenteditable="true"]',
  "button",
  "a",
  "nav",
  "code",
  "pre",
  '[role="button"]',
  '[data-contextual-ai="off"]',
];

export interface ActiveSelection {
  text: string;
  rect: DOMRect;
  range: Range;
}

function isTouchPrimary(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

function isExcluded(node: Node | null): boolean {
  let el: HTMLElement | null =
    node && node.nodeType === Node.TEXT_NODE
      ? (node.parentElement as HTMLElement | null)
      : (node as HTMLElement | null);
  while (el && el !== document.body) {
    for (const sel of EXCLUDED_SELECTORS) {
      if (el.matches(sel)) return true;
    }
    el = el.parentElement;
  }
  return false;
}

export function useTextSelection(enabled: boolean): ActiveSelection | null {
  const [active, setActive] = useState<ActiveSelection | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (isTouchPrimary()) return;

    const evaluate = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setActive(null);
        return;
      }

      const raw = sel.toString();
      const trimmed = raw.trim();
      if (trimmed.length < MIN_CHARS) {
        setActive(null);
        return;
      }

      const liveRange = sel.getRangeAt(0);
      if (isExcluded(liveRange.commonAncestorContainer)) {
        setActive(null);
        return;
      }

      const text =
        raw.length > MAX_SELECTION_CHARS
          ? raw.slice(0, MAX_SELECTION_CHARS)
          : raw;
      const rect = liveRange.getBoundingClientRect();
      setActive({ text, rect, range: liveRange.cloneRange() });
    };

    // mouseup/keyup signal the user is done selecting — evaluate immediately.
    const handleImmediate = () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      evaluate();
    };

    // selectionchange fires continuously during drag — debounce to batch.
    const handleDebounced = () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(evaluate, DEBOUNCE_MS);
    };

    const clearOnScroll = () => setActive(null);

    document.addEventListener("mouseup", handleImmediate);
    document.addEventListener("keyup", handleImmediate);
    document.addEventListener("selectionchange", handleDebounced);
    window.addEventListener("scroll", clearOnScroll, { passive: true });
    window.addEventListener("resize", clearOnScroll);

    return () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
      }
      document.removeEventListener("mouseup", handleImmediate);
      document.removeEventListener("keyup", handleImmediate);
      document.removeEventListener("selectionchange", handleDebounced);
      window.removeEventListener("scroll", clearOnScroll);
      window.removeEventListener("resize", clearOnScroll);
    };
  }, [enabled]);

  return active;
}
