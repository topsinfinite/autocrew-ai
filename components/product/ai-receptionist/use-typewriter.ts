"use client";

import { useEffect, useState } from "react";
import type { TranscriptTurn } from "@/lib/mock-data/ai-receptionist-hero-fixtures";

type State = {
  index: number;
  rendered: string;
  done: boolean;
};

const DEFAULT_TYPE_MS = 1600;
const DEFAULT_HOLD_MS = 900;

/**
 * Plays a fixture transcript turn-by-turn. Caller lines appear instantly,
 * Sarah's lines type out at a rate proportional to their length, and we
 * hold for a beat between turns. Loops back to the start.
 */
export function useTypedTranscript(turns: TranscriptTurn[], paused = false) {
  const [state, setState] = useState<State>({
    index: 0,
    rendered: "",
    done: false,
  });

  useEffect(() => {
    if (paused) return;
    if (typeof window === "undefined") return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      // Reduced-motion users see the final state of the transcript without
      // any animation; this is the entire point of the effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({
        index: turns.length - 1,
        rendered: turns[turns.length - 1]?.text ?? "",
        done: true,
      });
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    const advance = (idx: number) => {
      if (cancelled) return;
      const turn = turns[idx];
      if (!turn) {
        timer = window.setTimeout(() => advance(0), 1800);
        return;
      }

      if (turn.who === "caller") {
        setState({ index: idx, rendered: turn.text, done: true });
        timer = window.setTimeout(
          () => advance(idx + 1),
          turn.holdMs ?? DEFAULT_HOLD_MS,
        );
        return;
      }

      const total = turn.typeMs ?? DEFAULT_TYPE_MS;
      const perChar = Math.max(12, total / Math.max(1, turn.text.length));
      let i = 0;
      setState({ index: idx, rendered: "", done: false });

      const tick = () => {
        if (cancelled) return;
        i += 1;
        const next = turn.text.slice(0, i);
        setState({ index: idx, rendered: next, done: i >= turn.text.length });
        if (i >= turn.text.length) {
          timer = window.setTimeout(
            () => advance(idx + 1),
            turn.holdMs ?? DEFAULT_HOLD_MS,
          );
        } else {
          timer = window.setTimeout(tick, perChar);
        }
      };

      tick();
    };

    advance(0);

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [turns, paused]);

  return state;
}
