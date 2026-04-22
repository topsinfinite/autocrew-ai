"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  buildContext,
  isEnabled,
  resolveAdapter,
  track,
  type EnrichedContext,
} from "@/lib/contextual-ai";
import { useTextSelection } from "./use-text-selection";
import type { ComposerDismissReason } from "./selection-composer";

const SelectionPopover = dynamic(
  () => import("./selection-popover").then((m) => m.SelectionPopover),
  { ssr: false },
);

const SelectionComposer = dynamic(
  () => import("./selection-composer").then((m) => m.SelectionComposer),
  { ssr: false },
);

interface ComposerState {
  ctx: EnrichedContext;
  rect: DOMRect;
}

export function ContextualAIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [composer, setComposer] = useState<ComposerState | null>(null);
  const lastTrackedTextRef = useRef<string | null>(null);

  useEffect(() => {
    setHydrated(true);
    setEnabled(isEnabled());
  }, []);

  useEffect(() => {
    setComposer(null);
    lastTrackedTextRef.current = null;
  }, [pathname]);

  const active = useTextSelection(hydrated && enabled && !composer);

  useEffect(() => {
    if (!active) return;
    if (lastTrackedTextRef.current === active.text) return;
    lastTrackedTextRef.current = active.text;
    const ctx = buildContext(active.range, active.text);
    track({
      name: "contextual_ai_selection",
      chars: active.text.length,
      sectionLabel: ctx.sectionLabel,
      path: ctx.url,
    });
  }, [active]);

  const handleOpen = useCallback(() => {
    if (!active) return;
    const ctx = buildContext(active.range, active.text);
    track({
      name: "contextual_ai_open",
      chars: ctx.selection.length,
      sectionLabel: ctx.sectionLabel,
      path: ctx.url,
      hasSurrounding: Boolean(ctx.surrounding),
    });
    track({
      name: "contextual_ai_composer_opened",
      chars: ctx.selection.length,
      sectionLabel: ctx.sectionLabel,
      path: ctx.url,
    });

    setComposer({ ctx, rect: active.rect });
    window.getSelection()?.removeAllRanges();
  }, [active]);

  const handlePopoverDismiss = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    track({ name: "contextual_ai_dismissed", reason: "escape" });
  }, []);

  const handleComposerSubmit = useCallback(
    (userPrompt: string) => {
      if (!composer) return;
      const ctx: EnrichedContext = userPrompt
        ? { ...composer.ctx, userPrompt }
        : composer.ctx;

      track({
        name: "contextual_ai_composer_sent",
        chars: ctx.selection.length,
        userPromptChars: userPrompt.length,
        sectionLabel: ctx.sectionLabel,
        path: ctx.url,
      });

      const adapter = resolveAdapter();
      if (!adapter) {
        track({ name: "contextual_ai_adapter_missing", path: ctx.url });
        setComposer(null);
        return;
      }

      void adapter.send(ctx);
      setComposer(null);
    },
    [composer],
  );

  const handleComposerDismiss = useCallback(
    (reason: ComposerDismissReason) => {
      track({ name: "contextual_ai_composer_dismissed", reason });
      setComposer(null);
    },
    [],
  );

  return (
    <>
      {children}
      {hydrated && enabled && active && !composer && (
        <SelectionPopover
          rect={active.rect}
          onClick={handleOpen}
          onDismiss={handlePopoverDismiss}
        />
      )}
      {hydrated && composer && (
        <SelectionComposer
          ctx={composer.ctx}
          rect={composer.rect}
          onSubmit={handleComposerSubmit}
          onDismiss={handleComposerDismiss}
        />
      )}
    </>
  );
}
