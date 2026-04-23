"use client";

import { useEffect, useState } from "react";

interface UseTypewriterOptions {
  text: string;
  /** ms per character */
  speed?: number;
  /** ms to wait before typing begins (after `start` goes true) */
  delay?: number;
  /** When false, all characters reveal immediately and `done` is true — used for reduced-motion. */
  enabled?: boolean;
  /** When false, typing is paused at empty. Flip to true to begin. Used to chain sequential typewriters. */
  start?: boolean;
}

/**
 * Reveal a string character-by-character via requestAnimationFrame + wall-clock.
 *
 * Using wall-clock time (performance.now()) instead of nested setTimeouts
 * means the reveal catches up after background-tab throttling — when the tab
 * returns to the foreground, the text jumps to where it should be given
 * elapsed real time, instead of crawling at a throttled rate.
 *
 * Safe for SSR (returns empty string on server, fills on mount). When
 * `enabled` is false (reduced-motion) the full text returns immediately.
 */
export function useTypewriter({
  text,
  speed = 30,
  delay = 0,
  enabled = true,
  start = true,
}: UseTypewriterOptions) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setOut(text);
      setDone(true);
      return;
    }
    if (!start) {
      setOut("");
      setDone(false);
      return;
    }

    setOut("");
    setDone(false);

    const startTime = performance.now();
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    // Tick interval = `speed` so foreground tabs reveal one char per tick,
    // background tabs still fire (throttled) and catch up via wall-clock.
    const tick = () => {
      if (cancelled) return;
      const elapsed = performance.now() - startTime;
      const effective = elapsed - delay;
      if (effective < 0) return;
      const charsShown = Math.min(
        text.length,
        Math.max(0, Math.floor(effective / speed)),
      );
      setOut(text.slice(0, charsShown));
      if (charsShown >= text.length) {
        setDone(true);
        if (intervalId) clearInterval(intervalId);
      }
    };

    intervalId = setInterval(tick, speed);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay, enabled, start]);

  return { out, done };
}

/** Respects the user's prefers-reduced-motion system setting. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
