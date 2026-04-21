"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  buildContext,
  isEnabled,
  isStubEnabled,
  resolveAdapter,
  track,
  type EnrichedContext,
} from "@/lib/contextual-ai";
import { useTextSelection } from "./use-text-selection";

const SelectionPopover = dynamic(
  () => import("./selection-popover").then((m) => m.SelectionPopover),
  { ssr: false },
);

const StubDebugCard = dynamic(
  () => import("./stub-debug-card").then((m) => m.StubDebugCard),
  { ssr: false },
);

export function ContextualAIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [stubPayload, setStubPayload] = useState<EnrichedContext | null>(null);
  const lastTrackedTextRef = useRef<string | null>(null);

  useEffect(() => {
    setHydrated(true);
    setEnabled(isEnabled());
  }, []);

  useEffect(() => {
    setStubPayload(null);
    lastTrackedTextRef.current = null;
  }, [pathname]);

  const active = useTextSelection(hydrated && enabled);

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

    const adapter = resolveAdapter();
    if (!adapter) {
      track({ name: "contextual_ai_adapter_missing", path: ctx.url });
      return;
    }

    void adapter.prefillWithContext(ctx);
    if (isStubEnabled()) {
      setStubPayload(ctx);
    }
    window.getSelection()?.removeAllRanges();
  }, [active]);

  const handleDismiss = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    track({ name: "contextual_ai_dismissed", reason: "escape" });
  }, []);

  return (
    <>
      {children}
      {hydrated && enabled && active && (
        <SelectionPopover
          rect={active.rect}
          onClick={handleOpen}
          onDismiss={handleDismiss}
        />
      )}
      {hydrated && stubPayload && (
        <StubDebugCard
          payload={stubPayload}
          onClose={() => setStubPayload(null)}
        />
      )}
    </>
  );
}
